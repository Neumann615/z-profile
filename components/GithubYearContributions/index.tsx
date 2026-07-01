"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useLocale, useTranslations } from "next-intl"

/* ========== 类型 ========== */

interface ContributionDay {
    date: string
    contributionCount: number
    color: string
    contributionLevel: string
}

type ContributionWeek = ContributionDay[]

/* ========== 组件 ========== */

export function GithubYearContributions() {
    const [rawWeeks, setRawWeeks] = useState<ContributionWeek[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const fetchedRef = useRef(false)
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    const isDark = mounted && resolvedTheme === "dark"
    const locale = useLocale()
    const t = useTranslations('github')

    const months = t.raw('months') as string[]
    const days = t.raw('days') as string[]

    /* ---- 日期格式化 ---- */

    function formatDate(dateStr: string): string {
        const [y, m, d] = dateStr.split("-")
        if (locale === 'zh') {
            return `${y}年${parseInt(m)}月${parseInt(d)}日`
        }
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${monthNames[parseInt(m) - 1]} ${parseInt(d)}, ${y}`
    }

    /* ---- 拉取数据 ---- */

    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true
        fetch("https://github-contributions-api.deno.dev/Neumann615.json")
            .then((res) => res.json())
            .then((data) => {
                // 保留 API 原始周结构，不做展平重建
                const weeks: ContributionWeek[] = data.contributions || []
                setRawWeeks(weeks)
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [])

    /* ---- 截取最近 53 周 + 月份标签 ---- */

    const { weeks, monthLabels } = useMemo(() => {
        if (rawWeeks.length === 0) return { weeks: [], monthLabels: [] as { col: number; label: string }[] }

        // 取最近 53 周
        const recent = rawWeeks.slice(-53)

        // 月份标签：在月份首次出现的列放置标签
        const seenMonth = new Set<string>()
        const labels: { col: number; label: string }[] = []
        for (let wi = 0; wi < recent.length; wi++) {
            for (let di = 0; di < recent[wi].length; di++) {
                const day = recent[wi][di]
                if (!day) continue
                const mKey = day.date.slice(0, 7)
                if (!seenMonth.has(mKey)) {
                    seenMonth.add(mKey)
                    const m = parseInt(day.date.split("-")[1]) - 1
                    labels.push({ col: wi, label: months[m] })
                }
            }
        }

        return { weeks: recent, monthLabels: labels }
    }, [rawWeeks, months])

    /* ---- 单元格颜色 ---- */

    function cellColor(day: ContributionDay | null): string {
        if (!day) return "transparent"
        if (isDark && day.contributionCount === 0) return "rgba(255,255,255,0.06)"
        return day.color
    }

    /* ---- 常量 ---- */

    const CELL = 11
    const GAP = 3
    const MONTH_H = 18

    /* ---- 加载态 ---- */

    if (loading) {
        return (
            <section className="mt-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                    {t('contributionsSectionTitle')}
                </h2>
                <div className="animate-pulse">
                    <div className="flex" style={{ marginLeft: 28, gap: GAP }}>
                        {Array.from({ length: 53 }, (_, wi) => (
                            <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                                {Array.from({ length: 7 }, (_, i) => (
                                    <div key={i} className="rounded-sm bg-zinc-200 dark:bg-zinc-700" style={{ width: CELL, height: CELL }} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    /* ---- 错误降级 ---- */

    if (error) {
        return (
            <section className="mt-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                    {t('contributionsSectionTitle')}
                </h2>
                <img
                    src="https://ghchart.rshah.org/Neumann615"
                    alt="GitHub Contributions"
                    className="w-full rounded-md dark:invert dark:hue-rotate-180 opacity-70"
                />
            </section>
        )
    }

    if (weeks.length === 0) return null

    /* ---- 渲染 ---- */

    // 星期标签索引：中文一三五日，英文 Sun/Tue/Thu/Sat
    const visibleDayIndices = locale === 'zh' ? [1, 3, 5, 0] : [0, 2, 4, 6]

    return (
        <section className="mt-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                {t('sectionTitle')}
            </h2>

            {/* 可滚动容器 */}
            <div className="overflow-x-auto -mx-4 px-4 pb-1">
                <div className="inline-flex min-w-max" style={{ gap: 0 }}>
                    {/* 左侧星期标签 */}
                    <div className="flex flex-col flex-shrink-0 mr-1" style={{ paddingTop: MONTH_H, gap: GAP }}>
                        {days.map((label, i) => (
                            <div
                                key={i}
                                className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center justify-end"
                                style={{
                                    height: CELL,
                                    width: 24,
                                    visibility: visibleDayIndices.includes(i) ? "visible" : "hidden",
                                }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* 右侧网格区 */}
                    <div>
                        {/* 月份行 */}
                        <div className="flex" style={{ height: MONTH_H, gap: GAP }}>
                            {weeks.map((_, wi) => {
                                const ml = monthLabels.find((m) => m.col === wi)
                                return (
                                    <div
                                        key={wi}
                                        className="relative flex-shrink-0"
                                        style={{ width: CELL, height: MONTH_H }}
                                    >
                                        {ml && (
                                            <span className="absolute left-0 text-[9px] text-zinc-400 dark:text-zinc-500 font-mono whitespace-nowrap">
                                                {ml.label}
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* 格子：7 行 × N 列 */}
                        {Array.from({ length: 7 }, (_, rowIdx) => (
                            <div
                                key={rowIdx}
                                className="flex"
                                style={{ gap: GAP, marginBottom: rowIdx < 6 ? GAP : 0 }}
                            >
                                {weeks.map((week, wi) => {
                                    const day = week[rowIdx] || null
                                    return (
                                        <div
                                            key={wi}
                                            className="flex-shrink-0 rounded-sm cursor-pointer hover:ring-1 hover:ring-zinc-400 dark:hover:ring-zinc-400 transition-all"
                                            style={{
                                                width: CELL,
                                                height: CELL,
                                                backgroundColor: cellColor(day),
                                            }}
                                            title={
                                                day
                                                    ? `${formatDate(day.date)} ${t('contributionsCount', { count: day.contributionCount })}`
                                                    : ""
                                            }
                                        />
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GithubYearContributions
