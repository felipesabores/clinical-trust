'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import {
    Users,
    Plus,
    Mail,
    Phone,
    UserPlus,
    Activity,
    Shield,
    Briefcase,
    MoreVertical,
    Search,
    Filter,
    Award,
    Zap,
    Loader2,
    Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';

export default function EquipePage() {
    const { config } = useTenant();
    const tenantId = config?.id;
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [newMember, setNewMember] = useState({
        name: '',
        role: 'GROOMER',
        phone: '',
        email: '',
        commission: 0,
        avatar_url: '',
        is_active: true
    });

    const resetForm = () => {
        setNewMember({
            name: '',
            role: 'GROOMER',
            phone: '',
            email: '',
            commission: 0,
            avatar_url: '',
            is_active: true
        });
        setEditingMember(null);
    };

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/api/staff`);
            setStaff(res.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const res = await apiClient.post(`/api/upload/avatar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNewMember({ ...newMember, avatar_url: res.data.url });
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erro ao fazer upload do avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (editingMember) {
                await apiClient.patch(`/api/staff/${editingMember.id}`, {
                    ...newMember,
                    commission: parseFloat(newMember.commission as any)
                });
            } else {
                await apiClient.post(`/api/staff`, {
                    ...newMember,
                    commission: parseFloat(newMember.commission as any)
                });
            }
            setShowModal(false);
            resetForm();
            fetchStaff();
        } catch (error) {
            alert('Erro ao salvar membro da equipe');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja remover ${name} da equipe?`)) return;
        try {
            await apiClient.delete(`/api/staff/${id}`);
            fetchStaff();
        } catch (error) {
            alert('Erro ao excluir membro da equipe');
        }
    };

    if (loading && staff.length === 0) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-6 bg-[#F7F8F0] dark:bg-slate-950">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#7AAACE]/20 border-t-[#7AAACE] rounded-full animate-spin" />
                <Users className="absolute inset-0 m-auto text-[#7AAACE] animate-pulse" size={24} />
            </div>
            <span className="text-sm font-black text-[#355872]/40 uppercase tracking-[0.2em]">Sincronizando Talentos...</span>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-10 bg-[#F7F8F0] dark:bg-slate-950 text-foreground min-h-[calc(100vh-64px)] overflow-x-hidden">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shrink-0 mb-8 px-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#355872] dark:text-white flex items-center gap-3">
                        <Users className="text-[#7AAACE]" size={32} />
                        Gestão de Talentos
                    </h1>
                    <p className="text-[#355872]/60 font-medium mt-1">
                        Gerencie os colaboradores, comissões e acessos da sua marca.
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 sm:px-8 py-2.5 bg-[#7AAACE] hover:bg-[#355872] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#7AAACE]/20 hover:shadow-[#355872]/20 transition-all duration-300 w-full sm:w-auto justify-center shrink-0"
                >
                    <UserPlus size={18} />
                    <span>Adicionar Colaborador</span>
                </button>
            </header>

            {/* Matrix View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {staff.map((member: any) => (
                    <div key={member.id} className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-[#E4E9D5] dark:border-white/5 relative overflow-hidden group hover:border-[#7AAACE]/50 transition-all duration-500 shadow-sm hover:shadow-2xl">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7AAACE]/5 to-transparent rounded-bl-full pointer-events-none" />

                        <div className="relative flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-3xl border border-[#E4E9D5] dark:border-white/10 p-1 mb-6 relative bg-[#F7F8F0] dark:bg-slate-800 shadow-sm group-hover:scale-105 transition-transform">
                                {member.avatar_url ? (
                                    <img src={member.avatar_url} className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <div className="w-full h-full rounded-2xl bg-[#E4E9D5]/30 flex items-center justify-center text-[#355872]/30">
                                        <Users size={32} />
                                    </div>
                                )}
                            </div>

                            <h3 className="font-heading font-black text-xl text-[#355872] dark:text-white tracking-tight">{member.name}</h3>
                            <span className="text-[10px] font-black text-[#7AAACE] uppercase tracking-widest mt-1 mb-6">{member.role}</span>

                            <div className="w-full space-y-4 pt-6 border-t border-[#E4E9D5] dark:border-white/5">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                                    <span className="text-[#355872]/40">Status Operacional</span>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2 h-2 rounded-full", member.is_active ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-rose-500")} />
                                        <span className={cn("font-black", member.is_active ? "text-emerald-600" : "text-rose-600")}>{member.is_active ? 'Online' : 'Offline'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                                    <span className="text-[#355872]/40">Taxa de Comissão</span>
                                    <span className="text-[#355872] dark:text-white italic">{member.commission}%</span>
                                </div>
                            </div>

                            <div className="w-full flex gap-3 mt-5">
                                <button
                                    onClick={() => {
                                        setEditingMember(member);
                                        setNewMember({
                                            name: member.name,
                                            role: member.role,
                                            phone: member.phone || '',
                                            email: member.email || '',
                                            commission: member.commission,
                                            avatar_url: member.avatar_url || '',
                                            is_active: member.is_active
                                        });
                                        setShowModal(true);
                                    }}
                                    className="flex-1 p-3 bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/5 rounded-2xl hover:bg-[#7AAACE]/10 hover:border-[#7AAACE] transition-all text-[#355872]/40 hover:text-[#7AAACE] flex items-center justify-center"
                                >
                                    <MoreVertical size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id, member.name)}
                                    className="flex-1 p-3 bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/5 rounded-2xl hover:bg-rose-500/10 hover:border-rose-500/30 transition-all text-[#355872]/40 hover:text-rose-500 flex items-center justify-center"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-[#355872]/60 backdrop-blur-xl" onClick={() => { setShowModal(false); resetForm(); }} />
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl relative p-6 sm:p-8 shadow-[0_32px_128px_-12px_rgba(53,88,114,0.3)] rounded-[2rem] sm:rounded-[3rem] border border-[#7AAACE]/20 overflow-hidden flex flex-col max-h-[95vh]">
                        <div className="shrink-0 flex justify-between items-start mb-6 sm:mb-10">
                            <div>
                                <h1 className="text-3xl font-heading font-black text-[#355872] dark:text-white-8 flex items-center gap-3">
                                    <UserPlus className="text-[#7AAACE]" size={36} />
                                    {editingMember ? 'Perfil do Talento' : 'Novo Talento'}
                                </h1>
                                <p className="text-[10px] font-black text-[#355872]/30 uppercase tracking-[0.2em] mt-2">Personalize as permissões e dados do colaborador</p>
                            </div>
                        </div>

                        <div className="space-y-10 overflow-y-auto custom-scrollbar-thin pr-4 pb-4">
                            {/* Avatar section */}
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-[2.5rem] border-2 border-dashed border-[#E4E9D5] p-2 relative group cursor-pointer hover:border-[#7AAACE] transition-all">
                                    <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                                    {newMember.avatar_url ? (
                                        <img src={newMember.avatar_url} className="w-full h-full object-cover rounded-[2rem]" />
                                    ) : (
                                        <div className="w-full h-full rounded-[2rem] bg-[#F7F8F0] flex items-center justify-center text-[#7AAACE]">
                                            {uploading ? <Loader2 className="animate-spin" /> : <Plus size={40} />}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-[#355872]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-[2rem]">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{uploading ? 'Enviando...' : 'Trocar Foto'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                                <div className="col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-[#355872]/40 uppercase tracking-widest ml-1">Nome Completo</label>
                                    <input
                                        value={newMember.name}
                                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                        placeholder="Ex: Dra. Mariana Lima"
                                        className="w-full bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-[#355872] dark:text-white placeholder:text-[#355872]/30 focus:border-[#7AAACE] focus:ring-4 focus:ring-[#7AAACE]/10 outline-none transition-all font-bold"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#355872]/40 uppercase tracking-widest ml-1">Cargo / Especialidade</label>
                                    <div className="relative">
                                        <select
                                            value={newMember.role}
                                            onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                                            className="w-full bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-[#355872] dark:text-white focus:border-[#7AAACE] focus:ring-4 focus:ring-[#7AAACE]/10 outline-none appearance-none transition-all font-bold pr-12"
                                        >
                                            <option value="GROOMER">Veterinário(a)</option>
                                            <option value="BANHISTA">Assistente</option>
                                            <option value="RECEPTIONIST">Recepcionista</option>
                                            <option value="ADMIN">Administrador(a)</option>
                                        </select>
                                        <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7AAACE]/40" size={20} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#355872]/40 uppercase tracking-widest ml-1">Comissão (%)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={newMember.commission}
                                            onChange={e => setNewMember({ ...newMember, commission: e.target.value as any })}
                                            className="w-full bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-[#355872] dark:text-white focus:border-[#7AAACE] focus:ring-4 focus:ring-[#7AAACE]/10 outline-none transition-all font-bold tabular-nums pr-12"
                                        />
                                        <Award className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7AAACE]/40" size={20} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#355872]/40 uppercase tracking-widest ml-1">Telefone Direto</label>
                                    <div className="relative">
                                        <input
                                            value={newMember.phone}
                                            onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                            placeholder="(11) 99999-9999"
                                            className="w-full bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-[#355872] dark:text-white placeholder:text-[#355872]/30 focus:border-[#7AAACE] focus:ring-4 focus:ring-[#7AAACE]/10 outline-none transition-all font-bold"
                                        />
                                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7AAACE]/40" size={20} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#355872]/40 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                                    <div className="relative">
                                        <input
                                            value={newMember.email}
                                            onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                            placeholder="email@suaclinica.com"
                                            className="w-full bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-[#355872] dark:text-white placeholder:text-[#355872]/30 focus:border-[#7AAACE] focus:ring-4 focus:ring-[#7AAACE]/10 outline-none transition-all font-bold"
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7AAACE]/40" size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-10 mt-6 border-t border-[#E4E9D5] dark:border-white/5 shrink-0">
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="px-8 py-3 rounded-2xl text-[10px] font-black text-[#355872]/40 hover:text-[#355872] hover:bg-[#F7F8F0] transition-all uppercase tracking-[0.2em]"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-12 py-3 bg-[#355872] hover:bg-[#7AAACE] text-white rounded-2xl font-black text-[11px] transition-all shadow-xl shadow-[#355872]/20 uppercase tracking-[0.2em]"
                            >
                                {editingMember ? 'Atualizar Perfil' : 'Finalizar Cadastro'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
