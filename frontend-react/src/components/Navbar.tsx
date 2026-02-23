import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-crown me-2"></i>
          FallaMarket
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
              >
                <i className="fas fa-home me-1"></i>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/trajes') ? 'active' : ''}`} 
                to="/trajes"
              >
                <i className="fas fa-tshirt me-1"></i>
                Trajes
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/trajes/add') ? 'active' : ''}`} 
                to="/trajes/add"
              >
                <i className="fas fa-plus me-1"></i>
                Añadir Traje
              </Link>
            </li>
          </ul>
          
          <div className="navbar-text">
            <small className="text-light">React Frontend - Puerto 3001</small>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;