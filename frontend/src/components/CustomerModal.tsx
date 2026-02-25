'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, Phone, Loader2, Save, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { apiClient } from '@/lib/apiClient';

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (customerId?: string) => void;
    initialData?: {
        id: string;
        name: string;
        phone: string;
        avatar_url?: string;
    } | null;
}

export default function CustomerModal({ isOpen, onClose, onSuccess, initialData }: CustomerModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                phone: initialData.phone,
                avatar_url: initialData.avatar_url || ''
            });
        } else {
            setFormData({ name: '', phone: '', avatar_url: '' });
        }
    }, [initialData, isOpen]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const fd = new FormData();
        fd.append('file', file);

        try {
            setUploading(true);
            const res = await apiClient.post(`/api/upload/avatar`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, avatar_url: res.data.url }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erro ao fazer upload do avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone) return;
        setLoading(true);
        try {
            if (initialData) {
                await apiClient.patch(`/api/customers/${initialData.id}`, formData);
                onSuccess(initialData.id);
            } else {
                const res = await apiClient.post(`/api/customers`, formData);
                onSuccess(res.data.id);
            }
            onClose();
        } catch (e) {
            alert('Erro ao salvar tutor');
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
                    className="relative bg-card w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-border"
                >
                    <div className="p-8 pb-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">
                                {initialData ? 'Editar Tutor' : 'Novo Tutor'}
                            </h2>
                            <p className="text-muted-foreground text-sm font-medium">
                                {initialData ? 'Atualize as informações do tutor' : 'Cadastre o tutor para vincular pets'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 pt-4 space-y-6">
                        {/* Avatar Picker Mock */}
                        <div className="flex justify-center">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-[2rem] bg-muted flex items-center justify-center border-2 border-dashed border-border group-hover:border-primary transition-all overflow-hidden relative">
                                    <input
                                        type="file"
                                        onChange={handleUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        accept="image/*"
                                    />
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 opacity-40">
                                            {uploading ? <Loader2 className="animate-spin text-primary" /> : <Camera size={32} />}
                                            <span className="text-[8px] font-black uppercase">Upload</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <p className="text-[8px] font-black uppercase text-white tracking-widest">{uploading ? 'UPLOADING...' : 'CHANGE_PHOTO'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome Completo</label>
                            <input
                                autoFocus
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ex: João das Couves..."
                                className="w-full bg-muted/50 border border-border rounded-2xl py-4 px-4 outline-none focus:border-primary transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    value={formData.phone}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="Ex: 5511999999999"
                                    className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.name || !formData.phone}
                            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> {initialData ? 'Atualizar' : 'Salvar'} Tutor</>}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
