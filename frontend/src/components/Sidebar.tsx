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
        <aside className="w-64 h-screen bg-card text-foreground border-r border-border/50 flex flex-col fixed left-0 top-0 z-50 transition-all duration-500 ease-in-out">
            {/* HUD Accent Line - Consistent Branding */}
            <div className="absolute right-0 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-20" />

            <div className="p-8 relative">
                {/* Background HUD Decor */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/20 -translate-x-0.5 -translate-y-0.5" />

                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.2)] shrink-0 overflow-hidden ring-1 ring-white/10 relative group">
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {config?.logo_url ? (
                                <img src={config.logo_url} alt={config.name} className="w-full h-full object-cover" />
                            ) : (
                                <Activity size={24} className="animate-pulse" />
                            )}
                        </div>
                        <ThemeToggle />
                    </div>
                    <div className="min-w-0 space-y-2">
                        <h1 className="font-black text-sm leading-none truncate text-foreground tracking-tighter uppercase font-title italic">
                            {loading ? 'CALIBRATING...' : (config?.name || 'Clinical Trust')}
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                            <p className="text-[9px] text-muted-foreground truncate uppercase font-black tracking-[0.3em] opacity-40">
                                {loading ? 'SYNCHRONIZING' : (config?.description || 'NODE_MASTER_CONTROL')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar-thin">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "flex items-center gap-4 px-5 py-3.5 rounded-sm transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/10"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-bar"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                                />
                            )}
                            <item.icon
                                size={18}
                                className={cn(
                                    "transition-all duration-300",
                                    isActive ? "text-white scale-110" : "group-hover:text-primary group-hover:scale-110"
                                )}
                            />
                            <span className={cn(
                                "font-black text-[10px] uppercase tracking-widest transition-all",
                                isActive ? "translate-x-1" : "group-hover:translate-x-1"
                            )}>{item.label}</span>

                            {/* Decorative technical node */}
                            <div className={cn(
                                "absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-current opacity-0 transition-opacity",
                                isActive ? "opacity-20" : "group-hover:opacity-10"
                            )} />
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 space-y-6">
                <button className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all outline-none border border-primary/50 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <PlusCircle size={16} className="relative z-10" />
                    <span className="relative z-10">INITIALIZE</span>
                </button>

                <div className="p-5 bg-muted/20 rounded-sm border border-border/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                        <Lock size={20} />
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-3 opacity-40">System Integrity</p>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                            <span className="text-muted-foreground">Encryption</span>
                            <span className="text-primary font-black">Grade S</span>
                        </div>
                        <div className="h-[2px] w-full bg-muted rounded-full overflow-hidden p-[0.5px]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '88%' }}
                                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                transition={{ duration: 2, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                <Link
                    href="/admin/configuracoes"
                    className={cn(
                        "flex items-center gap-4 px-5 py-4 rounded-sm transition-all duration-300 group border-t border-border/10",
                        pathname === '/admin/configuracoes'
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    <Settings size={18} className={pathname === '/admin/configuracoes' ? 'text-primary' : 'group-hover:text-primary transition-all group-hover:rotate-90'} />
                    <span className="font-black text-[10px] uppercase tracking-widest">Control Center</span>
                </Link>
            </div>
        </aside>
    );
}
