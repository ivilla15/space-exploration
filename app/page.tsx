"use client";

import { Rocket, Star, Globe, Orbit, Check, HardHatIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Planet3D from "@/components/Planet3D";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const planets = [
  {
    id: "mercury",
    name: "Check-In",
    facts: ["Little stressed :/"],
    subtitle: "Let's Dive In",
    icon: Check,
    size: "w-32 h-32 md:w-48 md:h-48",
  },
  {
    id: "venus",
    name: "Updates",
    subtitle: "What Have I Been Working On?",
    facts: [
      "U-Krew page",
      "Linter bug fixes",
      "Count-Up Component",
      "Sorority Life Page",
      "Small tweaks such as rec call to action, image optimization, optimizing the web page for users.",
      "PDF accessibility remediation.",
    ],
    icon: HardHatIcon,
    size: "w-36 h-36 md:w-52 md:h-52",
  },
  {
    id: "earth",
    name: "What I've Accomplished",
    subtitle: "Check Them Out!",
    facts: [
      "U-Krew Page 100% Done!",
      "Linter 100% fixed!",
      "Count-Up Component 100% Done!",
      "Sorority Life Page 100% Done!",
    ],
    icon: Globe,
    size: "w-36 h-36 md:w-52 md:h-52",
  },
  {
    id: "mars",
    name: "What's On Deck?",
    facts: ["Backend authentication refactoring.", "Final finish of pdfs. "],
    icon: Orbit,
    size: "w-34 h-34 md:w-50 md:h-50",
  },
];

// Realistic star data with different types and brightness
const generateStars = (count: number) => {
  const starTypes = [
    { color: "#ffffff", brightness: 1, size: 1 }, // White dwarf
    { color: "#fffacd", brightness: 0.8, size: 1.2 }, // Yellow
    { color: "#add8e6", brightness: 0.9, size: 0.8 }, // Blue-white
    { color: "#ffd700", brightness: 0.7, size: 1.5 }, // Golden
    { color: "#f0f8ff", brightness: 0.6, size: 0.6 }, // Faint white
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = starTypes[Math.floor(Math.random() * starTypes.length)];
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 3, // Depth for parallax
      ...type,
      twinkleDelay: Math.random() * 4,
      twinkleDuration: 2 + Math.random() * 3,
    };
  });
};

interface PlanetRotation {
  x: number;
  y: number;
}
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}

type Star = {
  id: number;
  x: number;
  y: number;
  z: number;
  color: string;
  brightness: number;
  size: number;
  twinkleDelay: number;
  twinkleDuration: number;
};

export default function SpaceExplorationJourney() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [planetRotations, setPlanetRotations] = useState<{
    [key: string]: PlanetRotation;
  }>({});
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const hydrated = useHydrated();
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (hydrated) {
      setStars(generateStars(300));
    }
  }, [hydrated]);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        setVisibleSections((prev) => {
          const newSet = new Set(prev);
          if (entry.isIntersecting) {
            newSet.add(entry.target.id);
          } else {
            newSet.delete(entry.target.id);
          }
          return newSet;
        });
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePlanetMouseDown = useCallback((planetId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(planetId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePlanetTouchStart = useCallback((planetId: string, e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(planetId);
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      setPlanetRotations((prev) => ({
        ...prev,
        [isDragging]: {
          x: (prev[isDragging]?.x || 0) + deltaY * 0.5,
          y: (prev[isDragging]?.y || 0) + deltaX * 0.5,
        },
      }));

      dragStartRef.current = { x: e.clientX, y: e.clientY };
    },
    [isDragging]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !dragStartRef.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      setPlanetRotations((prev) => ({
        ...prev,
        [isDragging]: {
          x: (prev[isDragging]?.x || 0) + deltaY * 0.5,
          y: (prev[isDragging]?.y || 0) + deltaX * 0.5,
        },
      }));

      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    dragStartRef.current = null;
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Realistic Deep Space Starscape */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-indigo-950/30">
          {hydrated &&
            stars.map((star) => (
              <div
                key={star.id}
                className="absolute"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: `translateY(${scrollY * (0.1 + star.z * 0.05)}px) translateZ(0)`,
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    backgroundColor: star.color,
                    opacity: star.brightness,
                    boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
                    animation: `twinkle ${star.twinkleDuration}s ease-in-out infinite`,
                    animationDelay: `${star.twinkleDelay}s`,
                  }}
                />
              </div>
            ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes nebula {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section
        id="hero"
        ref={setRef("hero")}
        className="relative min-h-screen flex items-center justify-center px-4"
      >
        <div
          className="container mx-auto text-center z-10"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - scrollY / 800),
          }}
        >
          <div className="mb-12 relative">
            <div />
            <Image
              src="/images/astronaut-waving.webp"
              alt="Astronaut waving in space"
              width={350}
              height={350}
              className="mx-auto shadow-2xl relative z-10"
              priority
            />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Monthly
            <br />
            Report
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            In this report I will talk about what I&apos;ve accomplished this month, what I am
            currently working on, what&apos;s next and my monthly check-in.
          </p>

          <Button
            size="lg"
            onClick={() => scrollToSection("mercury")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xl px-12 py-6 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 border-2 border-blue-400/30"
          >
            <Rocket className="w-6 h-6 mr-3" />
            Learn More
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Planet Sections */}
      {planets.map((planet, index) => (
        <section
          key={planet.id}
          id={planet.id}
          ref={setRef(planet.id)}
          className="min-h-screen flex items-center justify-center px-4 py-20 relative"
        >
          <div
            className={`container mx-auto z-10 transition-all duration-1000 ${
              visibleSections.has(planet.id)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            }`}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Interactive Planet */}
              <div className={`flex justify-center ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative" style={{ perspective: "1000px" }}>
                  <Planet3D texturePath={`/images/${planet.id}.webp`} />
                </div>
              </div>

              {/* Planet Information */}
              <div className={`space-y-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div>
                  <Badge
                    variant="secondary"
                    className="mb-4 text-sm bg-slate-800/50 text-slate-300 border-slate-600"
                  >
                    Section {index + 1} of 4
                  </Badge>

                  <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {planet.name.toUpperCase()}
                  </h2>
                </div>

                <Card className="bg-slate-900/20 border-slate-700/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-400 flex items-center">
                      <planet.icon className="w-5 h-5 mr-2" />
                      {planet.subtitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {planet.facts.map((fact, factIndex) => (
                      <CardDescription
                        key={factIndex}
                        className="text-slate-300 text-base leading-relaxed flex items-start"
                      >
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                        {fact}
                      </CardDescription>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-lg px-8 py-3 rounded-full"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Discover More
                  </Button>

                  {index < planets.length - 1 && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => scrollToSection(planets[index + 1].id)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-3 rounded-full"
                    >
                      Next Planet
                      <Rocket className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Final Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            MISSION COMPLETE
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            You&apos;ve successfully journeyed through our entire solar system. Ready to explore the
            universe beyond?
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection("hero")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xl px-12 py-6 rounded-full"
            >
              <Rocket className="w-6 h-6 mr-3" />
              RESTART JOURNEY
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 text-xl px-12 py-6 rounded-full bg-transparent"
            >
              <Link href="/space">
                <Star className="w-6 h-6 mr-3" />
                Space Exploration
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
