"use client"
import React, {useCallback, useEffect, useRef, useState} from "react"
import {useTheme} from "next-themes"
import "@/index.css"


const SPINNER_DURATION = 1500

export function GlobalLoading(props: {
    loadingFinished: () => void
}) {
    const endVideoRef = useRef<HTMLVideoElement | null>(null)
    const loopVideoRef = useRef<HTMLVideoElement | null>(null)
    const videoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [isReady, setIsReady] = useState<boolean>(false)
    const [mounted, setMounted] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [videoFailed, setVideoFailed] = useState(false)
    const {resolvedTheme} = useTheme()

    const finish = useCallback(() => {
        setTimeout(props.loadingFinished, 0)
    }, [props.loadingFinished])

    // 客户端挂载后检测设备类型
    useEffect(() => {
        const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
            || ('ontouchstart' in window && window.innerWidth < 768)
        setIsMobile(mobile)
        setMounted(true)
    }, [])

    // 视频加载超时：2 秒内未触发 canplay 则降级到 CSS spinner
    useEffect(() => {
        if (!mounted || isMobile) return

        videoTimeoutRef.current = setTimeout(() => {
            setVideoFailed(true)
            setIsReady(true)
        }, 2000)

        return () => {
            if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current)
        }
    }, [mounted, isMobile])

    // ready 后的处理逻辑
    useEffect(() => {
        if (!isReady || !mounted) return

        if (isMobile || videoFailed) {
            // 移动端 / 视频超时：spinner 展示 1.5s 后结束
            const t = setTimeout(finish, SPINNER_DURATION)
            return () => clearTimeout(t)
        }
        // 桌面端视频正常：播放结束视频，ended 后结束；4s 仍未结束则强制放行
        const safety = setTimeout(finish, 4000)
        const video = endVideoRef.current
        if (video) {
            video.addEventListener('ended', finish, {once: true})
            video.play().catch(() => finish())
        } else {
            finish()
        }
        return () => clearTimeout(safety)
    }, [isReady, mounted, isMobile, videoFailed, finish])

    // 2 秒后标记 ready
    useEffect(() => {
        setTimeout(() => {
            setIsReady(true)
        }, 2000)
    }, [])

    const isDark = mounted && resolvedTheme === "dark"

    // 是否正在展示 spinner（移动端 / 视频失败降级）
    const showSpinner = isMobile || (isReady && videoFailed)

    // 渲染 loading spinner（移动端 / 视频超时降级）
    function renderSpinner() {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-12 h-12">
                        <div
                            className="absolute inset-0 rounded-full border-2"
                            style={{borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}}
                        />
                        <div
                            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                            style={{borderTopColor: isDark ? "#fff" : "#333"}}
                        />
                    </div>
                    <span
                        className="text-xs font-mono tracking-widest uppercase animate-pulse"
                        style={{color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}}
                    >
                        Loading
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div
            className={
                "z-[999] absolute bottom-0 left-0 right-0 top-0 w-full h-full select-none animate-out fade-out duration-500"
            }
            style={{backgroundColor: showSpinner ? (isDark ? "#000" : "#fafafa") : "#000"}}
        >
            {!mounted ? (
                /* 服务端 & hydration 阶段：占位，与 SSR HTML 一致 */
                null
            ) : showSpinner ? (
                renderSpinner()
            ) : isReady ? (
                <video
                    ref={endVideoRef}
                    className="mix-blend-screen w-full h-full object-cover"
                    src="/video/loader_end.mp4"
                    autoPlay muted playsInline
                />
            ) : (
                <video
                    ref={loopVideoRef}
                    className="mix-blend-screen opacity-60 w-full h-full object-cover"
                    src="/video/loader.mov"
                    autoPlay loop muted playsInline
                    onCanPlay={() => {
                        if (videoTimeoutRef.current) {
                            clearTimeout(videoTimeoutRef.current)
                            videoTimeoutRef.current = null
                        }
                    }}
                    onError={() => {
                        setVideoFailed(true)
                        setIsReady(true)
                    }}
                />
            )}
        </div>
    )
}