import React, { createContext, ReactNode, useContext, useState } from 'react';
import ToastContainer from './ToastContainer';
import { ToastOptions, ToastProps } from './types';

interface ToastContextValue {
  showToast: (options: ToastOptions) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const showToast = (options: ToastOptions) => {
    const id = generateId();
    
    const toast: ToastProps = {
      id,
      message: options.message || "",
      type: options.type || 'info',
      position: options.position || 'top-center',
      animation: options.animation || 'slide-top',
      duration: options.duration || 3000,
      showTimebar: options.showTimebar !== undefined ? options.showTimebar : true,
      onDismiss: (toastId) => hideToast(toastId),
    };

    setToasts(prevToasts => [...prevToasts, toast]);
    return id;
  };

  const hideToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  const value = {
    showToast,
    hideToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
