import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-bold rounded-2xl transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30 border-b-4 border-blue-700",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 shadow-gray-200/50 border-b-4 border-gray-200",
    accent: "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-yellow-400/30 border-b-4 border-yellow-600",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 border-b-4 border-red-700"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};