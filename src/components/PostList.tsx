"use client"

import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router"
import { supabase } from "../supabase-client"
import PostItem from "./PostItem"

export interface Post {
  id: number
  title: string
  content: string
  created_at: string
  image_url: string
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data as Post[]
}

const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="post-card">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-tertiary-dark rounded-full skeleton"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-tertiary-dark rounded skeleton w-3/4"></div>
                <div className="h-4 bg-tertiary-dark rounded skeleton w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-tertiary-dark rounded skeleton"></div>
              <div className="h-4 bg-tertiary-dark rounded skeleton w-5/6"></div>
              <div className="h-4 bg-tertiary-dark rounded skeleton w-4/6"></div>
            </div>
            <div className="h-48 bg-tertiary-dark rounded-medium skeleton mb-4"></div>
            <div className="flex items-center justify-between pt-3 border-t border-border-light/30">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-16 bg-tertiary-dark rounded skeleton"></div>
                <div className="h-8 w-20 bg-tertiary-dark rounded skeleton"></div>
              </div>
              <div className="h-8 w-16 bg-tertiary-dark rounded skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="post-card text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-error/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-headline-3 text-primary font-semibold mb-2">Failed to Load Posts</h3>
        <p className="text-body-regular text-secondary mb-4">{error.message}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="post-card text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-tertiary-dark/50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="text-headline-2 text-primary font-semibold mb-3">No Posts Yet</h3>
        <p className="text-body-regular text-secondary mb-6 max-w-md mx-auto">
          Be the first to share something with the community! Create your first post and start the conversation.
        </p>
        <Link to="/create" className="btn-primary">
          Create First Post
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {data.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  )
}

export default PostList
