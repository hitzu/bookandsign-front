import { useEffect, useState } from "react";

export const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`fade ${shown ? "show" : ""}`} style={{ width: "100%" }}>
      {children}
    </div>
  );
};
