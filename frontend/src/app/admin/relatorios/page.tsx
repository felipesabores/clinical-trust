'use client';

import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    ShoppingCart,
    Star,
    ArrowUpRight,
    Calendar,
    Activity,
    Target,
    Zap,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useTenant } from '@/context/TenantContext';
import axios from 'axios';
import { useState, useEffect } from 'react';

import { API } from '@/config';

export default function RelatoriosPage() {
    const { config } = useTenant();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        if (!config?.id) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API}/api/transactions/stats?tenantId=${config.id}`);
            setStats(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [config?.id]);

    const revenueData = stats?.monthlyRevenue || [0, 0, 0, 0, 0, 0];
    const months = ['SET', 'OUT', 'NOV', 'DEZ', 'JAN', 'FEV'];
    const maxRevenue = Math.max(...revenueData, 1);

    const kpis = [
        { label: 'Receita Operacional', value: `R$ ${stats?.totalIncome?.toFixed(2) || '0,00'}`, change: '+18.4%', up: true, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Matriz de Clientes', value: stats?.customerCount?.toString() || '0', change: '+7.2%', up: true, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Volume de Serviços', value: stats?.transactionCount?.toString() || '0', change: '+12.1%', up: true, icon: ShoppingCart, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Índice de Fidelidade', value: '94.2', change: '-2.1%', up: false, icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    const topServices = [
        { name: 'BANHO + TOSA PROF.', count: 148, pct: 38, revenue: 'R$ 7.400' },
        { name: 'BANHO HIGIÊNICO', count: 112, pct: 29, revenue: 'R$ 4.480' },
        { name: 'TOSA HIGIÊNICA', count: 73, pct: 19, revenue: 'R$ 2.920' },
        { name: 'HIDRATAÇÃO / OZÔNIO', count: 31, pct: 8, revenue: 'R$ 2.480' },
        { name: 'OUTROS PROCEDIMENTOS', count: 23, pct: 6, revenue: 'R$ 1.140' },
    ];
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 min-h-[400px] text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>Carregando relatórios...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-background/50 text-foreground min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <BarChart3 className="text-primary" size={28} />
                        Relatórios e Métricas
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Acompanhe o desempenho e os indicadores da sua clínica.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border/50 rounded-full text-sm font-medium text-foreground shadow-sm glass-panel">
                    <Calendar size={16} className="text-muted-foreground" />
                    Últimos 6 meses
                </div>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((k, i) => (
                    <div key={i} className="glass-panel p-6 bg-card border-border/50 hover:border-primary/30 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <k.icon size={60} />
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`${k.bg} p-3 rounded-xl border border-border/50 ${k.color}`}>
                                <k.icon size={20} />
                            </div>
                            <span className={cn(
                                "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border",
                                k.up ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'
                            )}>
                                {k.up ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
                                {k.change}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">{k.label}</p>
                        <h3 className="text-3xl font-bold tracking-tight text-foreground transition-colors">{k.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* HUD Chart */}
                <div className="lg:col-span-3 glass-panel p-8 bg-card border-border/50 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h3 className="font-semibold text-lg text-foreground">Fluxo de Receita</h3>
                            <p className="text-sm text-muted-foreground mt-1">Evolução mensal</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold tracking-tight">R$ {stats?.totalIncome?.toLocaleString() || '0,00'}</p>
                            <p className="text-xs text-emerald-500 font-medium flex items-center justify-end gap-1 mt-1">
                                <ArrowUpRight size={14} /> +18.4% vs mês anterior
                            </p>
                        </div>
                    </div>

                    {/* Technical Chart */}
                    <div className="flex items-end gap-4 h-64 relative pb-4">
                        {/* Background Grid */}
                        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none pb-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-full border-t border-border/50 border-dashed" />
                            ))}
                        </div>

                        {revenueData.map((val: number, i: number) => {
                            const height = (val / maxRevenue) * 100;
                            const isLast = i === revenueData.length - 1;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar z-10 transition-transform">
                                    <div className="w-full h-full flex flex-col justify-end relative">
                                        {/* Value Label */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all text-xs font-semibold text-foreground bg-popover px-2.5 py-1 border border-border shadow-md rounded-md whitespace-nowrap z-20">
                                            R$ {val.toLocaleString()}
                                        </div>
                                        <div
                                            className={cn(
                                                "w-full rounded-t-sm transition-all relative overflow-hidden",
                                                isLast ? 'bg-primary/90 hover:bg-primary' : 'bg-primary/20 hover:bg-primary/40',
                                                'group-hover/bar:shadow-lg'
                                            )}
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium transition-colors",
                                        isLast ? "text-foreground" : "text-muted-foreground group-hover/bar:text-foreground"
                                    )}>{months[i]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top services */}
                <div className="lg:col-span-2 glass-panel p-8 bg-card border-border/50 relative overflow-hidden group flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                            <Zap size={20} />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground">Serviços Mais Realizados</h3>
                    </div>

                    <div className="space-y-6 flex-1">
                        {topServices.map(s => (
                            <div key={s.name} className="group/item">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-semibold text-foreground">{s.name}</span>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-foreground">{s.revenue}</p>
                                        <p className="text-xs text-muted-foreground">{s.count} agendamentos</p>
                                    </div>
                                </div>
                                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000 opacity-90"
                                        style={{ width: `${s.pct}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-muted-foreground font-medium">{s.pct}% do total</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
