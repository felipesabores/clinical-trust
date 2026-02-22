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
        <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] gap-4 text-indigo-400">
            <Activity className="animate-pulse" size={48} />
            <span className="text-sm font-medium animate-pulse text-slate-400">Carregando Agenda...</span>
        </div>
    );

    return (
        <div className="space-y-8 flex flex-col h-full">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-heading font-semibold tracking-tight text-white flex items-center gap-3">
                        <CalendarIcon className="text-indigo-400" size={24} />
                        Agenda
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Gerencie os agendamentos e horários da sua equipe.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="flex bg-slate-900/50 border border-white/5 p-1 rounded-lg gap-1">
                        <button
                            onClick={() => setView('grid')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                view === 'grid' ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" : "text-slate-400 hover:text-white"
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                view === 'list' ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" : "text-slate-400 hover:text-white"
                            )}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                        <Filter size={16} /> Filtros
                    </button>
                    <button className="flex items-center gap-2 px-8 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all">
                        <Plus size={18} /> Novo Agendamento
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-0">
                {view === 'grid' ? (
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
                        {/* Calendar Grid */}
                        <div className="xl:col-span-3 glass-panel overflow-hidden flex flex-col rounded-2xl">
                            {/* Toolbar */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4 bg-slate-900/40">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg font-heading font-semibold text-white">20 de Fevereiro, 2026</h3>
                                    <div className="flex items-center gap-1 bg-slate-800/50 border border-white/5 p-1 rounded-lg">
                                        <button className="p-1.5 hover:bg-indigo-500/20 rounded-md transition-colors text-slate-400 hover:text-indigo-300">
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button className="p-1.5 hover:bg-indigo-500/20 rounded-md transition-colors text-slate-400 hover:text-indigo-300">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    {professionals.map(p => (
                                        <div key={p.name} className="flex items-center gap-2">
                                            <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", p.color)} />
                                            <span className="text-xs font-medium text-slate-400">{p.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Time Grid Scrollable Area */}
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                <div className="min-w-[800px]">
                                    {/* Header row */}
                                    <div className="grid grid-cols-[100px_1fr_1fr_1fr] border-b border-white/5 bg-slate-900/60 font-medium text-xs text-slate-400 sticky top-0 z-20">
                                        <div className="p-4 border-r border-white/5 text-center">Horário</div>
                                        {professionals.map(p => (
                                            <div key={p.name} className="p-4 border-r border-white/5 last:border-r-0 text-center">
                                                {p.name}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Time Slots */}
                                    <div className="relative">
                                        {timeSlots.map(time => (
                                            <div key={time} className="grid grid-cols-[100px_1fr_1fr_1fr] border-b border-white/5 last:border-b-0 min-h-[120px]">
                                                <div className="p-4 border-r border-white/5 bg-slate-900/20 text-xs font-medium text-slate-500 flex items-start justify-center pt-4 tabular-nums">
                                                    {time}
                                                </div>
                                                {professionals.map(p => {
                                                    const appts = appointments.filter(
                                                        a => a.time === time && a.professional === p.name
                                                    );
                                                    return (
                                                        <div key={p.name} className="p-2 border-r border-white/5 last:border-r-0 relative group transition-colors hover:bg-indigo-500/5">
                                                            {appts.map(a => (
                                                                <div
                                                                    key={a.id}
                                                                    style={{ height: `calc(${a.duration * 120}px - 16px)` }}
                                                                    className={cn(
                                                                        "absolute top-2 left-2 right-2 z-10 p-3 rounded-xl border border-white/5 shadow-md shadow-black/20 transition-all cursor-pointer group/item bg-slate-800/90 backdrop-blur-md hover:scale-[1.02] hover:shadow-lg",
                                                                        // fallback style if colors undefined
                                                                    )}
                                                                >
                                                                    <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-50 rounded-l-xl", p.color)} />

                                                                    <div className="flex justify-between items-start gap-2 mb-2 pl-2">
                                                                        <h4 className="font-heading font-semibold text-sm text-slate-100 group-hover/item:text-indigo-400 transition-colors">{a.pet}</h4>
                                                                        <span className={cn(
                                                                            "text-[10px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap",
                                                                            statusBadgeClass[a.status] || "bg-slate-800 text-slate-400 border-white/10"
                                                                        )}>
                                                                            {a.status}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-400 mb-2 truncate pl-2">{a.owner}</p>
                                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 border-t border-white/5 pt-2 pl-2 mt-auto">
                                                                        <ArrowRight size={12} className="text-indigo-400" />
                                                                        {a.breed}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {/* Hover: add appointment */}
                                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                                                <button className="w-8 h-8 rounded-full bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center border border-indigo-500/30 shadow-lg pointer-events-auto">
                                                                    <Plus size={16} className="text-indigo-400" />
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
                            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-indigo-500">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6 flex items-center justify-between">
                                    Resumo da Operação
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Confirmados', value: '12', color: 'text-white' },
                                        { label: 'Finalizados', value: '08', color: 'text-emerald-400' },
                                        { label: 'Em Atraso', value: '02', color: 'text-rose-400' },
                                    ].map(item => (
                                        <div key={item.label} className="bg-slate-900/40 border border-white/5 p-4 rounded-xl flex justify-between items-center group hover:bg-slate-800/60 transition-all">
                                            <span className="text-xs font-medium text-slate-400">{item.label}</span>
                                            <span className={cn("font-heading font-bold text-xl tabular-nums", item.color)}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-panel p-6 rounded-2xl bg-indigo-500/5 relative overflow-hidden group border-indigo-500/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                                <h4 className="text-sm font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                                    <Clock size={16} />
                                    Lembrete da Equipe
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                                    "Confirmar agendamentos de amanhã via canal WhatsApp até o fechamento."
                                </p>
                            </div>

                            {/* Next appointments */}
                            <div className="glass-panel p-6 rounded-2xl flex-1 min-h-[300px]">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">Fila de Entrada</h4>
                                <div className="space-y-4">
                                    {appointments.map(a => (
                                        <div key={a.id} className="flex items-center gap-4 group cursor-pointer border-b border-white/5 pb-4 last:border-0 hover:border-indigo-500/30 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center shrink-0 text-xs font-semibold text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all tabular-nums">
                                                {a.time.split(':')[0]}H
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-heading font-semibold text-sm text-slate-200 truncate group-hover:text-indigo-400 transition-colors">{a.pet}</p>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                                    {a.owner} · {a.professional}
                                                </p>
                                            </div>
                                            <div className={cn(
                                                "w-1.5 h-6 rounded-full shrink-0",
                                                a.status === 'CheckedIn' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : a.status === 'Confirmado' ? 'bg-emerald-500' : 'bg-slate-700'
                                            )} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* List view */
                    <div className="glass-panel overflow-hidden rounded-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-white/5 bg-slate-900/40">
                                    <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        <th className="p-5">Horário</th>
                                        <th className="p-5">Pet / Raça</th>
                                        <th className="p-5">Tutor Responsável</th>
                                        <th className="p-5">Equipe</th>
                                        <th className="p-5 text-center">Status Atual</th>
                                        <th className="p-5" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {appointments.map(a => {
                                        const prof = professionals.find(p => p.name === a.professional);
                                        return (
                                            <tr key={a.id} className="hover:bg-slate-800/40 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-indigo-500">
                                                <td className="p-5 font-semibold text-sm tabular-nums text-slate-300">{a.time}</td>
                                                <td className="p-5">
                                                    <p className="font-heading font-semibold text-sm text-slate-200 group-hover:text-indigo-400 transition-colors">{a.pet}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{a.breed}</p>
                                                </td>
                                                <td className="p-5 font-medium text-sm text-slate-300">{a.owner}</td>
                                                <td className="p-5">
                                                    <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                                        <div className={cn("w-2 h-2 rounded-full", prof?.color || "bg-slate-700")} />
                                                        {a.professional}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex justify-center">
                                                        <span className={cn(
                                                            "text-xs font-medium px-3 py-1 rounded-full border whitespace-nowrap",
                                                            a.status === 'Confirmado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                                a.status === 'CheckedIn' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                                    "bg-slate-800 text-slate-400 border-white/10"
                                                        )}>
                                                            {a.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button className="p-2 text-slate-500 hover:text-indigo-400 transition-colors">
                                                        <User size={16} />
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
