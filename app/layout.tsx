import "./globals.css"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="zh-CN" className="m-0 h-full p-0 font-sans" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var theme = localStorage.getItem('theme')
                                    if (theme === 'dark' || theme === 'light') {
                                        document.documentElement.classList.add(theme)
                                        return
                                    }
                                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                        document.documentElement.classList.add('dark')
                                    }
                                } catch (e) {}
                            })()
                        `,
                    }}
                />
            </head>
            <body className="w-full h-full">
                {children}
            </body>
        </html>
    )
}
