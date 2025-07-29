import React from "react";

function VoltBoxLogo() {
  return (
    <svg
      width="220"
      height="60"
      viewBox="0 0 220 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="30"
        fill="#00bfff"
        fontFamily="Segoe UI"
        fontSize="32"
        fontWeight="600"
      >
        Volt
      </text>
      <text
        x="60"
        y="30"
        fill="#cccccc"
        fontFamily="Segoe UI"
        fontSize="32"
        fontWeight="500"
      >
        Box
      </text>
    </svg>
  );
}

export const VoltboxSymbol = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00bfff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l9 18L21 3" />
    </svg>
  );
};

export default VoltBoxLogo;
