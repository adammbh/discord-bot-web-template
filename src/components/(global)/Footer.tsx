"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export const Footer = () => {
    const [shouldRender, setShouldRender] = useState(true)

    useEffect(() => {
        const existingFooter = document.getElementById("yourbot-footer")
        if (existingFooter && document.querySelectorAll("#yourbot-footer").length > 1) {
            setShouldRender(false)
        }
    }, [])

    if (!shouldRender) return null

    return (
        <footer
            id="yourbot-footer"
            className="border-t border-white/5 bg-[#080808] w-full relative z-10 font-sans">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs font-normal font-sans text-center sm:text-left">
                        Copyright © 2025 yourbot.bot. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <Link
                            href="/invite"
                            className="text-gray-400 text-xs font-normal font-sans hover:text-white transition-all">
                            Invite
                        </Link>
                        <Link
                            href="https://docs.yourbot.bot/"
                            className="text-gray-400 text-xs font-normal font-sans hover:text-white transition-all">
                            Documentation
                        </Link>
                        <Link
                            href="/team"
                            className="text-gray-400 text-xs font-normal font-sans hover:text-white transition-all">
                            Team
                        </Link>
                        <Link
                            href="https://discord.gg/yourbot"
                            className="text-gray-400 text-xs font-normal font-sans hover:text-white transition-all">
                            Support
                        </Link>
                        <Link
                            href="/terms"
                            className="text-gray-400 text-xs font-normal font-sans hover:text-white transition-all">
                            Terms
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-gray-400 text-xs font-normal font-sans hover:text-white transition-all">
                            Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
