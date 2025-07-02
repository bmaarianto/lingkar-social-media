import PostList from "../components/PostList"

const Home = () => {
  return (
    <div className="min-h-screen bg-primary-dark pt-16 md:pt-10">
      <div className="container-custom py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-headline-1 text-primary font-semibold mb-2">Recent Posts</h1>
            <p className="text-body-regular text-secondary">Discover the latest posts from our community</p>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            <PostList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
