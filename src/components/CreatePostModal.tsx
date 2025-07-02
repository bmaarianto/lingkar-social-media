"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supabase-client"

interface PostInput {
  content: string
}

const createPost = async (post: PostInput, imageFile?: File) => {
  let imageUrl = null

  if (imageFile) {
    const filePath = `post-${Date.now()}-${imageFile.name}`
    const { error: uploadError } = await supabase.storage.from("post-images").upload(filePath, imageFile)

    if (uploadError) throw new Error(uploadError.message)

    const { data: publicURLData } = supabase.storage.from("post-images").getPublicUrl(filePath)
    imageUrl = publicURLData.publicUrl
  }

  const { data, error } = await supabase.from("posts").insert({ ...post, image_url: imageUrl })

  if (error) throw new Error(error.message)

  return data
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

const CreatePostModal = ({ isOpen, onClose }: Props) => {
  const [content, setContent] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile?: File }) => {
      return createPost(data.post, data.imageFile)
    },
    onSuccess: () => {
      // Reset form and close modal
      setContent("")
      setSelectedFile(null)
      onClose()
      // Refresh posts list
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    mutate({ post: { content }, imageFile: selectedFile || undefined })
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const handleClose = () => {
    setContent("")
    setSelectedFile(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-secondary-dark border border-border-light rounded-large shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light/30">
          <h2 className="text-headline-2 text-primary font-semibold">Create Post</h2>
          <button
            onClick={handleClose}
            className="p-2 text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Content Textarea */}
          <div className="space-y-2">
            <textarea
              rows={4}
              value={content}
              required
              placeholder="What's on your mind?"
              className="input-field resize-none"
              onChange={(event) => setContent(event.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-caption text-muted">{content.length} characters</span>
            </div>
          </div>

          {/* Image Upload and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label
                htmlFor="modal-image"
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
                <input type="file" id="modal-image" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              {selectedFile && (
                <div className="flex items-center space-x-2 bg-tertiary-dark/50 border border-border-light/50 rounded-medium px-3 py-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-body-small text-primary font-medium truncate max-w-24">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 text-secondary hover:text-error hover:bg-error/10 rounded-small transition-all duration-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button type="button" onClick={handleClose} className="btn-ghost">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !content.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </div>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>

          {/* Error/Success Messages */}
          {isError && (
            <div className="flex items-center space-x-2 text-error">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-body-small">Error creating post. Please try again.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default CreatePostModal
