import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  left: number;
  delay: number;
  size: number;
  amplitude: number;
  frequency: number;
}

export function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Create initial bubbles
    const initialBubbles: Bubble[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      size: 3 + Math.random() * 15,
      amplitude: 20 + Math.random() * 40,
      frequency: 2 + Math.random() * 2
    }));
    setBubbles(initialBubbles);

    // Add new bubbles periodically
    const interval = setInterval(() => {
      setBubbles(prev => {
        const newBubble: Bubble = {
          id: Date.now(),
          left: Math.random() * 100,
          delay: 0,
          size: 3 + Math.random() * 15,
          amplitude: 20 + Math.random() * 40,
          frequency: 2 + Math.random() * 2
        };
        return [...prev.slice(-14), newBubble];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 100 }}>
      {bubbles.map(bubble => {
        // Generate sine wave path points
        const steps = 20;
        const pathPoints = Array.from({ length: steps + 1 }, (_, i) => {
          const progress = i / steps;
          const y = progress * 105; // 0 to 105vh
          const x = Math.sin(progress * Math.PI * bubble.frequency) * bubble.amplitude;
          return { x, y };
        });

        return (
          <div
            key={bubble.id}
            className="absolute rounded-full border-2"
            style={{
              left: `${bubble.left}%`,
              bottom: '-50px',
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              borderColor: 'rgba(147, 197, 253, 0.2)',
              animation: `rise-${bubble.id} 20s linear infinite`,
              animationDelay: `${bubble.delay}s`
            }}
          />
        );
      })}
      <style>{`
        ${bubbles.map(bubble => {
          const steps = 20;
          const keyframes = Array.from({ length: steps + 1 }, (_, i) => {
            const progress = i / steps;
            const y = progress * 105;
            const x = Math.sin(progress * Math.PI * bubble.frequency) * bubble.amplitude;
            const percent = progress * 100;
            const opacity = progress < 0.05 || progress > 0.95 ? 0 : 0.3;
            return `${percent}% { transform: translateY(-${y}vh) translateX(${x}px); opacity: ${opacity}; }`;
          }).join('\n            ');

          return `
          @keyframes rise-${bubble.id} {
            ${keyframes}
          }`;
        }).join('\n')}
      `}</style>
    </div>
  );
}
