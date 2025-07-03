import { Route, Routes, useLocation } from "react-router";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import CreatePostPage from "./pages/CreatePostPage";
import Navbar from "./components/Navbar";
import BackNavbar from "./components/BackNavbar";

const App = () => {
  const location = useLocation();

  // Determine which navbar to show based on route
  const isBackNavbarRoute =
    location.pathname.startsWith("/post/") || location.pathname === "/create";

  const getNavbarTitle = () => {
    if (location.pathname === "/create") return "Create Post";
    if (location.pathname.startsWith("/post/")) return "Post";
    return undefined;
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      {isBackNavbarRoute ? <BackNavbar title={getNavbarTitle()} /> : <Navbar />}

      {/* Main Content Area */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/create" element={<CreatePostPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
