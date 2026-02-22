'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
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

import { API } from '@/config';

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
            const res = await axios.get(`${API}/api/staff?tenantId=${tenantId}`);
            setStaff(res.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tenantId) fetchStaff();
    }, [tenantId]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const res = await axios.post(`${API}/api/upload/avatar`, formData, {
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
                await axios.patch(`${API}/api/staff/${editingMember.id}`, {
                    ...newMember,
                    commission: parseFloat(newMember.commission as any)
                });
            } else {
                await axios.post(`${API}/api/staff`, {
                    ...newMember,
                    tenant_id: tenantId,
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
            await axios.delete(`${API}/api/staff/${id}`);
            fetchStaff();
        } catch (error) {
            alert('Erro ao excluir membro da equipe');
        }
    };

    if (loading && staff.length === 0) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="animate-spin text-indigo-400" size={40} />
            <span className="text-sm font-medium text-slate-400">Carregando equipe...</span>
        </div>
    );

    return (
        <div className="p-8 space-y-10 bg-background text-foreground min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-heading font-semibold tracking-tight text-white flex items-center gap-3">
                        <Users className="text-indigo-400" size={24} />
                        Equipe
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Gerencie os colaboradores, comissões e acessos da clínica.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"
                >
                    <UserPlus size={18} />
                    Adicionar Colaborador
                </button>
            </header>

            {/* Matrix View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {staff.map((member: any) => (
                    <div key={member.id} className="glass-panel p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-indigo-500/10 blur-xl" />

                        <div className="relative flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl border border-white/10 p-1 mb-5 relative bg-slate-800/50 shadow-inner">
                                {member.avatar_url ? (
                                    <img src={member.avatar_url} className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <div className="w-full h-full rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-400">
                                        <Users size={28} />
                                    </div>
                                )}
                            </div>

                            <h3 className="font-heading font-semibold text-lg text-slate-100">{member.name}</h3>
                            <span className="text-xs font-medium text-indigo-400 mb-5">{member.role}</span>

                            <div className="w-full space-y-3 pt-5 border-t border-white/5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2 h-2 rounded-full", member.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-rose-500")} />
                                        <span className="text-slate-300 font-medium">{member.is_active ? 'Ativo' : 'Inativo'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Comissão</span>
                                    <span className="text-indigo-400 font-semibold tabular-nums">{member.commission}%</span>
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
                                    className="flex-1 p-2.5 bg-slate-800 border border-white/5 rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-slate-400 hover:text-indigo-400"
                                >
                                    <MoreVertical size={16} className="mx-auto" />
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id, member.name)}
                                    className="flex-1 p-2.5 bg-slate-800 border border-white/5 rounded-xl hover:bg-rose-500/10 hover:border-rose-500/30 transition-all text-slate-400 hover:text-rose-400"
                                >
                                    <Trash2 size={16} className="mx-auto" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => { setShowModal(false); resetForm(); }} />
                    <div className="glass-panel w-full max-w-xl relative p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <h2 className="text-xl font-heading font-semibold text-white mb-6 flex items-center gap-3 shrink-0">
                            <UserPlus className="text-indigo-400" />
                            {editingMember ? 'Editar Colaborador' : 'Novo Colaborador'}
                        </h2>

                        <div className="space-y-6 overflow-y-auto custom-scrollbar-thin pr-2">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 rounded-full border border-white/10 p-1 relative mb-4 group cursor-pointer overflow-hidden bg-slate-800">
                                    <input
                                        type="file"
                                        onChange={handleUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        accept="image/*"
                                    />
                                    {newMember.avatar_url ? (
                                        <img src={newMember.avatar_url} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400">
                                            {uploading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-full">
                                        <p className="text-xs font-medium text-white">{uploading ? 'Enviando...' : 'Alterar Foto'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Nome Completo</label>
                                    <input
                                        value={newMember.name}
                                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                        placeholder="Ex: João da Silva"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Cargo</label>
                                    <select
                                        value={newMember.role}
                                        onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all appearance-none"
                                    >
                                        <option value="GROOMER">Esteticista / Tosador</option>
                                        <option value="BANHISTA">Banhista</option>
                                        <option value="RECEPTIONIST">Recepcionista</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Comissão (%)</label>
                                    <input
                                        type="number"
                                        value={newMember.commission}
                                        onChange={e => setNewMember({ ...newMember, commission: e.target.value as any })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none tabular-nums transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Telefone</label>
                                    <input
                                        value={newMember.phone}
                                        onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                        placeholder="(11) 99999-9999"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">E-mail</label>
                                    <input
                                        value={newMember.email}
                                        onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                        placeholder="email@exemplo.com"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-white/5 shrink-0">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-indigo-500/20"
                            >
                                {editingMember ? 'Salvar Alterações' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
