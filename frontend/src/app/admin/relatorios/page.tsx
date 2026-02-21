import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    ShoppingCart,
    Star,
    ArrowUpRight,
    Calendar,
} from 'lucide-react';

const kpis = [
    { label: 'Receita Total', value: 'R$ 18.420', change: '+18%', up: true, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Clientes Ativos', value: '142', change: '+7', up: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Serviços Realizados', value: '387', change: '+42', up: true, icon: ShoppingCart, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'NPS Score', value: '94', change: '-2', up: false, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const topServices = [
    { name: 'Banho + Tosa', count: 148, pct: 38, revenue: 'R$ 7.400' },
    { name: 'Banho Simples', count: 112, pct: 29, revenue: 'R$ 4.480' },
    { name: 'Tosa Higiênica', count: 73, pct: 19, revenue: 'R$ 2.920' },
    { name: 'Consulta', count: 31, pct: 8, revenue: 'R$ 2.480' },
    { name: 'Outros', count: 23, pct: 6, revenue: 'R$ 1.140' },
];

const months = ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev'];
const revenueData = [12400, 14200, 13800, 16500, 15900, 18420];
const maxRevenue = Math.max(...revenueData);

export default function RelatoriosPage() {
    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <BarChart3 className="text-primary" size={28} />
                        Relatórios
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium italic">
                        Análise de performance e tendências do negócio.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-card border rounded-xl text-sm font-medium shadow-sm">
                    <Calendar size={16} className="text-muted-foreground" />
                    Últimos 6 meses
                </div>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {kpis.map((k, i) => (
                    <div key={i} className="bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${k.bg} p-3 rounded-2xl ${k.color}`}>
                                <k.icon size={22} />
                            </div>
                            <span className={`flex items-center gap-0.5 text-xs font-bold ${k.up ? 'text-emerald-600' : 'text-red-500'}`}>
                                {k.up ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
                                {k.change}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">{k.label}</p>
                        <h3 className="text-2xl font-black tracking-tight mt-1">{k.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Bar chart */}
                <div className="lg:col-span-3 bg-card border rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="font-bold text-lg">Receita Mensal</h3>
                            <p className="text-xs text-muted-foreground mt-1">Evolução dos últimos 6 meses</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black">R$ 18.420</p>
                            <p className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1">
                                <ArrowUpRight size={12} /> +18% vs mês anterior
                            </p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="flex items-end gap-3 h-48">
                        {revenueData.map((val, i) => {
                            const height = (val / maxRevenue) * 100;
                            const isLast = i === revenueData.length - 1;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full flex flex-col justify-end" style={{ height: '180px' }}>
                                        <div
                                            className={`w-full rounded-2xl transition-all ${isLast ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-muted group-hover:bg-primary/30'}`}
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground">{months[i]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top services */}
                <div className="lg:col-span-2 bg-card border rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="font-bold text-lg mb-6">Top Serviços</h3>
                    <div className="space-y-5">
                        {topServices.map(s => (
                            <div key={s.name}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold">{s.name}</span>
                                    <div className="text-right">
                                        <p className="text-xs font-black">{s.revenue}</p>
                                        <p className="text-[10px] text-muted-foreground">{s.count} atend.</p>
                                    </div>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${s.pct}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">{s.pct}% do total</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
