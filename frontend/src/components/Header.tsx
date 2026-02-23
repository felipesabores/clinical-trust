'use client';

import { Bell, Search, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();

    // Simple breadcrumb logic based on pathname
    const segments = pathname.split('/').filter(Boolean);
    const currentPage = segments[segments.length - 1] || 'Dashboard';
    const pageTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

    return (
        <header className="sticky top-0 z-40 w-full bg-[#F7F8F0] dark:bg-slate-900 border-b border-[#E4E9D5] dark:border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 truncate">
                <h1 className="text-xl font-heading font-bold text-[#355872] dark:text-white tracking-tight truncate">
                    {pageTitle}
                </h1>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 text-muted-foreground shrink-0">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#355872]/40 group-focus-within:text-[#7AAACE] transition-all pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        className="pl-10 pr-4 py-2 w-40 lg:w-64 bg-white dark:bg-slate-800/50 border border-[#E4E9D5] dark:border-slate-700 rounded-2xl text-sm transition-all focus:w-48 lg:focus:w-72 outline-none focus:ring-2 focus:ring-[#7AAACE]/20 shadow-sm"
                    />
                </div>

                <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900 border border-rose-400"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-[#E4E9D5] dark:border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7AAACE] to-[#355872] p-[2px] shrink-0 shadow-md">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                            <User className="w-4 h-4 text-[#355872] dark:text-white" />
                        </div>
                    </div>
                    <div className="hidden sm:block text-sm overflow-hidden">
                        <p className="font-heading font-semibold text-[#355872] dark:text-white leading-none truncate">Admin</p>
                        <p className="text-xs mt-1 text-[#355872]/50 truncate font-medium underline decoration-[#7AAACE]/30">admin@vividstream.com</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
