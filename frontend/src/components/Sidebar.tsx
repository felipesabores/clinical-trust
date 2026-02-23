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
        <aside className="w-64 h-screen bg-white dark:bg-slate-900/40 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out shadow-lg dark:shadow-2xl">
            {/* Subtle Gradient Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="p-6 relative border-b border-white/5">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-400 p-[1px] shadow-lg shadow-indigo-500/20 shrink-0 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[11px] flex items-center justify-center">
                                    {config?.logo_url ? (
                                        <img src={config.logo_url} alt={config.name} className="w-full h-full object-cover rounded-[11px]" />
                                    ) : (
                                        <Activity size={20} className="text-indigo-500" />
                                    )}
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-heading font-bold text-base text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                                    {loading ? 'Carregando...' : (config?.name || 'Vivid Stream')}
                                </h1>
                                <p className="text-xs text-muted-foreground truncate">
                                    {loading ? 'Aguarde' : 'Admin Workspace'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar-thin relative z-10">
                <div className="px-3 mb-2">
                    <p className="text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider">Gestão</p>
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon
                                size={18}
                                className={cn(
                                    "transition-colors duration-200",
                                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                                )}
                            />
                            <span className="text-sm tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 relative z-10 flex flex-col gap-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Tema</span>
                    <ThemeToggle />
                </div>
                <Link
                    href="/admin/configuracoes"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                        pathname === '/admin/configuracoes'
                            ? "bg-indigo-500/10 text-indigo-400 font-medium"
                            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}
                >
                    <Settings size={18} className={pathname === '/admin/configuracoes' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300 transition-transform duration-300 group-hover:rotate-45'} />
                    <span className="text-sm tracking-wide">Configurações</span>
                </Link>
            </div>
        </aside>
    );
}
