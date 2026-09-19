import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Zap, History } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-icon-wrapper">
            <ShieldAlert size={20} color="#ffffff" />
          </div>
          <span>Contradiction<span className="brand-name-x">X</span></span>
        </Link>

        <nav className="nav-links">
          <Link
            to="/upload"
            className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
          >
            <Zap size={16} />
            <span>Analyze Reqs</span>
          </Link>

          <Link
            to="/history"
            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
          >
            <History size={16} />
            <span>History</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

