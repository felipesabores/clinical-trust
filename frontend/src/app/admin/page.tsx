import {
    TrendingUp,
    Users,
    Clock,
    CheckCircle2,
    ChevronRight,
    MoreVertical,
    Scissors,
    Droplets,
    CalendarDays,
    Video,
} from 'lucide-react';

const stats = [
    { label: 'Faturamento Hoje', value: 'R$ 1.240,00', change: '+12%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Pets Atendidos', value: '24', change: '+4', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Novos Clientes', value: '3', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Média de Espera', value: '15 min', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
];

interface PetCardData {
    name: string;
    owner: string;
    breed?: string;
    time?: string;
    service?: string;
    status?: string;
    iconType?: string;
    iconColor?: string;
}

const statusColumns: { title: string; pets: PetCardData[]; indicatorColor: string }[] = [
    {
        title: 'Agendados',
        indicatorColor: 'bg-slate-400',
        pets: [
            { name: 'Luna', owner: 'Maria Silva', time: '14:30', service: 'Banho', breed: 'Poodle' },
            { name: 'Pipoca', owner: 'João Costa', time: '15:15', service: 'Tosa', breed: 'Poodle' },
        ],
    },
    {
        title: 'Na Recepção',
        indicatorColor: 'bg-blue-400',
        pets: [
            { name: 'Thor', owner: 'Carla Dias', time: '14:00', service: 'Check-up', breed: 'Beagle' },
        ],
    },
    {
        title: 'No Banho',
        indicatorColor: 'bg-indigo-400',
        pets: [
            { name: 'Biscuit', owner: 'Ana Paula', status: 'Secando', iconType: 'droplets', iconColor: 'text-blue-500', breed: 'SRD' },
            { name: 'Max', owner: 'Pedro H.', status: 'Limpando orelhas', iconType: 'droplets', iconColor: 'text-blue-500', breed: 'Poodle' },
        ],
    },
    {
        title: 'Na Tosa',
        indicatorColor: 'bg-amber-400',
        pets: [
            { name: 'Mel', owner: 'Luiza M.', status: 'Finalizando', iconType: 'scissors', iconColor: 'text-amber-500', breed: 'Yorkshire' },
        ],
    },
    {
        title: 'Prontos',
        indicatorColor: 'bg-emerald-500',
        pets: [],
    },
];

function PetIcon({ type, color }: { type?: string | undefined; color?: string | undefined }) {
    const cls = color ?? 'text-slate-400';
    if (type === 'scissors') return <Scissors size={12} className={cls} />;
    if (type === 'droplets') return <Droplets size={12} className={cls} />;
    return <Clock size={12} className="text-slate-400" />;
}

export default function DashboardPage() {
    const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Operacional</h1>
                    <p className="text-muted-foreground mt-1">Bem-vindo de volta! Status atual da boutique.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-xl text-sm font-medium shadow-sm">
                        <CalendarDays size={18} className="text-muted-foreground" />
                        Hoje, {today}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Video size={18} />
                        Ao Vivo
                    </button>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-card p-6 rounded-3xl border shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start">
                            <div className={`${stat.bg} p-3 rounded-2xl ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            {stat.change && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <h3 className="text-2xl font-black mt-1 tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Kanban preview */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {statusColumns.map((column, i) => (
                    <div key={i} className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${column.indicatorColor}`} />
                                {column.title}
                                <span className="bg-muted text-[10px] px-1.5 py-0.5 rounded-full">
                                    {column.pets.length}
                                </span>
                            </h4>
                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="space-y-4 min-h-[420px] bg-slate-50/50 p-3 rounded-[2rem] border border-dashed border-slate-200">
                            {column.pets.map((pet, j) => (
                                <div
                                    key={j}
                                    className="bg-card p-5 rounded-2xl border shadow-sm cursor-grab active:scale-95 transition-all group hover:border-primary/50 hover:shadow-md"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h5 className="font-bold text-lg group-hover:text-primary transition-colors">{pet.name}</h5>
                                            <p className="text-xs text-muted-foreground font-medium italic">{pet.breed}</p>
                                        </div>
                                        <button className="text-muted-foreground hover:bg-muted p-1 rounded-lg transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-white shrink-0">
                                            {pet.owner[0]}
                                        </div>
                                        <span className="text-xs font-semibold truncate">{pet.owner}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-lg border border-slate-100">
                                            <PetIcon type={pet.iconType} color={pet.iconColor} />
                                            <span className="text-[10px] font-bold uppercase tracking-tight">
                                                {pet.time ?? pet.status ?? pet.service}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {column.pets.length === 0 && (
                                <div className="h-24 flex items-center justify-center">
                                    <p className="text-xs text-muted-foreground italic">Vazio</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
