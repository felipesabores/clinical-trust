'use client';

import { useEffect, useState, useRef } from 'react';
import {
    Dog,
    Video,
    CheckCircle2,
    Clock,
    Kanban as KanbanIcon,
    GripVertical,
    Share2,
    MessageCircle,
    Copy,
    Check
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useTenant } from '@/context/TenantContext';
import { apiClient } from '@/lib/apiClient';
import { toast } from '@/lib/toast';
import logger from '@/lib/logger';

import AppointmentModal from '@/components/AppointmentModal';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const statuses = [
    { id: 'SCHEDULED', label: 'Agendados', color: 'bg-[#7AAACE]' },
    { id: 'RECEPTION', label: 'Recepção', color: 'bg-[#355872]' },
    { id: 'BATHING', label: 'Banho', color: 'bg-[#9CD5FF]' },
    { id: 'GROOMING', label: 'Tosa', color: 'bg-emerald-500' },
    { id: 'DRYING', label: 'Secagem', color: 'bg-amber-400' },
    { id: 'READY', label: 'Pronto', color: 'bg-rose-500' },
] as const;

export default function KanbanPage() {
    const [board, setBoard] = useState<Record<string, any[]>>({});
    const [cameras, setCameras] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const { config } = useTenant();

    // Track if a drag is in progress to avoid polling reset during drag
    const isDragging = useRef(false);

    const fetchKanban = async () => {
        // Don't refresh while user is dragging — prevents scroll reset
        if (isDragging.current) return;
        try {
            const res = await apiClient.get(`/api/appointments/kanban`);
            setBoard(res.data || {});
        } catch (e) {
            logger.error('Kanban', 'Erro ao carregar kanban', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCameras = async () => {
        try {
            const res = await apiClient.get(`/api/cameras`);
            setCameras(res.data || []);
        } catch (e) {
            logger.error('Kanban', 'Erro ao carregar câmeras', e);
        }
    };

    const updateStatus = async (appId: string, newStatus: string, cameraId?: string) => {
        try {
            await apiClient.patch(`/api/appointments/${appId}/status`, {
                status: newStatus,
                camera_id: cameraId || undefined,
            });
            // Only refresh to get access_token if generated (BATHING/GROOMING transitions)
            // Not triggered by drag (onDragEnd handles optimistic update already)
        } catch (e) {
            logger.error('Kanban', 'Erro ao atualizar status', e);
            // On error, refresh to restore correct state
            fetchKanban();
        }
    };

    const finishAppointment = async (appId: string) => {
        if (confirm('Tem certeza que deseja finalizar este atendimento?')) {
            try {
                // Optimistically remove from READY column
                const newBoard = { ...board };
                newBoard['READY'] = (newBoard['READY'] || []).filter((a: any) => a.id !== appId);
                setBoard(newBoard);
                await apiClient.patch(`/api/appointments/${appId}/status`, { status: 'DONE' });
                toast.success('Atendimento finalizado!');
            } catch (e) {
                logger.error('Kanban', 'Erro ao finalizar agendamento', e);
                toast.error('Erro ao finalizar atendimento');
                fetchKanban();
            }
        }
    };

    useEffect(() => {
        setIsMounted(true);
        fetchKanban();
        fetchCameras();
        const inter = setInterval(fetchKanban, 10000);
        return () => clearInterval(inter);
    }, []);

    // Re-fetch when config loads (first render may have no tenantId yet)
    useEffect(() => {
        if (config?.id) {
            fetchKanban();
            fetchCameras();
        }
    }, [config?.id]);

    const onDragStart = () => {
        isDragging.current = true;
    };

    const onDragEnd = (result: DropResult) => {
        isDragging.current = false;

        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Optimistic update — move card locally, NO fetchKanban to avoid scroll reset
        const newBoard = { ...board };
        const sourceList = [...(newBoard[source.droppableId] || [])];
        const destList = source.droppableId === destination.droppableId
            ? sourceList
            : [...(newBoard[destination.droppableId] || [])];

        const [movedItem] = sourceList.splice(source.index, 1);
        const updatedItem = { ...movedItem, status: destination.droppableId };
        destList.splice(destination.index, 0, updatedItem);

        newBoard[source.droppableId] = sourceList;
        newBoard[destination.droppableId] = destList;

        setBoard(newBoard);

        // If moving to BATHING/GROOMING, fetch after delay to get access_token
        const needsToken = destination.droppableId === 'BATHING' || destination.droppableId === 'GROOMING';

        const selectedCam = (window as any)[`selected_cam_${destination.droppableId}`];
        updateStatus(draggableId, destination.droppableId, selectedCam).then(() => {
            if (needsToken) {
                // Small delay then refresh just the moved card's column to get access_token
                setTimeout(() => fetchKanban(), 1500);
            }
        });
    };

    const handleCopyToken = (token: string, appId: string) => {
        const url = `${window.location.origin}/live/${token}`;
        navigator.clipboard.writeText(url);
        setCopiedId(appId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleWhatsAppShare = (app: any) => {
        const url = `${window.location.host}/live/${app.access_token}`;
        const clinicName = config?.name || 'Estética Pet';
        const message = `Olá! Aqui é da ${clinicName}. O banho do ${app.pet?.name} começou. Você pode acompanhar tudo ao vivo pelo link: https://${url}`;
        window.open(`https://wa.me/${app.pet?.customer?.phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (!isMounted) return null;

    return (
        <div className="p-8 h-screen flex flex-col bg-[#F7F8F0] dark:bg-slate-950 overflow-hidden">
            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchKanban}
            />

            <header className="flex justify-between items-center mb-10 shrink-0">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight text-[#355872] dark:text-white flex items-center gap-3">
                        <KanbanIcon className="text-[#7AAACE]" size={32} />
                        Fluxo Operacional
                    </h1>
                    <p className="text-[#355872]/60 font-medium mt-1">Monitore e gerencie o atendimento em tempo real com o <span className="text-[#7AAACE] font-bold">Vivid Stream</span>.</p>
                </div>

                <div className="flex gap-4">
                    <button className="bg-white dark:bg-slate-900/50 border border-[#E4E9D5] dark:border-white/5 px-6 py-2.5 rounded-2xl hover:bg-[#E4E9D5]/30 transition-all font-bold text-xs text-[#355872] flex items-center gap-2 shadow-sm">
                        <Video size={18} className="text-[#7AAACE]" /> Câmeras Ativas
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#7AAACE] hover:bg-[#355872] text-white px-8 py-2.5 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-[#7AAACE]/20"
                    >
                        NOVO AGENDAMENTO
                    </button>
                </div>
            </header>

            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="grid grid-cols-6 gap-5 flex-1 min-h-0 overflow-x-auto pb-4">
                    {statuses.map((status) => (
                        <div key={status.id} className="flex flex-col min-w-[260px] h-full">
                            <div className="flex flex-col gap-2 mb-4">
                                <div className="flex items-center gap-2 px-2">
                                    <div className={cn('w-2 h-2 rounded-full', status.color)} />
                                    <h3 className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">{status.label}</h3>
                                    <span className="bg-muted px-2 py-0.5 rounded-lg text-[10px] font-black text-muted-foreground ml-auto">
                                        {board[status.id]?.length || 0}
                                    </span>
                                </div>

                                {(status.id === 'BATHING' || status.id === 'GROOMING') && (
                                    <select
                                        id={`cam-select-${status.id}`}
                                        className="bg-muted/50 border border-border rounded-lg text-[10px] px-3 py-1.5 text-muted-foreground font-bold outline-none focus:border-primary/50 mx-2"
                                        onChange={(e) => {
                                            (window as any)[`selected_cam_${status.id}`] = e.target.value;
                                        }}
                                    >
                                        <option value="">Câmera Automática...</option>
                                        {cameras.map(cam => (
                                            <option key={cam.id} value={cam.id}>{cam.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <Droppable droppableId={status.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={cn(
                                            "flex-1 bg-[#E4E9D5]/20 dark:bg-slate-900/40 rounded-[2.5rem] p-3 overflow-y-auto custom-scrollbar-thin border border-[#E4E9D5] dark:border-white/5 border-dashed space-y-4 transition-all duration-300",
                                            snapshot.isDraggingOver && "bg-[#7AAACE]/5 border-[#7AAACE]/30 scale-[1.01]"
                                        )}
                                    >
                                        {board[status.id]?.map((app: any, index: number) => (
                                            <Draggable key={app.id} draggableId={app.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={cn(
                                                            "bg-white dark:bg-slate-800/80 backdrop-blur-md border border-[#E4E9D5] dark:border-white/5 p-4 rounded-3xl shadow-sm group hover:border-[#7AAACE]/50 transition-all hover:shadow-xl relative overflow-hidden",
                                                            snapshot.isDragging && "shadow-2xl border-[#7AAACE] ring-2 ring-[#7AAACE]/20 scale-105 z-50 bg-white"
                                                        )}
                                                    >
                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#7AAACE]/5 to-transparent rounded-bl-full pointer-events-none" />
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <div {...provided.dragHandleProps} className="text-muted-foreground/30 hover:text-primary transition-colors cursor-grab active:cursor-grabbing">
                                                                    <GripVertical size={16} />
                                                                </div>
                                                                <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
                                                                    <Dog size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                                                </div>
                                                            </div>
                                                            {app.access_token && (
                                                                <div className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">
                                                                    <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                                                                    <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">LIVE</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <h4 className="font-bold text-base mb-0.5">{app.pet?.name}</h4>
                                                        <p className="text-[10px] text-muted-foreground font-medium mb-4 italic">
                                                            {app.pet?.breed} • {app.pet?.customer?.name}
                                                        </p>

                                                        {app.access_token && (
                                                            <div className="flex gap-2 pt-3 border-t border-border mt-3">
                                                                <button
                                                                    onClick={() => handleCopyToken(app.access_token, app.id)}
                                                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-muted hover:bg-muted/80 rounded-lg text-[10px] font-black transition-colors"
                                                                >
                                                                    {copiedId === app.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                                                    {copiedId === app.id ? 'COPIADO' : 'LINK'}
                                                                </button>
                                                                {app.pet?.customer?.phone && (
                                                                    <button
                                                                        onClick={() => handleWhatsAppShare(app)}
                                                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded-lg text-[10px] font-black transition-colors"
                                                                    >
                                                                        <MessageCircle size={12} />
                                                                        WHATSAPP
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}

                                                        {status.id === 'READY' && (
                                                            <button
                                                                onClick={() => finishAppointment(app.id)}
                                                                className="flex items-center justify-center w-full text-white py-2 rounded-xl gap-2 font-black text-[10px] bg-green-600 hover:bg-green-700 transition-colors"
                                                            >
                                                                <CheckCircle2 size={14} /> FINALIZAR ATENDIMENTO
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {(!board[status.id] || (board[status.id]?.length ?? 0) === 0) && !loading && (
                                            <div className="h-40 flex flex-col items-center justify-center opacity-30">
                                                <Clock size={24} className="mb-2" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">Vazio</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
