export type ToastType = 'success' | 'info' | 'warning' | 'error';

export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right'
  | 'center';

export type ToastAnimation = 
  | 'slide-right' 
  | 'slide-top' 
  | 'slide-left' 
  | 'slide-bottom'
  | 'pop';

export interface ToastProps {
  id: string;
  message?: string | undefined;
  type: ToastType;
  position: ToastPosition;
  animation: ToastAnimation;
  duration: number; // Duration in milliseconds
  showTimebar?: boolean;
  onDismiss: (id: string) => void;
}

export interface ToastOptions {
  message?: string | undefined;
  type?: ToastType;
  position?: ToastPosition;
  animation?: ToastAnimation;
  duration?: number;
  showTimebar?: boolean;
}
