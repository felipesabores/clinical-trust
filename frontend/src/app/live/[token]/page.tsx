'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Play, Pause, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

export default function LiveView() {
    const { token } = useParams();
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await axios.get(`${API}/api/live/${token}`);
                setData(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Link inválido');
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000); // Check status every 10s
        return () => clearInterval(interval);
    }, [token]);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-sm">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="text-red-500" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Ops!</h1>
                    <p className="text-slate-500 leading-relaxed">{error}</p>
                </div>
            </div>
        );
    }

    if (!data) return <div className="p-10 text-center animate-pulse">Carregando visualização...</div>;

    const steps = [
        { id: 'RECEPTION', label: 'Recepção', icon: Clock },
        { id: 'BATHING', label: 'Banho', icon: Play },
        { id: 'GROOMING', label: 'Tosa', icon: ShieldCheck },
        { id: 'READY', label: 'Pronto', icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
            {/* HEADER / VIDEO PLAYER */}
            <div className="h-[40vh] bg-black relative group overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />

                {/* REAL VIDEO PLAYER (HLS Placeholder) */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                        <img
                            src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800"
                            className="w-full h-full object-cover blur-[2px]"
                            alt="Background"
                        />
                    </div>

                    <div className="relative z-20 flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl relative overflow-hidden group/play cursor-pointer hover:scale-110 transition-transform">
                                <Play className="text-white fill-white ml-1 group-hover/play:scale-125 transition-transform" size={32} />
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                            </div>
                        </div>
                        <p className="text-white/60 text-[10px] font-black tracking-[0.3em] mt-5 uppercase drop-shadow-lg">
                            Conectando ao Feed Seguro...
                        </p>
                    </div>
                </div>

                {/* TOP OVERLAY */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    <span className="text-white font-bold text-sm tracking-tight drop-shadow-md">AO VIVO</span>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 bg-white rounded-t-[40px] -mt-10 relative z-20 px-8 pt-10 shadow-2xl border-t border-slate-100">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{data.pet.name}</h2>
                        <p className="text-slate-400 font-medium italic">{data.pet.breed}</p>
                    </div>
                    <div className="bg-primary/10 px-4 py-2 rounded-2xl">
                        <span className="text-primary font-bold text-sm">Status Atual</span>
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="space-y-10 mb-24 relative">
                    <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-slate-100" />
                    {steps.map((step) => {
                        const isActive = data.status === step.id;
                        const isCompleted = steps.findIndex(s => s.id === data.status) > steps.findIndex(s => s.id === step.id);

                        return (
                            <div key={step.id} className="flex items-center gap-6 relative">
                                <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center z-10 transition-all duration-700 border-2 ${isActive ? 'bg-green-500 text-white scale-125 shadow-2xl shadow-green-200 border-green-400 rotate-[-5deg]' :
                                    isCompleted ? 'bg-green-50 text-green-500 border-green-100' : 'bg-white text-slate-200 border-slate-50'
                                    }`}>
                                    {isCompleted ? <ShieldCheck size={20} /> : <step.icon size={20} className={isActive ? 'animate-bounce' : ''} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`font-black tracking-tight transition-all duration-500 ${isActive ? 'text-slate-900 text-xl' : 'text-slate-300 uppercase text-xs tracking-widest'}`}>
                                        {step.label}
                                    </span>
                                    {isActive && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex gap-0.5">
                                                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" />
                                            </div>
                                            <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider italic">Em andamento na {data.tenant_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* FOOTER CTA */}
            <div className="fixed bottom-0 w-full max-w-md bg-white p-6 border-t border-slate-100 z-30">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-[22px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-green-200 uppercase tracking-widest text-sm">
                    <MessageCircle size={22} fill="white" />
                    Falar com a Recepção
                </button>
            </div>
        </div>
    );
}
