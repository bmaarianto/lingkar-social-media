"use client";

import type React from "react";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface PostInput {
  title: string;
  content: string;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      // Reset form after successful submission
      setTitle("");
      setContent("");
      setSelectedFile(null);
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    mutate({ post: { title, content }, imageFile: selectedFile });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="bg-secondary-dark border border-default rounded-large p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-body-regular text-primary font-medium"
          >
            Post Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            required
            placeholder="Enter an engaging title for your post..."
            className="input-field"
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        {/* Content Textarea */}
        <div className="space-y-2">
          <label
            htmlFor="content"
            className="block text-body-regular text-primary font-medium"
          >
            Content
          </label>
          <textarea
            id="content"
            rows={6}
            value={content}
            required
            placeholder="Share your thoughts, experiences, or ask questions..."
            className="input-field resize-none"
            onChange={(event) => setContent(event.target.value)}
          />
          <div className="flex justify-between items-center">
            <span className="text-caption text-muted">
              {content.length} characters
            </span>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-body-regular text-primary font-medium">
            Upload Image
          </label>

          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-large p-8 text-center transition-all duration-200 ${
                dragActive
                  ? "border-accent bg-accent/5"
                  : "border-border-light hover:border-accent/50 hover:bg-tertiary-dark/30"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-tertiary-dark rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-body-regular text-primary mb-1">
                    Drag and drop your image here, or{" "}
                    <label
                      htmlFor="image"
                      className="text-accent hover:text-accent-hover cursor-pointer font-medium"
                    >
                      browse files
                    </label>
                  </p>
                  <p className="text-body-small text-secondary">
                    Supports: JPG, PNG, GIF
                  </p>
                </div>
              </div>
              <input
                type="file"
                id="image"
                accept="image/*"
                required
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="border border-border-light rounded-large p-4 bg-tertiary-dark/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-medium flex items-center justify-center">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-body-regular text-primary font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-body-small text-secondary">
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
            </div>
          )}
        </div>

        {/* Submit Button */}
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
            {isSuccess && (
              <div className="flex items-center space-x-2 text-success">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-body-small">
                  Post created successfully!
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setTitle("");
                setContent("");
                setSelectedFile(null);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isPending ||
                !selectedFile ||
                !title.trim() ||
                content.length < 10
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
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
