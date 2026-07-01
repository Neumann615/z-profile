"use client"
import React, {useEffect, useRef, useState} from "react"
import "@/index.css"


export function GlobalLoading(props: {
    loadingFinished: () => void
}) {
    const loadingVideoRef = useRef<HTMLVideoElement | null>(null)
    const [isReady, setIsReady] = useState<boolean>(false)
    const [mounted, setMounted] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // 客户端挂载后检测设备类型，避免 SSR hydration 不匹配
    useEffect(() => {
        const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
            || ('ontouchstart' in window && window.innerWidth < 768)
        setIsMobile(mobile)
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isReady && mounted && !isMobile && loadingVideoRef.current) {
            loadingVideoRef.current.addEventListener('ended', () => {
                setTimeout(props.loadingFinished, 0)
            })
        }
        if (isReady && mounted && isMobile) {
            setTimeout(props.loadingFinished, 1500)
        }
    }, [isReady, mounted, isMobile])

    useEffect(() => {
        setTimeout(() => {
            setIsReady(true)
        }, 2000)
    }, [])

    return (
        <div
            className={
                "z-[999] absolute bottom-0 left-0 right-0 top-0 w-full h-full select-none bg-black animate-out fade-out duration-500"
            }
        >
            {!mounted ? (
                /* 服务端 & hydration 阶段：纯黑占位，与 SSR HTML 一致 */
                null
            ) : isMobile ? (
                /* 移动端：CSS 动画替代视频，避免下载弹窗 */
                <div className="flex items-center justify-center w-full h-full">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-2 border-white/20" />
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
                        </div>
                        <span className="text-white/50 text-xs font-mono tracking-widest uppercase animate-pulse">
                            Loading
                        </span>
                    </div>
                </div>
            ) : isReady ? (
                <video
                    ref={loadingVideoRef}
                    className="mix-blend-screen w-full h-full object-cover"
                    src="/video/loader_end.mp4"
                    autoPlay muted playsInline
                />
            ) : (
                <video
                    className="mix-blend-screen opacity-60 w-full h-full object-cover"
                    src="/video/loader.mov"
                    autoPlay loop muted playsInline
                />
            )}
        </div>
    )
}