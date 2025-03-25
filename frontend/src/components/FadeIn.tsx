import { useLayoutEffect, useRef, useState } from "react";

export default function FadeInSection(props) {
  const [isVisible, setVisible] = useState(true);
  const domRef = useRef<Element>(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    });
    observer.observe(domRef?.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => observer?.unobserve(domRef?.current);
  }, []);

  return (
    <div
      className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
      ref={domRef}
    >
      {props.children}
    </div>
  );
}
