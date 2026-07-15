"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Cpu,
  Zap,
  Code2,
  Binary,
  Users,
  GraduationCap,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import LoadingScreen from "./components/LoadingScreen";

/* ─── Data ─── */
// Left pillar: EXITO in 7-bit ASCII
const exitoData = ["E", "X", "I", "T", "O"].map((char) => ({
  char,
  binary: char.charCodeAt(0).toString(2).padStart(7, "0"),
  encoding: "ASCII" as const,
}));

// Right pillar: 2026 in 4-bit BCD
const yearData = ["2", "0", "2", "6"].map((digit) => ({
  char: digit,
  binary: parseInt(digit, 10).toString(2).padStart(4, "0"),
  encoding: "Binary" as const,
}));

type DecodedRow = {
  char: string;
  binary: string;
  encoding: "ASCII" | "Binary";
} | null;

/* ─── Animations ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Page ─── */
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [decoded, setDecoded] = useState<DecodedRow>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLoadingFinish = useCallback(() => setLoading(false), []);

  const handleTap = (row: NonNullable<DecodedRow>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDecoded(row);
    timerRef.current = setTimeout(() => setDecoded(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen onFinish={handleLoadingFinish} />}</AnimatePresence>
      <main className="relative min-h-screen">
      {/* Ambient layers */}
      <div className="ambient-bg" />
      <div className="circuit-grid" />

      {/* ════════════ HERO ════════════ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-6 overflow-hidden">
        
        {/* Slow aurora gradient */}
        <motion.div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "140vw",
            height: "60vh",
            background: "conic-gradient(from 180deg at 50% 50%, rgba(0,20,60,0) 0deg, rgba(0,102,255,0.18) 90deg, rgba(0,243,255,0.12) 180deg, rgba(0,60,120,0.08) 270deg, rgba(0,20,60,0) 360deg)",
            filter: "blur(60px)",
            borderRadius: "50%",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 35%, transparent 0%, #040a18 100%)",
          }}
        />

        {!loading && (
          <>
            {/* ── Glowing Wireframe Arch ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative mb-8"
            >
              <svg
                viewBox="0 0 200 160"
                className="w-[220px] h-[176px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Arch outline — draws itself */}
                <motion.path
                  d="M 20 155 L 20 50 Q 20 15, 55 15 L 145 15 Q 180 15, 180 50 L 180 155"
                  stroke="url(#archGrad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }}
                />
                {/* Inner arch cutout */}
                <motion.path
                  d="M 55 155 L 55 65 Q 55 40, 75 40 L 125 40 Q 145 40, 145 65 L 145 155"
                  stroke="rgba(0,243,255,0.15)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
                />
                {/* Circuit traces */}
                <motion.line x1="30" y1="25" x2="50" y2="25" stroke="rgba(0,243,255,0.2)" strokeWidth="0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} />
                <motion.line x1="150" y1="25" x2="170" y2="25" stroke="rgba(0,243,255,0.2)" strokeWidth="0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }} />
                <motion.line x1="30" y1="30" x2="42" y2="30" stroke="rgba(0,243,255,0.15)" strokeWidth="0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} />
                <motion.line x1="158" y1="30" x2="170" y2="30" stroke="rgba(0,243,255,0.15)" strokeWidth="0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} />

                {/* Left pillar binary dots (EXITO ASCII samples) */}
                {[
                  [1,0,0,0,1,0,1],
                  [1,0,1,1,0,0,0],
                  [1,0,0,1,0,0,1],
                  [1,0,1,0,1,0,0],
                  [1,0,0,1,1,1,1],
                ].map((row, ri) => (
                  row.map((bit, bi) => (
                    <motion.circle
                      key={`lb-${ri}-${bi}`}
                      cx={26 + bi * 4}
                      cy={60 + ri * 16}
                      r="1.2"
                      fill={bit === 1 ? "#00f3ff" : "rgba(255,255,255,0.25)"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: bit === 1 ? [0.4, 1, 0.4] : 0.3 }}
                      transition={{
                        duration: 2,
                        delay: 2.5 + ri * 0.15,
                        repeat: bit === 1 ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    />
                  ))
                ))}

                {/* Right pillar binary dots (2026 BCD) */}
                {[
                  [0,0,1,0],
                  [0,0,0,0],
                  [0,0,1,0],
                  [0,1,1,0],
                ].map((row, ri) => (
                  row.map((bit, bi) => (
                    <motion.circle
                      key={`rb-${ri}-${bi}`}
                      cx={162 + bi * 5}
                      cy={65 + ri * 18}
                      r="1.5"
                      fill={bit === 1 ? "#00f3ff" : "rgba(255,255,255,0.25)"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: bit === 1 ? [0.4, 1, 0.4] : 0.3 }}
                      transition={{
                        duration: 2,
                        delay: 2.8 + ri * 0.15,
                        repeat: bit === 1 ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    />
                  ))
                ))}

                {/* Top bar text area glow */}
                <motion.rect
                  x="55" y="8" width="90" height="14" rx="3"
                  fill="rgba(0,102,255,0.08)"
                  stroke="rgba(0,243,255,0.12)"
                  strokeWidth="0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, delay: 2, repeat: Infinity }}
                />
                <text x="100" y="18" textAnchor="middle" fill="rgba(0,243,255,0.5)" fontSize="5" fontFamily="monospace" letterSpacing="1.5">
                  FACULTY OF IT
                </text>

                {/* Gradient defs */}
                <defs>
                  <linearGradient id="archGrad" x1="20" y1="155" x2="180" y2="15">
                    <stop offset="0%" stopColor="rgba(0,102,255,0.6)" />
                    <stop offset="50%" stopColor="rgba(0,243,255,0.8)" />
                    <stop offset="100%" stopColor="rgba(0,102,255,0.6)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Glow behind the arch */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,102,255,0.15) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
            </motion.div>

            {/* Content */}
            <div className="relative w-full max-w-sm flex flex-col items-center">

              {/* Eyebrow tag */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="overflow-hidden mb-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-cyan-500/50" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-cyan-400/60 whitespace-nowrap">
                    Faculty of IT
                  </span>
                  <div className="w-8 h-[1px] bg-cyan-500/50" />
                </div>
              </motion.div>

              {/* EXITO — the centerpiece */}
              <motion.h1
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "0.18em" }}
                transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-[4.2rem] leading-none font-black mb-0"
                style={{
                  fontFamily: "var(--font-orbitron)",
                  background: "linear-gradient(180deg, #ffffff 0%, #b8e0f0 40%, #00ccee 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter: "drop-shadow(0 0 30px rgba(0,180,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
                }}
              >
                EXITO
              </motion.h1>

              {/* 2026 */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-[1.4rem] font-bold tracking-[0.5em] text-cyan-400/50 mb-10 -mt-1"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                2026
              </motion.p>

              {/* Glowing divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="w-20 h-[1px] mb-8"
                style={{
                  background: "linear-gradient(90deg, transparent, #00f3ff, transparent)",
                  boxShadow: "0 0 8px rgba(0,243,255,0.5)",
                }}
              />

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.3 }}
                className="text-[15px] leading-[1.7] text-gray-400 text-center max-w-[300px] mb-10"
              >
                You just walked through an arch that speaks the{" "}
                <span className="text-cyan-400">language of computers</span>.
                <br />
                Scroll to uncover the secret hidden in its lights.
              </motion.p>

              {/* CTA badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-sm mb-6"
              >
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400/80">
                  141 Batch · HDCSE · ICBT
                </span>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="flex flex-col items-center gap-2 mt-4"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              <motion.div
                className="w-[1px] h-6 bg-gradient-to-b from-cyan-500/50 to-transparent"
                animate={{ scaleY: [1, 0.5, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-gray-600">
                Scroll
              </span>
            </motion.div>
          </>
        )}
      </section>

      {/* ════════════ WHAT IS THE ARCH? ════════════ */}
      <section className="relative z-10 section-mobile">
        <div className="glow-divider mb-14" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="max-w-sm mx-auto"
        >
          <motion.h2
            variants={fadeUp}
            className="text-2xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Decoding the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Arch
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[15px] leading-relaxed text-gray-400 mb-8"
          >
            The entrance arch isn&apos;t just decoration — the glowing bulbs on
            its pillars carry a hidden digital message encoded using{" "}
            <strong className="text-cyan-400">Binary</strong> and{" "}
            <strong className="text-cyan-400">ASCII</strong>.
          </motion.p>

          {/* Legend */}
          <motion.div variants={fadeUp} className="glass-card p-5 mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <Lightbulb size={18} className="text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                How to read the lights
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bulb-on shrink-0" />
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">Blue light</span> ={" "}
                  <span className="text-cyan-400 font-mono font-bold text-lg">
                    1
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bulb-off shrink-0" />
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">White light</span>{" "}
                  ={" "}
                  <span className="text-gray-400 font-mono font-bold text-lg">
                    0
                  </span>
                </p>
              </div>
            </div>

            <div className="glow-divider my-5" />

            <p className="text-xs text-gray-500 leading-relaxed">
              Each row of lights represents one character. Read them as a
              sequence of 1s and 0s, then convert to text using the
              corresponding encoding standard.
            </p>
          </motion.div>

          {/* Left Pillar Explanation */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border-l-[3px] border-cyan-500 bg-gradient-to-r from-blue-950/40 to-transparent p-4 mb-4"
          >
            <h4 className="text-base font-bold text-cyan-300 mb-1 flex items-center gap-2">
              <Binary size={16} /> Left Pillar → EXITO
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              The 5 rows of 7 lights each use{" "}
              <strong className="text-white">ASCII encoding</strong> — the
              standard way computers represent letters. Each row decodes to one
              letter: <span className="text-cyan-400 font-mono">E X I T O</span>
              .
            </p>
          </motion.div>

          {/* Right Pillar Explanation */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border-l-[3px] border-blue-500 bg-gradient-to-r from-blue-950/40 to-transparent p-4 mb-10"
          >
            <h4 className="text-base font-bold text-cyan-300 mb-1 flex items-center gap-2">
              <Code2 size={16} /> Right Pillar → 2026
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              The 4 rows of 4 lights each use{" "}
              <strong className="text-white">Binary (BCD)</strong> — each digit
              of the year is independently converted to its binary form:{" "}
              <span className="text-cyan-400 font-mono">2 0 2 6</span>.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════ INTERACTIVE DECODER ════════════ */}
      <section className="relative z-10 section-mobile pt-0">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="max-w-sm mx-auto"
        >
          <motion.h3
            variants={fadeUp}
            className="text-lg font-bold text-white text-center mb-1"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Try It Yourself
          </motion.h3>
          <motion.p
            variants={fadeUp}
            className="text-xs text-gray-500 text-center font-mono mb-6"
          >
            Tap any row to decode it
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-3 relative">
            {/* Left Mini-Pillar: EXITO */}
            <div className="flex-1 glass-card p-3">
              <div className="text-[9px] text-center uppercase tracking-[0.2em] text-cyan-400/70 font-mono mb-3 pb-2 border-b border-blue-900/40">
                Left Pillar · ASCII
              </div>
              <div className="flex flex-col gap-2.5">
                {exitoData.map((row, i) => (
                  <div
                    key={`e-${i}`}
                    className="binary-row-interactive"
                    onClick={() => handleTap(row)}
                  >
                    {row.binary.split("").map((bit, bi) => (
                      <div
                        key={bi}
                        className={`bulb w-[10px] h-[10px] ${
                          bit === "1" ? "bulb-on" : "bulb-off"
                        }`}
                      />
                    ))}
                    <ArrowRight
                      size={10}
                      className="text-gray-600 ml-auto shrink-0"
                    />
                    <span className="text-[11px] font-mono text-gray-500 w-3 text-right">
                      {row.char}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Mini-Pillar: 2026 */}
            <div className="flex-1 glass-card p-3">
              <div className="text-[9px] text-center uppercase tracking-[0.2em] text-blue-400/70 font-mono mb-3 pb-2 border-b border-blue-900/40">
                Right Pillar · BCD
              </div>
              <div className="flex flex-col gap-2.5">
                {yearData.map((row, i) => (
                  <div
                    key={`y-${i}`}
                    className="binary-row-interactive justify-center"
                    onClick={() => handleTap(row)}
                  >
                    {row.binary.split("").map((bit, bi) => (
                      <div
                        key={bi}
                        className={`bulb w-[12px] h-[12px] ${
                          bit === "1" ? "bulb-on" : "bulb-off"
                        }`}
                      />
                    ))}
                    <ArrowRight
                      size={10}
                      className="text-gray-600 ml-auto shrink-0"
                    />
                    <span className="text-[11px] font-mono text-gray-500 w-3 text-right">
                      {row.char}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decoder Popup */}
            <AnimatePresence>
              {decoded && (
                <motion.div
                  key="decoder"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                  className="decoder-popup fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-8 py-6 text-center min-w-[220px]"
                  onClick={() => setDecoded(null)}
                >
                  <div className="text-[9px] text-cyan-400/80 font-mono uppercase tracking-[0.3em] mb-3">
                    {decoded.encoding === "ASCII"
                      ? "ASCII Decoded"
                      : "Binary Decoded"}
                  </div>
                  <div className="text-lg text-white font-mono tracking-[0.35em] mb-2">
                    {decoded.binary}
                  </div>
                  <div className="w-10 h-[1px] bg-cyan-500/30 mx-auto mb-2" />
                  <div
                    className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-500"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {decoded.char}
                  </div>
                  <p className="text-[10px] text-gray-600 mt-3 font-mono">
                    tap to dismiss
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════ THE 141 BATCH ════════════ */}
      <section className="relative z-10 section-mobile">
        <div className="glow-divider mb-14" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="max-w-sm mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-800/50 flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,102,255,0.25)]">
              <Code2 size={22} className="text-cyan-400" />
            </div>
            <h2
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                141 Batch
              </span>
            </h2>
            <p className="text-sm text-blue-400 font-semibold">
              HDCSE — Higher Diploma (HD) in Computing & Software Engineering
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-[15px] text-gray-400 leading-relaxed mb-4"
          >
            This incredible arch — from the physical structure with its
            circuit-traced pillars to this digital experience you&apos;re viewing
            right now — was conceptualized, designed, and built entirely by the{" "}
            <strong className="text-white">141 Batch of HDCSE</strong>.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-[14px] text-gray-500 leading-relaxed mb-8"
          >
            Blending hardware architecture with software creativity, the team
            engineered the binary light arrays, designed the circuit-board
            aesthetics, and developed this interactive decoder — showcasing the
            very skills they&apos;ve honed through their diploma program.
          </motion.p>

          {/* Stats Grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
            <div className="stat-card p-4 text-center">
              <Zap size={22} className="text-cyan-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white font-mono">100%</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                Innovation
              </div>
            </div>
            <div className="stat-card p-4 text-center">
              <Cpu size={22} className="text-cyan-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white font-mono">80+</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                Components
              </div>
            </div>
            <div className="stat-card p-4 text-center">
              <Users size={22} className="text-cyan-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white font-mono">Team</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                Collaboration
              </div>
            </div>
            <div className="stat-card p-4 text-center">
              <Binary size={22} className="text-cyan-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white font-mono">2</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                Encoding Systems
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════ ICBT CAMPUS ════════════ */}
      <section className="relative z-10 section-mobile">
        <div className="glow-divider mb-14" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="max-w-sm mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="mb-8 relative w-full flex items-center justify-center">
            <div className="bg-white/95 px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(0,243,255,0.15)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://icbt.lk/wp-content/uploads/2024/09/ICBT-No1-for-light-bg-scaled.png" 
                alt="ICBT Campus Logo" 
                className="h-12 object-contain"
              />
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            ICBT{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Campus
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[15px] text-gray-400 leading-relaxed mb-8"
          >
            Sri Lanka’s leading private higher education provider.
          </motion.p>

          <motion.div variants={fadeUp} className="glass-card p-6 text-left mb-8">
            <p className="text-[15px] text-gray-300 leading-relaxed mb-5">
              ICBT Campus is the top choice for internationally recognised UK degrees, diplomas, and masters. The Faculty of IT is renowned for producing industry-ready graduates equipped with cutting-edge skills in software engineering, networking, and cyber security.
            </p>
            <p className="text-[14px] text-gray-500 leading-relaxed">
              Exhibitions like{" "}
              <strong className="text-white">EXITO 2026</strong> are a testament
              to the practical, hands-on learning environment at ICBT — where
              theoretical knowledge meets real-world application, and students
              build, showcase, and inspire.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <a 
              href="https://icbt.lk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)] active:scale-95"
            >
              Visit icbt.lk
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════ NETCHX HOSTING ════════════ */}
      <section className="relative z-10 px-5 pb-12 pt-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="max-w-sm mx-auto text-center flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4 w-full">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-blue-900/50" />
            <p className="text-[9px] text-cyan-500/60 font-mono uppercase tracking-[0.3em]">
              Powered By
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-blue-900/50" />
          </motion.div>
          
          <motion.div variants={fadeUp}>
            <a 
              href="https://www.netchx.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block hover:scale-105 transition-transform duration-300 active:scale-95"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://file-cdn.netchx.net/nx-banner.png" 
                alt="NetchX Hosting" 
                className="w-[85vw] max-w-[380px] h-auto mx-auto object-contain drop-shadow-[0_0_25px_rgba(0,102,255,0.6)]"
              />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="relative z-10 py-10 flex flex-col items-center border-t border-blue-900/30 bg-black/40">
        <div className="circuit-grid opacity-[0.03]" />
        
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-600/60 mb-2">
          System Initialized
        </p>
        
        <p className="text-[11px] text-gray-500 mb-6">
          © 2026 EXITO · 141 Batch of HDCSE · ICBT Campus
        </p>

        {/* Developer Credit */}
        <p className="text-[12px] text-gray-400">
          Designed & Developed with <span className="text-red-500 animate-pulse inline-block">❤️</span> by{" "}
          <a
            href="https://rammonferdinandsz.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Rammon Ferdinandsz
          </a>
        </p>
      </footer>
      </main>
    </>
  );
}
