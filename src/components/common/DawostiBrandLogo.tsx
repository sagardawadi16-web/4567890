import React from 'react';

interface DawostiBrandLogoProps {
  variant?: 'full' | 'mark' | 'compact' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const DawostiBrandLogo: React.FC<DawostiBrandLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
}) => {
  // Height configurations
  const sizeClasses = {
    sm: { mark: 'w-7 h-7', text: 'text-sm', sub: 'text-[8px]' },
    md: { mark: 'w-9 h-9', text: 'text-base', sub: 'text-[9px]' },
    lg: { mark: 'w-12 h-12', text: 'text-xl', sub: 'text-[10px]' },
    xl: { mark: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs' },
  }[size];

  const strokeColor = variant === 'white' ? '#FFFFFF' : '#651722';
  const dotColor = variant === 'white' ? '#F6C358' : '#C76A32';
  const textColor = variant === 'white' ? 'text-white' : 'text-[#651722]';
  const subColor = variant === 'white' ? 'text-white/80' : 'text-[#2B1810]';

  // The custom vector mark precisely representing the user's uploaded logo:
  // Stylized Monogram D + coat hanger hook at top + flowing textile drape through the center loop
  const LogoMark = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses.mark} shrink-0 transition-transform duration-300`}
      aria-label="Dawosti Logo Mark"
    >
      {/* Coat hanger hook at the top */}
      <path
        d="M 54 28 C 54 20, 48 18, 48 13 C 48 9, 52 7, 55 9 C 58 11, 58 14, 56 16"
        stroke={strokeColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Coat hanger shoulders crossbeam */}
      <path
        d="M 18 48 L 48 35 L 78 48"
        stroke={strokeColor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main outer "D" geometry */}
      <path
        d="M 30 25 L 30 84 L 54 84 C 74 84, 82 72, 82 54 C 82 36, 72 25, 52 25 Z"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* Inner cutout of "D" with draped textile swoop */}
      <path
        d="M 40 40 L 40 72 L 52 72 C 64 72, 68 64, 68 56 C 68 47, 62 40, 50 40 Z"
        stroke={strokeColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Flowing silk/fabric drape loop curling gracefully across the lower-right of the D */}
      <path
        d="M 42 50 C 50 50, 58 66, 74 65 C 80 64, 85 58, 88 52 C 86 64, 76 75, 64 75 C 50 75, 42 62, 42 50 Z"
        fill={strokeColor}
      />
    </svg>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center ${className}`}>{LogoMark}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {LogoMark}

      <div className="flex flex-col justify-center select-none">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-serif-luxury font-bold tracking-[0.2em] ${textColor} ${sizeClasses.text}`}
          >
            DAWOSTI
          </span>
          <span
            className="w-2 h-2 rounded-full inline-block shrink-0 shadow-xs"
            style={{ backgroundColor: dotColor }}
          />
        </div>
        <span
          className={`font-sans uppercase font-medium tracking-[0.24em] ${subColor} ${sizeClasses.sub} mt-1`}
        >
          Clothing & Textiles
        </span>
      </div>
    </div>
  );
};
