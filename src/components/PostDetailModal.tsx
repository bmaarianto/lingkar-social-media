"use client";

import { useEffect } from "react";
import PostDetail from "./PostDetail";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

const PostDetailModal = ({ isOpen, onClose, postId }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Full Screen Backdrop */}
      <div
        className="fixed inset-0 w-screen h-screen bg-black/80 backdrop-blur-sm z-50 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-2xl h-[90vh] bg-secondary-dark border border-border-light rounded-large shadow-lg overflow-hidden flex flex-col pointer-events-auto">
          {/* Fixed Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-light/30 bg-secondary-dark flex-shrink-0">
            <h2 className="text-headline-2 text-primary font-semibold">
              Post Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200 cursor-pointer"
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

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-hide bg-secondary-dark">
            <PostDetail postId={postId} onClose={onClose} isModal={true} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetailModal;
