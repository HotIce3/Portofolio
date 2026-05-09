import { motion } from "framer-motion";

export default function LoadingSpinner({ fullScreen = false, size = "md" }) {
  const sizePx = { sm: 32, md: 56, lg: 80 }[size] ?? 56;

  const spinner = (
    <div
      style={{
        position: "relative",
        width: sizePx,
        height: sizePx,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer rotating ring */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `3px solid transparent`,
          borderTopColor: "#6366f1",
          borderRightColor: "#a78bfa",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {/* Middle counter-rotating ring */}
      <motion.div
        style={{
          position: "absolute",
          inset: 6,
          borderRadius: "50%",
          border: `2px solid transparent`,
          borderTopColor: "#a78bfa",
          borderLeftColor: "#6366f1",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner pulsing orb */}
      <motion.div
        style={{
          width: sizePx * 0.28,
          height: sizePx * 0.28,
          borderRadius: "50%",
          background: "radial-gradient(circle, #a78bfa, #6366f1)",
          boxShadow: "0 0 12px rgba(99,102,241,0.8), 0 0 24px rgba(167,139,250,0.4)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #1a1040 100%)",
          zIndex: 9999,
          gap: "1.5rem",
        }}
      >
        {spinner}
        <motion.p
          style={{
            color: "rgba(167,139,250,0.7)",
            fontSize: "0.85rem",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading
        </motion.p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {spinner}
    </div>
  );
}
