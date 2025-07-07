"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import CommentItem from "./CommentItem";
import { CommentSkeleton } from "./SkeletonLoader";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
  avatar_url: string;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string,
  avatar_url?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to comment.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
    avatar_url: avatar_url,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Comment[];
};

const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name || user?.email,
        user?.user_metadata.avatar_url || null
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setNewCommentText("");
      setIsExpanded(false);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    mutate({ content: newCommentText.trim(), parent_comment_id: null });
  };

  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  const commentTree = comments ? buildCommentTree(comments) : [];
  const commentCount = comments?.length || 0;

  if (isLoading) {
    return (
      <div className="mt-6 pt-6 border-t border-border-light/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-tertiary-dark rounded skeleton"></div>
            <div className="w-20 h-5 bg-tertiary-dark rounded skeleton"></div>
          </div>
        </div>
        <CommentSkeleton showReplies={true} replyCount={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 pt-6 border-t border-border-light/30">
        <div className="flex items-center space-x-2 text-error mb-4">
          <svg
            className="w-5 h-5"
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
          <span className="text-body-small">
            Failed to load comments: {error.message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-border-light/30">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-secondary"
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
          <h3 className="text-headline-3 text-primary font-semibold">
            {commentCount === 0
              ? "Comments"
              : `${commentCount} Comment${commentCount !== 1 ? "s" : ""}`}
          </h3>
        </div>
      </div>

      {/* Comment Form */}
      {user ? (
        <div className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start space-x-3">
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

              <div className="flex-1">
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                  rows={1}
                  placeholder="Write a comment..."
                  className="input-field resize-none text-body-regular transition-all duration-200"
                />

                {/* Comment Actions */}
                {isExpanded && (
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      {isError && (
                        <div className="flex items-center space-x-1 text-error">
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
                          <span className="text-caption">
                            Error posting comment
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsExpanded(false);
                          setNewCommentText("");
                        }}
                        className="px-3 py-1.5 text-body-small text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-small transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isPending || !newCommentText.trim()}
                        className="px-4 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-body-small font-medium rounded-small transition-all duration-200"
                      >
                        {isPending ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Posting...</span>
                          </div>
                        ) : (
                          "Post Comment"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-tertiary-dark/30 border border-border-light/50 rounded-medium text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-accent/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-accent"
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
          <h4 className="text-body-regular text-primary font-medium mb-2">
            Join the Conversation
          </h4>
          <p className="text-body-small text-secondary">
            Sign in to post comments and engage with the community.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {commentTree.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-tertiary-dark/30 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted"
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
            <h4 className="text-body-large text-primary font-medium mb-2">
              No Comments Yet
            </h4>
            <p className="text-body-small text-secondary">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          commentTree.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
