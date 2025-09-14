import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-success-subtle' : 'bg-danger-subtle';
  const textColor = type === 'success' ? 'text-success-emphasis' : 'text-danger-emphasis';
  const borderColor = type === 'success' ? 'border-success-subtle' : 'border-danger-subtle';

  return (
    <div 
      className={`toast show align-items-center ${textColor} ${bgColor} ${borderColor} mb-2`}
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">
          {message}
        </div>
        <button 
          type="button" 
          className="btn-close me-2 m-auto" 
          onClick={onClose} 
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default Toast;
