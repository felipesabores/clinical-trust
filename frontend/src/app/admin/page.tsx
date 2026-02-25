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
import { apiClient } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { cn } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';



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
    SCHEDULED: { title: 'Agendados', color: 'bg-[#7AAACE]', icon: Clock },
    RECEPTION: { title: 'Recepção', color: 'bg-[#355872]', icon: Users },
    BATHING: { title: 'Banho', color: 'bg-[#9CD5FF]', icon: Droplets },
    DRYING: { title: 'Secagem', color: 'bg-amber-400', icon: Wind },
    GROOMING: { title: 'Tosa', color: 'bg-emerald-500', icon: Scissors },
    READY: { title: 'Prontos', color: 'bg-rose-500', icon: CheckCircle2 },
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
        try {
            const [finRes, staffRes] = await Promise.all([
                apiClient.get(`/api/transactions/stats`),
                apiClient.get(`/api/staff`)
            ]);

            setDashStats([
                { label: 'Saldo Líquido', value: `R$ ${finRes.data.balance.toLocaleString('pt-BR')}`, change: '+0%', icon: TrendingUp },
                { label: 'Pets no Fluxo', value: Object.values(kanbanData).flat().length.toString(), change: '+0', icon: CheckCircle2 },
                { label: 'Total Entradas', value: `R$ ${finRes.data.total_income.toLocaleString('pt-BR')}`, icon: TrendingUp },
                { label: 'Equipe Ativa', value: staffRes.data.filter((s: any) => s.is_active).length.toString(), icon: Users },
            ]);
        } catch (error) {
            logger.error('Dashboard', 'Erro ao buscar stats', error);
        }
    };

    const fetchKanban = async () => {
        try {
            const res = await apiClient.get(`/api/appointments/kanban`);
            setKanbanData(res.data);
        } catch (error) {
            logger.error('Dashboard', 'Erro ao buscar kanban', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCameras = async () => {
        try {
            const res = await apiClient.get(`/api/cameras`);
            setCameras(res.data || []);
        } catch (error) {
            logger.error('Dashboard', 'Erro ao buscar cameras', error);
        }
    };

    const updateStatus = async (appId: string, newStatus: string, cameraId?: string) => {
        try {
            await apiClient.patch(`/api/appointments/${appId}/status`, {
                status: newStatus,
                camera_id: cameraId || undefined
            });
            fetchKanban();
        } catch (error) {
            logger.error('Dashboard', 'Erro ao atualizar status', error);
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
        <div className="p-4 sm:p-6 lg:p-0 space-y-8 flex flex-col min-h-screen lg:min-h-0 min-w-0 overflow-x-hidden">
            {/* Page Action Header (Sub-header since global App Bar handles the main title) */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-[#355872] dark:text-white">Visão Geral</h2>
                    <p className="text-sm text-[#355872]/60 mt-1 font-medium italic">Bem-vindo(a) ao seu workspace do <span className="text-[#7AAACE] font-bold">Vivid Stream</span>.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900/50 border border-[#E4E9D5] dark:border-white/5 rounded-2xl text-xs font-bold text-[#355872] dark:text-slate-300 shadow-sm backdrop-blur-md w-full sm:w-auto justify-center">
                        <CalendarDays size={16} className="text-[#7AAACE]" />
                        {today}
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 shrink-0">
                {dashStats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-[#E4E9D5] dark:border-white/5 p-6 rounded-3xl group transition-all duration-300 hover:border-[#7AAACE]/30 shadow-sm hover:shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-[#7AAACE]/10 p-2.5 rounded-xl text-[#355872] shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <stat.icon size={20} />
                            </div>
                            {stat.change && (
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-400/20">
                                    {stat.change} ↑
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-[#355872]/50 dark:text-slate-400 truncate uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-heading font-black mt-1 text-[#355872] dark:text-white tracking-tighter truncate" title={stat.value}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar flex-1 min-h-0">
                    {loading ? (
                        <div className="w-full flex flex-col items-center justify-center py-20 text-indigo-400 gap-4">
                            <Loader2 className="animate-spin" size={40} />
                            <span className="text-sm font-medium animate-pulse text-slate-400">Sincronizando Workspace...</span>
                        </div>
                    ) : (
                        (Object.keys(COLUMN_CONFIG) as (keyof typeof COLUMN_CONFIG)[]).map((status) => {
                            const config = COLUMN_CONFIG[status];
                            if (!config) return null;
                            const isLiveColumn = status === 'BATHING' || status === 'GROOMING';

                            return (
                                <div key={status} className="flex-shrink-0 w-[320px] flex flex-col h-full">
                                    <div className="flex flex-col gap-3 px-1 mb-4 shrink-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-2 h-2 rounded-full shadow-sm", config.color)} />
                                                <h4 className="font-heading font-extrabold text-sm text-[#355872] dark:text-slate-200 uppercase tracking-tight">{config.title}</h4>
                                                <span className="text-[10px] font-bold text-[#355872] dark:text-indigo-300 bg-[#7AAACE]/20 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-[#7AAACE]/30 dark:border-indigo-500/20">
                                                    {kanbanData[status]?.length || 0}
                                                </span>
                                            </div>
                                            {isLiveColumn && <Video size={16} className="text-primary dark:text-indigo-400/50" />}
                                        </div>

                                        {isLiveColumn && (
                                            <div className="relative group/select">
                                                <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-hover/select:text-indigo-400 transition-colors" />
                                                <select
                                                    id={`cam-select-${status}`}
                                                    className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-lg text-xs pl-9 pr-4 py-2 text-slate-600 dark:text-slate-300 font-medium outline-none focus:border-primary/50 dark:focus:border-indigo-500/50 focus:bg-slate-50 dark:focus:bg-slate-800/80 transition-all appearance-none cursor-pointer shadow-sm"
                                                    onChange={(e) => {
                                                        (window as any)[`selected_cam_${status}`] = e.target.value;
                                                    }}
                                                >
                                                    <option value="">Detecção Automática</option>
                                                    {cameras.map(cam => (
                                                        <option key={cam.id} value={cam.id}>{cam.name}</option>
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
                                                    "flex-1 space-y-3 p-3 rounded-3xl border border-transparent transition-all overflow-y-auto custom-scrollbar-thin bg-[#E4E9D5]/30 dark:bg-slate-900/20 backdrop-blur-sm",
                                                    snapshot.isDraggingOver && "bg-[#7AAACE]/10 border-[#7AAACE]/20 ring-1 ring-inset ring-[#7AAACE]/10"
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
                                                                    "bg-white dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-[#E4E9D5] dark:border-white/5 shadow-sm group transition-all relative overflow-hidden",
                                                                    snapshot.isDragging ? "shadow-2xl shadow-[#7AAACE]/20 scale-105 rotate-1 ring-2 ring-[#7AAACE] border-[#7AAACE] z-50 bg-white dark:bg-slate-800" : "hover:border-[#7AAACE]/50 hover:shadow-md"
                                                                )}
                                                            >
                                                                {/* Side Color Indicator matching Column */}
                                                                <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-50", config.color)} />

                                                                <div className="flex justify-between items-start mb-3">
                                                                    <div className="min-w-0 pr-2 pl-2">
                                                                        <h5 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{app.pet.name}</h5>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                                                            {app.pet.breed || 'SRD'}
                                                                        </p>
                                                                    </div>
                                                                    {app.access_token ? (
                                                                        <div className="flex items-center gap-1.5 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 shrink-0">
                                                                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                                                            <span className="text-[10px] font-medium text-rose-500 tracking-wide">AO VIVO</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">
                                                                            {(() => {
                                                                                const Icon = COLUMN_CONFIG[status]?.icon || Clock;
                                                                                return <Icon size={16} />;
                                                                            })()}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center gap-3 pl-2 mb-4">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center text-xs font-semibold text-primary dark:text-indigo-300 border border-primary/20 group-hover:border-primary/40 transition-colors shrink-0">
                                                                        {app.pet.customer.name[0]?.toUpperCase() || '?'}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{app.pet.customer.name}</p>
                                                                        <p className="text-[10px] text-slate-500">Tutor Responsável</p>
                                                                    </div>
                                                                </div>

                                                                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 pl-2">
                                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                        <Clock size={12} className="text-slate-400 dark:text-slate-500" />
                                                                        {new Date(app.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                                    </div>

                                                                    {app.access_token ? (
                                                                        <div className="flex gap-1.5">
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); handleCopyToken(app.access_token!, app.id); }}
                                                                                className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-primary/20 hover:text-primary border border-slate-200 dark:border-white/5 rounded-md transition-all text-slate-600 dark:text-slate-400"
                                                                                title="Copiar Link"
                                                                            >
                                                                                {copiedId === app.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); handleWhatsAppShare(app); }}
                                                                                className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 rounded-md text-emerald-600 dark:text-emerald-400 transition-all font-semibold"
                                                                                title="Enviar WhatsApp"
                                                                            >
                                                                                <MessageCircle size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <button className="text-slate-400 dark:text-slate-500 hover:text-primary p-1 transition-colors">
                                                                            <MoreVertical size={16} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                {(!kanbanData[status] || kanbanData[status].length === 0) && (
                                                    <div className="h-24 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl opacity-50">
                                                        <p className="text-xs font-medium text-slate-500 mb-1">Nenhum pet aqui</p>
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
