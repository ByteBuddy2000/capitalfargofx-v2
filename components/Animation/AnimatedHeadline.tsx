"use client";

import { motion, type Variants } from "framer-motion";

interface AnimatedHeadlineProps {
  className?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.2,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const headline = [
  { text: "Build Your Financial Future With", highlight: false },
  { text: "Smarter Digital Investing", highlight: true },
];

export default function AnimatedHeadline({
  className = "",
}: AnimatedHeadlineProps) {
  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`text-4xl leading-[1.12] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl ${className}`}
    >
      {headline.map((line, lineIndex) => (
        <span
          key={lineIndex}
          className={line.highlight ? "block" : "block"}
        >
          {line.text.split(" ").map((word, wordIndex) => (
            <motion.span
              key={`${lineIndex}-${wordIndex}`}
              variants={wordVariants}
              className={`mr-[0.25em] inline-block ${
                line.highlight
                  ? "bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent"
                  : ""
              }`}
            >
              {word}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}