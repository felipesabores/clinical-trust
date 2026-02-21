'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

    return (
        <aside className="w-64 h-screen glass border-r flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Clinical Trust</h1>
                        <p className="text-xs text-muted-foreground">Pet Boutique</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon
                                size={20}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-primary-foreground" : "group-hover:text-primary"
                                )}
                            />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 space-y-4">
                <button className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-xl font-bold shadow-lg shadow-secondary/10 hover:scale-[1.02] transition-transform">
                    <PlusCircle size={20} />
                    Agendamento Rápido
                </button>

                <div className="p-4 bg-muted rounded-2xl">
                    <p className="text-xs font-semibold mb-1">Plano Premium</p>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full w-full bg-primary" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">Acesso total liberado</p>
                </div>

                <Link
                    href="/admin/configuracoes"
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                        pathname === '/admin/configuracoes'
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Settings size={20} />
                    <span className="font-medium">Configurações</span>
                </Link>
            </div>
        </aside>
    );
}
