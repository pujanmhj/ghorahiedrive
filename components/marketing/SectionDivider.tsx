'use client';

interface SectionDividerProps {
  variant?: 'wave' | 'angle' | 'curve';
  fillColor?: string;
  className?: string;
  flip?: boolean;
}

export default function SectionDivider({
  variant = 'wave',
  fillColor = '#F8FAF8',
  className = '',
  flip = false,
}: SectionDividerProps) {
  const flipStyle = flip ? 'rotate-180' : '';

  if (variant === 'wave') {
    return (
      <div className={`w-full overflow-hidden leading-none pointer-events-none ${flipStyle} ${className}`}>
        <svg
          className="relative block w-full h-10 sm:h-16 lg:h-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"
            fill={fillColor}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'curve') {
    return (
      <div className={`w-full overflow-hidden leading-none pointer-events-none ${flipStyle} ${className}`}>
        <svg
          className="relative block w-full h-8 sm:h-14 lg:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z"
            fill={fillColor}
          />
        </svg>
      </div>
    );
  }

  // Angled Separator
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none ${flipStyle} ${className}`}>
      <svg
        className="relative block w-full h-8 sm:h-12 lg:h-14"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1200 0L0 120V120H1200V0Z" fill={fillColor} />
      </svg>
    </div>
  );
}
