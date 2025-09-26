import React from "react";
import "./progressive-card.css"; // move the CSS here

interface CustomCSSProperties extends React.CSSProperties {
  '--clr'?: string;
  '--num2'?: number;
  '--num'?: number;
}

export const ProgressCard = () => {

  const progress = 60;

  const progressStyle: CustomCSSProperties = {
    "--clr": progress < 50 ? "red" : "#04fc43",
    "--num": 0.75 * progress,
    "--num2": 75,
  };

  return (
    <div className="container">
      <div className="card">
        <div className="percent" style={progressStyle}>
          <svg>
            <circle cx="70" cy="70" r="70" />
            <circle cx="70" cy="70" r="70" />
          </svg>

          <div className="flex flex-col items-center  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-3xl text-gray-500">🔥</span>
            <span className="text-4xl font-bold">{progress}%</span>
          </div>

          <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-xl">
            match
          </p>
        </div>
      </div>
    </div>
  );
};
