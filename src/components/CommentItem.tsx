"use client";

import { useState, type FormEvent } from "react";
import type { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  comment: Comment & {
    children?: Comment[];
  };
  postId: number;
  depth?: number;
}

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

const CommentItem = ({ comment, postId, depth = 0 }: Props) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const maxDepth = 3; // Maximum nesting depth

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name || user?.email,
        user?.user_metadata.avatar_url || null
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    mutate(replyText.trim());
  };

  const hasReplies = comment.children && comment.children.length > 0;
  const canReply = depth < maxDepth && user;

  return (
    <div className={`${depth > 0 ? "ml-6 md:ml-8" : ""}`}>
      <div className="flex items-start space-x-3 group hover:bg-tertiary-dark/20 rounded-medium p-2 -m-2 transition-colors duration-200">
        {/* Avatar */}
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {comment.avatar_url ? (
            <img
              src={comment.avatar_url || "/placeholder.svg"}
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

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-body-small text-primary font-semibold">
              {comment.author}
            </h4>
            <span className="text-caption text-muted">•</span>
            <time className="text-caption text-muted">
              {formatDate(comment.created_at)}
            </time>
          </div>

          {/* Content */}
          <div className="mb-3">
            <p className="text-body-regular text-primary leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          <div
            className="flex items-center space-x-4 mb-3"
            onClick={(e) => e.stopPropagation()}
          >
            {canReply && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="flex items-center space-x-1 px-2 py-1 text-caption text-secondary hover:text-accent hover:bg-accent/10 rounded-small transition-all duration-200"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                <span>{showReply ? "Cancel" : "Reply"}</span>
              </button>
            )}

            {hasReplies && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="flex items-center space-x-1 px-2 py-1 text-caption text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-small transition-all duration-200"
              >
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isCollapsed ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span>
                  {isCollapsed ? "Hide" : "Show"} {comment.children!.length}{" "}
                  repl
                  {comment.children!.length === 1 ? "y" : "ies"}
                </span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReply && (
            <div
              className="mb-4 p-3 bg-tertiary-dark/20 border border-border-light/30 rounded-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleReplySubmit} className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user?.user_metadata.avatar_url ? (
                      <img
                        src={
                          user.user_metadata.avatar_url || "/placeholder.svg"
                        }
                        alt="Your Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <svg
                        className="w-3 h-3 text-accent"
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
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.author}...`}
                      className="input-field text-body-small"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isError && (
                      <div className="flex items-center space-x-1 text-error">
                        <svg
                          className="w-3 h-3"
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
                          Error posting reply
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReply(false);
                        setReplyText("");
                      }}
                      className="px-3 py-1 text-caption text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-small transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPending || !replyText.trim()}
                      className="px-3 py-1 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-caption font-medium rounded-small transition-all duration-200"
                    >
                      {isPending ? (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 border border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Posting...</span>
                        </div>
                      ) : (
                        "Post Reply"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {hasReplies && isCollapsed && (
        <div className="mt-4 space-y-4">
          {comment.children!.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
