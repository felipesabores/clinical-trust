'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Video, Link, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: {
        id: string;
        name: string;
        rtsp_url: string;
    } | null;
}

export default function CameraModal({ isOpen, onClose, onSuccess, initialData }: CameraModalProps) {
    const { config } = useTenant();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        rtsp_url: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                rtsp_url: initialData.rtsp_url,
            });
        } else {
            setFormData({ name: '', rtsp_url: '' });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async () => {
        if (!formData.name || !formData.rtsp_url) return;
        setLoading(true);
        try {
            if (initialData) {
                await axios.patch(`${API}/api/cameras/${initialData.id}`, formData);
            } else {
                await axios.post(`${API}/api/cameras`, {
                    ...formData,
                    tenant_id: config?.id
                });
            }
            onSuccess();
            onClose();
        } catch (e) {
            alert('Erro ao salvar câmera');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-card w-full max-w-md rounded-sm shadow-2xl overflow-hidden border border-border"
                >
                    <div className="p-8 pb-4 flex justify-between items-center border-b border-border/50">
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">
                                {initialData ? 'Editar Câmera' : 'Nova Câmera'}
                            </h2>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">
                                Configuração de monitoramento de banho e tosa
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-sm transition-colors text-muted-foreground">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 pt-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identificação da Área</label>
                            <div className="relative">
                                <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                                <input
                                    autoFocus
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ex: Banho 01, Tosa Principal..."
                                    className="w-full bg-muted/20 border border-border rounded-sm py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">URL RTSP Interna</label>
                            <div className="relative">
                                <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                                <input
                                    value={formData.rtsp_url}
                                    onChange={e => setFormData(prev => ({ ...prev, rtsp_url: e.target.value }))}
                                    placeholder="rtsp://usuario:senha@ip:porta/stream"
                                    className="w-full bg-muted/20 border border-border rounded-sm py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-mono text-[10px]"
                                />
                            </div>
                            <p className="text-[9px] text-muted-foreground italic ml-1">
                                * A URL RTSP nunca é exposta ao tutor.
                            </p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.name || !formData.rtsp_url}
                            className="w-full bg-primary text-primary-foreground py-4 rounded-sm font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> {initialData ? 'Atualizar' : 'Salvar'} Configuração</>}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
