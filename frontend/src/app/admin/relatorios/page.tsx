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
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useTenant } from '@/context/TenantContext';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
        { name: 'CONSULTA CLÍNICA', count: 31, pct: 8, revenue: 'R$ 2.480' },
        { name: 'OUTROS PROCEDIMENTOS', count: 23, pct: 6, revenue: 'R$ 1.140' },
    ];
    return (
        <div className="p-8 space-y-10 bg-background text-foreground min-h-screen">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 uppercase">
                        <BarChart3 className="text-primary" size={32} />
                        Business <span className="text-primary">Intelligence</span>
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground mt-2 opacity-60 italic">TELEMETRIA DE PERFORMANCE // NODE REPORT-X12</p>
                </div>
                <div className="flex items-center gap-4 px-6 py-3 bg-muted/10 border border-border/50 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <Calendar size={16} className="text-primary opacity-50" />
                    PERÍODO: ÚLTIMOS 180 DIAS
                </div>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((k, i) => (
                    <div key={i} className="hud-card p-6 bg-card border-border/50 hover:border-primary/30 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <k.icon size={60} />
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`${k.bg} p-3 rounded-sm border border-border/50 ${k.color}`}>
                                <k.icon size={20} />
                            </div>
                            <span className={cn(
                                "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border",
                                k.up ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' : 'text-red-500 bg-red-500/5 border-red-500/10'
                            )}>
                                {k.up ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                                {k.change}
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-50 mb-1">{k.label}</p>
                        <h3 className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">{k.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* HUD Chart */}
                <div className="lg:col-span-3 hud-card p-8 bg-card border-border/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 flex gap-2 pointer-events-none opacity-20">
                        <Activity size={18} className="text-primary animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest">LIVE TELEMETRY</span>
                    </div>

                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h3 className="font-black text-xl uppercase tracking-tighter">Fluxo de Receita</h3>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1 opacity-50 italic border-l border-primary/30 pl-3">MÉTRICA MENSAL CONSOLIDADA</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-black tracking-tighter">R$ {stats?.totalIncome?.toLocaleString() || '0,00'}</p>
                            <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest flex items-center justify-end gap-1.5 mt-1.5">
                                <ArrowUpRight size={12} /> +18.4% VS CICLO ANTERIOR
                            </p>
                        </div>
                    </div>

                    {/* Technical Chart */}
                    <div className="flex items-end gap-4 h-64 relative border-b border-border/10 pb-4">
                        {/* Background Grid */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-full border-t border-border/5 opacity-50" />
                            ))}
                        </div>

                        {revenueData.map((val: number, i: number) => {
                            const height = (val / maxRevenue) * 100;
                            const isLast = i === revenueData.length - 1;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar z-10 transition-transform hover:scale-x-105">
                                    <div className="w-full h-full flex flex-col justify-end relative">
                                        {/* Value Label */}
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all translate-y-2 group-hover/bar:translate-y-0 text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 border border-primary/20 rounded-sm whitespace-nowrap">
                                            R$ {val.toLocaleString()}
                                        </div>
                                        <div
                                            className={cn(
                                                "w-full rounded-sm transition-all relative overflow-hidden",
                                                isLast ? 'bg-primary shadow-2xl shadow-primary/20 ring-1 ring-white/20' : 'bg-muted/20 group-hover/bar:bg-primary/40 border border-border/50'
                                            )}
                                            style={{ height: `${height}%` }}
                                        >
                                            {/* Technical stripes on the bars */}
                                            <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-col gap-1.5 p-1">
                                                {Array.from({ length: 15 }).map((_, j) => (
                                                    <div key={j} className="h-[1px] w-full bg-white/20" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40 group-hover/bar:opacity-100 group-hover/bar:text-primary transition-all tracking-widest">{months[i]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top services */}
                <div className="lg:col-span-2 hud-card p-8 bg-card border-border/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Target size={60} />
                    </div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Zap size={16} className="text-primary" />
                        </div>
                        <h3 className="font-black text-xl uppercase tracking-tighter">Performance Mix</h3>
                    </div>

                    <div className="space-y-6">
                        {topServices.map(s => (
                            <div key={s.name} className="group/item">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 group-hover/item:text-primary group-hover/item:opacity-100 transition-all">{s.name}</span>
                                    <div className="text-right">
                                        <p className="text-sm font-black tracking-tight">{s.revenue}</p>
                                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-30 italic">{s.count} VOLS</p>
                                    </div>
                                </div>
                                <div className="h-2 bg-muted/10 border border-border/30 rounded-full overflow-hidden relative p-[1px]">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-1000 group-hover/item:opacity-100 opacity-60 relative"
                                        style={{ width: `${s.pct}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2.5">
                                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-30">{s.pct}% COMPART. MERCADO</p>
                                    <div className="w-1.5 h-1.5 bg-primary/20 rounded-full group-hover/item:bg-primary group-hover/item:animate-ping transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-border/10 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity cursor-help group/info">
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest">SYSTEM INTEGRITY NOMINAL</span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest group-hover/info:text-primary transition-colors">FULL DATALOG [HEX 0XFF12A]</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
