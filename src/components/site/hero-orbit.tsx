"use client";

import { motion } from "framer-motion";

const orbs = [
  { size: 340, top: "8%", left: "18%", opacity: 0.22 },
  { size: 240, top: "40%", left: "58%", opacity: 0.16 },
  { size: 180, top: "16%", left: "72%", opacity: 0.14 },
];

export function HeroOrbit() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-[radial-gradient(circle_at_center,rgba(148,163,255,0.5),rgba(59,130,246,0.08),transparent_72%)] blur-2xl"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            opacity: orb.opacity,
          }}
          animate={{ y: [0, -18, 0], x: [0, 12, 0], scale: [1, 1.04, 1] }}
          transition={{
            duration: 9 + index * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="pulsing-grid absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_58%)] opacity-60" />
    </div>
  );
}
