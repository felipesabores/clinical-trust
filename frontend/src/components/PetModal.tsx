'use client';

import { useState } from 'react';
import axios from 'axios';
import { X, Dog, Cat, Rabbit, Loader2, Save, Info, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface PetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    customerId: string;
    customerName: string;
}

const petTypes = [
    { id: 'DOG', label: 'Cachorro', icon: Dog },
    { id: 'CAT', label: 'Gato', icon: Cat },
    { id: 'RABBIT', label: 'Coelho', icon: Rabbit },
    { id: 'OTHER', label: 'Outro', icon: Info },
];

export default function PetModal({ isOpen, onClose, onSuccess, customerId, customerName }: PetModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'DOG',
        breed: '',
        avatar_url: '',
        notes: ''
    });

    const handleSubmit = async () => {
        if (!formData.name) return;
        setLoading(true);
        try {
            await axios.post(`${API}/api/customers/${customerId}/pets`, formData);
            onSuccess();
            onClose();
            setFormData({ name: '', type: 'DOG', breed: '', avatar_url: '', notes: '' });
        } catch (e) {
            alert('Erro ao cadastrar pet');
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
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Novo Pet</h2>
                            <p className="text-muted-foreground text-sm font-medium">Para: <span className="text-primary">{customerName}</span></p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 pt-4 space-y-6">
                        {/* Avatar Picker Mock */}
                        <div className="flex justify-center">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-[2rem] bg-muted flex items-center justify-center border-2 border-dashed border-border group-hover:border-primary transition-all overflow-hidden">
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="text-muted-foreground group-hover:text-primary transition-colors" size={32} />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="URL da Foto"
                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background border border-border rounded-lg text-[8px] px-2 py-1 outline-none focus:border-primary w-20 text-center font-bold"
                                    value={formData.avatar_url}
                                    onChange={e => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Type Picker */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Espécie</label>
                            <div className="grid grid-cols-4 gap-2">
                                {petTypes.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                                            formData.type === type.id
                                                ? "bg-primary/10 border-primary text-primary"
                                                : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <type.icon size={20} />
                                        <span className="text-[9px] font-black uppercase">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome do Pet</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ex: Mel..."
                                className="w-full bg-muted/50 border border-border rounded-2xl py-4 px-4 outline-none focus:border-primary transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Raça (Opcional)</label>
                            <input
                                value={formData.breed}
                                onChange={e => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                                placeholder="Ex: Shih Tzu..."
                                className="w-full bg-muted/50 border border-border rounded-2xl py-4 px-4 outline-none focus:border-primary transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Observações</label>
                            <textarea
                                value={formData.notes}
                                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Alergias, temperamento..."
                                className="w-full bg-muted/50 border border-border rounded-2xl py-3 px-4 outline-none focus:border-primary transition-all font-medium text-sm h-20 resize-none"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.name}
                            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Cadastrar Pet</>}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
