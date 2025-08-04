// components/Planet3DClientOnly.tsx
"use client";

import dynamic from "next/dynamic";

// Disable server-side rendering for Planet3D
const Planet3D = dynamic(() => import("./Planet3D"), { ssr: false });

export default Planet3D;