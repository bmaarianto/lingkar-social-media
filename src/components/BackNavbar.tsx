"use client";

import { useNavigate } from "react-router";
import logo from "../assets/logo.svg";

interface Props {
  title?: string;
  onBack?: () => void;
}

const BackNavbar = ({ title, onBack }: Props) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <nav className="bg-secondary-dark border-b border-default sticky top-0 z-50">
      <div className="px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center space-x-3 p-2 text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200 outline-none"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-body-regular font-medium">Back</span>
          </button>

          {/* Title (Optional) */}
          {title && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-headline-3 text-primary font-semibold">
                {title}
              </h1>
            </div>
          )}

          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logo || "/placeholder.svg"}
              alt="logo"
              className="h-8 w-auto opacity-60"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BackNavbar;
