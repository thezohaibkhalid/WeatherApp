import React from 'react'
import Header from './header'
import { useTheme } from "@/context/theme-provider";

const Layout = ({ children }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`bg-gradient-to-br from-background to-muted h-screen overflow-y-scroll scrollbar-thin ${isDark ? 'scrollbar-thumb-slate-500 scrollbar-track-slate-950' : 'scrollbar-thumb-slate-300 scrollbar-track-slate-200'}`}>
            <Header />
            <main className='min-h-screen container mx-auto px-4 py-8'>
                {children}
            </main>
            <footer className='border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60'>
                <div className='container mx-auto px-4 text-center text-gray-400'>
                    <p>
                        Made with ❤️ by Zohaib Khalid
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Layout