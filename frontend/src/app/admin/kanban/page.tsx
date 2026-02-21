'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
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

import AppointmentModal from '@/components/AppointmentModal';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const statuses = [
    { id: 'SCHEDULED', label: 'Agendados', color: 'bg-slate-500' },
    { id: 'RECEPTION', label: 'Recepção', color: 'bg-blue-500' },
    { id: 'BATHING', label: 'Banho', color: 'bg-indigo-500' },
    { id: 'GROOMING', label: 'Tosa', color: 'bg-violet-500' },
    { id: 'DRYING', label: 'Secagem', color: 'bg-amber-500' },
    { id: 'READY', label: 'Pronto', color: 'bg-green-500' },
] as const;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'test-tenant-123';

export default function KanbanPage() {
    const [board, setBoard] = useState<Record<string, any[]>>({});
    const [cameras, setCameras] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const { config } = useTenant();

    const fetchKanban = async () => {
        try {
            const res = await axios.get(`${API}/api/appointments/kanban?tenantId=${TENANT_ID}`);
            setBoard(res.data || {});
        } catch (e) {
            console.error('Erro ao carregar kanban', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCameras = async () => {
        try {
            const res = await axios.get(`${API}/api/cameras?tenantId=${TENANT_ID}`);
            setCameras(res.data || []);
        } catch (e) {
            console.error('Erro ao carregar câmeras', e);
        }
    };

    const updateStatus = async (appId: string, newStatus: string, cameraId?: string) => {
        try {
            await axios.patch(`${API}/api/appointments/${appId}/status`, {
                status: newStatus,
                camera_id: cameraId || undefined,
            });
            fetchKanban(); // We refresh to get the access_token if it was generated
        } catch (e) {
            console.error('Erro ao atualizar status', e);
            fetchKanban();
        }
    };

    useEffect(() => {
        setIsMounted(true);
        fetchKanban();
        fetchCameras();
        const inter = setInterval(fetchKanban, 10000);
        return () => clearInterval(inter);
    }, []);

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

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

        const selectedCam = (window as any)[`selected_cam_${destination.droppableId}`];
        updateStatus(draggableId, destination.droppableId, selectedCam);
    };

    const handleCopyToken = (token: string, appId: string) => {
        const url = `${window.location.origin}/live/${token}`;
        navigator.clipboard.writeText(url);
        setCopiedId(appId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleWhatsAppShare = (app: any) => {
        const url = `${window.location.host}/live/${app.access_token}`;
        const clinicName = config?.name || 'Clínica';
        const message = `Olá! Aqui é da ${clinicName}. O banho do ${app.pet?.name} começou. Você pode acompanhar tudo ao vivo pelo link: https://${url}`;
        window.open(`https://wa.me/${app.pet?.customer?.phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (!isMounted) return null;

    return (
        <div className="p-8 h-screen flex flex-col bg-background">
            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchKanban}
            />

            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <KanbanIcon className="text-primary" size={28} />
                        Kanban Operacional
                    </h1>
                    <p className="text-muted-foreground font-medium italic">Gerencie o fluxo dos pets em tempo real</p>
                </div>

                <div className="flex gap-3">
                    <button className="glass px-6 py-2.5 rounded-xl hover:bg-accent transition-all font-bold flex items-center gap-2">
                        <Video size={18} /> Câmeras
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                        NOVO AGENDAMENTO
                    </button>
                </div>
            </header>

            <DragDropContext onDragEnd={onDragEnd}>
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
                                            "flex-1 bg-muted/30 rounded-3xl p-3 overflow-y-auto border border-border border-dashed space-y-3 transition-colors",
                                            snapshot.isDraggingOver && "bg-muted/50 border-primary/30"
                                        )}
                                    >
                                        {board[status.id]?.map((app: any, index: number) => (
                                            <Draggable key={app.id} draggableId={app.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={cn(
                                                            "bg-card border border-border p-4 rounded-2xl shadow-sm group hover:border-primary/50 transition-all hover:shadow-md",
                                                            snapshot.isDragging && "shadow-2xl border-primary scale-105 z-50"
                                                        )}
                                                    >
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
                                                                <button
                                                                    onClick={() => handleWhatsAppShare(app)}
                                                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded-lg text-[10px] font-black transition-colors"
                                                                >
                                                                    <MessageCircle size={12} />
                                                                    WHATSAPP
                                                                </button>
                                                            </div>
                                                        )}

                                                        {status.id === 'READY' && (
                                                            <div className="flex items-center justify-center w-full text-green-500 py-2 rounded-xl gap-2 font-black text-[10px] bg-green-500/10">
                                                                <CheckCircle2 size={14} /> CONCLUÍDO
                                                            </div>
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
