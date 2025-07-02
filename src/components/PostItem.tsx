import { Link } from "react-router";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props) => {
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

  return (
    <article className="post-card group cursor-pointer">
      <Link to={`/post/${post.id}`} className="block">
        {/* Header: Avatar and Title */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
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
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-headline-3 text-primary font-semibold group-hover:text-accent transition-colors duration-200 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-body-small text-secondary mt-1">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>

        {/* Content Preview */}
        <div className="mb-4">
          <p className="text-body-regular text-secondary line-clamp-3 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Image Banner */}
        {post.image_url && (
          <div className="relative overflow-hidden rounded-medium mb-4">
            <img
              src={post.image_url || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center pt-3 border-t border-border-light/30">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-secondary hover:text-accent transition-colors duration-200">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-body-small">Like</span>
            </button>
            <button className="flex items-center space-x-2 text-secondary hover:text-accent transition-colors duration-200">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-body-small">Comment</span>
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostItem;
