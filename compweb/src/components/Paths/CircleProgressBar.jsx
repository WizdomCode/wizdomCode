import React from 'react';

const CircleProgressBar = ({ progress }) => {
  const radius = 100; // increased radius
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress / 100 * circumference;

  return (
    <svg height="240" width="240" style={{ transform: 'rotate(-90deg)' }}> {/* increased SVG size */}
      <circle
        stroke="dimgrey" // color of the remaining part
        fill="transparent"
        strokeWidth="15" // increased stroke width
        r={radius}
        cx="120" // center of the circle adjusted according to the new SVG size
        cy="120" // center of the circle adjusted according to the new SVG size
      />
      <circle
        stroke="blue"
        fill="transparent"
        strokeWidth="15" // increased stroke width
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
