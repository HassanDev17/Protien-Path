import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number; // 0 to 100
  color: string;
  label: string;
  subLabel: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ radius, stroke, progress, color, label, subLabel }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Ref for D3 animation
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (circleRef.current) {
      d3.select(circleRef.current)
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr("stroke-dashoffset", strokeDashoffset);
    }
  }, [strokeDashoffset]);

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: radius * 2, height: radius * 2 }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg] absolute top-0 left-0"
      >
        <circle
          stroke="hsl(var(--muted))" // Use muted color for background ring
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          ref={circleRef}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: circumference }} // Initial state for animation
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-bold text-foreground leading-none">{Math.round(progress)}%</span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">{label}</span>
      </div>
      <div className="absolute -bottom-6 left-0 right-0 text-center">
        <p className="text-xs font-medium text-muted-foreground">{subLabel}</p>
      </div>
    </div>
  );
};

export default ProgressRing;
