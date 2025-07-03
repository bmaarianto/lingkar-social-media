"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface PostInput {
  content: string;
  avatar_url: string | null;
  user_name: string;
}

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const createPost = async (post: PostInput, imageFile?: File) => {
  let imageUrl = null;

  if (imageFile) {
    const filePath = `post-${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, imageFile);

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicURLData } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);
    imageUrl = publicURLData.publicUrl;
  }
  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: imageUrl });

  if (error) throw new Error(error.message);

  return data;
};

const CreatePost = ({ onSuccess, onCancel, isModal = false }: Props) => {
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile?: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      // Reset form
      setContent("");
      setSelectedFile(null);
      // Refresh posts list
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Call success callback
      onSuccess?.();
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutate({
      post: {
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        user_name: user?.user_metadata.user_name || user?.email || "Anonymous",
      },
      imageFile: selectedFile || undefined,
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleCancel = () => {
    setContent("");
    setSelectedFile(null);
    onCancel?.();
  };

  return (
    <div
      className={`bg-secondary-dark border border-border-light rounded-large ${
        isModal ? "p-6" : "p-6"
      }`}
    >
      {/* Modal Header */}
      {isModal && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-light/30">
          <h2 className="text-headline-2 text-primary font-semibold">
            Create Post
          </h2>
          <button
            onClick={handleCancel}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-3 pb-4 border-b border-border-light/20">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user.user_metadata.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url || "/placeholder.svg"}
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
            <div>
              <h3 className="text-body-regular text-primary font-medium">
                {user.user_metadata.user_name || user.email}
              </h3>
              <p className="text-body-small text-secondary">
                What's on your mind?
              </p>
            </div>
          </div>
        )}

        {/* Content Textarea */}
        <div className="space-y-3">
          <textarea
            rows={isModal ? 4 : 6}
            value={content}
            required
            placeholder="Share your thoughts, experiences, or ask questions..."
            className="input-field resize-none text-body-regular leading-relaxed"
            onChange={(event) => setContent(event.target.value)}
          />
          <div className="flex justify-between items-center">
            <span className="text-caption text-muted">
              {content.length} characters
            </span>
            {content.length > 500 && (
              <span className="text-caption text-warning">
                Consider keeping it concise
              </span>
            )}
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-body-small text-secondary font-medium">
              Add Image (Optional)
            </label>
            <label
              htmlFor={isModal ? "modal-image" : "page-image"}
              className="flex items-center justify-center w-10 h-10 bg-tertiary-dark hover:bg-border-light border border-border-light hover:border-accent rounded-medium cursor-pointer transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 text-secondary group-hover:text-accent transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                type="file"
                id={isModal ? "modal-image" : "page-image"}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {selectedFile && (
            <div className="bg-tertiary-dark/30 border border-border-light/50 rounded-medium p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-medium flex items-center justify-center">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-body-small text-primary font-medium truncate max-w-48">
                      {selectedFile.name}
                    </p>
                    <p className="text-caption text-secondary">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-medium transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
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
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="flex items-center justify-between pt-4 border-t border-border-light/30">
          <div className="flex items-center space-x-4">
            {isError && (
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
                <span className="text-body-small">
                  Error creating post. Please try again.
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {!isModal && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn-ghost"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isModal ? "Posting..." : "Creating..."}</span>
                </div>
              ) : isModal ? (
                "Post"
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
