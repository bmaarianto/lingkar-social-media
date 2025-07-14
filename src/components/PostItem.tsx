"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { Post } from "./PostList";
import PostDetailModal from "./PostDetailModal";
import PostActions from "./PostActions";
import { useAuth } from "../context/AuthContext";

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Update mobile state on resize
  useState(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on action buttons
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest('[role="button"]')) {
      return;
    }

    e.preventDefault();

    if (isMobile) {
      // Navigate to full page on mobile
      navigate(`/post/${post.id}`);
    } else {
      // Open modal on desktop
      setIsModalOpen(true);
    }
  };

  const handleCommentClick = () => {
    if (isMobile) {
      // Navigate to post detail page on mobile
      navigate(`/post/${post.id}`);
    } else {
      // Open modal on desktop
      setIsModalOpen(true);
    }
  };

  const displayName =
    post.user_name ||
    user?.user_metadata.user_name ||
    user?.email ||
    "Anonymous";

  return (
    <>
      <article
        className={`${
          isMobile
            ? "bg-secondary-dark border-0 rounded-none border-b border-border-light/30"
            : "post-card"
        } group cursor-pointer`}
        onClick={handleClick}
      >
        {/* Header: Avatar and User Info */}
        <div
          className={`flex items-center space-x-3 mb-4 ${
            isMobile ? "px-4 pt-4" : ""
          }`}
        >
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            {post.avatar_url ? (
              <img
                src={post.avatar_url || "/placeholder.svg"}
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
            <h3 className="text-headline-3 text-primary font-semibold group-hover:text-accent transition-colors duration-200">
              {displayName}
            </h3>
            <p className="text-body-small text-secondary mt-1">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className={`mb-4 ${isMobile ? "px-4" : ""}`}>
          <p className="text-body-regular text-primary leading-relaxed line-clamp-3">
            {post.content}
          </p>
        </div>

        {/* Image Banner */}
        {post.image_url && (
          <div
            className={`relative overflow-hidden ${
              isMobile ? "rounded-none" : "rounded-medium"
            } mb-4`}
          >
            <img
              src={post.image_url || "/placeholder.svg"}
              alt="Post image"
              className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        {/* Post Actions - Prevent click propagation */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${isMobile ? "px-4 pb-4" : ""}`}
        >
          <PostActions postId={post.id} onCommentClick={handleCommentClick} />
        </div>
      </article>

      {/* Desktop Modal */}
      {!isMobile && (
        <PostDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          postId={post.id}
        />
      )}
    </>
  );
};

export default PostItem;
