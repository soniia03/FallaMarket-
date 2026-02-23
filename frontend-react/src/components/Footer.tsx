import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <div className="container text-center">
        <p className="mb-1">&copy; 2024 FallaMarket - Marketplace de Trajes Falleros Valencianos</p>
        <p className="mb-0">
          <small>Frontend React | API Backend en localhost:3000</small>
        </p>
      </div>
    </footer>
  );
};

export default Footer;