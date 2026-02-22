export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#F72585" />
        </linearGradient>
      </defs>
      
      {/* Outer rounded square */}
      <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#logoGradient)" opacity="0.2"/>
      <rect x="5" y="5" width="90" height="90" rx="20" stroke="url(#logoGradient)" strokeWidth="2" fill="none"/>
      
      {/* Letter S */}
      <path 
        d="M 35 30 Q 25 30 25 40 Q 25 45 30 47 L 55 55 Q 60 57 60 62 Q 60 67 55 67 L 35 67 Q 30 67 30 62" 
        stroke="url(#logoGradient)" 
        strokeWidth="6" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Play button triangle */}
      <path 
        d="M 65 40 L 80 50 L 65 60 Z" 
        fill="url(#logoGradient)"
      />
    </svg>
  )
}

