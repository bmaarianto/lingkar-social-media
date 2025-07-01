"use client"

import { Link } from "react-router"
import logo from "../assets/logo.svg"
import { useState } from "react"

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="h-16 bg-secondary-dark border-b border-border-default sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center" style={{ outline: "none", border: "none", boxShadow: "none" }}>
            <img
              src={logo || "/placeholder.svg?height=32&width=120"}
              alt="logo"
              className="h-8 w-auto hover:opacity-80 transition-opacity duration-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-text-primary hover:text-accent transition-colors duration-200 font-medium"
              style={{ outline: "none", border: "none", boxShadow: "none" }}
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-text-primary hover:text-accent transition-colors duration-200 font-medium"
              style={{ outline: "none", border: "none", boxShadow: "none" }}
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="text-text-primary hover:text-accent transition-colors duration-200 font-medium"
              style={{ outline: "none", border: "none", boxShadow: "none" }}
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="bg-accent text-white px-4 py-2 rounded-small font-medium hover:bg-accent-hover transition-colors duration-200"
              style={{ outline: "none", border: "none", boxShadow: "none" }}
            >
              Create Community
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-primary hover:text-accent transition-colors duration-200"
            style={{ outline: "none", border: "none", boxShadow: "none" }}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-secondary-dark border-b border-border-default shadow-lg">
            <div className="px-6 py-4 space-y-3">
              <div onClick={handleMobileLinkClick} style={{ outline: "none", border: "none", boxShadow: "none" }}>
                <Link
                  to="/"
                  className="block text-text-primary hover:text-accent transition-colors duration-200 font-medium py-2"
                  style={{
                    outline: "none !important",
                    border: "none !important",
                    boxShadow: "none !important",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Home
                </Link>
              </div>

              <div onClick={handleMobileLinkClick} style={{ outline: "none", border: "none", boxShadow: "none" }}>
                <Link
                  to="/create"
                  className="block text-text-primary hover:text-accent transition-colors duration-200 font-medium py-2"
                  style={{
                    outline: "none !important",
                    border: "none !important",
                    boxShadow: "none !important",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Create Post
                </Link>
              </div>

              <div onClick={handleMobileLinkClick} style={{ outline: "none", border: "none", boxShadow: "none" }}>
                <Link
                  to="/communities"
                  className="block text-text-primary hover:text-accent transition-colors duration-200 font-medium py-2"
                  style={{
                    outline: "none !important",
                    border: "none !important",
                    boxShadow: "none !important",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Communities
                </Link>
              </div>

              <div onClick={handleMobileLinkClick} style={{ outline: "none", border: "none", boxShadow: "none" }}>
                <Link
                  to="/community/create"
                  className="block bg-accent text-white px-4 py-2 rounded-small font-medium hover:bg-accent-hover transition-colors duration-200 text-center mt-4"
                  style={{
                    outline: "none !important",
                    border: "none !important",
                    boxShadow: "none !important",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Create Community
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
