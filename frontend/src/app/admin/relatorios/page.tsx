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
import { apiClient } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { useState, useEffect } from 'react';



export default function RelatoriosPage() {
    const { config } = useTenant();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/api/transactions/stats`);
            setStats(res.data);
        } catch (e) {
            logger.error('Relatórios', 'Erro ao buscar stats', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const res = await apiClient.get(`/api/appointments/history?limit=50`);
            setHistory(res.data || []);
        } catch (e) {
            logger.error('Relatórios', 'Erro ao buscar histórico', e);
        } finally {
            setLoadingHistory(false);
        }
    };



    const revenueData = stats?.monthlyRevenue || [0, 0, 0, 0, 0, 0];
    const months = ['SET', 'OUT', 'NOV', 'DEZ', 'JAN', 'FEV'];
    const maxRevenue = Math.max(...revenueData, 1);

    const kpis = [
        { label: 'Receita Operacional', value: `R$ ${stats?.totalIncome?.toFixed(2) || '0,00'}`, change: '+18.4%', up: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
        { label: 'Matriz de Clientes', value: stats?.customerCount?.toString() || '0', change: '+7.2%', up: true, icon: Users, color: 'text-[#355872]', bg: 'bg-[#7AAACE]/10' },
        { label: 'Volume de Serviços', value: stats?.transactionCount?.toString() || '0', change: '+12.1%', up: true, icon: ShoppingCart, color: 'text-[#355872]', bg: 'bg-[#7AAACE]/10' },
        { label: 'Índice de Fidelidade', value: '94.2', change: '-2.1%', up: false, icon: Star, color: 'text-amber-600', bg: 'bg-amber-500/10' },
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
        <div className="p-8 space-y-8 bg-[#F7F8F0] dark:bg-slate-950 text-foreground min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight text-[#355872] dark:text-white flex items-center gap-3">
                        <BarChart3 className="text-[#7AAACE]" size={32} />
                        Insights Operacionais
                    </h1>
                    <p className="text-[#355872]/60 font-medium mt-1">
                        Acompanhe o desempenho e rentabilidade da sua marca <span className="text-[#7AAACE] font-bold">Clinical Trust</span>.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900/50 border border-[#E4E9D5] dark:border-white/5 rounded-2xl text-[10px] font-black text-[#355872] shadow-sm uppercase tracking-widest">
                    <Calendar size={16} className="text-[#7AAACE]" />
                    Jan - Fev 2024
                </div>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((k, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-6 border border-[#E4E9D5] dark:border-white/5 rounded-3xl hover:border-[#7AAACE]/30 transition-all duration-500 group overflow-hidden relative shadow-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <k.icon size={64} className="text-[#355872]" />
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`${k.bg} p-3 rounded-2xl border border-[#E4E9D5]/50 ${k.color}`}>
                                <k.icon size={22} />
                            </div>
                            <span className={cn(
                                "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border",
                                k.up ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'
                            )}>
                                {k.up ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
                                {k.change}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-[#355872]/40 dark:text-slate-400 uppercase tracking-widest mb-1">{k.label}</p>
                        <h3 className="text-3xl font-heading font-black tracking-tight text-[#355872] dark:text-white">{k.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* HUD Chart */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-900/40 backdrop-blur-md p-8 border border-[#E4E9D5] dark:border-white/5 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h3 className="font-heading font-black text-xl text-[#355872] dark:text-white tracking-tight">Fluxo de Receita</h3>
                            <p className="text-sm font-medium text-[#355872]/40 mt-1">Análise de desempenho mensal</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-heading font-black text-[#355872] dark:text-white tracking-tighter">R$ {stats?.totalIncome?.toLocaleString() || '0,00'}</p>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center justify-end gap-1 mt-1">
                                <ArrowUpRight size={14} /> +18.4% VS PREV
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
                                                "w-full rounded-t-2xl transition-all relative overflow-hidden",
                                                isLast ? 'bg-[#355872] hover:bg-[#355872]/90' : 'bg-[#7AAACE]/20 hover:bg-[#7AAACE]/40',
                                                'group-hover/bar:shadow-2xl'
                                            )}
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/10" />
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                                        isLast ? "text-[#355872]" : "text-[#355872]/30 group-hover/bar:text-[#355872]"
                                    )}>{months[i]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top services */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 backdrop-blur-md p-8 border border-[#E4E9D5] dark:border-white/5 rounded-[2.5rem] relative overflow-hidden group flex flex-col shadow-2xl">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#7AAACE]/10 flex items-center justify-center border border-[#7AAACE]/20 text-[#7AAACE] shadow-sm">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-black text-xl text-[#355872] dark:text-white tracking-tight">Serviços Prime</h3>
                            <p className="text-[10px] font-bold text-[#355872]/40 uppercase tracking-widest">Mais realizados</p>
                        </div>
                    </div>

                    <div className="space-y-8 flex-1">
                        {topServices.map(s => (
                            <div key={s.name} className="group/item">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="space-y-1">
                                        <span className="text-sm font-black text-[#355872] dark:text-white tracking-tight">{s.name}</span>
                                        <p className="text-[10px] font-bold text-[#355872]/40 uppercase tracking-widest">{s.count} atendimentos</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-heading font-black text-[#7AAACE] tracking-tighter">{s.revenue}</p>
                                    </div>
                                </div>
                                <div className="h-3 bg-[#E4E9D5]/30 dark:bg-slate-800 rounded-full overflow-hidden border border-[#E4E9D5]/50 dark:border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#7AAACE] to-[#355872] rounded-full transition-all duration-1000 opacity-90 shadow-[0_0_10px_rgba(122,170,206,0.3)]"
                                        style={{ width: `${s.pct}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2.5">
                                    <p className="text-[10px] font-black text-[#355872]/60 uppercase tracking-tighter">{s.pct}% SHARE</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white dark:bg-slate-900/40 backdrop-blur-md p-8 border border-[#E4E9D5] dark:border-white/5 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#7AAACE]/10 flex items-center justify-center border border-[#7AAACE]/20 text-[#7AAACE] shadow-sm">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-black text-xl text-[#355872] dark:text-white tracking-tight">Histórico de Procedimentos</h3>
                            <p className="text-sm font-medium text-[#355872]/40 mt-1">Últimos atendimentos concluídos</p>
                        </div>
                    </div>
                    {loadingHistory ? (
                        <div className="flex items-center justify-center p-12 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            Carregando histórico...
                        </div>
                    ) : history.length === 0 ? (
                        <div className="p-6 text-center text-[#355872]/60 bg-[#F7F8F0] dark:bg-slate-900/50 rounded-2xl border border-[#E4E9D5] dark:border-white/10">
                            Nenhum procedimento concluído encontrado.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((app) => (
                                <div key={app.id} className="p-4 bg-[#F7F8F0] dark:bg-slate-900/50 border border-[#E4E9D5] dark:border-white/10 rounded-2xl hover:border-[#7AAACE]/30 transition-all shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <p className="font-heading font-semibold text-[#355872] dark:text-slate-100 truncate">
                                                {app.pet?.name} · {app.pet?.customer?.name}
                                            </p>
                                            <div className="text-xs text-[#355872]/50 dark:text-slate-400 mt-1 flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} className="text-[#7AAACE]" />
                                                    {new Date(app.scheduled_at).toLocaleString('pt-BR')}
                                                </span>
                                                {app.staff?.name && (
                                                    <span className="flex items-center gap-1">
                                                        <Activity size={12} className="text-[#7AAACE]" />
                                                        {app.staff.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                            Concluído
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
