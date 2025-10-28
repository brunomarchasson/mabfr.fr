import React from "react";

export default function HeroSection() {
  return (
    <header className="cv-section h-[100vh] flex items-center justify-center relative z-10 bg-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 540 300"
        preserveAspectRatio="xMidYMid"
        className="absolute w-full h-full top-0 left-0 z-0 pointer-events-none"
      >
        <defs>
          <linearGradient id="rainbow-loop-hero" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff4c4c" />
            <stop offset="50%" stopColor="#ffcd3c" />
            <stop offset="100%" stopColor="#4cff6c" />
          </linearGradient>
        </defs>
        <g strokeWidth="1" fill="none" stroke="url(#rainbow-loop-hero)">
         <path
        className="svg-path"
        d="M 130 40 H 210 A 10 10 90 0 0 220 30 A 10 10 90 0 1 230 20 A 10 10 90 0 1 240 30 V 40 A 10 10 90 0 0 250 50 A 10 10 90 0 0 260 40 V 10 A 10 10 90 0 1 270 0 H 300 A 10 10 90 0 1 310 10 V 30 A 10 10 90 1 1 300 20 H 360 A 10 10 90 0 1 360 40 H 330 A 10 10 90 0 0 320 50 V 60 A 10 10 90 1 1 310 50 H 350 A 20 20 90 0 1 370 70 V 90 A 20 20 90 0 0 390 110 H 440"
      />
      <path
        className="svg-path"
        d="M 370 90 H 460 A 10 10 90 0 1 460 130 H 380 A 20 20 90 0 0 360 150"
      />
      <path
        className="svg-path"
        d="M 380 150 A 20 20 90 0 1 360 170 H 190 A 10 10 90 0 0 190 230 H 390 A 20 20 90 0 0 410 210"
      />
      <path className="svg-path" d="M 410 210 V 180" />
      <path
        className="svg-path"
        d="M 450 140 H 390 A 5 5 90 0 0 390 150 H 430"
      />
      <path
        className="svg-path"
        d="M 440 130 A 5 5 90 1 0 435 125"
      />
      <path className="svg-path" d="M 480 110 H 500" />
      <path
        className="svg-path"
        d="M 410 100 A 12 12 90 0 1 415 92 A 12 12 90 0 1 440 70 A 13 13 90 0 1 460 80 A 12 12 90 0 1 480 90"
      />
      <path
        className="svg-path"
        d="M 110 60 H 180 A 10 10 90 0 1 180 80 H 140"
      />
      <path
        className="svg-path"
        d="M 200 70 H 60 A 10 10 90 0 0 60 130 H 140 A 20 20 90 0 1 160 150"
      />
      <path
        className="svg-path"
        d="M 140 170 A 20 20 90 0 1 120 150 V 110 A 20 20 90 0 1 140 90 H 180"
      />
      <path
        className="svg-path"
        d="M 80 130 A 10 10 90 1 1 80 110"
      />
      <path
        className="svg-path"
        d="M 390 160 A 20 20 90 0 0 380 180 A 20 20 90 0 1 360 200 H 280"
      />
      <path
        className="svg-path"
        d="M 200 190 H 270 A 10 10 90 0 1 270 210 H 110 A 10 10 90 0 1 100 200"
      />
      <path
        className="svg-path"
        d="M 130 220 H 210 A 10 10 90 0 1 220 230 A 10 10 90 0 0 230 240 A 10 10 90 0 0 240 230 A 10 10 90 0 1 250 220 A 10 10 90 0 1 260 230 A 10 10 90 0 0 270 240"
      />
      <path
        className="svg-path"
        d="M 330 230 A 10 10 90 1 0 320 220"
      />
      <path
        className="svg-path"
        d="M 460 200 A 20 20 90 0 0 440 220"
      />
      <path
        className="svg-path"
        d="M 445 220 A 15 15 90 1 1 475 220"
      />
      <path
        id="connecting-path"
        className="svg-path"
        d="M 390 170 A 20 20 90 0 0 410 190 H 460 A 10 10 90 0 1 460 250 H 290 a 20 20 90 0 0 -20 20 V 330"
      />
          <path
            className="cv-path-segment"
            id="connecting-path"
            d="M 390 170 A 20 20 90 0 0 410 190 H 460 A 10 10 90 0 1 460 250 H 290 a 20 20 90 0 0 -20 20 V 330"
          />
        </g>
      </svg>

      <h1 className="text-5xl font-bold relative z-20">Mon CV</h1>
    </header>
  );
}

