'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Search, Plus, User, Dog, Phone, Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AppointmentModal({ isOpen, onClose, onSuccess }: AppointmentModalProps) {
    const { config } = useTenant();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [customerData, setCustomerData] = useState({ id: '', name: '', phone: '' });
    const [petData, setPetData] = useState({ id: '', name: '', breed: '' });
    const [scheduledAt, setScheduledAt] = useState(new Date().toISOString().slice(0, 16));

    // Search results
    const [customers, setCustomers] = useState<any[]>([]);
    const [pets, setPets] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    const searchTimeout = useRef<any>(null);

    const handleSearchCustomer = async (q: string) => {
        setCustomerData(prev => ({ ...prev, name: q, id: '' }));
        if (q.length < 2) {
            setCustomers([]);
            return;
        }

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await axios.get(`${API}/api/customers/search?tenantId=${config?.id}&q=${q}`);
                setCustomers(res.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setSearching(false);
            }
        }, 300);
    };

    const handleSearchPet = async (q: string) => {
        setPetData(prev => ({ ...prev, name: q, id: '' }));
        if (q.length < 2 || !customerData.id) {
            setPets([]);
            return;
        }

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await axios.get(`${API}/api/pets/search?customerId=${customerData.id}&q=${q}`);
                setPets(res.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setSearching(false);
            }
        }, 300);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.post(`${API}/api/appointments`, {
                tenant_id: config?.id,
                customer_id: customerData.id || undefined,
                customer_name: customerData.name,
                customer_phone: customerData.phone,
                pet_id: petData.id || undefined,
                pet_name: petData.name,
                pet_breed: petData.breed,
                scheduled_at: scheduledAt
            });
            onSuccess();
            onClose();
            resetForm();
        } catch (e) {
            alert('Erro ao criar agendamento');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setCustomerData({ id: '', name: '', phone: '' });
        setPetData({ id: '', name: '', breed: '' });
        setCustomers([]);
        setPets([]);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                    className="relative bg-card w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-border"
                >
                    {/* Header */}
                    <div className="p-8 pb-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Novo Agendamento</h2>
                            <p className="text-muted-foreground text-sm font-medium">Passo {step} de 3</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 pt-4">
                        {step === 1 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tutor (Nome ou Telefone)</label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            autoFocus
                                            value={customerData.name}
                                            onChange={(e) => handleSearchCustomer(e.target.value)}
                                            placeholder="Ex: Felipe Carvalho..."
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold"
                                        />
                                        {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary" size={18} />}
                                    </div>

                                    <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                        {customers.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => {
                                                    setCustomerData({ id: c.id, name: c.name, phone: c.phone });
                                                    setStep(2);
                                                }}
                                                className="w-full text-left p-3 hover:bg-primary/10 rounded-xl flex items-center gap-3 transition-colors border border-transparent hover:border-primary/20"
                                            >
                                                <User size={16} className="text-primary" />
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">{c.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{c.phone}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {!customerData.id && customerData.name.length > 2 && customers.length === 0 && (
                                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                        <p className="text-xs font-bold mb-3">Tutor não encontrado. Cadastrar novo?</p>
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                                <input
                                                    value={customerData.phone}
                                                    onChange={e => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                                                    placeholder="WhatsApp (ex: 55119...)"
                                                    className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary text-sm font-bold"
                                                />
                                            </div>
                                            <button
                                                disabled={!customerData.phone}
                                                onClick={() => setStep(2)}
                                                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                                            >
                                                Continuar Cadastro
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome do Pet</label>
                                    <div className="relative">
                                        <Dog className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            autoFocus
                                            value={petData.name}
                                            onChange={(e) => handleSearchPet(e.target.value)}
                                            placeholder="Ex: Rex..."
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold"
                                        />
                                    </div>

                                    <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                        {pets.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    setPetData({ id: p.id, name: p.name, breed: p.breed || '' });
                                                    setStep(3);
                                                }}
                                                className="w-full text-left p-3 hover:bg-primary/10 rounded-xl flex items-center gap-3 transition-colors border border-transparent hover:border-primary/20"
                                            >
                                                <Dog size={16} className="text-primary" />
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">{p.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{p.breed || 'Raça não definida'}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {!petData.id && petData.name.length > 2 && pets.length === 0 && (
                                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                        <p className="text-xs font-bold mb-3">Pet não encontrado. Qual a raça?</p>
                                        <input
                                            value={petData.breed}
                                            onChange={e => setPetData(prev => ({ ...prev, breed: e.target.value }))}
                                            placeholder="Ex: Golden Retriever..."
                                            className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary text-sm font-bold mb-3"
                                        />
                                        <button
                                            onClick={() => setStep(3)}
                                            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-black text-xs uppercase tracking-widest"
                                        >
                                            Continuar
                                        </button>
                                    </div>
                                )}

                                <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors">Voltar</button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Data e Hora</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="datetime-local"
                                            value={scheduledAt}
                                            onChange={(e) => setScheduledAt(e.target.value)}
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="bg-accent/30 p-6 rounded-3xl border border-border">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Resumo</p>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-black text-lg leading-tight">{petData.name}</p>
                                            <p className="text-xs font-bold text-muted-foreground">Tutor: {customerData.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-primary uppercase">Para agora</p>
                                            <p className="text-[10px] font-bold text-muted-foreground">{new Date(scheduledAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setStep(2)} className="flex-1 border border-border hover:bg-muted py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Voltar</button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-[2] bg-primary text-primary-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Finalizar Agendamento"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
