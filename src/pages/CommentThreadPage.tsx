"use client";

import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import type { Comment } from "../components/CommentSection";
import { CommentSkeleton } from "../components/SkeletonLoader";

const fetchCommentThread = async (commentId: number): Promise<Comment[]> => {
  // First get the parent comment
  const { data: parentComment, error: parentError } = await supabase
    .from("comments")
    .select("*")
    .eq("id", commentId)
    .single();

  if (parentError) throw new Error(parentError.message);

  // Then get all replies to this comment
  const { data: replies, error: repliesError } = await supabase
    .from("comments")
    .select("*")
    .eq("parent_comment_id", commentId)
    .order("created_at", { ascending: true });

  if (repliesError) throw new Error(repliesError.message);

  return [parentComment, ...replies] as Comment[];
};

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string,
  avatarUrl?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to reply.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
    avatar_url: avatarUrl,
  });

  if (error) throw new Error(error.message);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const CommentThreadPage = () => {
  const { id: postId, commentId } = useParams<{
    id: string;
    commentId: string;
  }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState<string>("");

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comment-thread", commentId],
    queryFn: () => fetchCommentThread(Number(commentId)),
    enabled: !!commentId,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        Number(postId),
        Number(commentId),
        user?.id,
        user?.user_metadata?.user_name || user?.email,
        user?.user_metadata.avatar_url || null
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comment-thread", commentId],
      });
      queryClient.invalidateQueries({ queryKey: ["comments", Number(postId)] });
      setReplyText("");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    mutate(replyText.trim());
  };

  if (!postId || !commentId) {
    return (
      <div className="min-h-screen bg-secondary-dark">
        <div className="bg-secondary-dark p-4 text-center py-8">
          <h3 className="text-headline-3 text-primary font-semibold mb-2">
            Invalid Comment
          </h3>
          <p className="text-body-regular text-secondary">
            Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-dark">
        {/* Header */}
        <div className="bg-secondary-dark border-b border-border-light/30 px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-tertiary-dark rounded skeleton"></div>
            <div className="w-12 h-4 bg-tertiary-dark rounded skeleton"></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-secondary-dark pb-24 px-4">
          <CommentSkeleton showReplies={true} replyCount={3} />
        </div>

        {/* Fixed Input */}
        {user && (
          <div className="fixed bottom-0 left-0 right-0 bg-secondary-dark border-t border-border-light/30 p-4">
            <div className="w-full h-10 bg-tertiary-dark rounded-medium skeleton"></div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-dark">
        <div className="bg-secondary-dark p-4 text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-error/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-headline-3 text-primary font-semibold mb-2">
            Failed to Load Thread
          </h3>
          <p className="text-body-regular text-secondary mb-4">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-dark">
        <div className="bg-secondary-dark p-4 text-center py-8">
          <h3 className="text-headline-3 text-primary font-semibold mb-2">
            Comment not found
          </h3>
          <p className="text-body-regular text-secondary">
            The comment you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const [parentComment, ...replies] = comments;

  return (
    <div className="min-h-screen bg-secondary-dark">
      {/* Comment Thread */}
      <div className="bg-secondary-dark min-h-screen pb-24">
        {/* Parent Comment */}
        <div className="p-4 border-b border-border-light/30 bg-secondary-dark">
          <div className="flex items-start space-x-3 p-3 bg-tertiary-dark/30 rounded-medium">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              {parentComment.avatar_url ? (
                <img
                  src={parentComment.avatar_url || "/placeholder.svg"}
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-body-regular text-primary font-semibold">
                  {parentComment.author}
                </h4>
                <span className="text-caption text-muted">•</span>
                <time className="text-caption text-muted">
                  {formatDate(parentComment.created_at)}
                </time>
              </div>
              <p className="text-body-regular text-primary leading-relaxed whitespace-pre-wrap">
                {parentComment.content}
              </p>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="px-4 bg-secondary-dark">
          {replies.length > 0 ? (
            <div className="space-y-4 py-4">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className="flex items-start space-x-3 pl-6 p-3 hover:bg-tertiary-dark/20 rounded-medium transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {reply.avatar_url ? (
                      <img
                        src={reply.avatar_url || "/placeholder.svg"}
                        alt="User Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <svg
                        className="w-4 h-4 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-body-small text-primary font-semibold">
                        {reply.author}
                      </h4>
                      <span className="text-caption text-muted">•</span>
                      <time className="text-caption text-muted">
                        {formatDate(reply.created_at)}
                      </time>
                    </div>
                    <p className="text-body-regular text-primary leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-secondary-dark">
              <div className="w-12 h-12 mx-auto mb-3 bg-tertiary-dark/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h4 className="text-body-regular text-primary font-medium mb-2">
                No Replies Yet
              </h4>
              <p className="text-body-small text-secondary">
                Be the first to reply to this comment!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Reply Input */}
      {user ? (
        <div className="fixed bottom-0 left-0 right-0 bg-secondary-dark border-t border-border-light/30 p-4 z-40">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user.user_metadata.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url || "/placeholder.svg"}
                    alt="Your Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <svg
                    className="w-4 h-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>

              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${parentComment.author}...`}
                className="flex-1 border-0 bg-tertiary-dark focus:bg-tertiary-dark focus:border-0 focus:ring-2 focus:ring-accent/30 text-body-regular transition-all duration-200 rounded-medium px-4 py-2"
              />

              <button
                type="submit"
                disabled={isPending || !replyText.trim()}
                className="p-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200 flex items-center justify-center"
              >
                {isPending ? (
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Error Message */}
            {isError && (
              <div className="flex items-center space-x-1 text-error mt-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-caption">Error posting reply</span>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 bg-secondary-dark border-t border-border-light/30 p-4">
          <div className="p-4 bg-tertiary-dark/30 border border-border-light/50 rounded-medium text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-accent/20 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-body-small text-secondary">
              Sign in to reply to this comment
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentThreadPage;
