'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from '@/context/TenantContext';
import { ThemeToggle } from './ThemeToggle';
import {
    LayoutDashboard,
    Calendar,
    Users,
    ShoppingCart,
    Package,
    BarChart3,
    Video,
    Settings,
    PlusCircle,
    Kanban
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Kanban, label: 'Kanban', path: '/admin/kanban' },
    { icon: Calendar, label: 'Agenda', path: '/admin/agenda' },
    { icon: Users, label: 'Clientes', path: '/admin/clientes' },
    { icon: ShoppingCart, label: 'Vendas', path: '/admin/vendas' },
    { icon: Package, label: 'Estoque', path: '/admin/estoque' },
    { icon: Video, label: 'Câmeras', path: '/admin/cameras' },
    { icon: BarChart3, label: 'Relatórios', path: '/admin/relatorios' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { config, loading } = useTenant();

    return (
        <aside className="w-64 h-screen bg-[#F8FAFC] dark:bg-[hsl(180,50%,2%)] text-slate-600 dark:text-[hsl(180,10%,70%)] border-r border-slate-200 dark:border-[hsl(180,30%,10%)] flex flex-col fixed left-0 top-0 z-50 transition-all duration-500 ease-in-out">
            {/* HUD Accent Line */}
            <div className="absolute right-0 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden dark:block" />

            <div className="p-8 relative">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center text-white shadow-[0_0_20px_hsl(var(--primary)/0.3)] shrink-0 overflow-hidden ring-1 ring-white/10 dark:ring-primary/40">
                            {config?.logo_url ? (
                                <img src={config.logo_url} alt={config.name} className="w-full h-full object-cover" />
                            ) : (
                                <LayoutDashboard size={24} />
                            )}
                        </div>
                        <ThemeToggle />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-black text-xs leading-none truncate text-slate-900 dark:text-primary tracking-[-0.05em] uppercase">
                            {loading ? '...' : (config?.name || 'Clinical Trust')}
                        </h1>
                        <p className="text-[10px] text-slate-500 dark:text-[hsl(180,10%,50%)] truncate uppercase font-bold tracking-[0.2em] mt-1">
                            {loading ? '...' : (config?.description || 'Pet Boutique')}
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-white/5 text-white shadow-inner"
                                    : "hover:bg-white/[0.03] text-slate-400 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                            )}
                            <item.icon
                                size={20}
                                className={cn(
                                    "transition-colors duration-300",
                                    isActive ? "text-primary" : "group-hover:text-primary"
                                )}
                            />
                            <span className="font-semibold text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 space-y-6">
                <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all outline-none ring-offset-2 focus:ring-2 ring-primary border border-white/10">
                    <PlusCircle size={18} />
                    Agendar
                </button>

                <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-primary/20 transition-colors" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Sua Assinatura</p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-300">Plano Premium</span>
                            <span className="text-primary font-black">PRO</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>
                    </div>
                </div>

                <Link
                    href="/admin/configuracoes"
                    className={cn(
                        "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group",
                        pathname === '/admin/configuracoes'
                            ? "bg-white/5 text-white"
                            : "text-slate-500 hover:text-white hover:bg-white/[0.02]"
                    )}
                >
                    <Settings size={20} className={pathname === '/admin/configuracoes' ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                    <span className="font-bold text-sm">Ajustes</span>
                </Link>
            </div>
        </aside>
    );
}
