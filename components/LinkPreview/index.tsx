"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useTranslations } from "next-intl"

export interface LinkPreviewProps {
  url: string
  children: React.ReactNode
  width?: number
  height?: number
  className?: string
}

interface PreviewData {
  screenshot: string
  url: string
  logo: string
  publisher: string
}

export function LinkPreview({
  url,
  children,
  width = 280,
  height = 180,
  className,
}: LinkPreviewProps) {
  const t = useTranslations('linkPreview')
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [open, setOpen] = useState(false)
  const [isTouchDevice] = useState(() =>
    typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  )
  const fetchedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // ========== 请求预览数据 ==========

  const fetchPreview = useCallback(async () => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    setLoading(true)
    setImageError(false)
    try {
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}&meta=true&screenshot=true`
      )
      const data = await response.json()
      if (data.data) {
        setPreviewData({
          screenshot: data.data.screenshot?.url || "",
          url: data.data.url || url,
          logo: data.data.logo?.url || "",
          publisher: data.data.publisher || "",
        })
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [url])

  // 组件挂载时立即请求（触屏设备跳过）
  useEffect(() => {
    if (!isTouchDevice) fetchPreview()
  }, [fetchPreview, isTouchDevice])

  // ========== hover 触发 ==========

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setOpen(true), 200)
  }

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setOpen(false), 150)
  }

  // 点击外部关闭
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // cleanup timers on unmount
  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  // ========== 移动端直接透传 ==========

  if (isTouchDevice) return <>{children}</>

  return (
    <div
      ref={wrapperRef}
      className={`relative block ${className ?? ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {open && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-in fade-in zoom-in-95 origin-bottom duration-150"
          style={{ width }}
        >
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
            {/* 截图区域 */}
            {loading ? (
              <div
                className="flex items-center justify-center bg-zinc-50 dark:bg-zinc-800"
                style={{ height }}
              >
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {t('loading')}
                </div>
              </div>
            ) : imageError || !previewData?.screenshot ? (
              <div
                className="flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800"
                style={{ height }}
              >
                <span className="text-2xl opacity-30">🌐</span>
              </div>
            ) : (
              <div style={{ height }} className="overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={previewData.screenshot}
                  alt={previewData.publisher || url}
                  className="w-full h-full object-cover object-top"
                  onError={() => setImageError(true)}
                />
              </div>
            )}

            {/* 底部信息 */}
            {previewData && (
              <div className="px-2.5 py-2 flex items-center gap-2 bg-white dark:bg-zinc-900">
                {previewData.logo && (
                  <img
                    src={previewData.logo}
                    alt=""
                    className="w-3.5 h-3.5 rounded flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[11px] font-medium text-zinc-700 dark:text-zinc-200 truncate"
                    title={previewData.publisher}
                  >
                    {previewData.publisher || new URL(url).hostname}
                  </p>
                  <p
                    className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate"
                    title={previewData.url}
                  >
                    {previewData.url}
                  </p>
                </div>
              </div>
            )}

            {/* 箭头 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full">
              <div className="w-2 h-2 bg-white dark:bg-zinc-900 border-r border-b border-zinc-200 dark:border-zinc-700 rotate-45 -mt-[5px]" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkPreview
