import React, { useState, useEffect, useRef } from "react";
import AlertBar from "../alertbar";
import TopTicker from "../topticker";
import Navbar from "../navbar";

function MainLayout({ children, isMobile, isDesktop, C, bp }) {
  const [isSticky, setIsSticky] = useState(false);
  const [navOffset, setNavOffset] = useState(0); // null = not measured yet
  const alertBarRef = useRef(null);
  const topTickerRef = useRef(null);
  const thresholdRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      const alertH = alertBarRef.current?.offsetHeight ?? 0;
      const tickerH = topTickerRef.current?.offsetHeight ?? 0;
      return alertH + tickerH;
    };

    // Wait for real paint before measuring
    requestAnimationFrame(() => {
      const threshold = measure();
      thresholdRef.current = threshold;
      setNavOffset(threshold);
    });

    const handleScroll = () => {
      setIsSticky(window.scrollY >= thresholdRef.current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render navbar until we have a real measurement
  if (navOffset === null) return (
    <>
      <div ref={alertBarRef}>
        <AlertBar isMobile={false} C={{ accent: "#ff4d4f" }} />
      </div>
      <div ref={topTickerRef}>
        <TopTicker isMobile={isMobile} isDesktop={isDesktop} C={C} gutter="16px" />
      </div>
    </>
  );

  return (
    <>
      <div ref={alertBarRef}>
        <AlertBar isMobile={false} C={{ accent: "#ff4d4f" }} />
      </div>
      <div ref={topTickerRef}>
        <TopTicker isMobile={isMobile} isDesktop={isDesktop} C={C} gutter="16px" />
      </div>
      <Navbar
        bp={bp}
        sticky={isSticky}
        navOffset={navOffset}
        onMenuOpen={() => console.log("menu open")}
      />
      {children}
    </>
  );
}

export default MainLayout;