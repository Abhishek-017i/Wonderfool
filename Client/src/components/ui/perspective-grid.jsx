"use client";;
import React, { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";


export function PerspectiveGrid({
    className,
    gridSize = 40,
    fadeRadius = 80
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Memoize tiles array to prevent unnecessary re-renders
    const tiles = useMemo(() => Array.from({ length: gridSize * gridSize }), [gridSize]);

    return (
        <div
            className={cn(
                "relative w-full h-full overflow-hidden",
                className
            )}
            style={{
                perspective: "2000px",
                transformStyle: "preserve-3d",
            }}>
            <div
                className="absolute w-[80rem] aspect-square grid origin-center"
                style={{
                    left: "50%",
                    top: "50%",
                    transform:
                        "translate(-50%, -50%) rotateX(30deg) rotateY(-5deg) rotateZ(20deg) scale(2)",
                    transformStyle: "preserve-3d",
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                    WebkitMaskImage: `radial-gradient(circle, black 25%, transparent ${fadeRadius}%)`,
                    maskImage: `radial-gradient(circle, black 25%, transparent ${fadeRadius}%)`,
                }}>
                {/* Tiles */}
                {mounted &&
                    tiles.map((_, i) => {
                        const row = Math.floor(i / gridSize);
                        const col = i % gridSize;
                        const mix = (row * 2 + col) % 3;
                        const hoverColor = mix === 0 ? 'var(--primary)' : mix === 1 ? 'var(--accent)' : 'var(--secondary)';

                        return (
                            <div
                                key={i}
                                className="tile min-h-[1px] min-w-[1px] bg-transparent transition-colors duration-[1500ms] hover:duration-0"
                                style={{ border: "1px solid var(--grid-color)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverColor }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                            />
                        );
                    })}
            </div>
        </div>
    );
}

export default PerspectiveGrid;
