import { useEffect, useState } from "react";

const FullDivLoading = ({ show = false }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setProgress(0);

      const timer1 = setTimeout(() => setProgress(70), 120);
      const timer2 = setTimeout(() => setProgress(92), 1800);
      const timer3 = setTimeout(() => setProgress(98), 4800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      if (isVisible) {
        setProgress(100);

        const hideTimer = setTimeout(() => {
          setIsVisible(false);
          setProgress(0);
        }, 600);

        return () => clearTimeout(hideTimer);
      }
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[999999] pointer-events-none"
      style={{
        height: "3px",
        overflow: "hidden",
        zIndex: 999999,
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          zIndex: 999999,
          background: "0% 0% / 0% rgb(179, 113, 255)",
          transform: `translateX(-${100 - Math.min(progress, 100)}%)`,
          transition:
            progress >= 100
              ? "transform 0.4s ease-out, opacity 0.5s ease-out 0.1s"
              : "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
          opacity: progress >= 100 ? 0 : 1,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

export default FullDivLoading;