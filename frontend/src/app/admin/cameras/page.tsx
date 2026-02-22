'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Video,
    Plus,
    Wifi,
    WifiOff,
    Maximize2,
    Settings,
    RefreshCw,
    Eye,
    Loader2,
    Trash2,
    Edit3,
    Activity,
    Shield,
    Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import CameraModal from '@/components/CameraModal';
import { useTenant } from '@/context/TenantContext';

import { API } from '@/config';

export default function CamerasPage() {
    const { config } = useTenant();
    const [cameras, setCameras] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCamera, setEditingCamera] = useState<any>(null);

    const fetchCameras = async () => {
        if (!config?.id) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API}/api/cameras?tenantId=${config.id}`);
            setCameras(res.data || []);
            if (res.data.length > 0 && !selected) {
                setSelected(res.data[0]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Excluir a câmera "${name}"?`)) return;
        try {
            await axios.delete(`${API}/api/cameras/${id}`);
            if (selected?.id === id) setSelected(null);
            fetchCameras();
        } catch (e) {
            alert('Erro ao excluir câmera');
        }
    };

    useEffect(() => {
        fetchCameras();
    }, []);

    const onlineCount = cameras.filter(c => c.is_active).length;

    return (
        <div className="p-8 space-y-10 h-screen flex flex-col bg-background text-foreground overflow-hidden">
            <CameraModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCamera(null);
                }}
                onSuccess={fetchCameras}
                initialData={editingCamera}
            />

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 px-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Video className="text-primary" size={28} />
                        Transmissão ao Vivo
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Acompanhamento em tempo real das áreas de banho e tosa.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border/50 rounded-full text-sm font-medium glass-panel">
                        <div className={cn("w-2 h-2 rounded-full", onlineCount > 0 ? "bg-emerald-500 animate-[pulse_1.5s_infinite]" : "bg-red-500")} />
                        {onlineCount} {onlineCount === 1 ? 'Câmera Ativa' : 'Câmeras Ativas'}
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
                    >
                        <Plus size={18} /> Adicionar Câmera
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[500px]">
                {/* Theater Mode Viewer */}
                <div className="lg:col-span-3 flex flex-col relative group glass-panel bg-card border-border/50 p-2 overflow-hidden rounded-2xl">
                    <div className="relative bg-black rounded-xl overflow-hidden flex-1 shadow-inner h-full flex items-center justify-center">
                        {loading && cameras.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4">
                                <Loader2 className="animate-spin text-primary" size={48} />
                                <span className="text-sm font-medium">Carregando câmeras...</span>
                            </div>
                        ) : selected?.is_active ? (
                            <>
                                {/* Simulated live feed background */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                                {/* Overlays */}
                                <div className="absolute top-6 left-6 flex flex-col gap-2 z-30">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/90 rounded-full text-white text-xs font-bold shadow-lg backdrop-blur-md">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> AO VIVO
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white/90 text-xs font-medium border border-white/10">
                                        HD 1080p
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6 flex items-center gap-2 z-30">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white/90 text-xs font-medium">
                                        <Eye size={14} className="text-primary/80" /> 4 Visualizações
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-30">
                                    <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg max-w-md">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Shield size={16} className="text-primary" />
                                            <p className="text-white font-semibold text-lg leading-none">{selected?.name}</p>
                                        </div>
                                        <p className="text-white/60 text-xs font-medium truncate">{selected.rtsp_url.split('@')[1] || 'Conexão local ativa'}</p>
                                    </div>

                                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-primary/80 transition-colors shadow-lg">
                                            <RefreshCw size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingCamera(selected);
                                                setIsModalOpen(true);
                                            }}
                                            className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-primary/80 transition-colors shadow-lg"
                                        >
                                            <Settings size={18} />
                                        </button>
                                        <button className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-primary/80 transition-colors shadow-lg">
                                            <Maximize2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 z-40">
                                <WifiOff size={48} className="text-muted-foreground" />
                                <div className="text-center">
                                    <h4 className="font-semibold text-lg text-foreground mb-1">Câmera Desconectada</h4>
                                    <p className="text-sm text-muted-foreground mb-6">Verifique a conexão ou a URL RTSP.</p>
                                    <button
                                        onClick={fetchCameras}
                                        className="flex items-center justify-center gap-2 px-6 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <RefreshCw size={16} /> Tentar Novamente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sensors Sidebar */}
                <div className="flex flex-col gap-4 min-h-0 bg-card glass-panel rounded-2xl p-4 border border-border/50">
                    <div className="flex items-center justify-between border-b border-border/50 pb-3 mt-2 px-2">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            Câmeras Disponíveis
                        </h3>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{cameras.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar-thin">
                        {cameras.map(cam => (
                            <div
                                key={cam.id}
                                className={cn(
                                    "p-4 cursor-pointer rounded-xl transition-all relative group overflow-hidden border",
                                    selected?.id === cam.id
                                        ? "bg-primary/5 border-primary shadow-sm"
                                        : "border-border/40 hover:border-primary/50 hover:bg-muted/30 bg-background/50 grayscale-[0.5] hover:grayscale-0 shadow-sm"
                                )}
                                onClick={() => setSelected(cam)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className={cn(
                                            "font-semibold text-sm truncate transition-colors",
                                            selected?.id === cam.id ? "text-primary" : "text-foreground group-hover:text-primary"
                                        )}>
                                            {cam.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 truncate">ID: {cam.id.slice(0, 8)}</p>
                                    </div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                        cam.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-red-500/50"
                                    )} />
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-1">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "w-4 h-1 rounded-full",
                                                    cam.is_active ? "bg-primary/80" : "bg-muted",
                                                    i > 1 ? "opacity-40" : ""
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCamera(cam);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-1.5 hover:bg-primary/20 rounded-md text-primary transition-colors"
                                            title="Editar Câmera"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(cam.id, cam.name);
                                            }}
                                            className="p-1.5 hover:bg-red-500/20 rounded-md text-red-500 transition-colors"
                                            title="Excluir Câmera"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
