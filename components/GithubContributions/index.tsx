"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"

/* ========== 类型 ========== */

interface ContributionDay {
    date: string
    contributionCount: number
    color: string
    contributionLevel: string
}

type WeekGrid = (ContributionDay | null)[][]

const DAYS = ["一", "二", "三", "四", "五", "六", "日"]
const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

/* ========== 工具 ========== */

function getMonday(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
}

function fmtDate(d: Date): string {
    return d.toISOString().split("T")[0]
}

function formatDateCN(dateStr: string): string {
    const [y, m, d] = dateStr.split("-")
    return `${y}年${parseInt(m)}月${parseInt(d)}日`
}

function buildMonthGrid(year: number, month: number, allDays: ContributionDay[]): WeekGrid | null {
    const key = `${year}-${String(month).padStart(2, "0")}`
    const dayMap = new Map<string, ContributionDay>()
    for (const d of allDays) {
        if (d.date.startsWith(key)) dayMap.set(d.date, d)
    }
    if (dayMap.size === 0) return null

    const firstDay = new Date(`${key}-01`)
    const lastDay = new Date(year, month, 0)
    const startMonday = getMonday(firstDay)
    const endSunday = new Date(lastDay)
    endSunday.setDate(endSunday.getDate() + (7 - (endSunday.getDay() || 7)))
    endSunday.setHours(0, 0, 0, 0)

    const weeks: WeekGrid = []
    const cursor = new Date(startMonday)
    while (cursor <= endSunday) {
        const week: (ContributionDay | null)[] = []
        for (let i = 0; i < 7; i++) {
            const k = fmtDate(cursor)
            week.push(dayMap.get(k) || null)
            cursor.setDate(cursor.getDate() + 1)
        }
        weeks.push(week)
    }
    return weeks
}

/* ========== 组件 ========== */

