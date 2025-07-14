"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";
import { PostListSkeleton } from "./SkeletonLoader";

export interface Post {
  id: number;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url: string;
  user_name: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as Post[];
};

const PostList = () => {
  const isMobile = window.innerWidth < 768;
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <PostListSkeleton count={3} />;
  }

  if (error) {
    return (
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
          Failed to Load Posts
        </h3>
        <p className="text-body-regular text-secondary mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={`${
          isMobile ? "bg-secondary-dark p-4" : "post-card"
        } text-center py-12`}
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-tertiary-dark/50 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="text-headline-2 text-primary font-semibold mb-3">
          No Posts Yet
        </h3>
        <p className="text-body-regular text-secondary mb-6 max-w-md mx-auto">
          Be the first to share something with the community! Create your first
          post and start the conversation.
        </p>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? "" : "space-y-6"}`}>
      {data.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}

      {/* End of Posts Indicator - Simplified */}
      {data && data.length > 0 && (
        <div
          className={`text-center py-2 ${
            isMobile ? "bg-secondary-dark border-t border-border-light/30" : ""
          }`}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-tertiary-dark/30 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-body-large text-primary font-medium mb-2">
            You're all caught up!
          </h3>
          <p className="text-body-small text-muted">
            {data.length} post{data.length !== 1 ? "s" : ""} in your feed
          </p>
        </div>
      )}
    </div>
  );
};

export default PostList;
