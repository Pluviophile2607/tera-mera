import { cn } from "../lib/utils";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useRef, useEffect, useState } from "react";

const NOTCH_WIDTH = 13; // px per notch (3px notch + 10px gap)
const SPRING_CONFIG = { stiffness: 400, damping: 40, mass: 0.5 };

const DEFAULT_ACCENT = "#FF4500";

const ExposureSlider = ({
  min = 1,
  max = 30,
  step = 1,
  defaultValue = 7,
  onChange,
  showIndicator = true,
  accentColor,
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // We use a internal state for the raw value to keep it in sync with external defaultValue changes
  const [internalValue, setInternalValue] = useState(defaultValue);

  const count = Math.floor((max - min) / step) + 1;
  const centerIndex = Math.floor((defaultValue - min) / step);

  // Raw drag offset and spring-smoothed version
  const rawX = useMotionValue(0);
  const x = shouldReduceMotion ? rawX : useSpring(rawX, SPRING_CONFIG);

  // Update offset when defaultValue changes
  useEffect(() => {
    rawX.set(0);
  }, [defaultValue, rawX]);

  // Current value derived from offset
  const currentValue = useTransform(x, (latest) => {
    const indexOffset = Math.round(-latest / NOTCH_WIDTH);
    const val = Math.max(
      min,
      Math.min(max, (centerIndex + indexOffset) * step + min)
    );
    return val;
  });

  // Simplified Progress calculation for Duration (0 to 1)
  const progress = useTransform(currentValue, [min, max], [0, 1]);

  const snapToNearest = useCallback(() => {
    const current = rawX.get();
    const snapped = Math.round(current / NOTCH_WIDTH) * NOTCH_WIDTH;
    rawX.set(snapped);
  }, [rawX]);

  const handlePointerDown = useCallback(
    (e) => {
      isDragging.current = true;
      const startX = e.clientX;
      const startOffset = rawX.get();

      const handleMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX;
        const newOffset = startOffset + delta;
        
        // Clamp to bounds
        const maxOffset = (count - 1 - centerIndex) * NOTCH_WIDTH;
        const minOffset = -centerIndex * NOTCH_WIDTH;
        rawX.set(Math.max(-maxOffset, Math.min(-minOffset, newOffset)));

        // Fire onChange
        const indexOffset = Math.round(-rawX.get() / NOTCH_WIDTH);
        const val = Math.round(Math.max(
          min,
          Math.min(max, (centerIndex + indexOffset) * step + min)
        ));
        setInternalValue(val);
        onChange?.(val);
      };

      const handleUp = () => {
        isDragging.current = false;
        snapToNearest();
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [rawX, centerIndex, count, min, max, step, onChange, snapToNearest]
  );

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-4 text-foreground",
        className
      )}
      style={{ "--es-accent": accentColor ?? DEFAULT_ACCENT }}
    >
      {/* Progress circle optimized for 0-100% progress */}
      {showIndicator && (
        <ProgressCircle
          value={internalValue}
          progress={progress}
        />
      )}

      {/* Ticker slider */}
      <div
        className="relative flex h-14 w-full items-center justify-center"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 40%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 40%, black 60%, transparent 100%)",
        }}
      >
        <div
          className="relative h-full w-full cursor-grab select-none active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          ref={containerRef}
          style={{
            touchAction: "none", // Prevent scrolling while dragging
            padding: `0 calc(50% - ${NOTCH_WIDTH / 2}px)`,
          }}
        >
          <motion.ul
            className="relative m-0 flex h-full list-none items-center p-0"
            style={{ x, marginLeft: -centerIndex * NOTCH_WIDTH }}
          >
            {items.map((i) => (
              <Notch centerIndex={centerIndex} index={i} key={i} x={x} />
            ))}
          </motion.ul>
        </div>
        
        {/* Center Indicator Line */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-10 bg-accent-orange pointer-events-none z-10" />
      </div>
    </div>
  );
};

const Notch = ({ index, centerIndex, x }) => {
  const distance = useTransform(x, (latest) => {
    const currentCenter = centerIndex + -latest / NOTCH_WIDTH;
    return Math.abs(index - currentCenter);
  });

  const opacity = useTransform(distance, [0, 1, 5], [1, 0.4, 0.1]);
  const height = useTransform(distance, [0, 1, 2], [40, 25, 20]);
  
  const isCenter = useTransform(distance, (d) => d < 0.5);
  const bg = useTransform(isCenter, (center) =>
    center ? "var(--es-accent)" : "currentColor"
  );

  return (
    <li
      className="relative flex-shrink-0 flex-grow-0"
      style={{ height: "fit-content" }}
    >
      <div style={{ padding: "0 5px" }}>
        <motion.div
          className="rounded-full"
          style={{
            width: 3,
            height,
            backgroundColor: bg,
            opacity,
          }}
        />
      </div>
    </li>
  );
};

const ProgressCircle = ({ progress, value }) => {
  const dashArray = useTransform(progress, (p) => `${p} ${1 - p}`);
  
  return (
    <div className="relative flex h-[90px] w-[90px] items-center justify-center">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          fill="none"
          r="45"
          stroke="currentColor"
          strokeOpacity={0.1}
          strokeWidth="6"
        />
        {/* Progress */}
        <motion.circle
          cx="50"
          cy="50"
          fill="none"
          pathLength={1}
          r="45"
          stroke="var(--es-accent)"
          strokeDasharray={dashArray}
          strokeLinecap="round"
          strokeWidth="6"
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="font-black text-3xl text-on-surface leading-none">{value}</span>
        <span className="text-[10px] font-black uppercase opacity-40">Days</span>
      </div>
    </div>
  );
};

export default ExposureSlider;
