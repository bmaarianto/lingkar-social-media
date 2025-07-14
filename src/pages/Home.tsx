"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import PostList from "../components/PostList";
import CreatePostModal from "../components/CreatePostModal";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const handleCreatePost = () => {
    if (isMobile) {
      // Navigate to create post page on mobile
      navigate("/create");
    } else {
      // Open modal on desktop
      setIsCreateModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-dark">
      <div className={`${isMobile ? "" : "container-custom py-6 md:py-8"}`}>
        <div className={`${isMobile ? "" : "max-w-2xl mx-auto"}`}>
          {/* Create Post Button */}
          {user && (
            <div
              className={`${
                isMobile ? "border-b border-border-light/30" : "mb-6"
              }`}
            >
              <button
                onClick={handleCreatePost}
                className={`w-full bg-secondary-dark ${
                  isMobile
                    ? "border-0 rounded-none"
                    : "border border-border-light rounded-large"
                } p-4 text-left hover:bg-tertiary-dark/50 transition-all duration-200 group`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user.user_metadata.avatar_url ? (
                      <img
                        src={
                          user.user_metadata.avatar_url || "/placeholder.svg"
                        }
                        alt="Your Avatar"
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
                  <span className="text-body-regular text-secondary group-hover:text-primary transition-colors duration-200">
                    What's on your mind?
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Posts Feed */}
          <div className={`${isMobile ? "" : "space-y-6"}`}>
            <PostList />
          </div>
        </div>
      </div>

      {/* Create Post Modal - Desktop Only */}
      {!isMobile && (
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
