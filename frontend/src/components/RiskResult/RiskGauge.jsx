import React, { useEffect, useState } from 'react';

export default function RiskGauge({ score = 0, size = 200 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    // Animate score from 0 to target
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Map score 0-10 to color
  let color = 'var(--gauge-low)';
  let category = 'Low Risk';
  if (score >= 4 && score <= 6) {
    color = 'var(--gauge-medium)';
    category = 'Moderate Risk';
  } else if (score >= 7) {
    color = 'var(--gauge-high)';
    category = 'High Risk';
  }

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Arc is 75% of a circle (gap at bottom)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = circumference - arcLength;
  
  // Calculate fill based on animated score
  const fillPercentage = (animatedScore / 10);
  const fillDashoffset = circumference - (arcLength * fillPercentage);

  return (
    <div className="relative flex flex-col items-center justify-center font-sans">
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        className="transform rotate-135"
        style={{ transform: 'rotate(135deg)' }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        {/* Animated fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={fillDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 1s ease' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center text-center mt-2">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Risk Score</span>
        <span className="text-5xl font-black font-heading mt-1 mb-1" style={{ color }}>{score}</span>
        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-slate-800/50 backdrop-blur-sm border" style={{ borderColor: `${color}40`, color }}>
          {category}
        </span>
      </div>
    </div>
  );
}
