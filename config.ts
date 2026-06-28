import { BookText, Link, LucideProps, Sparkles } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import { LinkItem, ProjectItem, ProjectTypeEnum } from "./type"


const linkSet: {
    [key: string]: LinkItem
} = {
    'React': {
        name: 'React',
        desc: '用于构建 Web 和原生用户界面的库',
        logo: '/image/logo/react.svg',
        home: 'https://react.nodejs.cn/',
        contribute: 'https://github.com/facebook/react'
    },
    'ahooks': {
        name: 'ahooks',
        desc: '一套高质量可靠的 React Hooks 库',
        logo: '/image/logo/ahooks.svg',
        home: 'https://ahooks.js.org/zh-CN/',
        contribute: 'https://github.com/alibaba/hooks'
    },
    'Next.js': {
        name: 'Next.js',
        desc: 'React 零配置一站式解决方案',
        logo: 'https://cdn.docschina.org/home/logo/nextjs.png',
        home: 'https://nextjs.org/',
        contribute: "https://github.com/vercel/next.js"
    },
    'Umi.js': {
        name: "Umi.js",
        desc: "插件化的企业级前端应用框架",
        logo: "https://cdn.docschina.org/home/logo/umi.png",
        home: "https://umijs.org/",
        contribute: "https://github.com/umijs/umi",
    },
    'React-Router': {
        name: 'React-Router',
        desc: 'React 导航组件',
        logo: "https://cdn.docschina.org/home/logo/react-router.svg",
        home: 'https://reactrouter.com/',
        contribute: 'https://github.com/remix-run/react-router'
    },
    'Antd': {
        name: 'Antd',
        desc: '助力设计开发者「更灵活」地搭建出「更美」的产品，让用户「快乐工作」的ReactUI框架',
        logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        home: 'https://ant-design.antgroup.com/index-cn',
        contribute: 'https://github.com/ant-design/ant-design'
    },
    'Vue': {
        name: 'Vue',
        desc: '渐进式JavaScript 框架',
        logo: '/image/logo/vue.png',
        home: 'https://cn.vuejs.org/',
        contribute: 'https://github.com/vuejs/'
    },
    'VueUse': {
        name: 'VueUse',
        desc: '基础 Vue 组合式工具的集合',
        logo: '/image/logo/vueuse.svg',
        home: 'https://vueuse.nodejs.cn/',
        contribute: 'https://github.com/vueuse/vueuse'
    },
    'Pinia': {
        name: 'Pinia',
        desc: '符合直觉的Vue.js 状态管理库',
        logo: 'https://pinia.vuejs.org/logo.svg',
        home: 'https://pinia.vuejs.org/zh/',
        contribute: 'https://github.com/vuejs/pinia'
    },
    'Nuxt.js': {
        name: 'Nuxt.js',
        desc: 'Nuxt是一个 开源框架,使得Web开发变得直观且强大,可以自信地创建高性能和生产级别的全栈Web应用和网站',
        logo: '/image/logo/nuxt.svg',
        home: 'https://nuxt.com.cn/',
        contribute: 'https://github.com/nuxt/nuxt'
    },
    'Element-Plus': {
        name: 'Element-Plus',
        desc: '基于 Vue 3，面向设计师和开发者的组件库',
        logo: '/image/logo/element-plus.png',
        home: 'https://element-plus.org/zh-CN/',
        contribute: 'https://github.com/element-plus/element-plus'
    },
    'Vant': {
        name: 'Vant',
        desc: '轻量、可定制的移动端 Vue 组件库',
        logo: '/image/logo/vant.png',
        home: 'https://vant.pro/vant/#/zh-CN',
        contribute: 'https://github.com/youzan/vant'
    },
    'Uni-App': {
        name: 'Uni-App',
        desc: '开发一次，多端运行',
        logo: '/image/logo/uni-app.png',
        home: 'https://uniapp.dcloud.net.cn/',
    },
    'photokit': {
        name: "photokit",
        desc: "基于AI人工智能的在线图片编辑器",
        logo: "https://photokit.com/img/logo.svg",
        home: "https://photokit.com/?lang=zh",
    },
    'Taro': {
        name: 'Taro',
        desc: 'Taro是一套遵循 React语法规范的多端开发解决方案',
        logo: "https://cdn.docschina.org/home/logo/taro.png",
        home: "https://docs.taro.zone/docs/",
        contribute: 'https://github.com/NervJS/taro'
    },
    '百度地图开放平台': {
        name: '百度地图开放平台',
        desc: '政企客户首选的地图数字底座',
        logo: 'https://mapopen-website-wiki.cdn.bcebos.com/statics/%E5%AF%BC%E8%88%AA04%402x.png',
        home: 'https://lbsyun.baidu.com/',
    },
    '讯飞开放平台': {
        name: '讯飞开发平台',
        desc: '以语音交互为核心的人工智能开放平台1',
        logo: '/image/logo/xunfei.svg',
        home: 'https://www.xfyun.cn/?ch=ptsj-bytg-ty&msclkid=f368fe10ef3a1362441799208dc3ae8e',
    },
    '高德开放平台': {
        name: '高德开放平台',
        desc: '完整的POI数据,高德为各行各业保驾护航',
        logo: '/image/logo/gaode.svg',
        home: 'https://lbs.amap.com/',
    },
    'Vite': {
        name: 'Vite',
        desc: '下一代前端开发与构建工具',
        logo: '/image/logo/vite.svg',
        home: 'https://vitejs.cn/vite3-cn/',
        contribute: 'https://github.com/vitejs/vite'
    },
    'Rollup': {
        name: 'Rollup',
        desc: '新一代 JavaScript 模块打包器',
        logo: '/image/logo/rollup.svg',
        home: 'https://www.rollupjs.com/',
        contribute: 'https://github.com/rollup/rollup'
    },
    'Webpack': {
        name: 'Webpack',
        desc: '用于现代 JavaScript 应用程序的静态模块打包工具',
        logo: '/image/logo/webpack.svg',
        home: 'https://www.webpackjs.com/',
        contribute: 'https://github.com/webpack/webpack'
    },
    'Angular': {
        name: 'Angular',
        desc: '适用于任何规模的web开发框架，强大的国际化、安全性和无障碍功能',
        logo: '/image/logo/angular.png',
        home: 'https://angular.cn/',
        contribute: 'https://github.com/angular/angular'
    },
    'Ng-Zorro': {
        name: 'Ng-Zorro',
        desc: '遵循 Ant Design 设计规范的 Angular UI 组件库，主要用于研发企业级中后台产品',
        logo: '/image/logo/ngzorro.svg',
        home: 'https://ng.ant.design/docs/introduce/zh',
        contribute: 'https://github.com/NG-ZORRO/ng-zorro-antd'
    },
    'TypeScript': {
        name: 'TypeScript',
        desc: 'JavaScript类型的超集',
        logo: '/image/logo/typescript.png',
        home: 'https://www.tslang.cn/index.html',
        contribute: 'https://github.com/Microsoft/TypeScript'
    },
    'Rust': {
        name: 'Rust',
        desc: '一门赋予每个人构建可靠且高效软件能力的语言',
        logo: '/image/logo/rust.png',
        home: 'https://www.rust-lang.org/zh-CN/',
        contribute: 'https://github.com/rust-lang/rust'
    },
    'MDN': {
        name: 'MDN',
        desc: '提供 Web 技术文档，学习 Web 开发的最佳实践',
        logo: '/image/logo/mdn.png',
        home: 'https://developer.mozilla.org/zh-CN/',
        contribute: 'https://github.com/mdn/content'
    },
    'UnoCSS': {
        name: 'UnoCSS',
        desc: '即时按需的原子化 CSS 引擎',
        logo: '/image/logo/unocss.svg',
        home: 'https://unocss.nodejs.cn/',
        contribute: 'https://github.com/unocss/unocss'
    },
    'tailwindcss': {
        name: 'tailwindcss',
        desc: '只需书写 HTML 代码，无需书写 CSS，即可快速构建美观的网站',
        logo: '/image/logo/tailwindcss.svg',
        home: 'https://www.tailwindcss.cn/',
        contribute: 'https://github.com/tailwindlabs/tailwindcss'
    },
    'Faker': {
        name: 'Faker',
        desc: '生成大量虚假（但真实）的数据用于测试和开发',
        logo: '/image/logo/faker.svg',
        home: 'https://faker.nodejs.cn/',
        contribute: 'https://github.com/faker-js/faker'
    },
    'html2canvas': {
        name: 'html2canvas',
        desc: 'html2canvas 是一个 HTML 渲染器,允许你直接在用户浏览器截取页面或部分网页的“屏幕截屏”',
        logo: '/image/logo/html2canvas.png',
        home: 'https://www.html2canvas.cn/',
        contribute: 'https://github.com/niklasvh/html2canvas'
    }, 'ico': {
        name: 'ico',
        desc: '在线制作icon图标',
        logo: 'https://blog.nyaasu.top/usr/imgs/favicon.ico',
        home: 'https://ico.nyaasu.top/',
        contribute: ''
    }, '': {
        name: '',
        desc: '',
        logo: '',
        home: '',
        contribute: ''
    }, '': {
        name: '',
        desc: '',
        logo: '',
        home: '',
        contribute: ''
    },
}

