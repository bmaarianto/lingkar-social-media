"use client";

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => {
  return <div className={`skeleton ${className}`}></div>;
};

interface PostSkeletonProps {
  showActions?: boolean;
  showImage?: boolean;
  compact?: boolean;
}

const PostSkeleton = ({
  showActions = true,
  showImage = true,
  compact = false,
}: PostSkeletonProps) => {
  return (
    <div className="post-card">
      {/* Header: Avatar and User Info */}
      <div className="flex items-start space-x-3 mb-4">
        <Skeleton
          className={`${compact ? "w-10 h-10" : "w-12 h-12"} rounded-full`}
        />
        <div className="flex-1 space-y-2">
          <Skeleton className={`h-${compact ? "5" : "6"} w-3/4 rounded`} />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
      </div>

      {/* Content */}
      <div
        className={`space-y-${compact ? "2" : "3"} mb-${compact ? "4" : "6"}`}
      >
        <Skeleton className="h-4 rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        {!compact && <Skeleton className="h-4 w-4/6 rounded" />}
      </div>

      {/* Image */}
      {showImage && (
        <Skeleton
          className={`h-${compact ? "40" : "64"} rounded-medium mb-${
            compact ? "4" : "6"
          }`}
        />
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center space-x-4 pt-3 border-t border-border-light/30">
          <Skeleton className="h-10 w-20 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>
      )}
    </div>
  );
};

interface PostListSkeletonProps {
  count?: number;
  showActions?: boolean;
  showImage?: boolean;
  compact?: boolean;
}

const PostListSkeleton = ({
  count = 3,
  showActions = true,
  showImage = true,
  compact = false,
}: PostListSkeletonProps) => {
  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, index) => (
        <PostSkeleton
          key={index}
          showActions={showActions}
          showImage={showImage}
          compact={compact}
        />
      ))}
    </div>
  );
};

interface CommentSkeletonProps {
  showReplies?: boolean;
  replyCount?: number;
}

const CommentSkeleton = ({
  showReplies = false,
  replyCount = 2,
}: CommentSkeletonProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
          <div className="flex items-center space-x-4 mt-2">
            <Skeleton className="h-6 w-12 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        </div>
      </div>

      {/* Replies */}
      {showReplies && (
        <div className="ml-11 space-y-3">
          {[...Array(replyCount)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface UserProfileSkeletonProps {
  showStats?: boolean;
  showBio?: boolean;
}

const UserProfileSkeleton = ({
  showStats = true,
  showBio = true,
}: UserProfileSkeletonProps) => {
  return (
    <div className="post-card">
      <div className="flex items-start space-x-4 mb-6">
        <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
          {showBio && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>
          )}
        </div>
      </div>

      {showStats && (
        <div className="flex items-center space-x-6 pt-4 border-t border-border-light/30">
          <div className="text-center">
            <Skeleton className="h-6 w-8 rounded mb-1" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
          <div className="text-center">
            <Skeleton className="h-6 w-8 rounded mb-1" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="text-center">
            <Skeleton className="h-6 w-8 rounded mb-1" />
            <Skeleton className="h-4 w-14 rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

interface FormSkeletonProps {
  showHeader?: boolean;
  showImage?: boolean;
  showActions?: boolean;
}

const FormSkeleton = ({
  showHeader = true,
  showImage = false,
  showActions = true,
}: FormSkeletonProps) => {
  return (
    <div className="bg-secondary-dark border border-border-light rounded-large p-6">
      {showHeader && (
        <div className="flex items-center space-x-3 pb-4 border-b border-border-light/20 mb-6">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4 mb-6">
        <Skeleton className="h-32 w-full rounded" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>

      {/* Image Upload */}
      {showImage && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="w-10 h-10 rounded-medium" />
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-border-light/30">
          <div></div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-16 rounded" />
            <Skeleton className="h-10 w-24 rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

interface ListSkeletonProps {
  count?: number;
  itemHeight?: string;
  showAvatar?: boolean;
}

const ListSkeleton = ({
  count = 5,
  itemHeight = "h-16",
  showAvatar = true,
}: ListSkeletonProps) => {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={`flex items-center space-x-3 p-3 ${itemHeight}`}
        >
          {showAvatar && (
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      ))}
    </div>
  );
};

interface CardSkeletonProps {
  showImage?: boolean;
  showActions?: boolean;
  imageHeight?: string;
}

const CardSkeleton = ({
  showImage = true,
  showActions = false,
  imageHeight = "h-48",
}: CardSkeletonProps) => {
  return (
    <div className="post-card">
      {showImage && (
        <Skeleton className={`${imageHeight} w-full rounded-medium mb-4`} />
      )}

      <div className="space-y-3 mb-4">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>

      {showActions && (
        <div className="flex items-center justify-between pt-3 border-t border-border-light/30">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      )}
    </div>
  );
};

// Export all components
export {
  Skeleton,
  PostSkeleton,
  PostListSkeleton,
  CommentSkeleton,
  UserProfileSkeleton,
  FormSkeleton,
  ListSkeleton,
  CardSkeleton,
};

// Default export for convenience
export default {
  Skeleton,
  PostSkeleton,
  PostListSkeleton,
  CommentSkeleton,
  UserProfileSkeleton,
  FormSkeleton,
  ListSkeleton,
  CardSkeleton,
};
