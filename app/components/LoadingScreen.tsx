"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = [
  { char: "E", binary: "1000101" },
  { char: "X", binary: "1011000" },
  { char: "I", binary: "1001001" },
  { char: "T", binary: "1010100" },
  { char: "O", binary: "1001111" },
];

const GLITCH_CHARS = "01!@#$%^&*_+-=|<>?/~";

export default function LoadingScreen({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [phase, setPhase] = useState<
    "binary-rain" | "decode" | "glow" | "exit"
  >("binary-rain");
  const [decodedCount, setDecodedCount] = useState(0);
  const [glitchTexts, setGlitchTexts] = useState<string[]>(
    LETTERS.map((l) => l.binary)
  );

  // Phase 1: Binary rain for 800ms then decode
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("decode"), 800);
    return () => clearTimeout(t1);
  }, []);

  // Phase 2: Decode letters one by one
  useEffect(() => {
    if (phase !== "decode") return;

    if (decodedCount >= LETTERS.length) {
      const t = setTimeout(() => setPhase("glow"), 300);
      return () => clearTimeout(t);
    }

    const idx = decodedCount;
    const targetChar = LETTERS[idx].char;
    let scrambleCount = 0;
    const maxScrambles = 6;

    const interval = setInterval(() => {
      scrambleCount++;
      if (scrambleCount >= maxScrambles) {
        setGlitchTexts((prev) => {
          const next = [...prev];
          next[idx] = targetChar;
          return next;
        });
        clearInterval(interval);
        setTimeout(() => setDecodedCount((c) => c + 1), 120);
      } else {
        setGlitchTexts((prev) => {
          const next = [...prev];
          next[idx] =
            GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          return next;
        });
      }
    }, 70);

    return () => clearInterval(interval);
  }, [phase, decodedCount]);

  // Phase 3: Glow → exit
  useEffect(() => {
    if (phase !== "glow") return;
    const t = setTimeout(() => setPhase("exit"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase 4: Exit → finish
  useEffect(() => {
    if (phase !== "exit") return;
    const t = setTimeout(onFinish, 600);
    return () => clearTimeout(t);
  }, [phase, onFinish]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="loader"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020810] overflow-hidden"
          style={{ height: "100svh" }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,243,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.5) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Radial glow behind text */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: "70vw",
              height: "70vw",
              maxWidth: "320px",
              maxHeight: "320px",
              background:
                "radial-gradient(circle, rgba(0,102,255,0.3) 0%, rgba(0,243,255,0.1) 40%, transparent 70%)",
            }}
            animate={{
              scale: phase === "glow" ? [1, 1.5, 1.2] : 1,
              opacity: phase === "glow" ? [0.5, 1, 0.8] : 0.3,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Binary rain columns — fewer for mobile */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`rain-${i}`}
                className="absolute text-[9px] font-mono text-cyan-500/15 leading-[14px] select-none whitespace-pre"
                style={{
                  left: `${6 + i * 12}%`,
                  top: -80,
                }}
                initial={{ y: -150, opacity: 0 }}
                animate={{
                  y: ["-10%", "110%"],
                  opacity: [0, 0.3, 0.3, 0],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  delay: Math.random() * 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {Array.from({ length: 15 })
                  .map(() => (Math.random() > 0.5 ? "1" : "0"))
                  .join("\n")}
              </motion.div>
            ))}
          </div>

          {/* ── Main EXITO 2026 Text ── */}
          <div className="relative flex flex-col items-center px-6">
            {/* EXITO letters */}
            <div className="flex items-center justify-center gap-[2px]">
              {LETTERS.map((letter, i) => {
                const isDecoded = glitchTexts[i] === letter.char;
                const isBinary = glitchTexts[i].length > 1;

                return (
                  <motion.div
                    key={`letter-${i}`}
                    className="relative"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.08,
                      duration: 0.3,
                    }}
                  >
                    {isBinary ? (
                      /* Binary phase: show the 7-bit string */
                      <div className="flex flex-col items-center w-[48px]">
                        <motion.span
                          className="text-[8px] font-mono text-cyan-500/50 tracking-[0.1em]"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                          }}
                        >
                          {glitchTexts[i]}
                        </motion.span>
                      </div>
                    ) : (
                      /* Decoded letter */
                      <motion.span
                        className="text-[48px] font-black leading-none"
                        style={{
                          fontFamily: "var(--font-orbitron)",
                          color: isDecoded ? "transparent" : "#00f3ff",
                          backgroundImage: isDecoded
                            ? "linear-gradient(180deg, #ffffff, #a0d4e4, #00f3ff)"
                            : "none",
                          backgroundClip: isDecoded ? "text" : "unset",
                          WebkitBackgroundClip: isDecoded ? "text" : "unset",
                          textShadow: isDecoded
                            ? "none"
                            : "0 0 20px #00f3ff",
                          filter: isDecoded
                            ? "drop-shadow(0 0 8px rgba(0,243,255,0.6)) drop-shadow(0 0 20px rgba(0,102,255,0.4))"
                            : "none",
                        }}
                        initial={{ scale: 1.4, opacity: 0 }}
                        animate={{
                          scale: phase === "glow" ? [1, 1.05, 1] : 1,
                          opacity: 1,
                        }}
                        transition={{
                          scale: {
                            duration: 0.8,
                            repeat: phase === "glow" ? Infinity : 0,
                            repeatType: "reverse",
                          },
                          opacity: { duration: 0.15 },
                        }}
                      >
                        {glitchTexts[i]}
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* 2026 appears after all letters decode */}
            <AnimatePresence>
              {decodedCount >= LETTERS.length && (
                <motion.span
                  className="text-[22px] font-bold tracking-[0.4em] mt-1"
                  style={{
                    fontFamily: "var(--font-orbitron)",
                    color: "transparent",
                    backgroundImage:
                      "linear-gradient(180deg, #a0d4e4, #00f3ff)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    filter: "drop-shadow(0 0 8px rgba(0,243,255,0.5))",
                  }}
                  initial={{ opacity: 0, y: 8, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  2026
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <motion.p
            className="mt-8 text-[9px] font-mono uppercase tracking-[0.35em] text-cyan-500/40"
            initial={{ opacity: 0 }}
            animate={{
              opacity:
                phase === "decode" || phase === "glow"
                  ? [0.3, 0.7, 0.3]
                  : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {phase === "glow"
              ? "Initializing..."
              : "Decoding binary sequence"}
          </motion.p>

          {/* Bottom progress dots */}
          <div className="absolute bottom-[env(safe-area-inset-bottom,24px)] mb-6 flex gap-2.5">
            {LETTERS.map((_, i) => (
              <motion.div
                key={`dot-${i}`}
                className="w-2 h-2 rounded-full"
                animate={{
                  backgroundColor:
                    i < decodedCount ? "#00f3ff" : "#1a3a5c",
                  boxShadow:
                    i < decodedCount
                      ? "0 0 6px #00f3ff, 0 0 12px #0066ff"
                      : "none",
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
