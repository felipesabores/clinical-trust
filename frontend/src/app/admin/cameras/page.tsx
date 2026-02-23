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
        <div className="p-8 space-y-10 h-screen flex flex-col bg-[#F7F8F0] dark:bg-slate-950 text-foreground overflow-hidden">
            <CameraModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCamera(null);
                }}
                onSuccess={fetchCameras}
                initialData={editingCamera}
            />

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 px-2">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tighter text-[#355872] dark:text-white flex items-center gap-4">
                        <Video className="text-[#7AAACE]" size={32} />
                        Monitoramento Crítico
                    </h1>
                    <p className="text-[#355872]/50 font-medium text-sm mt-1 pl-1 italic">VIGILÂNCIA EM TEMPO REAL // BACKBONE ÓPTICO</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900/60 border-2 border-[#E4E9D5] dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#355872] shadow-sm">
                        <div className={cn("w-2.5 h-2.5 rounded-full border-2 border-white", onlineCount > 0 ? "bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-rose-500")} />
                        {onlineCount} {onlineCount === 1 ? 'NÓ ATIVO' : 'NÓS ATIVOS'}
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#355872] hover:bg-[#7AAACE] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-[#355872]/20 flex items-center gap-2 border-2 border-[#355872]/10"
                    >
                        <Plus size={18} /> INJETAR CANAL
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-[500px]">
                {/* Theater Mode Viewer */}
                <div className="lg:col-span-3 flex flex-col relative group bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-[#E4E9D5] dark:border-white/5 p-3 overflow-hidden rounded-[2.5rem] shadow-2xl">
                    <div className="relative bg-black rounded-[1.8rem] overflow-hidden flex-1 shadow-inner h-full flex items-center justify-center">
                        {loading && cameras.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#7AAACE]/40 gap-6">
                                <Activity className="animate-pulse" size={64} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">SINCRONIZANDO FEEDS...</span>
                            </div>
                        ) : selected?.is_active ? (
                            <>
                                {/* Simulated live feed background */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-screen" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

                                {/* Overlays */}
                                <div className="absolute top-8 left-8 flex flex-col gap-3 z-30">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-rose-600/90 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl border border-white/20">
                                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-glow" /> TRANSMISSÃO_ONLINE
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl text-white/90 text-[10px] font-black uppercase tracking-widest border border-white/10">
                                        FHD 1080P // 60 FPS
                                    </div>
                                </div>

                                <div className="absolute top-8 right-8 flex items-center gap-3 z-30">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-[#F7F8F0]/10 backdrop-blur-xl border border-white/10 rounded-xl text-white/90 text-[10px] font-black uppercase tracking-widest">
                                        <Eye size={16} className="text-[#7AAACE]" /> 4 ESCRUTADORES
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between z-30">
                                    <div className="bg-black/60 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/10 shadow-2xl max-w-lg">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Shield size={18} className="text-[#7AAACE]" />
                                            <p className="text-white font-heading font-black text-2xl uppercase tracking-tighter leading-none">{selected?.name}</p>
                                        </div>
                                        <p className="text-[#F7F8F0]/40 text-[10px] font-black uppercase tracking-widest truncate">{selected.rtsp_url.split('@')[1] || 'PROTOCOLO_LOCAL_ENCRYPTED'}</p>
                                    </div>

                                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                        <button className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/10 hover:bg-[#7AAACE] transition-all duration-300 shadow-2xl">
                                            <RefreshCw size={20} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingCamera(selected);
                                                setIsModalOpen(true);
                                            }}
                                            className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/10 hover:bg-[#7AAACE] transition-all duration-300 shadow-2xl"
                                        >
                                            <Settings size={20} />
                                        </button>
                                        <button className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/10 hover:bg-[#7AAACE] transition-all duration-300 shadow-2xl">
                                            <Maximize2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/90 z-40 backdrop-blur-md">
                                <WifiOff size={64} className="text-rose-500/50" />
                                <div className="text-center space-y-2">
                                    <h4 className="font-heading font-black text-2xl text-white uppercase tracking-tighter">Sinal Interrompido</h4>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">ERRO_DE_HANDSHAKE // VERIFIQUE O ENDEREÇO RTSP</p>
                                    <div className="pt-8 px-10">
                                        <button
                                            onClick={fetchCameras}
                                            className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10"
                                        >
                                            <RefreshCw size={16} /> RECONECTAR CANAL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sensors Sidebar */}
                <div className="flex flex-col gap-6 min-h-0 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-6 border border-[#E4E9D5] dark:border-white/5 shadow-xl ring-1 ring-black/5">
                    <div className="flex items-center justify-between border-b border-[#E4E9D5] pb-4 mt-2 px-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#355872]/40 flex items-center gap-3">
                            <Activity size={18} className="text-[#7AAACE]" />
                            Matriz de Feeds
                        </h3>
                        <span className="text-[10px] font-black text-[#7AAACE] bg-[#7AAACE]/10 px-3 py-1 rounded-lg tabular-nums">{cameras.length} UNITS</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar-thin">
                        {cameras.map(cam => (
                            <div
                                key={cam.id}
                                className={cn(
                                    "p-5 cursor-pointer rounded-2xl transition-all duration-500 relative group overflow-hidden border-2",
                                    selected?.id === cam.id
                                        ? "bg-white border-[#7AAACE] shadow-2xl shadow-[#7AAACE]/10"
                                        : "bg-[#F7F8F0]/50 border-transparent hover:border-[#7AAACE]/30 hover:bg-white text-[#355872]/40 grayscale hover:grayscale-0 shadow-sm"
                                )}
                                onClick={() => setSelected(cam)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className={cn(
                                            "font-heading font-black text-sm uppercase tracking-tight transition-colors",
                                            selected?.id === cam.id ? "text-[#355872]" : "text-[#355872]/60 group-hover:text-[#355872]"
                                        )}>
                                            {cam.name}
                                        </p>
                                        <p className="text-[10px] font-black text-[#355872]/20 mt-1 uppercase tracking-widest">ID_{cam.id.slice(0, 8)}</p>
                                    </div>
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full mt-1 shrink-0 border-2 border-white",
                                        cam.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-rose-500/50"
                                    )} />
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex gap-1.5 px-3 py-1.5 bg-black/5 rounded-lg border border-black/5">
                                        {[...Array(3)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "w-1.5 h-1.5 rounded-full shadow-inner",
                                                    cam.is_active ? "bg-[#355872]" : "bg-[#355872]/10",
                                                    i > 1 ? "opacity-20" : ""
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCamera(cam);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 bg-white hover:bg-[#7AAACE] rounded-xl text-[#355872]/40 hover:text-white transition-all shadow-sm border border-[#E4E9D5]"
                                            title="Configurar Parâmetros"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(cam.id, cam.name);
                                            }}
                                            className="p-2 bg-white hover:bg-rose-500 rounded-xl text-rose-500/40 hover:text-white transition-all shadow-sm border border-[#E4E9D5]"
                                            title="Desativar Unidade"
                                        >
                                            <Trash2 size={14} />
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
