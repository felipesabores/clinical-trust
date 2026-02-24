'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, User, Timer, Activity, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { API } from '@/config';
import { useTenant } from '@/context/TenantContext';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    targetDate?: Date;
    initialData?: {
        id: string;
        pet_id: string;
        staff_id?: string;
        scheduled_at: string; // ISO String
        end_time?: string;
        status: string;
    } | null;
}

const statusOptions = [
    { value: 'SCHEDULED', label: 'Agendado' },
    { value: 'RECEPTION', label: 'Recepção' },
    { value: 'BATHING', label: 'Banho' },
    { value: 'GROOMING', label: 'Tosa' },
    { value: 'DRYING', label: 'Secagem' },
    { value: 'READY', label: 'Pronto' },
    { value: 'DONE', label: 'Finalizado' },
];

export default function AppointmentModal({ isOpen, onClose, onSuccess, targetDate, initialData }: AppointmentModalProps) {
    const { config } = useTenant();
    const tenantId = config?.id;

    const [loading, setLoading] = useState(false);
    const [pets, setPets] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);

    // Form fields
    const [petId, setPetId] = useState('');
    const [staffId, setStaffId] = useState('');
    const [dateStr, setDateStr] = useState('');
    const [timeStr, setTimeStr] = useState('09:00');
    const [durationMins, setDurationMins] = useState(60);
    const [status, setStatus] = useState('SCHEDULED');

    useEffect(() => {
        if (!isOpen || !tenantId) return;

        const fetchData = async () => {
            try {
                // Fetch pets for dropdown
                const petsRes = await axios.get(`${API}/api/customers?tenantId=${tenantId}`);
                // Customers endpoint returns customers with their pets. We need to flatten to a pet list
                const allPets = petsRes.data.flatMap((c: any) => c.pets.map((p: any) => ({ ...p, customerName: c.name })));
                setPets(allPets);

                // Fetch staff
                const staffRes = await axios.get(`${API}/api/staff?tenantId=${tenantId}`);
                setStaff(staffRes.data);
            } catch (err) {
                console.error("Error fetching modal data", err);
            }
        };

        fetchData();

        if (initialData) {
            const dt = new Date(initialData.scheduled_at);
            setPetId(initialData.pet_id || '');
            setStaffId(initialData.staff_id || '');
            setDateStr(dt.toISOString().split('T')[0] || '');
            setTimeStr(`${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`);
            setStatus(initialData.status);

            if (initialData.end_time) {
                const endDt = new Date(initialData.end_time);
                const diffMins = Math.round((endDt.getTime() - dt.getTime()) / 60000);
                setDurationMins(diffMins);
            } else {
                setDurationMins(60);
            }
        } else {
            // New appointment
            setPetId('');
            setStaffId('');
            setStatus('SCHEDULED');
            setDurationMins(60);

            // Default to target date or today
            const baseDate = targetDate || new Date();
            setDateStr(baseDate.toISOString().split('T')[0] || '');
            setTimeStr('09:00');
        }
    }, [isOpen, initialData, tenantId, targetDate]);


    const handleSubmit = async () => {
        if (!petId || !dateStr || !timeStr) return;
        setLoading(true);

        // Standardize datetime creation locally
        const [year, month, day] = dateStr.split('-');
        const [hours, minutes] = timeStr.split(':');
        const scheduled_at = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));

        const payload = {
            tenant_id: tenantId,
            pet_id: petId,
            staff_id: staffId || null,
            scheduled_at: scheduled_at.toISOString(),
            duration_minutes: durationMins,
            status
        };

        try {
            if (initialData) {
                await axios.patch(`${API}/api/appointments/${initialData.id}`, payload);
            } else {
                await axios.post(`${API}/api/appointments`, payload);
            }
            onSuccess();
            onClose();
        } catch (e) {
            console.error('Error saving appointment', e);
            alert('Erro ao salvar agendamento');
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
                    className="relative bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0 bg-slate-800/50">
                        <div>
                            <h2 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
                                <Calendar className="text-indigo-400" size={20} />
                                {initialData ? 'Editar Agendamento' : 'Novo Agendamento'}
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Preencha os dados para bloquear a agenda.
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">

                        {/* Pet Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Paciente (Pet)</label>
                            <select
                                value={petId}
                                onChange={e => setPetId(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-medium focus:border-indigo-500 focus:outline-none transition-colors appearance-none"
                            >
                                <option value="" disabled>Selecione um Pet...</option>
                                {pets.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.customerName})</option>
                                ))}
                            </select>
                        </div>

                        {/* Professional Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Profissional / Equipe</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <select
                                    value={staffId}
                                    onChange={e => setStaffId(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 text-sm text-white font-medium focus:border-indigo-500 focus:outline-none transition-colors appearance-none"
                                >
                                    <option value="">Sem atribuição específica</option>
                                    {staff.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} - {s.role}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date and Time Group */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Data</label>
                                <input
                                    type="date"
                                    value={dateStr}
                                    onChange={e => setDateStr(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-medium focus:border-indigo-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Horário</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="time"
                                        value={timeStr}
                                        onChange={e => setTimeStr(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 text-sm text-white font-medium focus:border-indigo-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Duration & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Duração Estimada</label>
                                <div className="relative">
                                    <Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <select
                                        value={durationMins}
                                        onChange={e => setDurationMins(Number(e.target.value))}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 text-sm text-white font-medium focus:border-indigo-500 focus:outline-none transition-colors appearance-none"
                                    >
                                        <option value={30}>30 Minutos</option>
                                        <option value={60}>1 Hora</option>
                                        <option value={90}>1h 30m</option>
                                        <option value={120}>2 Horas</option>
                                        <option value={150}>2h 30m</option>
                                        <option value={180}>3 Horas</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                <div className="relative">
                                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 text-sm text-white font-medium focus:border-indigo-500 focus:outline-none transition-colors appearance-none"
                                    >
                                        {statusOptions.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/10 bg-slate-900/80 shrink-0 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl font-medium text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !petId || !dateStr || !timeStr}
                            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {initialData ? 'Atualizar' : 'Agendar'}
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}
