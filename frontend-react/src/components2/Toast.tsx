import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  show, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const typeConfig = {
    success: {
      bg: 'bg-success',
      icon: 'fa-check-circle',
      title: 'Éxito'
    },
    error: {
      bg: 'bg-danger',
      icon: 'fa-exclamation-circle',
      title: 'Error'
    },
    warning: {
      bg: 'bg-warning',
      icon: 'fa-exclamation-triangle',
      title: 'Advertencia'
    },
    info: {
      bg: 'bg-info',
      icon: 'fa-info-circle',
      title: 'Información'
    }
  };

  const config = typeConfig[type];

  return (
    <div 
      className="position-fixed top-0 end-0 p-3" 
      style={{ zIndex: 10000 }}
    >
      <div 
        className={`toast show ${config.bg} text-white`} 
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          <i className={`fas ${config.icon} me-2`}></i>
          <strong className="me-auto">{config.title}</strong>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Toast;
