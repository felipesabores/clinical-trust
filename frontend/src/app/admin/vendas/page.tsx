'use client';

import {
    ShoppingCart,
    TrendingUp,
    Search,
    Filter,
    Plus,
    CheckCircle2,
    Clock,
    XCircle,
    MoreVertical,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const statusStyle: Record<string, string> = {
    Pago: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    Pendente: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    Cancelado: 'text-red-500 bg-red-500/10 border-red-500/20',
};

const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'Pago') return <CheckCircle2 size={12} />;
    if (status === 'Pendente') return <Clock size={12} />;
    return <XCircle size={12} />;
};

import { API } from '@/config';

export default function VendasPage() {
    const { config } = useTenant();
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const stats = [
        { label: 'Faturamento Hoje', value: sales.length > 0 ? `R$ ${sales.reduce((acc, s) => acc + (s.amount || 0), 0).toFixed(2)}` : 'R$ 0,00', change: '+12%', up: true },
        { label: 'Pedidos Realizados', value: sales.length.toString(), change: '+2', up: true },
        { label: 'Ticket Médio', value: sales.length > 0 ? `R$ ${(sales.reduce((acc, s) => acc + (s.amount || 0), 0) / sales.length).toFixed(2)}` : 'R$ 0,00', change: '+5%', up: true },
        { label: 'Meta do Mês', value: '68%', change: '', up: true },
    ];

    const fetchSales = async () => {
        if (!config?.id) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API}/api/transactions?tenantId=${config.id}&type=INCOME`);
            setSales(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [config?.id]);
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 min-h-[400px] text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>Carregando vendas...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-[#F7F8F0] dark:bg-slate-950 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3 text-[#355872] dark:text-white">
                        <ShoppingCart className="text-[#7AAACE]" size={32} />
                        Transações Financeiras
                    </h1>
                    <p className="text-[#355872]/60 font-medium mt-1">
                        Monitoramento de fluxo de caixa e histórico de operações com o <span className="text-[#7AAACE] font-bold">Vivid Stream</span>.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-8 py-2.5 bg-[#7AAACE] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#7AAACE]/20 hover:bg-[#355872] transition-all duration-300">
                    <Plus size={18} /> Nova Venda
                </button>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-[#E4E9D5] dark:border-white/5 p-6 rounded-3xl group transition-all duration-500 hover:border-[#7AAACE]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#7AAACE]/5 to-transparent rounded-bl-full pointer-events-none" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-[#355872]/40 dark:text-slate-400 uppercase tracking-widest mb-4">{s.label}</p>
                            <h3 className="text-3xl font-heading font-black text-[#355872] dark:text-white tracking-tighter">{s.value}</h3>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#E4E9D5]/50 flex items-center justify-between relative z-10">
                            {s.change ? (
                                <span className={cn(
                                    "flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                                    s.up ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-100' : 'text-rose-600 bg-rose-50 dark:bg-rose-400/10 border border-rose-100'
                                )}>
                                    <ArrowUpRight size={14} className={s.up ? '' : 'rotate-90'} />
                                    {s.change}
                                </span>
                            ) : <div />}
                            {s.label === 'Meta do Mês' && (
                                <div className="w-20 h-1.5 bg-[#E4E9D5] rounded-full overflow-hidden">
                                    <div className="h-full w-[68%] bg-[#7AAACE]" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-[#E4E9D5] dark:border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-[#E4E9D5]/50 flex items-center gap-6 flex-wrap bg-[#F7F8F0]/30">
                    <div className="relative flex-1 min-w-[300px] group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]/40 group-focus-within:text-[#7AAACE] transition-all" size={18} />
                        <input
                            type="text"
                            placeholder="Filtrar transações..."
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950/20 border border-[#E4E9D5] dark:border-white/5 rounded-2xl text-sm font-medium focus:border-[#7AAACE]/50 focus:ring-4 focus:ring-[#7AAACE]/10 outline-none transition-all placeholder:text-[#355872]/30"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/5 rounded-2xl text-xs font-bold text-[#355872] hover:bg-[#E4E9D5]/20 transition-all shadow-sm">
                            <Filter size={16} className="text-[#7AAACE]" /> Filtros
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/5 rounded-2xl text-xs font-bold text-[#355872] hover:bg-[#E4E9D5]/20 transition-all shadow-sm">
                            <TrendingUp size={16} className="text-[#355872]" /> Exportar
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 pl-6">ID</th>
                                <th className="p-4">Cliente / Pet</th>
                                <th className="p-4">Serviço</th>
                                <th className="p-4">Data</th>
                                <th className="p-4 text-right">Valor</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 pr-6" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30 text-sm">
                            {sales.map(sale => (
                                <tr key={sale.id} className="hover:bg-muted/20 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-primary">
                                    <td className="p-4 pl-6 text-muted-foreground font-medium">{sale.id}</td>
                                    <td className="p-4">
                                        <p className="font-semibold text-foreground">{sale.client}</p>
                                        <p className="text-xs text-muted-foreground">{sale.pet}</p>
                                    </td>
                                    <td className="p-4 font-medium text-foreground">{sale.service}</td>
                                    <td className="p-4 text-muted-foreground">{sale.date}</td>
                                    <td className="p-4 text-right font-semibold text-foreground">{sale.value}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center">
                                            <span className={cn(
                                                "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
                                                statusStyle[sale.status]
                                            )}>
                                                <StatusIcon status={sale.status} />
                                                {sale.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button className="text-muted-foreground hover:text-primary p-2 transition-all opacity-0 group-hover:opacity-100 rounded-md hover:bg-muted/50">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground bg-muted/10 gap-4">
                    <span>Mostrando <strong className="text-foreground">5</strong> de <strong className="text-foreground">41</strong> resultados</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-background border border-border/50 hover:bg-muted/50 font-medium transition-colors disabled:opacity-50" disabled>Anterior</button>
                        <button className="px-4 py-2 rounded-lg bg-background border border-border/50 hover:bg-muted/50 font-medium transition-colors">Próximo</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