export const config: {
    projectData: Array<ProjectItem>
    menuData: Array<{
        text: string
        path: string
        icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
    }>
    linkData: Array<{
        name: string
        label: string,
        list: Array<LinkItem>
    }>
} = {
    menuData: [
        {
            text: "技术栈",
            path: "/#tech",
            icon: BookText,
        },
        {
            text: "项目",
            path: "/#projects",
            icon: Sparkles,
        },
        {
            text: "联系",
            path: "/#contact",
            icon: Link,
        },
    ],
    projectData: [
        {
            icon: "/logo.jpg",
            title: "Z-blog",
            description: "基于Next.js构建的个人博客",
            url: "https://xiaonuo.love",
            tags: [
                {
                    text: "Next.js",
                    color: "stone",
                },
                {
                    text: "TailwindCss",
                    color: "blue",
                },
            ],
            type: ProjectTypeEnum.个人,
        },
        {
            icon: "/z-docs-logo.png",
            title: "Z-docs",
            description: "基于vitePress构建的文档站点，记录一些知识点和常见问题",
            url: "https://docs.xiaonuo.love",
            tags: [
                {
                    text: "VitePress",
                    color: "green",
                },
            ],
            type: ProjectTypeEnum.个人,
        },
        {
            icon: "/image/logo/uoffer.ico",
            title: "有录网模仿网站",
            description: "基于Nuxt.js构建的模仿有录网开发的网站，学习Nuxt用",
            url: "https://uoffer.xiaonuo.love",
            tags: [
                {
                    text: "Nuxt.js",
                    color: "green",
                },
                {
                    text: "UnoCss",
                    color: "violet",
                },
            ],
            type: ProjectTypeEnum.个人,
        },
        {
            icon: "/logo.jpg",
            title: "Z-admin",
            description: "基于React、Antd构建的一套后台管理模板",
            url: "https://bupu-admin.xiaonuo.love/",
            tags: [
                {
                    text: "React",
                    color: "indigo",
                },
                {
                    text: "Antd",
                    color: "blue",
                },
            ],
            type: ProjectTypeEnum.个人,
        },
        {
            icon: "/logo.jpg",
            title: "Z-Board",
            description: "使用原生js及canvas构建的一个截屏工具以及白板",
            url: "https://bupu-board.xiaonuo.love/",
            tags: [
                {
                    text: "JavaScript",
                    color: "yellow",
                },
                {
                    text: "Canvas",
                    color: "slate",
                },
            ],
            type: ProjectTypeEnum.个人,
        },
        {
            icon: "/image/logo/jyxz.svg",
            title: "就业小知",
            description: "一款集成语音识别、百度地图、数字人的求职机系统",
            url: "https://xiaozhi.beikesmart.com",
            tags: [
                {
                    text: "Vue3",
                    color: "green",
                },
                {
                    text: "讯飞数字人",
                    color: "rose",
                },
                {
                    text: "百度地图",
                    color: "fuchsia",
                },
            ],
            type: ProjectTypeEnum.公司,
        },
        {
            icon: "/image/logo/uniplat-admin.png",
            title: "uniplat-admin",
            description: "公司用的通用后台管理网站，支持多入口模块管理",
            url: "https://xiaozhi-uniplat.beikesmart.com",
            tags: [
                {
                    text: "Vue3",
                    color: "green",
                },
                {
                    text: "ElementPlus",
                    color: "blue",
                },
            ],
            type: ProjectTypeEnum.公司,
        },
        {
            icon: "/image/logo/anxin.png",
            title: "即时通讯H5",
            description: "基于Vue3、Vant构建的一个即时通讯聊天软件",
            url: "http://dd.dreamdt.cn:8899/mobile/index.html#/login",
            tags: [
                {
                    text: "Vue3",
                    color: "green",
                },
                {
                    text: "Vant",
                    color: "green",
                },
            ],
            type: ProjectTypeEnum.公司,
        }
    ],
    linkData: [
        {
            name: "React",
            label: "React",
            list: [linkSet['React'], linkSet['Next.js'], linkSet['Umi.js'], linkSet['React-Router'], linkSet['Antd'], linkSet['ahooks']]
        },
        {
            name: "Vue",
            label: "Vue",
            list: [linkSet['Vue'], linkSet['Nuxt.js'], linkSet['Pinia'], linkSet['Element-Plus'], linkSet['Vant'], linkSet['VueUse']]
        },
        {
            name: 'Angular',
            label: 'Angular',
            list: [linkSet['Angular'], linkSet['Ng-Zorro']]
        },
        {
            name: 'CSS',
            label: 'CSS',
            list: [linkSet['tailwindcss'], linkSet['UnoCSS']]
        },
        {
            name: '小程序',
            label: '小程序',
            list: [linkSet['Uni-App'], linkSet['Taro']]
        },
        {
            name: '构建工具',
            label: '构建工具',
            list: [linkSet['Vite'], linkSet['Rollup'], linkSet['Webpack']]
        },
        {
            name: '好用的库',
            label: '好用的库',
            list: [linkSet['Faker'], linkSet['html2canvas']]
        },
        {
            name: '语言及规范',
            label: '语言及规范',
            list: [linkSet['MDN'], linkSet['TypeScript'], linkSet['Rust']]
        },
        {
            name: '工具箱',
            label: '工具箱',
            list: [linkSet['photokit'], linkSet['ico']]
        },
        {
            name: '第三方平台',
            label: '第三方平台',
            list: [linkSet['百度地图开放平台'], linkSet['高德开放平台'], linkSet['讯飞开放平台']]
        }
    ]
}
