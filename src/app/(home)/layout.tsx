import { Footer } from "@/components/(global)/Footer"
import { GradientContainer } from "@/components/(global)/GradientContainer"
import Navbar from "@/components/(global)/navbar/Navbar"
import type { Metadata, Viewport } from "next"
import "../../styles/globals.css"

export const viewport: Viewport = {
    themeColor: "776dd4"
}

export const metadata: Metadata = {
    title: "Your Bot",
    description: "The only aesthetic multi-functional Discord bot you need.",
    twitter: {
        site: "https://your.bot/",
        card: "player"
    },
    openGraph: {
        url: "https://your.bot/",
        type: "website",
        title: "Your Bot",
        siteName: "your.bot",
        description: "The only aesthetic multi-functional Discord bot you need.",
        images: [
            {
                url: "https://r2.your.bot/your-new.png",
                width: 500,
                height: 500,
                alt: "your-bot"
            }
        ]
    }
}

export default function yourBotMain({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`bg-yourbot-100 font-satoshi`}>
                <GradientContainer />
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    )
}
