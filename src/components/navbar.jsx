
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import QuickJobSearch from "./home_page_components/quick_job_search.jsx";

const C = {
  primary: "#0a2540",
  accent: "#ff4d4f",
  border: "#e5e7eb",
  text: "#374151",
  light: "#f3f4f6",
};

const NAV_ITEMS = [
  { label: "Home", page: "home" },
  {
    label: "Jobs",
    dropdown: [
      { label: "Fresher Jobs", key: "fresher" },
      { label: "Experienced Jobs", key: "experienced" },
      { label: "Work From Home", key: "remote" },
      { label: "Part-Time Jobs", key: "part-time" },
      { label: "Urgent Hiring", key: "urgent" },
      { label: "Abroad Jobs", key: "abroad" },
    ],
  },
  { label: "Walk in Drive", page: "walk-in-drive" },
  {
    label: "Internships",
    dropdown: [
      { label: "IT Internships", key: "it-internship" },
      { label: "GOVT Internships", key: "govt-internship" },
    ],
  },
  { label: "Exams", page: "user/view-exams" },
  { label: "Courses", page: "users/view-courses" },
  { label: "Resources", page: "resources" },
  {
    label: "Resume Builder",
    page: "resume",
    external: "https://resumes-by-hirely.onrender.com/",
  },
];

const getPagePath = (page) =>
  page === "home" ? "/" : `/${page}`;

const getSubPath = (key) =>
  `/jobs/categories/${key}`;

