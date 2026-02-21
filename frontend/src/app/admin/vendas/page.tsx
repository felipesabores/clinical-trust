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

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
    return (
        <div className="p-8 space-y-8 bg-background min-h-screen">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 uppercase">
                        <ShoppingCart className="text-primary" size={28} />
                        Transações Financeiras
                    </h1>
                    <p className="text-muted-foreground mt-1 text-[10px] font-black uppercase tracking-widest italic opacity-70">
                        Monitoramento de fluxo de caixa e histórico de operações.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-sm text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    <Plus size={18} /> INICIAR NOVA VENDA
                </button>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="hud-card p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 opacity-70">{s.label}</p>
                            <h3 className="text-2xl font-black tracking-tight">{s.value}</h3>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                            {s.change ? (
                                <span className={`flex items-center gap-0.5 text-[10px] font-black uppercase tracking-widest ${s.up ? 'text-emerald-500' : 'text-red-500'}`}>
                                    <ArrowUpRight size={12} className={s.up ? '' : 'rotate-90'} />
                                    {s.change} VS PREV
                                </span>
                            ) : <div />}
                            {s.label === 'Meta do Mês' && (
                                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full w-[68%] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="hud-card overflow-hidden">
                <div className="p-6 border-b border-border/50 flex items-center gap-4 flex-wrap bg-muted/10">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="PESQUISAR TRANSAÇÃO, TUTOR OU PET..."
                            className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-border/50 rounded-sm text-[10px] font-black uppercase tracking-widest focus:border-primary/50 focus:bg-muted/30 outline-none transition-all placeholder:text-muted-foreground/30"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-3 bg-muted/20 border border-border/50 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-muted/30 transition-colors">
                            <Filter size={14} /> FILTROS AVANÇADOS
                        </button>
                        <button className="flex items-center gap-2 px-4 py-3 bg-muted/20 border border-border/50 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-muted/30 transition-colors">
                            <TrendingUp size={14} /> EXPORTAR DATASET
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                                <th className="p-5">ID OPERAÇÃO</th>
                                <th className="p-5">CLIENTE / PET</th>
                                <th className="p-5">PRODUTO / SERVIÇO</th>
                                <th className="p-5">DATA/HORA</th>
                                <th className="p-5 text-right">VALOR BRUTO</th>
                                <th className="p-5 text-center">STATUS</th>
                                <th className="p-5" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {sales.map(sale => (
                                <tr key={sale.id} className="hover:bg-primary/[0.02] transition-colors group cursor-pointer border-l-2 border-transparent hover:border-primary">
                                    <td className="p-5 font-black text-muted-foreground text-[10px] tabular-nums opacity-50">{sale.id}</td>
                                    <td className="p-5">
                                        <p className="font-black text-xs uppercase tracking-tight group-hover:text-primary transition-colors">{sale.client}</p>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60 italic">{sale.pet}</p>
                                    </td>
                                    <td className="p-5 font-black text-[10px] uppercase tracking-wide">{sale.service}</td>
                                    <td className="p-5 text-[10px] font-black text-muted-foreground tabular-nums uppercase">{sale.date}</td>
                                    <td className="p-5 text-right font-black text-xs tabular-nums">{sale.value}</td>
                                    <td className="p-5">
                                        <div className="flex justify-center">
                                            <span className={cn(
                                                "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border",
                                                statusStyle[sale.status]
                                            )}>
                                                <StatusIcon status={sale.status} />
                                                {sale.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button className="text-muted-foreground/30 hover:text-primary p-2 transition-all opacity-0 group-hover:opacity-100">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-border/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/5">
                    <span>MOSTRANDO <strong className="text-foreground">5</strong> DE <strong className="text-foreground">41</strong> ENTRADAS NO SISTEMA</span>
                    <div className="flex gap-2">
                        <button className="px-6 py-2 rounded-sm bg-muted/20 border border-border/50 hover:bg-muted/30 font-black transition-colors disabled:opacity-30" disabled>← ANTERIOR</button>
                        <button className="px-6 py-2 rounded-sm bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">PRÓXIMO →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
