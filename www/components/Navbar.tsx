"use client";

import { useState } from "react";
import Link from "next/link";
import { Github } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div
        className={`nav-overlay ${menuOpen ? "active" : ""}`}
        onClick={closeMenu}
      ></div>

      <nav className="full-nav">
        <Link href="/" className="logo" onClick={closeMenu}>
          ebade<span>.dev</span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="/#technology" onClick={closeMenu}>
            Technology
          </Link>
          <Link href="/#benchmarks" onClick={closeMenu}>
            Benchmarks
          </Link>
          <Link href="/playground" onClick={closeMenu}>
            Playground
          </Link>
          <a
            href="https://github.com/hasankemaldemirci/ebade"
            target="_blank"
            className="nav-github"
            onClick={closeMenu}
          >
            <Github size={18} />
            <span>GitHub</span>
          </a>
          <a
            href="https://github.com/hasankemaldemirci/ebade#-quick-start"
            target="_blank"
            className="nav-cta"
            onClick={closeMenu}
          >
            Get Started
          </a>
        </div>
      </nav>
    </>
  );
}
