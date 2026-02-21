'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter,
    LayoutGrid,
    List,
    Calendar as CalendarIcon,
    Clock,
    User,
    ArrowRight,
    Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';

import { API } from '@/config';

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const appointments = [
    { id: 1, pet: 'Pipoca', breed: 'Poodle', owner: 'Amanda Martins', professional: 'Ricardo', time: '08:00', duration: 2, status: 'CheckedIn' },
    { id: 2, pet: 'Thor', breed: 'Beagle', owner: 'João Costa', professional: 'Dr. Silva', time: '10:00', duration: 1, status: 'Confirmado' },
    { id: 3, pet: 'Luna', breed: 'Persa', owner: 'Regina Silva', professional: 'Mariana', time: '09:00', duration: 1.5, status: 'Concluído' },
];

const COLORS = [
    { color: 'bg-primary', border: 'border-primary/30', light: 'bg-primary/5' },
    { color: 'bg-emerald-500', border: 'border-emerald-500/30', light: 'bg-emerald-500/5' },
    { color: 'bg-amber-500', border: 'border-amber-500/30', light: 'bg-amber-500/5' },
    { color: 'bg-rose-500', border: 'border-rose-500/30', light: 'bg-rose-500/5' },
    { color: 'bg-indigo-500', border: 'border-indigo-500/30', light: 'bg-indigo-500/5' },
];

const statusBadgeClass: Record<string, string> = {
    CheckedIn: 'bg-primary/10 text-primary border-primary/20',
    Confirmado: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Concluído: 'bg-muted/50 text-muted-foreground border-border',
};

