'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

const NOISE_BG =
  'url(\'data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)"/%3E%3C/svg%3E\')';

interface LineData {
  offset: number;
  opacity: number;
  dashArray: string;
}

function getInitialLineData(): LineData[] {
  return Array.from({ length: 25 }, () => ({
    offset: Math.random() * 2 - 1,
    opacity: 0.2 + Math.random() * 0.1,
    dashArray: `${3 + Math.random() * 2} ${8 + Math.random() * 3}`,
  }));
}

export function SketchyGrid() {
  const [lineData] = useState<LineData[]>(getInitialLineData);

  return (
    <>
      <div className='fixed inset-0 opacity-[0.6] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.2)_1px,transparent_0)] bg-size-[16px_16px] pointer-events-none z-50' />

      <div
        className='fixed inset-0 opacity-[0.15] pointer-events-none z-50'
        style={{ backgroundImage: NOISE_BG }}
      />

      <div className='fixed inset-0 opacity-[0.15] pointer-events-none z-50'>
        <svg className='w-full h-full'>
          {lineData.length > 0 &&
            lineData.map((line, i) => (
              <motion.line
                key={`h-${i}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: line.opacity }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                x1={line.offset}
                y1={i * 50}
                x2='100%'
                y2={i * 50}
                stroke='black'
                strokeWidth='1'
                strokeDasharray={line.dashArray}
                strokeLinecap='round'
              />
            ))}
        </svg>
      </div>
    </>
  );
}
