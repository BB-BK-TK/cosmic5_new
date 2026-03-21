"use client";

/**
 * Fixed purple / teal orbs (spec § ambient background).
 * Sits behind content; pointer-events none.
 */
export function CosmicAmbient() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute -top-24 -left-24 h-[280px] w-[280px] rounded-full opacity-40 blur-[100px]"
        style={{ background: "var(--orb-purple)" }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[240px] w-[240px] rounded-full opacity-35 blur-[90px]"
        style={{ background: "var(--orb-teal)" }}
      />
      <div
        className="absolute bottom-20 left-1/4 h-[180px] w-[180px] rounded-full opacity-25 blur-[80px]"
        style={{ background: "var(--orb-purple)" }}
      />
    </div>
  );
}
