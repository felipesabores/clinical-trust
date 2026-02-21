'use client';

import { useState } from 'react';
import {
    Video,
    Plus,
    Wifi,
    WifiOff,
    Maximize2,
    Settings,
    RefreshCw,
    Eye,
} from 'lucide-react';

type Camera = {
    id: number;
    name: string;
    location: string;
    status: string;
    watching: number;
    streamKey: string;
};

const cameras: Camera[] = [
    { id: 1, name: 'Câmera Banho 1', location: 'Área de Banho — Baia 1', status: 'online', watching: 3, streamKey: 'CAM-001' },
    { id: 2, name: 'Câmera Banho 2', location: 'Área de Banho — Baia 2', status: 'online', watching: 1, streamKey: 'CAM-002' },
    { id: 3, name: 'Câmera Tosa', location: 'Área de Tosa', status: 'offline', watching: 0, streamKey: 'CAM-003' },
    { id: 4, name: 'Câmera Recepção', location: 'Recepção Principal', status: 'online', watching: 0, streamKey: 'CAM-004' },
];

export default function CamerasPage() {
    const [selected, setSelected] = useState(cameras[0]);
    const online = cameras.filter(c => c.status === 'online').length;

    return (
        <div className="p-8 space-y-8 h-screen flex flex-col">
            <header className="flex justify-between items-end shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Video className="text-primary" size={28} />
                        Câmeras ao Vivo
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium italic">
                        Monitoramento em tempo real das áreas de serviço.
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold text-emerald-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        {online} câmera{online !== 1 ? 's' : ''} online
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Plus size={18} /> Adicionar
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Main viewer */}
                <div className="xl:col-span-3 flex flex-col gap-4">
                    <div className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden flex-1 min-h-[300px] group shadow-2xl">
                        {selected?.status === 'online' ? (
                            <>
                                {/* Simulated live feed */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                                    <div className="text-center space-y-3 opacity-40">
                                        <Video size={48} className="text-white mx-auto" />
                                        <p className="text-white text-sm font-medium">Stream ativo</p>
                                    </div>
                                </div>

                                {/* Overlays */}
                                <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                                </div>

                                <div className="absolute top-5 right-5 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl text-white text-xs font-bold border border-white/10">
                                    <Eye size={14} /> {selected?.watching} assistindo
                                </div>

                                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                                    <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
                                        <p className="text-white font-bold text-sm">{selected?.name}</p>
                                        <p className="text-white/60 text-xs">{selected?.location}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-white border border-white/10 hover:bg-white/20 transition-colors">
                                            <RefreshCw size={16} />
                                        </button>
                                        <button className="p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-white border border-white/10 hover:bg-white/20 transition-colors">
                                            <Settings size={16} />
                                        </button>
                                        <button className="p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-white border border-white/10 hover:bg-white/20 transition-colors">
                                            <Maximize2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
                                <WifiOff size={40} />
                                <p className="font-bold text-sm">Câmera offline</p>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition-colors">
                                    <RefreshCw size={14} /> Tentar reconectar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Camera list */}
                <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">
                        Todas as câmeras
                    </h3>
                    {cameras.map(cam => (
                        <button
                            key={cam.id}
                            onClick={() => setSelected(cam)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${selected?.id === cam.id
                                ? 'bg-primary/10 border-primary/30 shadow-md'
                                : 'bg-card hover:bg-accent hover:border-primary/20'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <p className={`font-bold text-sm leading-tight ${selected?.id === cam.id ? 'text-primary' : ''}`}>
                                    {cam.name}
                                </p>
                                <div className={`flex items-center gap-1 shrink-0 ${cam.status === 'online' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {cam.status === 'online'
                                        ? <><Wifi size={12} /><span className="text-[9px] font-black uppercase">Online</span></>
                                        : <><WifiOff size={12} /><span className="text-[9px] font-black uppercase">Offline</span></>
                                    }
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{cam.location}</p>
                            {cam.watching > 0 && (
                                <p className="text-[10px] text-primary font-bold mt-2 flex items-center gap-1">
                                    <Eye size={10} /> {cam.watching} assistindo
                                </p>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
