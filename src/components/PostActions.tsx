"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "./SkeletonLoader";

interface Props {
  postId: number;
}

interface Like {
  id: number;
  post_id: number;
  user_id: string;
  like: number;
}

const like = async (likeValue: number, postId: number, userId: string) => {
  const { data: existingLike } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    if (existingLike.like === likeValue) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id);
      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId, like: likeValue });
    if (error) throw new Error(error.message);
  }
};

const fetchLikes = async (postId: number): Promise<Like[]> => {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);

  return data as Like[];
};

const PostActions = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: likes,
    isLoading,
    error,
  } = useQuery<Like[], Error>({
    queryKey: ["likes", postId],
    queryFn: () => fetchLikes(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (likeValue: number) => {
      if (!user) throw new Error("You must be logged in to like!");
      return like(likeValue, postId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center pt-3 border-t border-border-light/30">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="w-12 h-4 rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="w-16 h-4 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center pt-3 border-t border-border-light/30">
        <div className="flex items-center space-x-2 text-error">
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
          <span className="text-body-small">Failed to load interactions</span>
        </div>
      </div>
    );
  }

  const likesNumber = likes?.filter((like) => like.like === 1).length || 0;
  const userLike = likes?.find((like) => like.user_id === user?.id)?.like;
  const isLiked = userLike === 1;

  const handleLike = () => {
    if (!user) {
      // Could show a toast or modal here
      console.log("Please sign in to like posts");
      return;
    }
    mutate(1);
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t border-border-light/30">
      <div className="flex items-center space-x-1">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isPending}
          className={`flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-medium transition-all duration-200 outline-none group ${
            isLiked
              ? "text-error bg-error/10 hover:bg-error/20"
              : "text-secondary hover:text-error hover:bg-error/10"
          } ${isPending ? "opacity-50 cursor-not-allowed" : ""} ${
            !user ? "opacity-60" : ""
          }`}
        >
          <svg
            className={`w-5 h-5 transition-all duration-200 ${
              isLiked ? "fill-current" : "group-hover:scale-110"
            } ${isPending ? "animate-pulse" : ""}`}
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-body-small font-medium">
            {isPending ? "..." : likesNumber > 0 ? `${likesNumber}` : "Like"}
          </span>
        </button>

        {/* Comment Button */}
        <button className="flex cursor-pointer items-center space-x-2 px-3 py-2 text-secondary hover:text-accent hover:bg-accent/10 rounded-medium transition-all duration-200 outline-none group">
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
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
          <span className="text-body-small font-medium">Comment</span>
        </button>
      </div>
    </div>
  );
};

export default PostActions;
