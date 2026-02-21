'use client';

import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter,
    LayoutGrid,
    List,
    Calendar as CalendarIcon,
    Clock,
} from 'lucide-react';

const professionals = [
    { name: 'Dr. Silva', color: 'bg-blue-500', border: 'border-blue-300', light: 'bg-blue-500/10' },
    { name: 'Mariana', color: 'bg-pink-500', border: 'border-pink-300', light: 'bg-pink-500/10' },
    { name: 'Ricardo', color: 'bg-indigo-500', border: 'border-indigo-300', light: 'bg-indigo-500/10' },
];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const appointments = [
    { id: 1, pet: 'Pipoca', breed: 'Poodle', owner: 'Amanda Martins', professional: 'Ricardo', time: '08:00', duration: 2, status: 'CheckedIn' },
    { id: 2, pet: 'Thor', breed: 'Beagle', owner: 'João Costa', professional: 'Dr. Silva', time: '10:00', duration: 1, status: 'Confirmado' },
    { id: 3, pet: 'Luna', breed: 'Persa', owner: 'Regina Silva', professional: 'Mariana', time: '09:00', duration: 1.5, status: 'Concluído' },
];

const statusBadgeClass: Record<string, string> = {
    CheckedIn: 'bg-blue-100 text-blue-700',
    Confirmado: 'bg-emerald-100 text-emerald-700',
    Concluído: 'bg-slate-100 text-slate-500',
};

export default function AgendaPage() {
    const [view, setView] = useState<'grid' | 'list'>('grid');

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agenda Global</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium italic">
                        Controle total dos serviços de hoje.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="flex bg-card border rounded-2xl p-1 shrink-0 gap-1">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border rounded-2xl text-sm font-semibold hover:bg-accent transition-colors shadow-sm">
                        <Filter size={18} />
                        Filtros
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Plus size={18} />
                        Novo Agendamento
                    </button>
                </div>
            </header>

            {view === 'grid' ? (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Calendar Grid */}
                    <div className="xl:col-span-3 bg-card border rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                        {/* Toolbar */}
                        <div className="p-6 border-b flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-bold">20 de Fevereiro, 2026</h3>
                                <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
                                    <button className="p-1.5 hover:bg-card rounded-lg transition-colors">
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button className="p-1.5 hover:bg-card rounded-lg transition-colors">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                {professionals.map(p => (
                                    <div key={p.name} className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                                        <span className="text-xs font-bold text-muted-foreground">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Time Grid */}
                        <div className="flex-1 overflow-auto p-6">
                            <div className="relative border rounded-3xl overflow-hidden bg-slate-50/30">
                                {/* Header row */}
                                <div className="grid grid-cols-[80px_1fr_1fr_1fr] border-b bg-card font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
                                    <div className="p-4 border-r">Horário</div>
                                    {professionals.map(p => (
                                        <div key={p.name} className="p-4 border-r last:border-r-0 text-center">
                                            {p.name}
                                        </div>
                                    ))}
                                </div>

                                {/* Time Slots */}
                                {timeSlots.map(time => (
                                    <div key={time} className="grid grid-cols-[80px_1fr_1fr_1fr] border-b last:border-b-0 min-h-[100px]">
                                        <div className="p-4 border-r bg-card text-xs font-bold text-slate-400 flex items-start justify-center pt-4">
                                            {time}
                                        </div>
                                        {professionals.map(p => {
                                            const appts = appointments.filter(
                                                a => a.time === time && a.professional === p.name
                                            );
                                            return (
                                                <div key={p.name} className="p-1 border-r last:border-r-0 relative group min-h-[100px]">
                                                    {appts.map(a => (
                                                        <div
                                                            key={a.id}
                                                            style={{ height: `${a.duration * 100}px` }}
                                                            className={`absolute top-1 left-1 right-1 z-10 p-4 rounded-2xl border ${p.border} ${p.light} shadow-sm hover:shadow-md transition-all cursor-pointer`}
                                                        >
                                                            <div className="flex justify-between items-start gap-1 flex-wrap">
                                                                <h4 className="font-bold text-sm">{a.pet}</h4>
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${statusBadgeClass[a.status] ?? 'bg-muted text-muted-foreground'}`}>
                                                                    {a.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs font-medium text-muted-foreground mt-1">{a.owner}</p>
                                                            <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-muted-foreground uppercase">
                                                                <CalendarIcon size={12} />
                                                                {a.breed}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {/* Hover: add appointment */}
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                                        <div className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-lg border">
                                                            <Plus size={16} className="text-primary" />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar panel */}
                    <div className="space-y-6">
                        <div className="bg-card border rounded-[2rem] p-6 shadow-sm">
                            <h4 className="font-bold mb-4 flex items-center justify-between">
                                Resumo do Dia
                                <span className="text-[10px] text-muted-foreground underline decoration-primary underline-offset-4 cursor-pointer hover:text-primary transition-colors">
                                    Ver Detalhes
                                </span>
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'Confirmados', value: '12', className: 'bg-slate-50 border-slate-100 text-foreground' },
                                    { label: 'Finalizados', value: '08', className: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
                                    { label: 'Em Atraso', value: '02', className: 'bg-orange-50 border-orange-100 text-orange-600' },
                                ].map(item => (
                                    <div key={item.label} className={`flex justify-between items-center p-3 rounded-2xl border ${item.className}`}>
                                        <span className="text-sm font-medium">{item.label}</span>
                                        <span className="font-black text-lg">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-6">
                            <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                                <Clock size={16} />
                                Dica Operacional
                            </h4>
                            <p className="text-sm text-primary/70 leading-relaxed italic">
                                &quot;Lembre-se de confirmar os agendamentos de amanhã via WhatsApp até às 18h.&quot;
                            </p>
                        </div>

                        {/* Next appointments */}
                        <div className="bg-card border rounded-[2rem] p-6 shadow-sm space-y-4">
                            <h4 className="font-bold">Próximos</h4>
                            {appointments.map(a => (
                                <div key={a.id} className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center shrink-0 text-xs font-black text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        {a.time.split(':')[0]}h
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm truncate">{a.pet}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{a.owner} · {a.professional}</p>
                                    </div>
                                    <span className={`ml-auto text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shrink-0 ${statusBadgeClass[a.status] ?? 'bg-muted text-muted-foreground'}`}>
                                        {a.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* List view */
                <div className="bg-card border rounded-[2.5rem] shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/30">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                <th className="text-left p-5">Horário</th>
                                <th className="text-left p-5">Pet</th>
                                <th className="text-left p-5">Raça</th>
                                <th className="text-left p-5">Tutor</th>
                                <th className="text-left p-5">Profissional</th>
                                <th className="text-left p-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {appointments.map(a => {
                                const prof = professionals.find(p => p.name === a.professional);
                                return (
                                    <tr key={a.id} className="hover:bg-muted/30 transition-colors group cursor-pointer">
                                        <td className="p-5 font-bold tabular-nums">{a.time}</td>
                                        <td className="p-5 font-bold group-hover:text-primary transition-colors">{a.pet}</td>
                                        <td className="p-5 text-muted-foreground italic">{a.breed}</td>
                                        <td className="p-5 font-medium">{a.owner}</td>
                                        <td className="p-5">
                                            <span className={`flex items-center gap-1.5 text-xs font-bold`}>
                                                <span className={`w-2 h-2 rounded-full ${prof?.color ?? 'bg-slate-400'}`} />
                                                {a.professional}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${statusBadgeClass[a.status] ?? 'bg-muted text-muted-foreground'}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