function SearchIcon({ size = 19 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function ChevronIcon({ expanded = false }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
      }}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function DropdownMenu({
  items,
  position,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}) {
  if (!position) return null;

  return createPortal(
    <div
      className="djo-desktop-dropdown"
      style={{
        top: position.top,
        left: position.left,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.map((item) => (
        <Link
          key={item.key}
          to={getSubPath(item.key)}
          className="djo-dropdown-link"
          onClick={() => onNavigate?.(item.key)}
        >
          {item.label}
        </Link>
      ))}
    </div>,
    document.body
  );
}

function NavLink({
  item,
  index,
  activePage,
  onNavigate,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);

  const triggerRef = useRef(null);
  const timerRef = useRef(null);

  const hasDropdown = Boolean(item.dropdown);
  const isActive = item.page && activePage === item.page;

  const show = () => {
    if (!hasDropdown || !triggerRef.current) return;

    clearTimeout(timerRef.current);

    const rect = triggerRef.current.getBoundingClientRect();

    setPosition({
      left: rect.left + rect.width / 2,
      top: rect.bottom + 12,
    });

    setOpen(true);
  };

  const hide = () => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const linkStyle = {
    fontSize: 14,
    padding: "8px 10px",
    borderRadius: 8,
    color: isActive
      ? C.accent
      : index === 0
      ? C.primary
      : C.text,
    background: isActive
      ? "rgba(255,77,79,0.10)"
      : index === 0
      ? "rgba(243,244,246,0.60)"
      : "transparent",
    display: "flex",
    alignItems: "center",
    gap: 6,
    textDecoration: "none",
    fontWeight: isActive ? 700 : 500,
    whiteSpace: "nowrap",
    transition: "background 0.2s ease",
  };

  return (
    <div
      ref={triggerRef}
      className="djo-desktop-nav-item"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {item.external ? (
        <a
          href={item.external}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          {item.label}
        </a>
      ) : hasDropdown ? (
        <button
          type="button"
          className="djo-desktop-dropdown-trigger"
          style={linkStyle}
          onClick={() => {
            if (open) {
              setOpen(false);
            } else {
              show();
            }
          }}
          aria-expanded={open}
          aria-haspopup="true"
        >
          {item.label}
          <ChevronIcon expanded={open} />
        </button>
      ) : (
        <Link
          to={getPagePath(item.page)}
          style={linkStyle}
          onClick={() => onNavigate?.(item.page)}
        >
          {item.label}
        </Link>
      )}

      {hasDropdown && open && (
        <DropdownMenu
          items={item.dropdown}
          position={position}
          onMouseEnter={() => clearTimeout(timerRef.current)}
          onMouseLeave={hide}
          onNavigate={(key) => {
            setOpen(false);
            onNavigate?.(key);
          }}
        />
      )}
    </div>
  );
}

function MobileNavItem({
  item,
  closeMenu,
  onNavigate,
}) {
  const [expanded, setExpanded] = useState(false);

  const hasDropdown = Boolean(item.dropdown);

  const handleNavigation = (value) => {
    onNavigate?.(value);
    closeMenu();
  };

  if (hasDropdown) {
    return (
      <div className="djo-mobile-nav-group">
        <button
          type="button"
          className={`djo-mobile-nav-row ${
            expanded ? "is-expanded" : ""
          }`}
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          <span>{item.label}</span>
          <ChevronIcon expanded={expanded} />
        </button>

        {expanded && (
          <div className="djo-mobile-submenu">
            {item.dropdown.map((sub) => (
              <Link
                key={sub.key}
                to={getSubPath(sub.key)}
                className="djo-mobile-submenu-link"
                onClick={() => handleNavigation(sub.key)}
              >
                <span className="djo-submenu-dot" />
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.external}
        target="_blank"
        rel="noopener noreferrer"
        className="djo-mobile-nav-row"
        onClick={closeMenu}
      >
        <span>{item.label}</span>
        <span className="djo-external-arrow">↗</span>
      </a>
    );
  }

  return (
    <Link
      to={getPagePath(item.page)}
      className="djo-mobile-nav-row"
      onClick={() => handleNavigation(item.page)}
    >
      {item.label}
    </Link>
  );
}

function Navbar({
  bp,
  onNavigate = () => {},
  activePage = "",
  sticky: isSticky = false,
  navOffset = 0,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  const [scrolled, setScrolled] = useState(false);

  const drawerRef = useRef(null);
  const searchRef = useRef(null);
  const searchButtonRef = useRef(null);
  const hamburgerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isDesktop = viewportWidth >= 1024;
  const compactDesktop = viewportWidth < 1500;

  const closeMenu = () => setMenuOpen(false);

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const submitSearch = ({
    query,
    category,
    role,
    location: jobLocation,
  }) => {
    const params = new URLSearchParams();

    if (query?.trim()) {
      params.set("query", query.trim());
    }

    if (category) {
      params.set("category", category);
    }

    if (role) {
      params.set("role", role);
    }

    if (jobLocation && jobLocation !== "All Locations") {
      params.set("location", jobLocation);
    }

    setSearchOpen(false);
    setMenuOpen(false);

    navigate(`/jobs/search?${params.toString()}`);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setViewportWidth(width);

      if (width >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        openSearch();
      }
    };

    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen || isDesktop) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, isDesktop]);

  useEffect(() => {
    if (!searchOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    document.body.style.overflow = "hidden";

    const panel = searchRef.current;

    const focusableSelector = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    panel?.querySelector("input")?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusableElements = [
        ...panel.querySelectorAll(focusableSelector),
      ].filter((element) => element.getClientRects().length > 0);

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      } else {
        searchButtonRef.current?.focus();
      }
    };
  }, [searchOpen]);

  const navStyle = {
    position: isSticky ? "fixed" : "relative",
    top: isSticky ? 0 : "auto",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: menuOpen ? 10003 : 1000,

    background: menuOpen
      ? "rgba(255,255,255,0.96)"
      : isSticky || scrolled
      ? "rgba(255,255,255,0.88)"
      : "rgba(255,255,255,0.95)",

    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",

    borderBottom: "1px solid rgba(229,231,235,0.75)",
    boxShadow: scrolled
      ? "0 4px 20px rgba(10,37,64,0.08)"
      : "0 1px 3px rgba(0,0,0,0.04)",

    transition:
      "background 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <>
      <style>{`
        @keyframes djo-slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes djo-popup-in {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Desktop navigation */

        .djo-desktop-nav-item {
          position: relative;
          flex-shrink: 0;
        }

        .djo-desktop-dropdown-trigger {
          border: none;
          font-family: inherit;
          cursor: pointer;
          background: transparent;
        }

        .djo-desktop-nav-item > a:hover,
        .djo-desktop-dropdown-trigger:hover {
          background: rgba(243,244,246,0.85) !important;
        }

        .djo-desktop-dropdown {
          position: fixed;
          z-index: 11000;
          transform: translateX(-50%);
          min-width: 190px;
          padding: 7px;
          border-radius: 16px;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(229,231,235,0.85);
          box-shadow: 0 12px 35px rgba(10,37,64,0.12);
          animation: djo-slide-down 0.2s ease;
        }

        .djo-dropdown-link {
          display: flex;
          align-items: center;
          padding: 11px 13px;
          border-radius: 10px;
          color: #0a2540;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: background 0.2s ease,
                      transform 0.2s ease;
        }

        .djo-dropdown-link:hover {
          background: #f3f6fa;
          transform: translateX(3px);
        }

        /* Modern search button */

        .navbar-job-search-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          height: 40px;
          padding: 0 13px;
          margin-right: 5px;
          flex-shrink: 0;
          border: 1px solid #e5eaf0;
          border-radius: 999px;
          background: #f8fafc;
          color: #64748b;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .navbar-job-search-trigger:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 16px rgba(15,23,42,0.07);
          transform: translateY(-1px);
        }

        .navbar-job-search-trigger:focus-visible,
        .navbar-search-close:focus-visible,
        .hamburger-btn:focus-visible {
          outline: 2px solid #0a2540;
          outline-offset: 3px;
        }

        .navbar-job-search-trigger svg {
          flex-shrink: 0;
          color: #475569;
        }

        .navbar-job-search-trigger.is-compact {
          width: 40px;
          padding: 0;
          border-radius: 12px;
        }

        .navbar-job-search-trigger.is-mobile {
          width: 42px;
          height: 42px;
          padding: 0;
          margin-right: 0;
          border-radius: 12px;
        }

        .navbar-search-label {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .navbar-search-hint {
          padding: 3px 6px;
          border: 1px solid #e2e8f0;
          border-radius: 5px;
          background: #ffffff;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 600;
        }

        /* Hamburger */

        .hamburger-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .hamburger-btn span {
          display: block;
          width: 20px;
          height: 2.5px;
          background: #0a2540;
          border-radius: 2px;
          transition:
            transform 0.25s ease,
            opacity 0.2s ease;
        }

        .hamburger-btn.is-open span:nth-child(1) {
          transform: translateY(7.5px) rotate(45deg);
        }

        .hamburger-btn.is-open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger-btn.is-open span:nth-child(3) {
          transform: translateY(-7.5px) rotate(-45deg);
        }

        /* Mobile overlay */

        .ct-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,37,64,0.20);
          z-index: 10001;
        }

        /* Mobile drawer — outside navbar via portal */

        .ct-drawer {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 12px 32px rgba(10,37,64,0.12);
          z-index: 10002;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          padding: 12px 0 32px;
          animation: djo-slide-down 0.22s ease;
        }

        .djo-mobile-nav-group {
          width: 100%;
        }

        .djo-mobile-nav-row {
          display: flex;
          width: 100%;
          box-sizing: border-box;
          align-items: center;
          justify-content: space-between;
          min-height: 51px;
          padding: 14px 22px;
          border: none;
          border-bottom: 1px solid rgba(229,231,235,0.65);
          background: transparent;
          color: #0a2540;
          text-align: left;
          text-decoration: none;
          font-family: inherit;
          font-size: 15px;
          font-weight: 550;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .djo-mobile-nav-row:hover,
        .djo-mobile-nav-row.is-expanded {
          background: #f5f7fa;
        }

        .djo-mobile-submenu {
          padding: 6px 0;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }

        .djo-mobile-submenu-link {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 43px;
          padding: 9px 34px;
          box-sizing: border-box;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .djo-mobile-submenu-link:hover {
          background: #edf2f7;
          color: #0a2540;
        }

        .djo-submenu-dot {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #94a3b8;
        }

        .djo-external-arrow {
          color: #94a3b8;
          font-size: 17px;
        }

        /* Quick Job Search popup */

        .navbar-search-overlay {
          position: fixed;
          inset: 0;
          z-index: 12000;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 80px 12px 20px;
          box-sizing: border-box;
          overflow-y: auto;
          background: rgba(10,37,64,0.30);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .navbar-search-panel {
          position: relative;
          width: 100%;
          max-width: 520px;
          animation: djo-popup-in 0.22s ease-out;
        }

        .navbar-search-panel .jsc-card {
          max-width: 100%;
          box-sizing: border-box;
        }

        .navbar-search-close {
          position: absolute;
          right: 12px;
          top: 12px;
          z-index: 5;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 9px;
          background: #f3f4f6;
          color: #374151;
          font-size: 23px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .navbar-search-close:hover {
          background: #e5e7eb;
        }

        @media (max-width: 600px) {
          .navbar-search-overlay {
            padding: 72px 10px 16px;
          }

          .navbar-search-panel .jsc-row {
            grid-template-columns: 1fr;
          }

          .navbar-search-panel .jsc-card {
            padding: 22px 18px;
          }
        }

        @media (max-width: 380px) {
          .djo-brand-text {
            font-size: 13px !important;
          }

          .djo-brand-logo {
            width: 48px !important;
            height: 48px !important;
          }

          .djo-nav-inner {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ct-drawer,
          .navbar-search-panel,
          .djo-desktop-dropdown {
            animation: none;
          }

          .navbar-job-search-trigger,
          .hamburger-btn,
          .djo-mobile-nav-row {
            transition: none;
          }
        }
      `}</style>

      {/* Main Navbar */}
      <nav style={navStyle}>
        <div
          className="djo-nav-inner"
          style={{
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            height: 64,
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              textDecoration: "none",
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            <img
              className="djo-brand-logo"
              src="/favicon.svg"
              alt="Daily Job Openings Logo"
              style={{
                width: 65,
                height: 65,
                objectFit: "contain",
                borderRadius: 9,
                flexShrink: 0,
              }}
            />

            <span
              className="djo-brand-text"
              style={{
                fontWeight: 800,
                color: C.primary,
                fontSize: 15,
                whiteSpace: "nowrap",
              }}
            >
              Daily
              <span style={{ color: C.accent }}>
                Job Openings
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isDesktop && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                minWidth: 0,
              }}
            >
              <button
                ref={searchButtonRef}
                type="button"
                className={`navbar-job-search-trigger ${
                  compactDesktop ? "is-compact" : ""
                }`}
                aria-label="Open job search"
                aria-haspopup="dialog"
                aria-expanded={searchOpen}
                onClick={openSearch}
                title="Search jobs (Ctrl + K)"
              >
                <SearchIcon size={17} />

                {!compactDesktop && (
                  <>
                    <span className="navbar-search-label">
                      Search jobs...
                    </span>

                    <span
                      className="navbar-search-hint"
                      aria-hidden="true"
                    >
                      Ctrl K
                    </span>
                  </>
                )}
              </button>

              {NAV_ITEMS.map((item, index) => (
                <NavLink
                  key={item.label}
                  item={item}
                  index={index}
                  activePage={activePage}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}

          {/* Mobile Controls */}
          {!isDesktop && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              {/* Mobile Search */}
              <button
                type="button"
                className="navbar-job-search-trigger is-mobile"
                aria-label="Open job search"
                aria-haspopup="dialog"
                aria-expanded={searchOpen}
                onClick={openSearch}
              >
                <SearchIcon size={19} />
              </button>

              {/* Hamburger */}
              <button
                ref={hamburgerRef}
                type="button"
                className={`hamburger-btn ${
                  menuOpen ? "is-open" : ""
                }`}
                aria-label={
                  menuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={menuOpen}
                aria-controls="djo-mobile-navigation"
                onClick={() => {
                  setSearchOpen(false);
                  setMenuOpen((value) => !value);
                }}
                style={{
                  background: menuOpen
                    ? "rgba(243,244,246,0.85)"
                    : "transparent",
                  border: menuOpen
                    ? "1.5px solid #e5e7eb"
                    : "1.5px solid transparent",
                }}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile overlay outside navbar */}
      {!isDesktop &&
        menuOpen &&
        createPortal(
          <div
            className="ct-overlay"
            onClick={closeMenu}
            aria-hidden="true"
          />,
          document.body
        )}

      {/* Mobile Drawer outside navbar */}
      {!isDesktop &&
        menuOpen &&
        createPortal(
          <div
            id="djo-mobile-navigation"
            className="ct-drawer"
            ref={drawerRef}
            role="navigation"
            aria-label="Mobile navigation"
          >
            {NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.label}
                item={item}
                onNavigate={onNavigate}
                closeMenu={closeMenu}
              />
            ))}

            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #e5e7eb",
              }}
            />
          </div>,
          document.body
        )}

      {/* Quick Job Search Popup */}
      {searchOpen &&
        createPortal(
          <div
            className="navbar-search-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeSearch();
              }
            }}
          >
            <div
              ref={searchRef}
              className="navbar-search-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Quick job search"
            >
              <button
                type="button"
                className="navbar-search-close"
                aria-label="Close job search"
                onClick={closeSearch}
              >
                ×
              </button>

              <QuickJobSearch onSearch={submitSearch} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Navbar;
