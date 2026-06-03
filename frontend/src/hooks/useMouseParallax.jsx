import { useEffect, useRef } from "react";

export default function useMouseParallax() {
   const ref = useRef(null);

   useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleMove = e => {
         const { left, top, width, height } = el.getBoundingClientRect();
         const x = ((e.clientX - left) / width - 0.5) * 2;
         const y = ((e.clientY - top) / height - 0.5) * 2;
         el.style.setProperty("--mx", x.toFixed(3));
         el.style.setProperty("--my", y.toFixed(3));
      };

      const handleLeave = () => {
         el.style.setProperty("--mx", "0");
         el.style.setProperty("--my", "0");
      };

      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", handleLeave);
      return () => {
         el.removeEventListener("mousemove", handleMove);
         el.removeEventListener("mouseleave", handleLeave);
      };
   }, []);

   return ref;
}
