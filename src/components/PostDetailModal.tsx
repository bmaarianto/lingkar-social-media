"use client"

import { useEffect } from "react"
import PostDetail from "./PostDetail"

interface Props {
  isOpen: boolean
  onClose: () => void
  postId: number
}

const PostDetailModal = ({ isOpen, onClose, postId }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Full Coverage */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
        }}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-secondary-dark border border-border-light rounded-large shadow-lg overflow-hidden">
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh] scrollbar-hide">
          <PostDetail postId={postId} onClose={onClose} isModal={true} />
        </div>
      </div>
    </div>
  )
}

export default PostDetailModal
