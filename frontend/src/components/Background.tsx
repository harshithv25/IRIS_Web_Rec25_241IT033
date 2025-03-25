import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Background() {
  const [particles, setParticles] = useState([
    {
      id: 0,
      x: 0,
      y: 0,
      size: 0,
      opacity: 0,
      delay: 0,
      speed: 0,
    },
  ]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const numParticles = 100;
    const newParticles = Array.from({ length: numParticles }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 2,
      speed: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, [isClient]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-0">
      {isClient &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-[#6770d2]"
            style={{
              top: `${particle.y}%`,
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${
                particle.size
              }px rgba(103, 112, 210, 0.5)`,
            }}
            initial={{ y: 0, x: 0 }}
            animate={{
              y: [0, 100, 0],
              x: [0, 50, 0],
            }}
            transition={{
              duration: particle.speed * 10,
              ease: "linear",
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
    </div>
  );
}
