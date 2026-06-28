'use client'
import { useTheme } from "next-themes"
import type { P5I } from 'p5i'
import { p5i } from 'p5i'
import { useEffect, useRef } from 'react'


export function GlobalBg() {
    const el = useRef<HTMLDivElement>(null)
    const { theme } = useTheme()
    const {
        mount,
        unmount,
        createCanvas,
        background,
        noFill,
        stroke,
        noise,
        noiseSeed,
        resizeCanvas,
        cos,
        sin,
        TWO_PI,
    } = p5i()

    let w = window.innerWidth
    let h = window.innerHeight
    const offsetY = window.scrollY

    const SCALE = 200
    const LENGTH = 15
    const SPACING = 40
    function getForceOnPoint(x: number, y: number, z: number) {
        return (noise(x / SCALE, y / SCALE, z) - 0.5) * 2 * TWO_PI
    }

    const existingPoints = new Set<string>()
    const points: { x: number, y: number, opacity: number }[] = []

    function addPoints() {
        for (let x = -SPACING / 2; x < w + SPACING; x += SPACING) {
            for (let y = -SPACING / 2; y < h + offsetY + SPACING; y += SPACING) {
                const id = `${x}-${y}`
                if (existingPoints.has(id))
                    continue
                existingPoints.add(id)
                points.push({ x, y, opacity: Math.random() * 0.5 + 0.5 })
            }
        }
    }

    function setup() {
        createCanvas(w, h)
        background(theme === 'dark' ? '#000' : '#ffffff')
        stroke('#ccc')
        noFill()
        noiseSeed(+new Date())
        addPoints()
    }

    function draw({ circle }: P5I) {
        background(theme === 'dark' ? '#000' : '#ffffff')
        const t = +new Date() / 10000

        for (const p of points) {
            const { x, y } = p
            const rad = getForceOnPoint(x, y, t)
            const length = (noise(x / SCALE, y / SCALE, t * 2) + 0.5) * LENGTH
            const nx = x + cos(rad) * length
            const ny = y + sin(rad) * length
            if (theme === 'dark') {
                stroke(115, 115, 115, (Math.abs(cos(rad)) * 0.8 + 0.2) * p.opacity * 255)
            } else {
                stroke(100, 100, 100, (Math.abs(cos(rad)) * 0.8 + 0.2) * p.opacity * 255)
            }
            circle(nx, ny - offsetY, 1.2)
        }
    }

    function restart() {
        if (el.current)
            mount(el.current, { setup, draw })
    }

    function windowResize() {
        w = window.innerWidth
        h = window.innerHeight
        resizeCanvas(w, h)
        addPoints()

    }


    useEffect(() => {

        restart()
        window.addEventListener('resize', windowResize)
        return () => {
            unmount()
            window.removeEventListener('resize', windowResize)
        }
    }, [theme])
    return <div ref={el} className="z-[-999] fixed bottom-0 left-0 right-0 top-0 w-full h-full select-none"></div>
}