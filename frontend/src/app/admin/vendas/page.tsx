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

const stats = [
    { label: 'Faturamento Hoje', value: 'R$ 1.240', change: '+12%', up: true },
    { label: 'Tickets Abertos', value: '7', change: '+2', up: false },
    { label: 'Ticket Médio', value: 'R$ 177', change: '+5%', up: true },
    { label: 'Meta do Mês', value: '68%', change: '', up: true },
];

const sales = [
    { id: '#0041', client: 'Maria Silva', pet: 'Luna', service: 'Banho + Tosa', value: 'R$ 180,00', status: 'Pago', date: '20/02 14:30' },
    { id: '#0040', client: 'João Costa', pet: 'Thor', service: 'Consulta', value: 'R$ 120,00', status: 'Pendente', date: '20/02 13:00' },
    { id: '#0039', client: 'Ana Paula', pet: 'Bella', service: 'Banho', value: 'R$ 90,00', status: 'Pago', date: '20/02 11:15' },
    { id: '#0038', client: 'Carlos Ramos', pet: 'Rex', service: 'Tosa Higiênica', value: 'R$ 65,00', status: 'Cancelado', date: '20/02 10:00' },
    { id: '#0037', client: 'Luiza Melo', pet: 'Mel', service: 'Banho + Tosa', value: 'R$ 200,00', status: 'Pago', date: '20/02 09:30' },
];

const statusStyle: Record<string, string> = {
    Pago: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Pendente: 'bg-amber-50 text-amber-700 border-amber-100',
    Cancelado: 'bg-red-50 text-red-500 border-red-100',
};

const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'Pago') return <CheckCircle2 size={12} />;
    if (status === 'Pendente') return <Clock size={12} />;
    return <XCircle size={12} />;
};

export default function VendasPage() {
    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <ShoppingCart className="text-primary" size={28} />
                        Vendas
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium italic">
                        Controle financeiro e histórico de transações.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <Plus size={18} /> Nova Venda
                </button>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-xs font-medium text-muted-foreground mb-2">{s.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-black tracking-tight">{s.value}</h3>
                            {s.change && (
                                <span className={`flex items-center gap-0.5 text-xs font-bold ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                                    <ArrowUpRight size={14} className={s.up ? '' : 'rotate-90'} />
                                    {s.change}
                                </span>
                            )}
                        </div>
                        {s.label === 'Meta do Mês' && (
                            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full w-[68%] bg-primary rounded-full" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-card border rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar venda, cliente ou pet..."
                            className="w-full pl-11 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl text-sm focus:border-primary/30 focus:bg-card outline-none transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 bg-card border rounded-2xl text-sm font-semibold hover:bg-accent transition-colors">
                        <Filter size={16} /> Filtros
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 bg-card border rounded-2xl text-sm font-semibold hover:bg-accent transition-colors">
                        <TrendingUp size={16} /> Exportar
                    </button>
                </div>

                <table className="w-full text-sm">
                    <thead className="border-b bg-muted/20">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <th className="text-left p-5">ID</th>
                            <th className="text-left p-5">Cliente / Pet</th>
                            <th className="text-left p-5">Serviço</th>
                            <th className="text-left p-5">Data</th>
                            <th className="text-right p-5">Valor</th>
                            <th className="text-center p-5">Status</th>
                            <th className="p-5" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {sales.map(sale => (
                            <tr key={sale.id} className="hover:bg-muted/20 transition-colors group cursor-pointer">
                                <td className="p-5 font-black text-muted-foreground text-xs tabular-nums">{sale.id}</td>
                                <td className="p-5">
                                    <p className="font-bold group-hover:text-primary transition-colors">{sale.client}</p>
                                    <p className="text-xs text-muted-foreground italic">{sale.pet}</p>
                                </td>
                                <td className="p-5 font-medium">{sale.service}</td>
                                <td className="p-5 text-xs text-muted-foreground tabular-nums">{sale.date}</td>
                                <td className="p-5 text-right font-black">{sale.value}</td>
                                <td className="p-5">
                                    <div className="flex justify-center">
                                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${statusStyle[sale.status]}`}>
                                            <StatusIcon status={sale.status} />
                                            {sale.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <button className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-5 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <span>Mostrando <strong className="text-foreground">5</strong> de <strong className="text-foreground">41</strong> transações</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-xl bg-muted hover:bg-accent font-bold transition-colors">← Anterior</button>
                        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold">Próximo →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
