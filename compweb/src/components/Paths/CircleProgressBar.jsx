import React from 'react';

const CircleProgressBar = ({ progress }) => {
  const radius = 100; // increased radius
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress / 100 * circumference;

  return (
    <svg height="240" width="240" style={{ transform: 'rotate(-90deg)' }}> {/* increased SVG size */}
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:'#87ddee', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'var(--accent)', stopOpacity:1}} />
        </linearGradient>
      </defs>
      <circle
        stroke="var(--selected-item)" // color of the remaining part
        fill="transparent"
        strokeWidth="15" // increased stroke width
        r={radius}
        cx="120" // center of the circle adjusted according to the new SVG size
        cy="120" // center of the circle adjusted according to the new SVG size
      />
      <circle
        stroke="url(#grad1)"
        fill="transparent"
        strokeWidth="15" // increased stroke width
        strokeLinecap="round" // make the ends of the stroke rounded
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        r={radius}
        cx="120" // center of the circle adjusted according to the new SVG size
        cy="120" // center of the circle adjusted according to the new SVG size
      />
      <text x="120" y="120" textAnchor="middle" fill="blue" fontSize="40px" dy=".3em" style={{ transform: 'rotate(90deg)' }}> {/* increased font size */}
        {progress}%
      </text>
    </svg>
  );
};

export default CircleProgressBar;