export default function AgendaPage() {
    const { config } = useTenant();
    const tenantId = config?.id;
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tenantId) fetchStaff();
    }, [tenantId]);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/api/staff?tenantId=${tenantId}`);
            const mapped = res.data.map((s: any, i: number) => ({
                ...s,
                ...COLORS[i % COLORS.length]
            }));
            setProfessionals(mapped);
        } catch (error) {
            console.error('Error fetching staff for agenda:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && professionals.length === 0) return (
        <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] gap-4 text-muted-foreground">
            <Activity className="animate-pulse text-primary" size={48} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Synchronizing Agenda Nodes...</span>
        </div>
    );

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 uppercase">
                        <CalendarIcon className="text-primary" size={28} />
                        Agenda Global
                    </h1>
                    <p className="text-muted-foreground mt-1 text-[10px] font-black uppercase tracking-widest italic opacity-70">
                        Sincronização de Nodes e Procedimentos em Tempo Real.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="flex bg-muted/20 border border-border p-1 rounded-sm gap-1">
                        <button
                            onClick={() => setView('grid')}
                            className={cn(
                                "p-2 rounded-sm transition-all",
                                view === 'grid' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                "p-2 rounded-sm transition-all",
                                view === 'list' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-muted/20 border border-border rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-muted/30 transition-colors">
                        <Filter size={16} /> FILTROS
                    </button>
                    <button className="flex items-center gap-2 px-8 py-2 bg-primary text-primary-foreground rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Plus size={18} /> NOVO AGENDAMENTO
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-0">
                {view === 'grid' ? (
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
                        {/* Calendar Grid */}
                        <div className="xl:col-span-3 hud-card overflow-hidden flex flex-col">
                            {/* Toolbar */}
                            <div className="p-6 border-b border-border/50 flex items-center justify-between flex-wrap gap-4 bg-muted/5">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg font-black uppercase tracking-tight">20 de Fevereiro, 2026</h3>
                                    <div className="flex items-center gap-1 bg-muted/30 border border-border/50 p-1 rounded-sm">
                                        <button className="p-1.5 hover:bg-primary/20 rounded-sm transition-colors text-muted-foreground hover:text-primary">
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button className="p-1.5 hover:bg-primary/20 rounded-sm transition-colors text-muted-foreground hover:text-primary">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    {professionals.map(p => (
                                        <div key={p.name} className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", p.color)} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{p.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Time Grid Scrollable Area */}
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                <div className="min-w-[800px]">
                                    {/* Header row */}
                                    <div className="grid grid-cols-[100px_1fr_1fr_1fr] border-b border-border/50 bg-muted/10 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky top-0 z-20">
                                        <div className="p-4 border-r border-border/50 text-center bg-muted/10">Horário</div>
                                        {professionals.map(p => (
                                            <div key={p.name} className="p-4 border-r border-border/50 last:border-r-0 text-center bg-muted/10">
                                                {p.name}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Time Slots */}
                                    <div className="relative">
                                        {timeSlots.map(time => (
                                            <div key={time} className="grid grid-cols-[100px_1fr_1fr_1fr] border-b border-border/30 last:border-b-0 min-h-[120px]">
                                                <div className="p-4 border-r border-border/50 bg-muted/5 text-[11px] font-black text-muted-foreground flex items-start justify-center pt-4 tabular-nums">
                                                    {time}
                                                </div>
                                                {professionals.map(p => {
                                                    const appts = appointments.filter(
                                                        a => a.time === time && a.professional === p.name
                                                    );
                                                    return (
                                                        <div key={p.name} className="p-2 border-r border-border/30 last:border-r-0 relative group transition-colors hover:bg-primary/[0.01]">
                                                            {appts.map(a => (
                                                                <div
                                                                    key={a.id}
                                                                    style={{ height: `calc(${a.duration * 120}px - 16px)` }}
                                                                    className={cn(
                                                                        "absolute top-2 left-2 right-2 z-10 p-4 rounded-sm border shadow-xl transition-all cursor-pointer group/item",
                                                                        p.border, p.light
                                                                    )}
                                                                >
                                                                    <div className="flex justify-between items-start gap-2 mb-2">
                                                                        <h4 className="font-black text-xs uppercase tracking-tight group-hover/item:text-primary transition-colors">{a.pet}</h4>
                                                                        <span className={cn(
                                                                            "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border whitespace-nowrap",
                                                                            statusBadgeClass[a.status] || "bg-muted text-muted-foreground"
                                                                        )}>
                                                                            {a.status}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-3 truncate">{a.owner}</p>
                                                                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] border-t border-border/30 pt-3">
                                                                        <ArrowRight size={10} className="text-primary" />
                                                                        {a.breed}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {/* Hover: add appointment */}
                                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                                                <button className="w-8 h-8 rounded-sm bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30 shadow-2xl">
                                                                    <Plus size={16} className="text-primary" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar panel */}
                        <div className="space-y-6 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-2">
                            <div className="hud-card p-6 border-l-4 border-primary">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center justify-between">
                                    Resumo da Operação
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Confirmados', value: '12', color: 'text-foreground' },
                                        { label: 'Finalizados', value: '08', color: 'text-emerald-500' },
                                        { label: 'Em Atraso', value: '02', color: 'text-red-500' },
                                    ].map(item => (
                                        <div key={item.label} className="bg-muted/10 border border-border/50 p-4 rounded-sm flex justify-between items-center group hover:bg-muted/20 transition-all">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                                            <span className={cn("font-black text-xl tabular-nums", item.color)}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="hud-card p-6 bg-primary/[0.03] border-border/50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                <h4 className="text-[10px] font-black text-primary mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <Clock size={14} />
                                    Node de Lembrete
                                </h4>
                                <p className="text-[11px] font-black text-muted-foreground leading-relaxed uppercase tracking-widest opacity-80 italic">
                                    "Confirmar agendamentos de amanhã via canal WhatsApp até o fechamento."
                                </p>
                            </div>

                            {/* Next appointments */}
                            <div className="hud-card p-6 border-border/50 flex-1 min-h-[300px]">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Fila de Entrada</h4>
                                <div className="space-y-4">
                                    {appointments.map(a => (
                                        <div key={a.id} className="flex items-center gap-4 group cursor-pointer border-b border-border/30 pb-4 last:border-0 hover:border-primary/50 transition-colors">
                                            <div className="w-12 h-12 rounded-sm bg-muted/20 border border-border flex items-center justify-center shrink-0 text-[11px] font-black text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/50 transition-all tabular-nums">
                                                {a.time.split(':')[0]}H
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-black text-xs uppercase tracking-tight truncate group-hover:text-primary transition-colors">{a.pet}</p>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate opacity-60 mt-1">
                                                    {a.owner} · {a.professional}
                                                </p>
                                            </div>
                                            <div className={cn(
                                                "w-1.5 h-6 rounded-full shrink-0",
                                                a.status === 'CheckedIn' ? 'bg-primary' : a.status === 'Confirmado' ? 'bg-emerald-500' : 'bg-muted'
                                            )} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* List view */
                    <div className="hud-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-border/50 bg-muted/10">
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                                        <th className="p-5">HORÁRIO</th>
                                        <th className="p-5">PET / RAÇA</th>
                                        <th className="p-5">TUTOR RESPONSÁVEL</th>
                                        <th className="p-5">PROFISSIONAL / NODE</th>
                                        <th className="p-5 text-center">STATUS ATUAL</th>
                                        <th className="p-5" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {appointments.map(a => {
                                        const prof = professionals.find(p => p.name === a.professional);
                                        return (
                                            <tr key={a.id} className="hover:bg-primary/[0.02] transition-colors group cursor-pointer border-l-2 border-transparent hover:border-primary">
                                                <td className="p-5 font-black text-xs tabular-nums text-muted-foreground">{a.time}</td>
                                                <td className="p-5">
                                                    <p className="font-black text-xs uppercase tracking-tight group-hover:text-primary transition-colors">{a.pet}</p>
                                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60 italic">{a.breed}</p>
                                                </td>
                                                <td className="p-5 font-black text-[10px] uppercase tracking-wide">{a.owner}</td>
                                                <td className="p-5">
                                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                                        <div className={cn("w-2 h-2 rounded-full", prof?.color || "bg-muted")} />
                                                        {a.professional}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex justify-center">
                                                        <span className={cn(
                                                            "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border whitespace-nowrap",
                                                            statusBadgeClass[a.status] || "bg-muted text-muted-foreground"
                                                        )}>
                                                            {a.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button className="p-2 text-muted-foreground/30 hover:text-primary transition-colors">
                                                        <User size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
