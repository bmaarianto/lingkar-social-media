import CreatePost from "../components/CreatePost"

const CreatePostPage = () => {
  return (
    <div className="min-h-screen bg-primary-dark pt-4 pb-4 md:pt-10 md:pb-10">
      <div className="container-custom py-3 pb-4 md:py-6 md:pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 md:mb-6">
            <h1 className="text-headline-1 text-primary font-semibold mb-2">Create New Post</h1>
            <p className="text-body-regular text-secondary">
              Share your thoughts, ideas, and experiences with the community.
            </p>
          </div>
          <CreatePost />
        </div>
      </div>
    </div>
  )
}

export default CreatePostPage
