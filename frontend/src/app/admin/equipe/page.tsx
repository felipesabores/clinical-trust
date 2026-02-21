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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function EquipePage() {
    const { config } = useTenant();
    const tenantId = config?.id;
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '',
        role: 'GROOMER',
        phone: '',
        email: '',
        commission: 0,
        avatar_url: ''
    });

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

    const handleCreate = async () => {
        try {
            await axios.post(`${API}/api/staff`, {
                ...newMember,
                tenant_id: tenantId,
                commission: parseFloat(newMember.commission as any)
            });
            setShowModal(false);
            fetchStaff();
        } catch (error) {
            alert('Erro ao cadastrar membro da equipe');
        }
    };

    if (loading && staff.length === 0) return (
        <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Activity className="animate-pulse text-primary" size={48} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">RECRUITING_ASSETS...</span>
        </div>
    );

    return (
        <div className="p-8 space-y-10 bg-background text-foreground min-h-screen">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 uppercase">
                        <Users className="text-primary" size={32} />
                        Team <span className="text-primary">Ops Center</span>
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground mt-2 opacity-60 italic">HUMAN_ASSETS // PERFORMANCE_MATRIX</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-primary-foreground px-10 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 border border-primary/50"
                >
                    <UserPlus size={18} />
                    PROVISION_ASSET
                </button>
            </header>

            {/* Matrix View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {staff.map((member: any) => (
                    <div key={member.id} className="hud-card bg-card border-border/50 p-8 relative overflow-hidden group hover:border-primary/40 transition-all shadow-xl">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-primary/20 blur-2xl" />

                        <div className="relative flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-sm border border-border/50 p-1 mb-6 relative">
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
                                {member.avatar_url ? (
                                    <img src={member.avatar_url} className="w-full h-full object-cover grayscale active:grayscale-0 transition-all" />
                                ) : (
                                    <div className="w-full h-full bg-muted/20 flex items-center justify-center opacity-30">
                                        <Users size={32} />
                                    </div>
                                )}
                            </div>

                            <h3 className="font-black text-lg uppercase tracking-tight text-foreground">{member.name}</h3>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-6">{member.role}</span>

                            <div className="w-full space-y-3 pt-6 border-t border-border/20">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-muted-foreground uppercase tracking-widest opacity-40">Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", member.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-rose-500")} />
                                        <span className="uppercase tracking-widest">{member.is_active ? 'Active' : 'Offline'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-muted-foreground uppercase tracking-widest opacity-40">Commission</span>
                                    <span className="text-primary font-black tabular-nums">{member.commission}%</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-8 w-full">
                                <button className="flex-1 p-3 bg-muted/10 border border-border/50 rounded-sm hover:bg-muted/20 transition-all text-muted-foreground hover:text-foreground">
                                    <Mail size={14} className="mx-auto" />
                                </button>
                                <button className="flex-1 p-3 bg-muted/10 border border-border/50 rounded-sm hover:bg-muted/20 transition-all text-muted-foreground hover:text-foreground">
                                    <Phone size={14} className="mx-auto" />
                                </button>
                                <button className="flex-1 p-3 bg-muted/10 border border-border/50 rounded-sm hover:bg-muted/20 transition-all text-muted-foreground hover:text-foreground">
                                    <MoreVertical size={14} className="mx-auto" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="hud-card bg-card border-primary/30 w-full max-w-xl relative p-10 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary" />

                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <UserPlus className="text-primary" />
                            ASSET_INITIALIZATION_PROTOCOL
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic border-l border-primary/40 pl-3">Full Legal Name</label>
                                    <input
                                        value={newMember.name}
                                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                        placeholder="ASSET_IDENTIFIER..."
                                        className="w-full bg-muted/5 border border-border/50 rounded-sm px-6 py-4 text-base font-black tracking-tight focus:border-primary/50 outline-none uppercase"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic border-l border-primary/40 pl-3">Role_Assignment</label>
                                    <select
                                        value={newMember.role}
                                        onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                                        className="w-full bg-muted border-border/50 rounded-sm px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-primary/50 outline-none transition-all border appearance-none"
                                    >
                                        <option value="GROOMER">HEAD_GROOMER</option>
                                        <option value="VETERINARIAN">MEDICAL_CORPS</option>
                                        <option value="RECEPTIONIST">COMM_CENTER</option>
                                        <option value="ADMIN">COMMAND_LEVEL_S</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic border-l border-primary/40 pl-3">Performance_Comm (%)</label>
                                    <input
                                        type="number"
                                        value={newMember.commission}
                                        onChange={e => setNewMember({ ...newMember, commission: e.target.value as any })}
                                        className="w-full bg-muted/5 border border-border/50 rounded-sm px-6 py-4 text-lg font-black tracking-widest focus:border-primary/50 outline-none tabular-nums"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic border-l border-primary/40 pl-3">Data Tunnel (Phone)</label>
                                    <input
                                        value={newMember.phone}
                                        onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                        placeholder="55XXXXXXXXXXX"
                                        className="w-full bg-muted/5 border border-border/50 rounded-sm px-6 py-4 text-[10px] font-black tracking-widest focus:border-primary/50 outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic border-l border-primary/40 pl-3">Comms Link (Email)</label>
                                    <input
                                        value={newMember.email}
                                        onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                        placeholder="ASSET@PROTOCOL.IO"
                                        className="w-full bg-muted/5 border border-border/50 rounded-sm px-6 py-4 text-[10px] font-black tracking-widest focus:border-primary/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/20 transition-all border border-transparent"
                                >
                                    ABORT_PROVISION
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="px-10 py-4 bg-primary text-primary-foreground rounded-sm font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 border border-primary/50"
                                >
                                    INITIALIZE_ASSET
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
