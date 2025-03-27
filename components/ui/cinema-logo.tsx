interface CinemaLogoProps {
    className?: string
    width?: number
    height?: number
  }
  
  export default function CinemaLogo({ className, width = 120, height = 120 }: CinemaLogoProps) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Fondo circular con gradiente */}
        <circle cx="120" cy="120" r="110" fill="url(#circleGradient)" />
  
        {/* Primer rectángulo (negro) */}
        <g transform="rotate(-15, 120, 100)">
          <rect x="80" y="70" width="70" height="50" rx="5" fill="#1E1E1E" />
  
          {/* Perforaciones del lado izquierdo */}
          <rect x="70" y="75" width="10" height="5" fill="#FFFFFF" />
          <rect x="70" y="85" width="10" height="5" fill="#FFFFFF" />
          <rect x="70" y="95" width="10" height="5" fill="#FFFFFF" />
          <rect x="70" y="105" width="10" height="5" fill="#FFFFFF" />
          <rect x="70" y="115" width="10" height="5" fill="#FFFFFF" />
        </g>
  
        {/* Segundo rectángulo (gris) */}
        <g transform="rotate(15, 120, 100)">
          <rect x="90" y="70" width="70" height="50" rx="5" fill="#6B7280" />
  
          {/* Perforaciones del lado derecho */}
          <rect x="160" y="75" width="10" height="5" fill="#FFFFFF" />
          <rect x="160" y="85" width="10" height="5" fill="#FFFFFF" />
          <rect x="160" y="95" width="10" height="5" fill="#FFFFFF" />
          <rect x="160" y="105" width="10" height="5" fill="#FFFFFF" />
          <rect x="160" y="115" width="10" height="5" fill="#FFFFFF" />
        </g>
  
        {/* Texto "CINETICKET" en color blanco */}
        <text x="120" y="170" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
          CINETICKET
        </text>
  
        {/* Definición del gradiente */}
        <defs>
          <linearGradient id="circleGradient" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1E40AF" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
  
  