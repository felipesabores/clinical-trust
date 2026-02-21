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

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

            <header className="flex justify-between items-start shrink-0">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 uppercase font-title leading-none">
                        <Video className="text-primary" size={36} />
                        Surveillance <span className="text-primary">Telemetry</span>
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground mt-2 opacity-60 italic leading-none">RTSP PROTOCOL // ACTIVE MONITORING NODE-7</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-4 px-6 py-4 bg-muted/10 border border-border/50 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-inner">
                        <div className={cn("w-2 h-2 rounded-full", onlineCount > 0 ? "bg-emerald-500 animate-[pulse_1.5s_infinite] shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500")} />
                        {onlineCount} ACTIVE SENSORS
                        <span className="opacity-20 border-l border-border/10 h-3 ml-2 pl-4">ENCRYPTED</span>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-primary-foreground px-8 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 border border-primary/50"
                    >
                        <Plus size={18} /> INITIALIZE NODE
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 flex-1 min-h-0 relative">
                {/* Tactical Viewer */}
                <div className="xl:col-span-3 flex flex-col gap-4 min-h-0 relative group">
                    {/* Corners Decorative HUD */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 -translate-x-1 -translate-y-1 z-20 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 translate-x-1 -translate-y-1 z-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 -translate-x-1 translate-y-1 z-20 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 translate-x-1 translate-y-1 z-20 pointer-events-none" />

                    <div className="relative bg-[#020617] rounded-sm overflow-hidden flex-1 group border border-border/50 shadow-2xl relative">
                        {/* Static Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-10" />

                        {loading && cameras.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/40 gap-4">
                                <Activity className="animate-pulse" size={48} />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">BOOTING TACTICAL OS...</span>
                            </div>
                        ) : selected?.is_active ? (
                            <>
                                {/* Simulated live feed background */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-150 brightness-[0.4] opacity-40 scale-105 group-hover:scale-100 transition-transform duration-[10s]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />

                                {/* Scanning line effect */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-20">
                                    <div className="w-full h-[1px] bg-primary animate-[scan_6s_linear_infinite]" style={{ boxShadow: '0 0 20px var(--primary)' }} />
                                </div>

                                {/* Crosshair Center */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20 z-20">
                                    <div className="w-12 h-12 border border-primary/40 rounded-full" />
                                    <div className="absolute w-24 h-[1px] bg-primary/20" />
                                    <div className="absolute h-24 w-[1px] bg-primary/20" />
                                </div>

                                {/* Overlays */}
                                <div className="absolute top-8 left-8 flex flex-col gap-3 z-30">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-red-600/90 rounded-sm text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl border border-red-400/50">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE STREAM • 60 FPS
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-sm text-white text-[9px] font-black uppercase tracking-[0.2em] border border-white/10">
                                        RES: 3840 X 2160
                                    </div>
                                </div>

                                <div className="absolute top-8 right-8 flex flex-col gap-3 items-end z-30">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm text-white text-[9px] font-black uppercase tracking-widest group/hud">
                                        <Eye size={12} className="text-primary" /> 04 SYSTEM VIEWERS
                                    </div>
                                    <div className="text-[9px] font-black text-primary/60 bg-primary/10 px-3 py-1 border border-primary/20 rounded-sm uppercase tracking-widest font-mono">
                                        NET_TUNNEL: {selected.rtsp_url.split('@')[1] || 'INTERNAL_ACCESS'}
                                    </div>
                                    <div className="flex items-center gap-2 text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">
                                        <Cpu size={10} /> CORE TEMP: 42°C
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between z-30">
                                    <div className="flex flex-col gap-4">
                                        <div className="bg-black/80 backdrop-blur-xl rounded-sm p-6 border-l-4 border-primary shadow-2xl border border-white/5 relative group/info overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                                <Shield size={40} />
                                            </div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                <p className="text-white font-black text-xl uppercase tracking-tighter leading-none">{selected?.name}</p>
                                            </div>
                                            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] italic">SECURE FEED // AUTHORIZED ACCESS GRANTED</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        <button className="w-12 h-12 flex items-center justify-center bg-black/80 backdrop-blur-xl rounded-sm text-white border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all shadow-xl group/btn">
                                            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingCamera(selected);
                                                setIsModalOpen(true);
                                            }}
                                            className="w-12 h-12 flex items-center justify-center bg-black/80 backdrop-blur-xl rounded-sm text-white border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all shadow-xl"
                                        >
                                            <Settings size={18} />
                                        </button>
                                        <button className="w-12 h-12 flex items-center justify-center bg-black/80 backdrop-blur-xl rounded-sm text-white border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all shadow-xl">
                                            <Maximize2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/90 backdrop-blur-3xl z-40">
                                <div className="relative">
                                    <WifiOff size={80} className="text-red-500/20" />
                                    <div className="absolute inset-0 animate-ping opacity-10"><WifiOff size={80} className="text-red-500" /></div>
                                </div>
                                <div className="text-center">
                                    <h4 className="font-black text-lg uppercase tracking-[0.4em] text-red-500 mb-2">NODE_STATUS: DISCONNECTED</h4>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-8">SIGNAL LOSS DETECTED // RETRYING CONNECTION</p>
                                    <button
                                        onClick={fetchCameras}
                                        className="flex items-center gap-3 px-10 py-4 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-sm text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all border border-white/10 hover:border-primary/40 group"
                                    >
                                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> RE-ESTABLISH DATALINK
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sensors Sidebar */}
                <div className="flex flex-col gap-6 min-h-0 bg-muted/[0.03] border-l border-border/10 pl-8">
                    <div className="flex items-center justify-between border-b border-border/30 pb-4">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-2">
                            System Nodes
                        </h3>
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 border border-primary/20 rounded-sm">{cameras.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar-thin">
                        {cameras.map(cam => (
                            <div
                                key={cam.id}
                                className={cn(
                                    "p-6 cursor-pointer border-l-2 transition-all relative group overflow-hidden bg-muted/5",
                                    selected?.id === cam.id
                                        ? "bg-primary/[0.04] border-primary shadow-xl ring-1 ring-primary/20"
                                        : "border-border/30 hover:border-primary/50 hover:bg-muted/10 grayscale hover:grayscale-0 shadow-sm"
                                )}
                                onClick={() => setSelected(cam)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className={cn(
                                            "font-black text-sm uppercase tracking-tight truncate transition-colors",
                                            selected?.id === cam.id ? "text-primary" : "text-foreground group-hover:text-primary"
                                        )}>
                                            {cam.name}
                                        </p>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-50 italic">NODEID_{cam.id.slice(0, 8)}</p>
                                    </div>
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full border-2",
                                        cam.is_active ? "bg-emerald-500 border-white/10 animate-pulse" : "bg-red-500/20 border-red-500/30"
                                    )} />
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex gap-1.5 opacity-40">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "w-6 h-1 rounded-sm",
                                                    cam.is_active ? "bg-primary" : "bg-muted",
                                                    i > 2 ? "opacity-30" : ""
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCamera(cam);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2.5 bg-muted/10 hover:bg-primary/20 rounded-sm text-primary transition-colors border border-border/50 hover:border-primary/30"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(cam.id, cam.name);
                                            }}
                                            className="p-2.5 bg-red-500/5 hover:bg-red-500/20 rounded-sm text-red-400 border border-red-500/10 transition-colors"
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
