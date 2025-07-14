"use client";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import PostActions from "./PostActions";
import { PostSkeleton } from "./SkeletonLoader";
import CommentSection from "./CommentSection";

interface Props {
  postId: number;
  onClose?: () => void;
  isModal?: boolean;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

const PostDetail = ({ postId, onClose, isModal = false }: Props) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  // Scroll to top when component mounts (for page view)
  useEffect(() => {
    if (!isModal) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [isModal]);

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

  const { user } = useAuth();
  const displayName =
    data?.user_name ||
    user?.user_metadata.user_name ||
    user?.email ||
    "Anonymous";

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  // Handle comment click - scroll to comments section
  const handleCommentClick = () => {
    const commentsSection = document.querySelector(".comments-section");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className={`${isModal ? "p-6" : "min-h-screen bg-secondary-dark"}`}>
        <div
          className={`${
            isModal ? "" : isMobile ? "" : "container-custom py-6 md:py-8"
          }`}
        >
          <div
            className={`${isModal ? "" : isMobile ? "" : "max-w-2xl mx-auto"}`}
          >
            {/* Back Button for Page View - Only show on mobile */}
            {!isModal && isMobile && (
              <div className="bg-secondary-dark border-b border-border-light/30 px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-tertiary-dark rounded skeleton"></div>
                  <div className="w-12 h-4 bg-tertiary-dark rounded skeleton"></div>
                </div>
              </div>
            )}

            <PostSkeleton showActions={true} showImage={true} compact={false} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isModal ? "p-6" : "min-h-screen bg-secondary-dark"}`}>
        <div
          className={`${
            isModal ? "" : isMobile ? "" : "container-custom py-6 md:py-8"
          }`}
        >
          <div
            className={`${isModal ? "" : isMobile ? "" : "max-w-2xl mx-auto"}`}
          >
            {/* Back Button for Page View - Only show on mobile */}
            {!isModal && isMobile && (
              <div className="bg-secondary-dark border-b border-border-light/30 px-4 py-3">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-secondary hover:text-primary transition-all duration-200"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="text-body-small font-medium">Back</span>
                </button>
              </div>
            )}

            <div
              className={`${
                isMobile ? "bg-secondary-dark p-4" : "post-card"
              } text-center py-8`}
            >
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
                Failed to Load Post
              </h3>
              <p className="text-body-regular text-secondary mb-4">
                {error.message}
              </p>
              <button onClick={handleBack} className="btn-primary">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${isModal ? "p-6" : "min-h-screen bg-secondary-dark"}`}>
        <div
          className={`${
            isModal ? "" : isMobile ? "" : "container-custom py-6 md:py-8"
          }`}
        >
          <div
            className={`${isModal ? "" : isMobile ? "" : "max-w-2xl mx-auto"}`}
          >
            {/* Back Button for Page View - Only show on mobile */}
            {!isModal && isMobile && (
              <div className="bg-secondary-dark border-b border-border-light/30 px-4 py-3">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-secondary hover:text-primary transition-all duration-200"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="text-body-small font-medium">Back</span>
                </button>
              </div>
            )}

            <div
              className={`${
                isMobile ? "bg-secondary-dark p-4" : "post-card"
              } text-center py-8`}
            >
              <h3 className="text-headline-3 text-primary font-semibold mb-2">
                Post not found
              </h3>
              <p className="text-body-regular text-secondary mb-4">
                The post you're looking for doesn't exist.
              </p>
              <button onClick={handleBack} className="btn-primary">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal content - structured for fixed header/footer layout
  if (isModal) {
    return (
      <div className="flex flex-col h-full bg-secondary-dark">
        {/* Post Content - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-6">
            {/* Header: Avatar and User Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {data.avatar_url ? (
                  <img
                    src={data.avatar_url || "/placeholder.svg"}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
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
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-headline-3 text-primary font-semibold">
                  {displayName}
                </h3>
                <p className="text-body-small text-secondary mt-1">
                  {formatDate(data.created_at)}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-body-regular text-primary leading-relaxed whitespace-pre-wrap">
                {data.content}
              </p>
            </div>

            {/* Image Banner */}
            {data.image_url && (
              <div className="relative overflow-hidden rounded-medium mb-6">
                <img
                  src={data.image_url || "/placeholder.svg"}
                  alt="Post image"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            {/* Actions */}
            <div className="mb-6">
              <PostActions
                postId={postId}
                onCommentClick={handleCommentClick}
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <CommentSection postId={postId} isModal={true} />
          </div>
        </div>
      </div>
    );
  }

  // Page content (non-modal)
  const content = (
    <div
      className={`${
        isMobile ? "bg-secondary-dark border-0 rounded-none" : "post-card"
      } ${isMobile && user && !isModal ? "pb-24" : ""}`}
    >
      {/* Header: Avatar and User Info */}
      <div
        className={`flex items-center space-x-4 mb-6 ${
          isMobile && !isModal ? "px-4 pt-4" : ""
        }`}
      >
        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {data.avatar_url ? (
            <img
              src={data.avatar_url || "/placeholder.svg"}
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
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
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-headline-3 text-primary font-semibold">
            {displayName}
          </h3>
          <p className="text-body-small text-secondary mt-1">
            {formatDate(data.created_at)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={`mb-6 ${isMobile && !isModal ? "px-4" : ""}`}>
        <p className="text-body-regular text-primary leading-relaxed whitespace-pre-wrap">
          {data.content}
        </p>
      </div>

      {/* Image Banner */}
      {data.image_url && (
        <div
          className={`relative overflow-hidden ${
            isMobile && !isModal ? "rounded-none" : "rounded-medium"
          } mb-6`}
        >
          <img
            src={data.image_url || "/placeholder.svg"}
            alt="Post image"
            className="w-full h-auto max-h-96 object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className={`${isMobile && !isModal ? "px-4" : ""}`}>
        <PostActions postId={postId} onCommentClick={handleCommentClick} />
      </div>

      {/* Comments Section */}
      <div
        className={`comments-section ${
          isMobile && !isModal ? "px-4 pb-4" : ""
        }`}
      >
        <CommentSection postId={postId} isModal={false} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-dark">
      <div className={`${isMobile ? "" : "container-custom py-6 md:py-8"}`}>
        <div className={`${isMobile ? "" : "max-w-2xl mx-auto"}`}>
          {/* Back Button for Desktop */}
          {!isMobile && (
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-3 py-2 text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-body-small font-medium">Back</span>
              </button>
            </div>
          )}
          {content}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
