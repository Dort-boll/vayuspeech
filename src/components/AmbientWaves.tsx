import React, { useEffect, useRef } from 'react';

interface AmbientWavesProps {
  theme: 'dark' | 'light';
}

export const AmbientWaves: React.FC<AmbientWavesProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Wave parameters
    const waveCount = 4;
    const waveColorsDark = [
      'rgba(232, 148, 40, 0.18)',  // Vayu Amber
      'rgba(192, 40, 104, 0.14)',  // Accent pink
      'rgba(12, 136, 120, 0.12)',  // Accent emerald
      'rgba(59, 130, 246, 0.10)',  // Accent blue
    ];

    const waveColorsLight = [
      'rgba(232, 148, 40, 0.12)',
      'rgba(192, 40, 104, 0.08)',
      'rgba(12, 136, 120, 0.08)',
      'rgba(59, 130, 246, 0.06)',
    ];

    const waveConfigs = [
      { speed: 0.002, amplitude: 90, frequency: 0.003, phase: 0 },
      { speed: -0.0015, amplitude: 120, frequency: 0.002, phase: Math.PI / 4 },
      { speed: 0.0025, amplitude: 60, frequency: 0.005, phase: Math.PI / 2 },
      { speed: -0.003, amplitude: 75, frequency: 0.004, phase: Math.PI * 0.75 },
    ];

    // Grid nodes for interactive look
    const gridRows = 16;
    const gridCols = 24;
    const gridPoints: { x: number; y: number; originalY: number; speed: number; phase: number }[] = [];

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const x = (width / (gridCols - 1)) * c;
        const y = (height / (gridRows - 1)) * r;
        gridPoints.push({
          x,
          y,
          originalY: y,
          speed: 0.01 + Math.random() * 0.02,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const colors = theme === 'dark' ? waveColorsDark : waveColorsLight;

      // 1. Draw subtle digital tech grid points
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)';
      gridPoints.forEach((pt) => {
        // Calculate a very subtle organic wave float for each grid dot
        const offset = Math.sin(time * pt.speed + pt.phase) * 6;
        ctx.beginPath();
        ctx.arc(pt.x, pt.originalY + offset, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw soundwave lines/grid vertically on the left and right
      const sideLines = 40;
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.015)';
      ctx.lineWidth = 1;
      for (let i = 0; i < sideLines; i++) {
        const xLeft = 50 + i * 8;
        const xRight = width - 50 - i * 8;
        
        // Calculate a wave swell based on position
        const centerDist = Math.abs(width / 2 - xLeft) / (width / 2);
        const amplitudeFactor = Math.pow(centerDist, 2) * 120;
        
        const hLeft = Math.sin(time * 0.02 + i * 0.15) * amplitudeFactor;
        const hRight = Math.cos(time * 0.018 + i * 0.12) * amplitudeFactor;

        // Draw left voice print column
        ctx.beginPath();
        ctx.moveTo(xLeft, height / 2 - hLeft - 10);
        ctx.lineTo(xLeft, height / 2 + hLeft + 10);
        ctx.stroke();

        // Draw right voice print column
        ctx.beginPath();
        ctx.moveTo(xRight, height / 2 - hRight - 10);
        ctx.lineTo(xRight, height / 2 + hRight + 10);
        ctx.stroke();
      }

      // 3. Draw flowing main organic sine waves
      for (let i = 0; i < waveCount; i++) {
        const config = waveConfigs[i];
        ctx.beginPath();
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = i === 0 ? 3.5 : 2; // Make the primary amber wave slightly thicker
        
        // Setup shadow/glow for waves
        if (theme === 'dark') {
          ctx.shadowBlur = 15;
          ctx.shadowColor = colors[i];
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw continuous smooth wave across the screen width
        const segmentCount = 60;
        for (let x = 0; x <= width; x += width / segmentCount) {
          // Use multiple sin overlays for dynamic richness
          const waveY = 
            height / 2 + 
            Math.sin(x * config.frequency + time * config.speed + config.phase) * config.amplitude * Math.sin(time * 0.001) +
            Math.cos(x * (config.frequency * 0.5) - time * config.speed * 0.8) * (config.amplitude * 0.35);

          if (x === 0) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }
        ctx.stroke();
      }

      // Reset shadows
      ctx.shadowBlur = 0;

      time += 1.2;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }}
    />
  );
};
