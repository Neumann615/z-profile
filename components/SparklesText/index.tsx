"use client"

import { useMemo, useState, useRef, useEffect } from "react"

const colors = [
    "#1677ff", "#f5222d", "#fa541c", "#52c41a", "#fa8c16",
    "#fadb14", "#13c2c2", "#2f54eb", "#722ed1", "#eb2f96",
    "#a0d911", "#faad14",
]

const randomInRange = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

const FourPointStar = ({ color }: { color: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill={color}>
        <path d="M 100 20 L 120 80 L 180 100 L 120 120 L 100 180 L 80 120 L 20 100 L 80 80 Z" />
    </svg>
)

const Star = ({ color }: { color: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill={color}>
        <path d="M 100 20 L 118 76 L 176 75 L 129 109 L 147 165 L 100 130 L 53 165 L 71 109 L 24 75 L 82 76 Z" stroke={color} strokeWidth="8" strokeLinejoin="round" />
    </svg>
)

const Flower = ({ color }: { color: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill={color}>
        <defs>
            <path id="petal" d="M 100 100 C 135 55, 125 15, 100 15 C 75 15, 65 55, 100 100 Z" />
        </defs>
        <use href="#petal" transform="rotate(0 100 100)" />
        <use href="#petal" transform="rotate(60 100 100)" />
        <use href="#petal" transform="rotate(120 100 100)" />
        <use href="#petal" transform="rotate(180 100 100)" />
        <use href="#petal" transform="rotate(240 100 100)" />
        <use href="#petal" transform="rotate(300 100 100)" />
        <circle cx="100" cy="100" r="18" />
    </svg>
)

const shapes = {
    star: Star,
    "four-point-star": FourPointStar,
    flower: Flower,
}

type ShapeType = keyof typeof shapes

interface Sparkle {
    id: number
    left: number
    top: number
    delay: number
    duration: number
    size: number
    color: string
    shape: ShapeType
    rotate: number
}

export function SparklesText({ text, fontSize = 30 }: { text: string; fontSize?: number }) {
    const [cycle, setCycle] = useState(0)
    const [sparkles, setSparkles] = useState<Sparkle[]>([])
    const [fading, setFading] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout>>()

    const generate = useMemo(() => {
        return () => {
            const count = Math.floor(text.length * 1.2)
            const positions: { left: number; top: number }[] = []
            const minDist = 15

            return Array.from({ length: count }, (_, i) => {
                let left: number, top: number
                let attempts = 0
                do {
                    left = Math.random() * 100
                    top = Math.random() * 120 - 20
                    const tooClose = positions.some(p => {
                        const dx = p.left - left
                        const dy = p.top - top
                        return Math.sqrt(dx * dx + dy * dy) < minDist
                    })
                    if (!tooClose) { positions.push({ left, top }); break }
                    attempts++
                } while (attempts < 50)

                const shapeKeys = Object.keys(shapes) as ShapeType[]
                const shape = shapeKeys[Math.floor(Math.random() * shapeKeys.length)]
                const color = colors[Math.floor(Math.random() * colors.length)]
                const delay = (i / count) * 1.8
                const duration = 1.8 * (0.8 + Math.random() * 0.4)
                const size = randomInRange(Math.floor(fontSize * 0.35), Math.floor(fontSize * 1.0))

                return { id: i, left: Math.max(0, Math.min(100, left)), top: Math.max(-20, Math.min(80, top)), delay, duration, size, color, shape, rotate: Math.random() * 360 }
            })
        }
    }, [text, fontSize])

    useEffect(() => {
        if (cycle === 0) {
            setSparkles(generate())
        } else {
            setFading(true)
            setTimeout(() => {
                setSparkles(generate())
                setFading(false)
            }, 330)
        }
        timerRef.current = setTimeout(() => setCycle(p => p + 1), 9000)
        return () => clearTimeout(timerRef.current)
    }, [cycle, generate])

    const lines = text.split("\n")

    return (
        <span style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
            {lines.map((line, i) => (
                <span key={i} style={{ position: "relative", display: "inline-block", fontSize, fontWeight: 700, lineHeight: 1.3 }}>
                    {line}
                </span>
            ))}
            <span style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", opacity: fading ? 0 : 1, transition: "opacity 0.33s" }}>
                {sparkles.map(s => {
                    const Shape = shapes[s.shape as ShapeType]
                    return (
                        <span
                            key={s.id}
                            style={{
                                position: "absolute",
                                left: `${s.left}%`,
                                top: `${s.top}%`,
                                width: s.size,
                                height: s.size,
                                animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
                                transform: `rotate(${s.rotate}deg)`,
                            }}
                        >
                            <Shape color={s.color} />
                        </span>
                    )
                })}
            </span>
        </span>
    )
}
