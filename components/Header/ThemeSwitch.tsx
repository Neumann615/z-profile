'use client';
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { flushSync } from 'react-dom'
import { useRef } from 'react'

export function ThemeSwitch() {
    const { theme, setTheme } = useTheme()
    const darkBtnRef = useRef<HTMLDivElement>(null)

    function toggleDarkMode() {
        if (
            !darkBtnRef.current ||
            !document.startViewTransition
        ) {
            setTheme(theme === 'light' ? 'dark' : 'light')
            return
        }
        const { top, left, width, height } = darkBtnRef.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2
        const right = window.innerWidth - left
        const bottom = window.innerHeight - top
        const maxRadius = Math.hypot(
            Math.max(left, right),
            Math.max(top, bottom),
        )
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setTheme(theme === 'light' ? 'dark' : 'light')
            })
        })
        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
            ]
            const clipPath2 = [
                `circle(${maxRadius}px at ${x}px ${y}px)`,
                `circle(0px at ${x}px ${y}px)`,
            ]
            document.documentElement.animate(
                {
                    clipPath: theme === 'light' ? clipPath : clipPath2
                },
                {
                    duration: 600,
                    easing: 'ease-in',
                    pseudoElement: theme === 'light' ? '::view-transition-new(root)' : '::view-transition-old(root)',
                }
            )
        })
    }

    return <div ref={darkBtnRef} onClick={toggleDarkMode}>
        {theme === 'dark' ? (
            <Moon className="w-5.5 text-zinc-500 cursor-pointer" />
        ) : (
            <Sun className="w-5.5 text-zinc-500 cursor-pointer" />
        )}
    </div>
}
