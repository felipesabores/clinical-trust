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
        <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-heading font-semibold text-white tracking-tight">
                    {pageTitle}
                </h1>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 group-focus-within:opacity-100 group-focus-within:text-primary transition-all" />
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        className="pl-10 pr-4 py-2 w-64 bg-slate-800/40 border border-slate-700/50 rounded-full text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-slate-800/80 transition-all text-white placeholder:text-muted-foreground"
                    />
                </div>

                <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900 border border-rose-400"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-indigo-400 p-[2px]">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <div className="hidden sm:block text-sm">
                        <p className="font-heading font-medium text-white leading-none">Admin</p>
                        <p className="text-xs mt-1 text-muted-foreground">admin@vividstream.com</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
