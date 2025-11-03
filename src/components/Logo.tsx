import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 400 100" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="logoTitle logoDesc"
    >
      <title id="logoTitle">DatePullAI Logo</title>
      <desc id="logoDesc">Das Logo zeigt die Buchstaben AL mit einem Geschwindigkeitseffekt und der URL AlexLE135.de</desc>

      <defs>
        <linearGradient id="speedGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" style={{ stopColor: '#0056b3' }} />
          <stop offset="100%" style={{ stopColor: '#007BFF' }} />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#007BFF' }} />
          <stop offset="100%" style={{ stopColor: '#0056b3' }} />
        </linearGradient>
      </defs>

      {/* Speed Lines */}
      <g fill="url(#speedGradient)">
        <rect x="20" y="35" width="40" height="4" rx="2" />
        <rect x="40" y="45" width="50" height="4" rx="2" />
        <rect x="30" y="55" width="30" height="4" rx="2" />
        <rect x="70" y="65" width="40" height="4" rx="2" />
        <rect x="90" y="25" width="60" height="4" rx="2" />
        <rect x="100" y="35" width="55" height="4" rx="2" />
        <rect x="120" y="45" width="40" height="4" rx="2" />
        <rect x="110" y="55" width="50" height="4" rx="2" />
        <rect x="130" y="65" width="30" height="4" rx="2" />
        <rect x="150" y="15" width="20" height="3" rx="1.5" />
        <rect x="160" y="75" width="15" height="3" rx="1.5" />
      </g>

      {/* AL Letters */}
      <g fill="url(#textGradient)" fontFamily="Inter, sans-serif" fontWeight="bold">
        <path d="M180 80 L200 20 L220 80 L212 80 L207 65 L193 65 L188 80 Z M195 55 L205 55 L200 35 Z" />
        <path d="M230 20 L230 65 L260 65 L260 80 L215 80 L215 20 Z" />
      </g>
      
      {/* URL Text */}
      <text 
        x="225" 
        y="95" 
        fontFamily="Inter, sans-serif" 
        fontSize="12" 
        fill="#888888" 
        textAnchor="middle"
      >
        ALEXLE135.DE
      </text>
    </svg>
  );
};

export default Logo;