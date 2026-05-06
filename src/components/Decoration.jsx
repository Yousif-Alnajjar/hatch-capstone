// Reusable decorative SVG shapes — abstract organic forms scattered across pages.

export function Asterisk({ color = '#0dae52', size = 56, style }) {
  // 8-point chunky asterisk
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" style={style} aria-hidden>
      <g fill={color}>
        <rect x="24" y="2"  width="8" height="52" rx="4" />
        <rect x="24" y="2"  width="8" height="52" rx="4" transform="rotate(45 28 28)" />
        <rect x="24" y="2"  width="8" height="52" rx="4" transform="rotate(90 28 28)" />
        <rect x="24" y="2"  width="8" height="52" rx="4" transform="rotate(135 28 28)" />
      </g>
    </svg>
  );
}

export function Burst({ color = '#ffb1a8', size = 80, style }) {
  // wispy radial sun-burst
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={style} aria-hidden>
      <g fill={color}>
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x="37" y="6" width="6" height="30" rx="3"
                transform={`rotate(${i * 40} 40 40)`} />
        ))}
      </g>
    </svg>
  );
}

export function HalfMoon({ color = '#ffd338', size = 120, rotate = 0, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: `rotate(${rotate}deg)`, ...style }} aria-hidden>
      <path d="M10,60 a50,50 0 0 1 100,0 z" fill={color} />
    </svg>
  );
}

export function Arc({ color = '#0c8ce9', size = 140, style }) {
  // open arc / partial ring
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" style={style} aria-hidden>
      <path d="M20 70 A50 50 0 1 1 120 70" stroke={color} strokeWidth="22" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Blob({ color = '#02b1a5', size = 200, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style} aria-hidden>
      <path d="M40,90 C20,40 90,5 130,25 C175,45 195,110 160,150 C130,185 70,180 45,150 C25,125 50,120 40,90 Z"
            fill={color} />
    </svg>
  );
}

export function Dot({ color = '#f5d51c', size = 22, style }) {
  return <span aria-hidden style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, ...style }} />;
}

export function Stripe({ color = '#ffd0b8', width = 130, height = 22, rotate = -25, style }) {
  return (
    <span aria-hidden style={{
      display: 'inline-block',
      width, height,
      background: color,
      borderRadius: 999,
      transform: `rotate(${rotate}deg)`,
      ...style,
    }} />
  );
}
