"use client"

import { Link, useLocation } from "react-router"
import logo from "../assets/logo.svg"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { signInWithGitHub, signOut, user } = useAuth()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const displayName = user?.user_metadata.user_name || user?.email
  const userEmail = user?.email

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false)
  }

  const handleSignOut = () => {
    signOut()
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const isActiveLink = (path: string) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  const getLinkClasses = (path: string) => {
    const baseClasses = "px-4 py-2 text-body-regular rounded-medium transition-all duration-200 outline-none relative"
    const activeClasses = "text-primary bg-tertiary-dark/70 border-b-2 border-accent"
    const inactiveClasses = "text-secondary hover:text-primary hover:bg-tertiary-dark/50"

    return `${baseClasses} ${isActiveLink(path) ? activeClasses : inactiveClasses}`
  }

  const getMobileLinkClasses = (path: string) => {
    const baseClasses =
      "block px-4 py-3 text-body-regular rounded-medium transition-all duration-200 outline-none relative"
    const activeClasses = "text-primary bg-tertiary-dark/70 border-l-4 border-accent"
    const inactiveClasses = "text-secondary hover:text-primary hover:bg-tertiary-dark/50"

    return `${baseClasses} ${isActiveLink(path) ? activeClasses : inactiveClasses}`
  }

  return (
    <nav className="bg-secondary-dark border-b border-default sticky top-0 z-50">
      <div className="px-4 md:px-6 lg:px-8">
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
            <Link to="/" className={getLinkClasses("/")}>
              Home
              {isActiveLink("/") && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></div>
              )}
            </Link>
            <Link to="/communities" className={getLinkClasses("/communities")}>
              Communities
              {isActiveLink("/communities") && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></div>
              )}
            </Link>
            <Link to="/community/create" className={getLinkClasses("/community/create")}>
              Create Community
              {isActiveLink("/community/create") && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></div>
              )}
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center ml-6">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-tertiary-dark/50 transition-all duration-200 outline-none"
                >
                  {user.user_metadata.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url || "/placeholder.svg"}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full border-2 border-border-light hover:border-accent transition-colors duration-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent/20 border-2 border-accent/30 flex items-center justify-center">
                      <span className="text-accent font-semibold text-sm">{displayName?.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-secondary-dark border border-border-light rounded-large shadow-lg z-50">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        {user.user_metadata.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url || "/placeholder.svg"}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full border-2 border-border-light"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent/30 flex items-center justify-center">
                            <span className="text-accent font-semibold text-lg">
                              {displayName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-body-regular text-primary font-semibold truncate">{displayName}</h3>
                          {userEmail && <p className="text-body-small text-secondary truncate">{userEmail}</p>}
                        </div>
                      </div>

                      <div className="border-t border-border-light/30 pt-3">
                        <button
                          onClick={() => {
                            signOut()
                            setProfileDropdownOpen(false)
                          }}
                          className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 text-body-small text-secondary hover:text-error hover:bg-error/10 rounded-medium transition-all duration-200 outline-none"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="px-6 py-2 bg-tertiary-dark hover:bg-border-light text-primary text-body-small font-medium rounded-medium transition-all duration-200 outline-none hover:scale-105 border border-border-light hover:border-accent"
              >
                Sign In With GitHub
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-secondary hover:text-primary hover:bg-tertiary-dark/50 rounded-small transition-all duration-200 outline-none"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
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
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            mobileMenuOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-1 border-t border-default/50">
            <div onClick={handleMobileLinkClick}>
              <Link to="/" className={getMobileLinkClasses("/")}>
                Home
                {isActiveLink("/") && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"></div>
                )}
              </Link>
            </div>

            <div onClick={handleMobileLinkClick}>
              <Link to="/communities" className={getMobileLinkClasses("/communities")}>
                Communities
                {isActiveLink("/communities") && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"></div>
                )}
              </Link>
            </div>

            <div onClick={handleMobileLinkClick}>
              <Link to="/community/create" className={getMobileLinkClasses("/community/create")}>
                Create Community
                {isActiveLink("/community/create") && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"></div>
                )}
              </Link>
            </div>

            {/* Mobile Auth */}
            <div className="pt-4 px-4 border-t border-default/50 mt-4">
              {user ? (
                <div className="bg-tertiary-dark/40 border border-border-light/50 rounded-large p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {user.user_metadata.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url || "/placeholder.svg"}
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full border-2 border-border-light"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent/30 flex items-center justify-center">
                          <span className="text-accent font-semibold text-lg">
                            {displayName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body-large text-primary font-semibold truncate">{displayName}</h3>
                      {userEmail && <p className="text-body-small text-secondary truncate mt-1">{userEmail}</p>}
                      <div className="flex items-center mt-2">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-caption text-success font-medium">Signed in with GitHub</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sign Out Button inside profile card */}
                  <div className="mt-4 pt-4 border-t border-border-light/30">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 text-body-small text-secondary hover:text-error hover:bg-error/10 rounded-medium transition-all duration-200 outline-none"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  <div className="text-center py-3">
                    <div className="w-14 h-14 mx-auto mb-3 bg-tertiary-dark/50 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-body-large text-primary font-semibold mb-2">Join Our Community</h3>
                    <p className="text-body-small text-secondary mb-3">
                      Sign in to create posts, join communities, and connect with others.
                    </p>
                  </div>
                  <button
                    onClick={signInWithGitHub}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-tertiary-dark hover:bg-border-light text-primary text-body-regular font-medium rounded-medium transition-all duration-200 outline-none border border-border-light hover:border-accent"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Sign In With GitHub</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
