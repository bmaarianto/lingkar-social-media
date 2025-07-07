"use client";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import PostActions from "./PostActions";
import { PostSkeleton } from "./SkeletonLoader";

interface Props {
  postId: number;
  onClose?: () => void;
  isModal?: boolean;
  showBackButton?: boolean;
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

const PostDetail = ({
  postId,
  onClose,
  isModal = false,
  showBackButton = true,
}: Props) => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
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

  if (isLoading) {
    return (
      <div
        className={`${
          isModal ? "p-6" : "min-h-screen bg-primary-dark pt-4 md:pt-4"
        }`}
      >
        <div className={`${isModal ? "" : "container-custom py-6 md:py-8"}`}>
          <div className={`${isModal ? "" : "max-w-2xl mx-auto"}`}>
            {/* Back Button for Page View - Only show if showBackButton is true */}
            {!isModal && showBackButton && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 px-3 py-2">
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
      <div
        className={`${
          isModal ? "p-6" : "min-h-screen bg-primary-dark pt-4 md:pt-4"
        }`}
      >
        <div className={`${isModal ? "" : "container-custom py-6 md:py-8"}`}>
          <div className={`${isModal ? "" : "max-w-2xl mx-auto"}`}>
            {/* Back Button for Page View - Only show if showBackButton is true */}
            {!isModal && showBackButton && (
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

            <div className="post-card text-center py-8">
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
      <div
        className={`${
          isModal ? "p-6" : "min-h-screen bg-primary-dark pt-4 md:pt-4"
        }`}
      >
        <div className={`${isModal ? "" : "container-custom py-6 md:py-8"}`}>
          <div className={`${isModal ? "" : "max-w-2xl mx-auto"}`}>
            {/* Back Button for Page View - Only show if showBackButton is true */}
            {!isModal && showBackButton && (
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

            <div className="post-card text-center py-8">
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

  const content = (
    <div className={`post-card ${isModal ? "border-0 rounded-none" : ""}`}>
      {/* Modal Header */}
      {isModal && onClose && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-light/30">
          <h2 className="text-headline-2 text-primary font-semibold">
            Post Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

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
      <PostActions postId={postId} />
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <div className="min-h-screen bg-primary-dark pt-4 md:pt-4">
      <div className="container-custom py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button for Page View - Only show if showBackButton is true */}
          {showBackButton && (
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
