'use client';

import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '@/lib/apiClient';
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
import AppointmentModal from '@/components/AppointmentModal';

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const COLORS = [
    { color: 'bg-[#7AAACE]', border: 'border-[#7AAACE]/30', light: 'bg-[#7AAACE]/5' },
    { color: 'bg-emerald-500', border: 'border-emerald-500/30', light: 'bg-emerald-500/5' },
    { color: 'bg-amber-500', border: 'border-amber-500/30', light: 'bg-amber-500/5' },
    { color: 'bg-rose-500', border: 'border-rose-500/30', light: 'bg-rose-500/5' },
    { color: 'bg-[#355872]', border: 'border-[#355872]/30', light: 'bg-[#355872]/5' },
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
    const [appointments, setAppointments] = useState<any[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [isApptModalOpen, setIsApptModalOpen] = useState(false);
    const [editingAppt, setEditingAppt] = useState<any>(undefined);
    const [selectedDateForNewAppt, setSelectedDateForNewAppt] = useState<Date | undefined>(undefined);

    useEffect(() => {
        fetchStaff();
        fetchAppointments();
    }, [config?.id, currentDate]);

    const fetchStaff = async () => {
        try {
            const res = await apiClient.get(`/api/staff`);
            const mapped = res.data.map((s: any, i: number) => ({
                ...s,
                ...COLORS[i % COLORS.length]
            }));
            setProfessionals(mapped);
        } catch (error) {
            console.error('Error fetching staff for agenda:', error);
        }
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const formattedDate = currentDate.toISOString().split('T')[0];
            const res = await apiClient.get(`/api/appointments?date=${formattedDate}`);
            setAppointments(res.data);
        } catch (error) {
            console.error('Error fetching appointments for agenda:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextDay = () => {
        const next = new Date(currentDate);
        next.setDate(currentDate.getDate() + 1);
        setCurrentDate(next);
    };

    const prevDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(currentDate.getDate() - 1);
        setCurrentDate(prev);
    };

    const today = () => setCurrentDate(new Date());

    const formattedDisplayDate = new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(currentDate);

    // Real stats from today's appointments
    const stats = useMemo(() => {
        const confirmed = appointments.filter(a => ['SCHEDULED', 'RECEPTION'].includes(a.status)).length;
        const done = appointments.filter(a => a.status === 'DONE').length;
        const now = new Date();
        const late = appointments.filter(a => {
            if (!a.scheduled_at || a.status === 'DONE') return false;
            return new Date(a.scheduled_at) < now && !['DONE', 'READY'].includes(a.status);
        }).length;
        return { confirmed, done, late };
    }, [appointments]);

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
                    <h2 className="text-2xl font-heading font-black tracking-tight text-[#355872] dark:text-white flex items-center gap-3">
                        <CalendarIcon className="text-[#7AAACE]" size={28} />
                        Agenda Semanal
                    </h2>
                    <p className="text-sm text-[#355872]/60 mt-1 font-medium">
                        Coordene os atendimentos com uma visão premium da sua operação.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="flex bg-white dark:bg-slate-900/50 border border-[#E4E9D5] dark:border-white/5 p-1 rounded-2xl gap-1 shadow-sm">
                        <button
                            onClick={() => setView('grid')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                view === 'grid' ? "bg-[#355872] text-white shadow-lg" : "text-[#355872]/60 hover:text-[#355872]"
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                view === 'list' ? "bg-[#355872] text-white shadow-lg" : "text-[#355872]/60 hover:text-[#355872]"
                            )}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900/50 border border-[#E4E9D5] dark:border-white/5 rounded-2xl text-xs font-bold text-[#355872] dark:text-slate-300 hover:bg-[#E4E9D5]/30 transition-all shadow-sm">
                        <Filter size={16} className="text-[#7AAACE]" /> Filtros
                    </button>
                    <button
                        onClick={() => {
                            setEditingAppt(undefined);
                            setSelectedDateForNewAppt(currentDate);
                            setIsApptModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-8 py-2.5 bg-[#7AAACE] hover:bg-[#355872] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#7AAACE]/20 hover:shadow-[#355872]/20 transition-all duration-300">
                        <Plus size={18} /> Novo Agendamento
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-0">
                {view === 'grid' ? (
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
                        {/* Calendar Grid */}
                        <div className="xl:col-span-3 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col rounded-2xl shadow-xl">
                            {/* Toolbar */}
                            <div className="p-6 border-b border-[#E4E9D5] dark:border-white/5 flex items-center justify-between flex-wrap gap-4 bg-[#F7F8F0]/80 dark:bg-slate-900/40 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg font-heading font-black text-[#355872] dark:text-white capitalize">{formattedDisplayDate}</h3>
                                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800/50 border border-[#E4E9D5] dark:border-white/5 p-1 rounded-xl shadow-sm">
                                        <button onClick={prevDay} className="p-1.5 hover:bg-[#7AAACE]/10 rounded-lg transition-colors text-[#355872]/40 hover:text-[#7AAACE]">
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button onClick={today} className="px-3 py-1 hover:bg-[#7AAACE]/10 rounded-lg transition-colors text-[#355872] dark:text-slate-300 text-[10px] font-black uppercase tracking-widest hover:text-[#7AAACE]">
                                            Hoje
                                        </button>
                                        <button onClick={nextDay} className="p-1.5 hover:bg-[#7AAACE]/10 rounded-lg transition-colors text-[#355872]/40 hover:text-[#7AAACE]">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    {professionals.map(p => (
                                        <div key={p.name} className="flex items-center gap-2">
                                            <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", p.color)} />
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{p.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Time Grid Scrollable Area */}
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                <div className="min-w-[800px]">
                                    {/* Header row */}
                                    <div className="grid grid-cols-[100px_1fr_1fr_1fr] border-b border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/60 font-medium text-xs text-slate-500 dark:text-slate-400 sticky top-0 z-20">
                                        <div className="p-4 border-r border-slate-200 dark:border-white/5 text-center">Horário</div>
                                        {professionals.map(p => (
                                            <div key={p.name} className="p-4 border-r border-slate-200 dark:border-white/5 last:border-r-0 text-center">
                                                {p.name}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Time Slots */}
                                    <div className="relative">
                                        {timeSlots.map(time => (
                                            <div key={time} className="grid grid-cols-[100px_1fr_1fr_1fr] border-b border-slate-100 dark:border-white/5 last:border-b-0 min-h-[120px]">
                                                <div className="p-4 border-r border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-slate-900/20 text-xs font-medium text-slate-400 dark:text-slate-500 flex items-start justify-center pt-4 tabular-nums">
                                                    {time}
                                                </div>
                                                {professionals.map(p => {
                                                    const appts = appointments.filter(a => {
                                                        if (!a.scheduled_at || a.staff?.name !== p.name) return false;
                                                        const reqHours = new Date(a.scheduled_at).getHours().toString().padStart(2, '0');
                                                        const reqMins = new Date(a.scheduled_at).getMinutes() === 0 ? '00' : '30';
                                                        return `${reqHours}:${reqMins}` === time;
                                                    });

                                                    return (
                                                        <div key={p.name} className="p-2 border-r border-slate-100 dark:border-white/5 last:border-r-0 relative group transition-colors hover:bg-primary/5">
                                                            {appts.map(a => {
                                                                const start = new Date(a.scheduled_at);
                                                                const end = a.end_time ? new Date(a.end_time) : new Date(start.getTime() + 60 * 60000); // default 1h
                                                                const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

                                                                return (
                                                                    <div
                                                                        key={a.id}
                                                                        style={{ height: `calc(${durationHours * 120}px - 16px)` }}
                                                                        onClick={() => {
                                                                            setEditingAppt(a);
                                                                            setIsApptModalOpen(true);
                                                                        }}
                                                                        className={cn(
                                                                            "absolute top-2 left-2 right-2 z-10 p-3 rounded-3xl border border-[#E4E9D5] dark:border-white/5 shadow-xl shadow-black/5 dark:shadow-black/20 transition-all cursor-pointer group/item bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl hover:scale-[1.02] hover:shadow-2xl hover:border-[#7AAACE]/50"
                                                                        )}
                                                                    >
                                                                        <div className={cn("absolute left-0 top-0 bottom-0 w-2 opacity-80 rounded-l-3xl", p.color)} />

                                                                        <div className="flex justify-between items-start gap-2 mb-2 pl-2">
                                                                            <h4 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover/item:text-primary transition-colors">{a.pet?.name || 'Sem Pet'}</h4>
                                                                            <span className={cn(
                                                                                "text-[10px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap",
                                                                                statusBadgeClass[a.status] || "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 shadow-sm"
                                                                            )}>
                                                                                {a.status}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate pl-2">{a.pet?.customer?.name || 'Cliente'}</p>
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 border-t border-white/5 pt-2 pl-2 mt-auto">
                                                                            <ArrowRight size={12} className="text-indigo-400" />
                                                                            {a.pet?.breed || 'Sem Raça'}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                            {/* Hover: add appointment */}
                                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                                                <button
                                                                    onClick={() => {
                                                                        const selectedDt = new Date(currentDate);
                                                                        const [h = '0', m = '0'] = time.split(':');
                                                                        selectedDt.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
                                                                        setSelectedDateForNewAppt(selectedDt);
                                                                        setEditingAppt(undefined);
                                                                        setIsApptModalOpen(true);
                                                                    }}
                                                                    className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30 shadow-lg pointer-events-auto">
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
                            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border-l-4 border-l-primary border border-slate-200 dark:border-white/5 shadow-lg">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center justify-between">
                                    Resumo da Operação
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Confirmados', value: stats.confirmed, color: 'text-slate-900 dark:text-white' },
                                        { label: 'Finalizados', value: stats.done, color: 'text-emerald-600 dark:text-emerald-400' },
                                        { label: 'Em Atraso', value: stats.late, color: 'text-rose-600 dark:text-rose-400' },
                                    ].map(item => (
                                        <div key={item.label} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 p-4 rounded-xl flex justify-between items-center group hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all shadow-sm">
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                                            <span className={cn("font-heading font-bold text-xl tabular-nums", item.color)}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-primary/5 dark:bg-indigo-500/5 p-6 rounded-2xl relative overflow-hidden group border border-primary/10 dark:border-indigo-500/10 shadow-sm">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 dark:bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                                <h4 className="text-sm font-semibold text-primary dark:text-indigo-400 mb-4 flex items-center gap-2">
                                    <Clock size={16} />
                                    Lembrete da Equipe
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic relative z-10">
                                    "Confirmar agendamentos de amanhã via canal WhatsApp até o fechamento."
                                </p>
                            </div>

                            {/* Next appointments */}
                            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl flex-1 min-h-[300px] border border-slate-200 dark:border-white/5 shadow-lg">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">Fila de Entrada</h4>
                                <div className="space-y-4">
                                    {appointments.slice(0, 5).map(a => {
                                        const date = new Date(a.scheduled_at);
                                        const timeLabel = `${date.getHours().toString().padStart(2, '0')}H${date.getMinutes() === 0 ? '' : '30'}`;
                                        return (
                                            <div
                                                key={a.id}
                                                onClick={() => {
                                                    setEditingAppt(a);
                                                    setIsApptModalOpen(true);
                                                }}
                                                className="flex items-center gap-4 group cursor-pointer border-b border-slate-100 dark:border-white/5 pb-4 last:border-0 hover:border-primary/30 dark:hover:border-indigo-500/30 transition-colors">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary dark:group-hover:text-indigo-400 group-hover:border-primary/30 transition-all tabular-nums shadow-sm">
                                                    {timeLabel}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-200 truncate group-hover:text-primary transition-colors">{a.pet?.name}</p>
                                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                                        {a.pet?.customer?.name} · {a.staff?.name || 'N/A'}
                                                    </p>
                                                </div>
                                                <div className={cn(
                                                    "w-1.5 h-6 rounded-full shrink-0",
                                                    a.status === 'RECEPTION' ? 'bg-primary dark:bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : a.status === 'SCHEDULED' ? 'bg-slate-300 dark:bg-slate-500' : 'bg-emerald-500'
                                                )} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* List view */
                    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/10 overflow-hidden rounded-2xl shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40">
                                    <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <th className="p-5">Horário</th>
                                        <th className="p-5">Pet / Raça</th>
                                        <th className="p-5">Tutor Responsável</th>
                                        <th className="p-5">Equipe</th>
                                        <th className="p-5 text-center">Status Atual</th>
                                        <th className="p-5" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {appointments.map(a => {
                                        const prof = professionals.find(p => p.id === a.staff_id);
                                        const date = new Date(a.scheduled_at);
                                        const timeLabel = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                                        return (
                                            <tr
                                                key={a.id}
                                                onClick={() => {
                                                    setEditingAppt(a);
                                                    setIsApptModalOpen(true);
                                                }}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-primary">
                                                <td className="p-5 font-semibold text-sm tabular-nums text-slate-700 dark:text-slate-300">{timeLabel}</td>
                                                <td className="p-5">
                                                    <p className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-200 group-hover:text-primary transition-colors">{a.pet?.name}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{a.pet?.breed}</p>
                                                </td>
                                                <td className="p-5 font-medium text-sm text-slate-700 dark:text-slate-300">{a.pet?.customer?.name}</td>
                                                <td className="p-5">
                                                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        <div className={cn("w-2 h-2 rounded-full", prof?.color || "bg-slate-300 dark:bg-slate-700")} />
                                                        {a.staff?.name || 'Não atribuído'}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex justify-center">
                                                        <span className={cn(
                                                            "text-xs font-medium px-3 py-1 rounded-full border whitespace-nowrap shadow-sm",
                                                            a.status === 'Confirmado' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                                                a.status === 'CheckedIn' ? 'bg-primary/5 dark:bg-indigo-500/10 text-primary dark:text-indigo-400 border-primary/20 dark:border-indigo-500/20' :
                                                                    "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10"
                                                        )}>
                                                            {a.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
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

            {isApptModalOpen && (
                <AppointmentModal
                    isOpen={isApptModalOpen}
                    onClose={() => setIsApptModalOpen(false)}
                    onSuccess={() => {
                        setIsApptModalOpen(false);
                        fetchAppointments();
                    }}
                    targetDate={selectedDateForNewAppt}
                    initialData={editingAppt}
                />
            )}
        </div>
    );
}
