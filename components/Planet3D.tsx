"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

// Load Globe dynamically to disable SSR
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type Props = {
  texturePath: string;
};

export default function Planet3D({ texturePath }: Props) {
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "700px" }}>
      <Globe
        ref={globeRef}
        globeImageUrl={texturePath} // 👈 YOUR IMAGE HERE
        backgroundColor="rgba(0, 0, 0, 0)" // transparent background
        width={700}
        height={700}
      />
    </div>
  );
}