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
        <div className="p-8 space-y-8 bg-background/50 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
                        <ShoppingCart className="text-primary" size={28} />
                        Transações Financeiras
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Monitoramento de fluxo de caixa e histórico de operações.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold shadow-md hover:bg-primary/90 transition-all">
                    <Plus size={18} /> Nova Venda
                </button>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="glass-panel p-6 flex flex-col justify-between bg-card text-foreground">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-4">{s.label}</p>
                            <h3 className="text-2xl font-bold tracking-tight">{s.value}</h3>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                            {s.change ? (
                                <span className={cn(
                                    "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md",
                                    s.up ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'
                                )}>
                                    <ArrowUpRight size={14} className={s.up ? '' : 'rotate-90'} />
                                    {s.change} vs ref
                                </span>
                            ) : <div />}
                            {s.label === 'Meta do Mês' && (
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full w-[68%] bg-primary" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="glass-panel overflow-hidden bg-card border-border/50">
                <div className="p-6 border-b border-border/50 flex items-center gap-4 flex-wrap bg-muted/20">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Pesquisar transação, tutor ou pet..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border/50 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors text-foreground">
                            <Filter size={16} /> Filtros
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border/50 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors text-foreground">
                            <TrendingUp size={16} /> Exportar
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
