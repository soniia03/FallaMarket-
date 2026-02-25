import React from 'react';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ 
  message = 'Cargando...', 
  fullScreen = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border spinner-border-lg'
  };

  if (fullScreen) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 9999 }}>
        <div className="text-center">
          <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">{message}</span>
          </div>
          <p className="mt-3 text-primary fw-bold">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-5">
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="mt-2 text-muted">{message}</p>
    </div>
  );
};

export default Loader;
