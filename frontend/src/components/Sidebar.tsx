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
    Kanban,
    Activity,
    Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Kanban, label: 'Kanban', path: '/admin/kanban' },
    { icon: Calendar, label: 'Agenda', path: '/admin/agenda' },
    { icon: Users, label: 'Clientes', path: '/admin/clientes' },
    { icon: Users, label: 'Equipe', path: '/admin/equipe' },
    { icon: ShoppingCart, label: 'Vendas', path: '/admin/vendas' },
    { icon: Activity, label: 'Financeiro', path: '/admin/financeiro' },
    { icon: Package, label: 'Estoque', path: '/admin/estoque' },
    { icon: Video, label: 'Câmeras', path: '/admin/cameras' },
    { icon: BarChart3, label: 'Relatórios', path: '/admin/relatorios' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { config, loading } = useTenant();

    return (
        <aside className="w-64 h-screen bg-[#355872] dark:bg-slate-900 border-r border-[#2a465b] dark:border-white/5 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out shadow-2xl">
            {/* Subtle Gradient Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-30 pointer-events-none" />

            <div className="p-6 relative border-b border-white/5">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 p-[1px] shadow-lg shadow-black/20 shrink-0 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[11px] flex items-center justify-center">
                                    {config?.logo_url ? (
                                        <img src={config.logo_url} alt={config.name} className="w-full h-full object-cover rounded-[11px]" />
                                    ) : (
                                        <Activity size={20} className="text-[#355872]" />
                                    )}
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-heading font-bold text-base text-white tracking-tight leading-tight truncate">
                                    {loading ? 'Carregando...' : (config?.name || 'Vivid Stream')}
                                </h1>
                                <p className="text-xs text-[#9CD5FF] truncate italic">
                                    {loading ? 'Aguarde' : 'Admin Workspace'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar-thin relative z-10">
                <div className="px-3 mb-2">
                    <p className="text-xs font-heading font-semibold text-[#9CD5FF]/60 uppercase tracking-widest">Gestão</p>
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative",
                                isActive
                                    ? "bg-white/15 text-white font-semibold shadow-inner"
                                    : "text-[#9CD5FF]/80 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#9CD5FF] rounded-r-full shadow-[0_0_10px_rgba(156,213,255,0.8)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon
                                size={18}
                                className={cn(
                                    "transition-colors duration-200",
                                    isActive ? "text-[#9CD5FF]" : "text-[#9CD5FF]/60 group-hover:text-white"
                                )}
                            />
                            <span className="text-sm tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-white/10 bg-black/10 relative z-10 flex flex-col gap-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-xs font-medium text-[#9CD5FF]">Tema</span>
                    <ThemeToggle />
                </div>
                <Link
                    href="/admin/configuracoes"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group",
                        pathname === '/admin/configuracoes'
                            ? "bg-white/15 text-white font-medium"
                            : "text-[#9CD5FF]/70 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Settings size={18} className={pathname === '/admin/configuracoes' ? 'text-[#9CD5FF]' : 'text-[#9CD5FF]/60 group-hover:text-white transition-all duration-500 group-hover:rotate-90'} />
                    <span className="text-sm tracking-wide">Configurações</span>
                </Link>
            </div>
        </aside>
    );
}
