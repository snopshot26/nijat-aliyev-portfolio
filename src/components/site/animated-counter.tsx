"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type AnimatedCounterProps = {
  label: string;
  value: string;
};

function parseCounter(value: string) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);

  if (!match) {
    return null;
  }

  return {
    prefix: match[1],
    number: Number(match[2]),
    suffix: match[3],
  };
}

export function AnimatedCounter({ label, value }: AnimatedCounterProps) {
  const parsed = parseCounter(value);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 24 });
  const rounded = useTransform(spring, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!parsed) {
      setDisplay(value);
      return;
    }

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplay(`${parsed.prefix}${latest}${parsed.suffix}`);
    });

    motionValue.set(parsed.number);
    return unsubscribe;
  }, [motionValue, parsed, rounded, value]);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-2xl border border-white/[0.08] bg-black/[0.16] p-4"
    >
      <p className="text-2xl font-semibold text-white">{display}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{label}</p>
    </motion.div>
  );
}
