"use client";

import { useNavigate } from "react-router";
import CreatePost from "../components/CreatePost";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  const handleSuccess = () => {
    // Navigate back to home after successful post creation
    navigate("/");
  };

  const handleCancel = () => {
    // Navigate back to home when cancelled
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      <div className={`${isMobile ? "" : "container-custom py-6 md:py-8"}`}>
        <div className={`${isMobile ? "" : "max-w-2xl mx-auto"}`}>
          <CreatePost onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