export function GithubContributions() {
    const [allDays, setAllDays] = useState<ContributionDay[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [quarter, setQuarter] = useState(0)
    const fetchedRef = useRef(false)
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    const isDark = mounted && resolvedTheme === "dark"

    /* ---- 拉取数据 ---- */

    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true
        fetch("https://github-contributions-api.deno.dev/Neumann615.json")
            .then((res) => res.json())
            .then((data) => {
                const days: ContributionDay[] = []
                for (const week of data.contributions) {
                    for (const day of week) {
                        days.push(day)
                    }
                }
                setAllDays(days)
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [])

    /* ---- 按日历年严格划分季度 ---- */

    const { quarters, quarterLabel } = useMemo(() => {
        const monthSet = new Set<string>()
        for (const d of allDays) {
            monthSet.add(d.date.slice(0, 7))
        }
        if (monthSet.size === 0) return { quarters: [], quarterLabel: "" }

        // 年月范围
        const sorted = Array.from(monthSet).sort()
        const minY = parseInt(sorted[0].split("-")[0])
        const maxY = parseInt(sorted[sorted.length - 1].split("-")[0])

        // Q: [1,2,3,4] → 1~4月, [5,6,7,8] → 5~8月, [9,10,11,12] → 9~12月
        const Q_MONTHS = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
        const qs: string[][] = []

        for (let y = minY; y <= maxY; y++) {
            for (const qm of Q_MONTHS) {
                const keys = qm.map((m) => `${y}-${String(m).padStart(2, "0")}`)
                // 至少有一个月有数据才保留
                if (keys.some((k) => monthSet.has(k))) {
                    qs.push(keys)
                }
            }
        }

        // 生成当前季度标签
        const cur = qs[quarter] || []
        const label = (() => {
            if (cur.length === 0) return ""
            const m0 = parseInt(cur[0].split("-")[1])
            const m3 = parseInt(cur[3].split("-")[1])
            const y0 = cur[0].split("-")[0]
            const y3 = cur[3].split("-")[0]
            const yr = y0 === y3 ? y0 : `${y0}/${y3}`
            return `${yr} ${MONTH_LABELS[m0 - 1]}~${MONTH_LABELS[m3 - 1]}`
        })()

        return { quarters: qs, quarterLabel: label }
    }, [allDays, quarter])

    const currentMonths = quarters[quarter] || []

    /* ---- 数据加载后默认跳到最新季度 ---- */

    useEffect(() => {
        if (quarters.length > 0) {
            setQuarter(quarters.length - 1)
        }
    }, [quarters.length])

    /* ---- 颜色 ---- */

    function cellColor(day: ContributionDay | null): string {
        if (!day) return "transparent"
        if (isDark && day.contributionCount === 0) return "rgba(255,255,255,0.06)"
        return day.color
    }

    /* ---- 渲染 ---- */

    if (loading) {
        return (
            <div className="mt-3 animate-pulse">
                <div className="flex items-center justify-between mb-2">
                    <div className="h-3 w-6 bg-zinc-200 dark:bg-zinc-700 rounded" />
                    <div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-700 rounded" />
                    <div className="h-3 w-6 bg-zinc-200 dark:bg-zinc-700 rounded" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                    {Array.from({ length: 4 }, (_, mi) => (
                        <div key={mi}>
                            <div className="h-2.5 w-6 bg-zinc-200 dark:bg-zinc-700 rounded mb-1" />
                            <div className="flex gap-[1px] justify-center mb-0.5">
                                {Array.from({ length: 7 }, (_, i) => (
                                    <div key={i} className="w-4 h-4 rounded-sm bg-zinc-200 dark:bg-zinc-700" />
                                ))}
                            </div>
                            <div className="flex flex-col gap-[1px]">
                                {Array.from({ length: 5 }, (_, ri) => (
                                    <div key={ri} className="flex gap-[1px] justify-center">
                                        {Array.from({ length: 7 }, (_, ci) => (
                                            <div key={ci} className="w-4 h-4 rounded-sm bg-zinc-200 dark:bg-zinc-700" />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mt-3">
                <p className="text-[10px] text-zinc-400 font-mono mb-1">GitHub 动态</p>
                <img
                    src="https://ghchart.rshah.org/Neumann615"
                    alt="GitHub"
                    className="w-full rounded-md dark:invert dark:hue-rotate-180 opacity-70"
                />
            </div>
        )
    }

    const totalQuarters = quarters.length

    return (
        <div className="mt-4">
            {/* 季度导航 */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => setQuarter((q) => Math.max(0, q - 1))}
                    disabled={quarter <= 0}
                    className="text-[20px] leading-none text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-default transition-colors px-0.5"
                >
                    &#8249;
                </button>
                <span className="text-sm font-mono text-zinc-600 dark:text-zinc-300 select-none">
                    {quarterLabel}
                </span>
                <button
                    onClick={() => setQuarter((q) => Math.min(totalQuarters - 1, q + 1))}
                    disabled={quarter >= totalQuarters - 1}
                    className="text-[20px] leading-none text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-default transition-colors px-0.5"
                >
                    &#8250;
                </button>
            </div>

            {/* 月份网格：sm 2×2 / md 1×4 / lg 2×2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-x-2 gap-y-2.5">
                {currentMonths
                    .filter((mKey) => allDays.some((d) => d.date.startsWith(mKey)))
                    .map((mKey) => {
                    const [yStr, mStr] = mKey.split("-")
                    const y = parseInt(yStr)
                    const m = parseInt(mStr)
                    const grid = buildMonthGrid(y, m, allDays)
                    if (!grid) return null

                    return (
                        <div key={mKey}>
                            {/* 月份 */}
                            <p className="text-[12px] font-mono text-zinc-500 dark:text-zinc-400 mb-[2px] text-center">
                                {MONTH_LABELS[m - 1]}
                            </p>
                            {/* 表头 */}
                            <div className="flex gap-[2px] justify-center mb-[2px]">
                                {DAYS.map((label, i) => (
                                    <span
                                        key={i}
                                        className="text-[9px] leading-[12px] text-zinc-500 dark:text-zinc-400 font-mono w-4 text-center"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                            {/* 格子 */}
                            <div className="flex flex-col gap-[2px]">
                                {grid.map((week, wi) => (
                                    <div key={wi} className="flex gap-[2px] justify-center">
                                        {week.map((day, di) => (
                                            <div
                                                key={di}
                                                className="w-4 h-4 rounded-sm flex-shrink-0 cursor-pointer"
                                                style={{ backgroundColor: cellColor(day) }}
                                                title={day ? `${formatDateCN(day.date)} ${day.contributionCount} 次` : ""}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

