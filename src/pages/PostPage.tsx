"use client";

import { useParams } from "react-router";
import PostDetail from "../components/PostDetail";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="min-h-screen bg-primary-dark pt-4 md:pt-4">
        <div className="container-custom py-6 md:py-8">
          <div className="max-w-2xl mx-auto">
            <div className="post-card text-center py-8">
              <h3 className="text-headline-3 text-primary font-semibold mb-2">
                Invalid Post ID
              </h3>
              <p className="text-body-regular text-secondary">
                Please check the URL and try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PostDetail postId={Number(id)} isModal={false} />;
};

export default PostPage;
