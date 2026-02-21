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
    { label: 'Faturamento Hoje', value: 'R$ 1.240,00', change: '+12%', icon: TrendingUp },
    { label: 'Pets Atendidos', value: '24', change: '+4', icon: CheckCircle2 },
    { label: 'Novos Clientes', value: '3', icon: Users },
    { label: 'Média de Espera', value: '15 min', icon: Clock },
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
        indicatorColor: 'bg-sky-400',
        pets: [
            { name: 'Thor', owner: 'Carla Dias', time: '14:00', service: 'Check-up', breed: 'Beagle' },
        ],
    },
    {
        title: 'No Banho',
        indicatorColor: 'bg-blue-500',
        pets: [
            { name: 'Biscuit', owner: 'Ana Paula', status: 'Secando', iconType: 'droplets', iconColor: 'text-blue-500', breed: 'SRD' },
            { name: 'Max', owner: 'Pedro H.', status: 'Limpando orelhas', iconType: 'droplets', iconColor: 'text-blue-500', breed: 'Poodle' },
        ],
    },
    {
        title: 'Na Tosa',
        indicatorColor: 'bg-emerald-600',
        pets: [
            { name: 'Mel', owner: 'Luiza M.', status: 'Finalizando', iconType: 'scissors', iconColor: 'text-emerald-600', breed: 'Yorkshire' },
        ],
    },
    {
        title: 'Prontos',
        indicatorColor: 'bg-green-500',
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
                    <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Dashboard <span className="text-primary">Operacional</span></h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground mt-2 opacity-60">SISTEMA DE GESTÃO CLÍNICA v1.0.4</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-sm text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <CalendarDays size={14} className="text-primary" />
                        HOJE // {today}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        <Video size={14} />
                        AO VIVO
                    </button>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="hud-card p-6 rounded-sm group overflow-visible">
                        <div className="flex justify-between items-start">
                            <div className="bg-primary/10 p-3 rounded-sm text-primary ring-1 ring-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                                <stat.icon size={20} />
                            </div>
                            {stat.change && (
                                <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-tighter">
                                    {stat.change} ↑
                                </span>
                            )}
                        </div>
                        <div className="mt-6">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-black mt-2 tracking-tighter">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Kanban preview */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {statusColumns.map((column, i) => (
                    <div key={i} className="space-y-4">
                        <div className="flex items-center justify-between px-2 mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-1 h-4 rounded-full ${column.indicatorColor} opacity-80`} />
                                <h4 className="font-black text-xs uppercase tracking-tighter text-muted-foreground">{column.title}</h4>
                                <span className="text-[10px] font-black text-primary/60">
                                    {column.pets.length}
                                </span>
                            </div>
                            <button className="text-muted-foreground hover:text-foreground transition-all">
                                <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="space-y-4 min-h-[420px] bg-muted/20 dark:bg-card/30 p-3 rounded-sm border border-dashed border-border dark:border-primary/10">
                            {column.pets.map((pet, j) => (
                                <div
                                    key={j}
                                    className="hud-card p-5 cursor-grab active:scale-95 group"
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
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border border-border shrink-0">
                                            {pet.owner[0]}
                                        </div>
                                        <span className="text-xs font-semibold truncate">{pet.owner}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-lg border border-border">
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
