// components/Planet3DClientOnly.tsx
"use client";

import dynamic from "next/dynamic";

const Planet3DInner = dynamic(() => import("./Planet3DInner"), { ssr: false });

export default Planet3DInner;