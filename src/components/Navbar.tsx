"use client";

import { Link } from "react-router";
import logo from "../assets/logo.svg";
import { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary-dark/95 backdrop-blur-md border-b border-default">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center outline-none">
            <img
              src={logo || "/placeholder.svg"}
              alt="logo"
              className="h-8 w-auto transition-transform duration-200 hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-body-regular text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200 outline-none"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="px-4 py-2 text-body-regular text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200 outline-none"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="px-4 py-2 text-body-regular text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200 outline-none"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="ml-4 px-6 py-2 bg-accent hover:bg-accent-hover text-white text-body-small font-medium rounded-small transition-all duration-200 outline-none hover:scale-105"
            >
              Create Community
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-small transition-all duration-200 outline-none"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-1 border-t border-default/50">
            <div onClick={handleMobileLinkClick}>
              <Link
                to="/"
                className="block px-4 py-3 text-body-regular text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200 outline-none"
              >
                Home
              </Link>
            </div>

            <div onClick={handleMobileLinkClick}>
              <Link
                to="/create"
                className="block px-4 py-3 text-body-regular text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200 outline-none"
              >
                Create Post
              </Link>
            </div>

            <div onClick={handleMobileLinkClick}>
              <Link
                to="/communities"
                className="block px-4 py-3 text-body-regular text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-medium transition-all duration-200 outline-none"
              >
                Communities
              </Link>
            </div>

            <div onClick={handleMobileLinkClick} className="pt-2 px-4">
              <Link
                to="/community/create"
                className="block w-full text-center px-6 py-3 bg-accent hover:bg-accent-hover text-white text-body-regular font-medium rounded-medium transition-all duration-200 outline-none"
              >
                Create Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
