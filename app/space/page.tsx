"use client";

import { Rocket, Star, Thermometer, Zap, Globe, Wind, Orbit } from "lucide-react";
import Image from "next/image";
import React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const planets = [
  {
    id: "mercury",
    name: "Mercury",
    facts: [
      "Closest planet to the Sun, completing an orbit in just 88 Earth days",
      "Surface temperatures range from 800°F (427°C) during the day to -300°F (-184°C) at night",
    ],
    icon: Thermometer,
    size: "w-32 h-32 md:w-48 md:h-48",
  },
  {
    id: "venus",
    name: "Venus",
    facts: [
      "Hottest planet in our solar system with surface temperatures of 900°F (482°C)",
      "Rotates backwards and has the longest day - 243 Earth days",
    ],
    icon: Zap,
    size: "w-36 h-36 md:w-52 md:h-52",
  },
  {
    id: "earth",
    name: "Earth",
    facts: [
      "The only known planet with life, 71% covered by water",
      "Has plate tectonics that help regulate the planet's temperature",
    ],
    icon: Globe,
    size: "w-36 h-36 md:w-52 md:h-52",
  },
  {
    id: "mars",
    name: "Mars",
    facts: [
      "Known as the Red Planet due to iron oxide (rust) on its surface",
      "Home to the largest volcano in the solar system - Olympus Mons",
    ],
    icon: Orbit,
    size: "w-34 h-34 md:w-50 md:h-50",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    facts: [
      "Largest planet with a mass greater than all other planets combined",
      "Has over 80 moons and a Great Red Spot storm larger than Earth",
    ],
    icon: Wind,
    size: "w-48 h-48 md:w-64 md:h-64",
  },
  {
    id: "saturn",
    name: "Saturn",
    facts: [
      "Famous for its spectacular ring system made of ice and rock particles",
      "Less dense than water - it would float in a giant bathtub",
    ],
    icon: Orbit,
    size: "w-44 h-44 md:w-60 md:h-60",
  },
  {
    id: "uranus",
    name: "Uranus",
    facts: [
      "Tilted on its side at 98 degrees, rotating like a rolling ball",
      "Has the coldest atmosphere in the solar system at -371°F (-224°C)",
    ],
    icon: Orbit,
    size: "w-40 h-40 md:w-56 md:h-56",
  },
  {
    id: "neptune",
    name: "Neptune",
    facts: [
      "Windiest planet with speeds reaching 1,200 mph (2,000 km/h)",
      "Takes 165 Earth years to complete one orbit around the Sun",
    ],
    icon: Wind,
    size: "w-38 h-38 md:w-54 md:h-54",
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

export default function SpaceExplorationJourney() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [planetRotations, setPlanetRotations] = useState<{
    [key: string]: PlanetRotation;
  }>({});
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [stars] = useState(() => generateStars(300));
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
          {stars.map((star) => (
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
              src="/images/astronaut-waving.webp?height=500&width=500"
              alt="Astronaut waving in space"
              width={500}
              height={500}
              className="mx-auto shadow-2xl relative z-10"
              priority
            />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            SPACE
            <br />
            EXPLORER
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Embark on an extraordinary journey through our solar system. Discover the mysteries and
            wonders of each planet as you travel through the cosmos.
          </p>

          <Button
            size="lg"
            onClick={() => scrollToSection("mercury")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xl px-12 py-6 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 border-2 border-blue-400/30"
          >
            <Rocket className="w-6 h-6 mr-3" />
            START JOURNEY
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
          {/* Nebula Background */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)`,
              animation: "nebula 8s ease-in-out infinite",
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          />

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
                  {/* <Planet3D texturePath={`/images/${planet.id}.webp`} /> */}
                </div>
              </div>

              {/* Planet Information */}
              <div className={`space-y-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div>
                  <Badge
                    variant="secondary"
                    className="mb-4 text-sm bg-slate-800/50 text-slate-300 border-slate-600"
                  >
                    Planet {index + 1} of 8
                  </Badge>

                  <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {planet.name.toUpperCase()}
                  </h2>
                </div>

                <Card className="bg-slate-900/20 border-slate-700/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-400 flex items-center">
                      <planet.icon className="w-5 h-5 mr-2" />
                      Key Facts
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
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-t from-black to-slate-950">
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
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 text-xl px-12 py-6 rounded-full bg-transparent"
            >
              <Star className="w-6 h-6 mr-3" />
              EXPLORE BEYOND
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
