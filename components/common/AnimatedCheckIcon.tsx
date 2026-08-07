"use client";

import React from "react";

const AnimatedCheckIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => {
    return (
        <div style={{ width: size, height: size }} className={className}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
                className="checkmark"
            >
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <style jsx global>{`
                .checkmark {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    display: block;
                    stroke-width: 3;
                    stroke: #4bb543;
                    stroke-miterlimit: 10;
                    box-shadow: inset 0px 0px 0px #4bb543;
                }
                .checkmark__circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                .checkmark__check {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }
                @keyframes stroke { to { stroke-dashoffset: 0; } }
            `}</style>
        </div>
    );
};

export default AnimatedCheckIcon;