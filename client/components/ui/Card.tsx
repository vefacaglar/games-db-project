import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  hoverable?: boolean;
}

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hoverable = false 
}: CardProps) {
  const baseStyles = 'bg-white rounded-lg overflow-hidden';
  
  const variants = {
    default: 'shadow-md',
    bordered: 'border border-gray-200',
    elevated: 'shadow-lg',
    flat: 'shadow-none',
  };
  
  const hoverStyles = hoverable ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer' : '';
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}

export function CardHeader({ 
  children, 
  className = '',
  bordered = true 
}: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 ${bordered ? 'border-b border-gray-200' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function CardContent({ 
  children, 
  className = '',
  padding = 'md' 
}: CardContentProps) {
  const paddingStyles = {
    none: '',
    sm: 'px-4 py-3',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
  };
  
  return <div className={`${paddingStyles[padding]} ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}

export function CardFooter({ 
  children, 
  className = '',
  bordered = true 
}: CardFooterProps) {
  return (
    <div className={`px-6 py-4 bg-gray-50 ${bordered ? 'border-t border-gray-200' : ''} ${className}`}>
      {children}
    </div>
  );
}

// Card compound component for easier composition
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;