import {GlobalBg} from "@/components/GlobalBg"
import {Main} from "@/components/Main"
import dynamic from "next/dynamic"
const Header = dynamic(() => import("@/components/Header"), {ssr: false})
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div id='z-container' className={"w-full h-full overflow-y-auto overflow-x-hidden scroll scroll-smooth focus:scroll-auto"}>
            <GlobalBg/>
            {/* 内容区域盒子 */}
            <Header></Header>
            <Main>{children}</Main>
        </div>
    )
}
