'use client';

import { useState, useEffect } from 'react';
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
    Loader2,
    Wind,
    MessageCircle,
    Copy,
    Check,
    Share2,
    ExternalLink,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Appointment {
    id: string;
    status: string;
    scheduled_at: string;
    access_token?: string;
    pet: {
        name: string;
        breed: string;
        customer: {
            name: string;
            phone: string;
        };
    };
}

const COLUMN_CONFIG: Record<string, { title: string; color: string; icon: any }> = {
    SCHEDULED: { title: 'Agendados', color: 'bg-slate-400', icon: Clock },
    RECEPTION: { title: 'Recepção', color: 'bg-sky-400', icon: Users },
    BATHING: { title: 'Banho', color: 'bg-blue-500', icon: Droplets },
    DRYING: { title: 'Secagem', color: 'bg-amber-400', icon: Wind },
    GROOMING: { title: 'Tosa', color: 'bg-emerald-600', icon: Scissors },
    READY: { title: 'Prontos', color: 'bg-green-500', icon: CheckCircle2 },
};

export default function DashboardPage() {
    const { config } = useTenant();
    const tenantId = config?.id;
    const [kanbanData, setKanbanData] = useState<Record<string, Appointment[]>>({});
    const [cameras, setCameras] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [dashStats, setDashStats] = useState([
        { label: 'Faturamento Hoje', value: 'R$ 0,00', change: '+0%', icon: TrendingUp },
        { label: 'Pets Atendidos', value: '0', change: '+0', icon: CheckCircle2 },
        { label: 'Novos Clientes', value: '0', icon: Users },
        { label: 'Equipe Ativa', value: '0', icon: Users },
    ]);

    useEffect(() => {
        setMounted(true);
        if (tenantId) {
            fetchKanban();
            fetchCameras();
            fetchStats();
        }

        // Polling for updates
        const interval = setInterval(() => {
            if (tenantId) fetchKanban();
        }, 15000);
        return () => clearInterval(interval);
    }, [tenantId]);

    const fetchStats = async () => {
        if (!tenantId) return;
        try {
            const [finRes, staffRes] = await Promise.all([
                axios.get(`${API}/api/transactions/stats?tenantId=${tenantId}`),
                axios.get(`${API}/api/staff?tenantId=${tenantId}`)
            ]);

            setDashStats([
                { label: 'Saldo Líquido', value: `R$ ${finRes.data.balance.toLocaleString('pt-BR')}`, change: '+0%', icon: TrendingUp },
                { label: 'Pets no Fluxo', value: Object.values(kanbanData).flat().length.toString(), change: '+0', icon: CheckCircle2 },
                { label: 'Total Entradas', value: `R$ ${finRes.data.total_income.toLocaleString('pt-BR')}`, icon: TrendingUp },
                { label: 'Equipe Ativa', value: staffRes.data.filter((s: any) => s.is_active).length.toString(), icon: Users },
            ]);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const fetchKanban = async () => {
        if (!tenantId) return;
        try {
            const res = await axios.get(`${API}/api/appointments/kanban?tenantId=${tenantId}`);
            setKanbanData(res.data);
        } catch (error) {
            console.error('Failed to fetch kanban', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCameras = async () => {
        if (!tenantId) return;
        try {
            const res = await axios.get(`${API}/api/cameras?tenantId=${tenantId}`);
            setCameras(res.data || []);
        } catch (error) {
            console.error('Failed to fetch cameras', error);
        }
    };

    const updateStatus = async (appId: string, newStatus: string, cameraId?: string) => {
        try {
            await axios.patch(`${API}/api/appointments/${appId}/status`, {
                status: newStatus,
                camera_id: cameraId || undefined
            });
            fetchKanban(); // Refresh to get access token if generated
        } catch (error) {
            console.error('Failed to update status', error);
            fetchKanban();
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Optimistic UI update
        const sourceData = Array.from(kanbanData[source.droppableId] || []);
        const destData = source.droppableId === destination.droppableId
            ? sourceData
            : Array.from(kanbanData[destination.droppableId] || []);

        const [movedItem] = sourceData.splice(source.index, 1);
        if (!movedItem) return;

        movedItem.status = destination.droppableId;
        destData.splice(destination.index, 0, movedItem);

        const newData = {
            ...kanbanData,
            [source.droppableId]: sourceData,
            [destination.droppableId]: destData
        };

        setKanbanData(newData);

        // Get selected camera for this column if any
        const selectedCam = (window as any)[`selected_cam_${destination.droppableId}`];
        updateStatus(draggableId, destination.droppableId, selectedCam);
    };

    const handleCopyToken = (token: string, appId: string) => {
        const url = `${window.location.host}/live/${token}`;
        navigator.clipboard.writeText(`https://${url}`);
        setCopiedId(appId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleWhatsAppShare = (app: Appointment) => {
        const url = `${window.location.host}/live/${app.access_token}`;
        const message = `Olá! O procedimento do pet ${app.pet.name} já começou. Você pode acompanhar ao vivo aqui: https://${url}`;
        window.open(`https://wa.me/${app.pet.customer.phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

    if (!mounted) return null;

    return (
        <div className="p-8 space-y-8 min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-end flex-wrap gap-4 shrink-0">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Dashboard <span className="text-primary">Operacional</span></h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground mt-2 opacity-60 italic">SISTEMA DE GESTÃO BANHO E TOSA v1.0.5</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-6 py-2 bg-muted/20 border border-border/50 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <CalendarDays size={14} className="text-primary" />
                        NODE // {today}
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
                {dashStats.map((stat, i) => (
                    <div key={i} className="hud-card p-6 rounded-sm group overflow-visible border border-border/50 bg-gradient-to-br from-white to-muted/5">
                        <div className="flex justify-between items-start">
                            <div className="bg-primary/5 p-3 rounded-sm text-primary ring-1 ring-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.05)]">
                                <stat.icon size={20} />
                            </div>
                            {stat.change && (
                                <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20 uppercase tracking-widest">
                                    {stat.change} ↑
                                </span>
                            )}
                        </div>
                        <div className="mt-6">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                            <h3 className="text-3xl font-black mt-2 tracking-tighter tabular-nums">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar flex-1 min-h-0">
                    {loading ? (
                        <div className="w-full flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                            <Loader2 className="animate-spin text-primary" size={40} />
                            <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Sincronizando Fluxo de Trabalho...</span>
                        </div>
                    ) : (
                        (Object.keys(COLUMN_CONFIG) as (keyof typeof COLUMN_CONFIG)[]).map((status) => {
                            const config = COLUMN_CONFIG[status];
                            if (!config) return null;
                            const isLiveColumn = status === 'BATHING' || status === 'GROOMING';

                            return (
                                <div key={status} className="flex-shrink-0 w-[300px] flex flex-col h-full">
                                    <div className="flex flex-col gap-3 px-2 mb-4 shrink-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-1.5 h-4 rounded-full", config.color.replace('bg-', 'bg-'))} />
                                                <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{config.title}</h4>
                                                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-sm border border-primary/20">
                                                    {kanbanData[status]?.length || 0}
                                                </span>
                                            </div>
                                            {isLiveColumn && <Video size={14} className="text-primary/30" />}
                                        </div>

                                        {isLiveColumn && (
                                            <div className="relative group/select">
                                                <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover/select:text-primary transition-colors" size={12} />
                                                <select
                                                    id={`cam-select-${status}`}
                                                    className="w-full bg-muted/20 border border-border/50 rounded-sm text-[9px] pl-8 pr-4 py-2 text-muted-foreground font-black uppercase tracking-widest outline-none focus:border-primary/50 focus:bg-muted/40 transition-all appearance-none cursor-pointer"
                                                    onChange={(e) => {
                                                        (window as any)[`selected_cam_${status}`] = e.target.value;
                                                    }}
                                                >
                                                    <option value="">AUTODETECT CAMERA</option>
                                                    {cameras.map(cam => (
                                                        <option key={cam.id} value={cam.id}>{cam.name.toUpperCase()}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <Droppable droppableId={status}>
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={cn(
                                                    "flex-1 space-y-4 p-4 rounded-sm border border-dashed transition-all overflow-y-auto custom-scrollbar-thin",
                                                    snapshot.isDraggingOver ? "bg-primary/[0.04] border-primary/40 ring-4 ring-primary/[0.02]" : "bg-muted/5 border-border/30"
                                                )}
                                            >
                                                {kanbanData[status]?.map((app, index) => (
                                                    <Draggable key={app.id} draggableId={app.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={cn(
                                                                    "hud-card p-5 group transition-all relative",
                                                                    snapshot.isDragging ? "shadow-2xl scale-105 rotate-1 ring-2 ring-primary border-primary bg-background z-50" : "hover:border-primary/40"
                                                                )}
                                                            >
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <div className="min-w-0 pr-2">
                                                                        <h5 className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors truncate">{app.pet.name}</h5>
                                                                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60 italic truncate border-l-2 border-primary/20 pl-2">
                                                                            {app.pet.breed || 'SRD'}
                                                                        </p>
                                                                    </div>
                                                                    {app.access_token ? (
                                                                        <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-sm border border-red-500/20 shrink-0">
                                                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                                                            <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">LIVE FEED</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="p-1.5 bg-muted/30 rounded-sm text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                                                                            {(() => {
                                                                                const Icon = COLUMN_CONFIG[status]?.icon || Clock;
                                                                                return <Icon size={14} />;
                                                                            })()}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center gap-3 mb-5">
                                                                    <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center text-[10px] font-black text-muted-foreground border border-border group-hover:border-primary/30 group-hover:text-primary transition-all shrink-0">
                                                                        {app.pet.customer.name[0]?.toUpperCase() || '?'}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-[10px] font-black uppercase tracking-tight truncate opacity-80">{app.pet.customer.name}</p>
                                                                        <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40">Tutor Responsável</p>
                                                                    </div>
                                                                </div>

                                                                <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-2">
                                                                    <div className="flex items-center gap-2 px-2 py-1 bg-muted/10 rounded-sm border border-border/30 text-[9px] font-black uppercase tracking-widest text-muted-foreground tabular-nums">
                                                                        <Clock size={10} className="text-primary/50" />
                                                                        {new Date(app.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                                    </div>

                                                                    {app.access_token ? (
                                                                        <div className="flex gap-1">
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); handleCopyToken(app.access_token!, app.id); }}
                                                                                className="p-1.5 bg-muted/30 hover:bg-primary/20 hover:text-primary border border-border/30 rounded-sm transition-all"
                                                                                title="Copiar Link"
                                                                            >
                                                                                {copiedId === app.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); handleWhatsAppShare(app); }}
                                                                                className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 rounded-sm text-emerald-500 transition-all"
                                                                                title="Enviar WhatsApp"
                                                                            >
                                                                                <MessageCircle size={12} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <button className="text-muted-foreground/30 hover:text-primary p-1.5 transition-all">
                                                                            <MoreVertical size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                {(!kanbanData[status] || kanbanData[status].length === 0) && (
                                                    <div className="h-24 flex flex-col items-center justify-center border border-dashed border-border/10 rounded-sm opacity-20">
                                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-1">Standby</p>
                                                        <div className="w-8 h-[1px] bg-muted-foreground/50" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })
                    )}
                </div>
            </DragDropContext>
        </div>
    );
}
