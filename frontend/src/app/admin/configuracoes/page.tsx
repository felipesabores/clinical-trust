'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Settings,
    Building2,
    Palette,
    Shield,
    Camera,
    Save,
    Loader2,
    Clock,
    Activity,
    Zap,
    Lock,
    Globe,
    ChevronRight,
} from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { cn } from '@/lib/utils';

import { API } from '@/config';

export default function ConfiguracoesPage() {
    const { config, loading: contextLoading } = useTenant();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        whatsapp: '',
        logo_url: '',
        primary_color: '#3b82f6'
    });

    useEffect(() => {
        if (config) {
            setFormData({
                name: config.name || '',
                description: config.description || '',
                whatsapp: config.whatsapp || '',
                logo_url: config.logo_url || '',
                primary_color: config.primary_color || '#3b82f6'
            });
        }
    }, [config]);

    const handleSave = async () => {
        try {
            setLoading(true);
            await axios.patch(`${API}/api/config`, formData);
            alert('Configurações salvas com sucesso!');
            window.location.reload();
        } catch (error: any) {
            console.error(error);
            alert('Erro ao salvar as configurações.');
        } finally {
            setLoading(false);
        }
    };

    if (contextLoading) return (
        <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Activity className="animate-pulse text-primary" size={48} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">SYNCING SYSTEM_PARAM...</span>
        </div>
    );

    return (
        <div className="p-8 space-y-10 bg-background text-foreground min-h-screen">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 uppercase">
                        <Settings className="text-primary" size={32} />
                        System <span className="text-primary">Orchestration</span>
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground mt-2 opacity-60 italic">GLOBAL CONFIGURATION // CORE PARAMETERS</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-10 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 border border-primary/50"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    DEPLOY CHANGES
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Navigation Nodes */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="space-y-1">
                        {[
                            { id: 'profile', icon: Building2, label: 'CLINIC PROFILE' },
                            { id: 'appearance', icon: Palette, label: 'HUD VISUALS' },
                            { id: 'security', icon: Shield, label: 'ENCRYPTION' },
                            { id: 'integrations', icon: Globe, label: 'DATA TUNNELS' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-6 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border",
                                    activeTab === tab.id
                                        ? "bg-primary text-primary-foreground border-primary shadow-xl"
                                        : "bg-muted/10 border-border/50 text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon size={16} />
                                    {tab.label}
                                </div>
                                <ChevronRight size={14} className={cn("transition-transform", activeTab === tab.id ? "rotate-90" : "")} />
                            </button>
                        ))}
                    </div>

                    {/* Technical Status */}
                    <div className="hud-card p-6 bg-card border-border/50 mt-10">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">SYSTEM_STATUS</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="opacity-40">Integrity</span>
                                <span className="text-emerald-500">Nominal</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="opacity-40">Uptime</span>
                                <span className="text-primary">99.98%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Control Area */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="hud-card p-10 bg-card border-border/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Zap size={80} />
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-primary/10 border border-primary/20 rounded-sm text-primary">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-2xl uppercase tracking-tighter">Identidade de Marca</h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">WHITE-LABEL ASSETS & CONTACT CONFIG</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="md:col-span-2 flex items-center gap-10 pb-8 border-b border-border/10">
                                <div className="w-32 h-32 bg-muted/10 rounded-sm flex items-center justify-center relative overflow-hidden group/logo border border-border/50 hover:border-primary/50 transition-colors shadow-inner">
                                    {formData.logo_url ? (
                                        <img src={formData.logo_url} className="w-full h-full object-cover grayscale active:grayscale-0 transition-all" />
                                    ) : (
                                        <Camera className="text-muted-foreground opacity-20" size={40} />
                                    )}
                                    <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-all cursor-pointer">
                                        <label className="cursor-pointer text-white text-[9px] font-black uppercase tracking-widest">UPLOAD_URL</label>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic border-l border-primary/40 pl-3">LOGOTYPE SOURCE PATH</label>
                                    <input
                                        value={formData.logo_url}
                                        onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                                        placeholder="HTTPS://CDN.PROTOCOL.X/LOGO.PNG"
                                        className="w-full px-6 py-4 bg-muted/5 border border-border/50 rounded-sm text-xs font-black uppercase tracking-widest focus:border-primary/50 outline-none transition-all placeholder:opacity-20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic border-l border-primary/40 pl-3">SYSTEM DISPLAY NAME</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-muted/5 border border-border/50 rounded-sm text-base font-black tracking-tighter uppercase focus:border-primary/50 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic border-l border-primary/40 pl-3">CORE SLOGAN // META_DATA</label>
                                <input
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-muted/5 border border-border/50 rounded-sm text-xs font-black uppercase tracking-widest focus:border-primary/50 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic border-l border-primary/40 pl-3">WHATSAPP DATA TUNNEL</label>
                                <input
                                    value={formData.whatsapp}
                                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    placeholder="5511999999999"
                                    className="w-full px-6 py-4 bg-muted/5 border border-border/50 rounded-sm text-xs font-black tracking-widest focus:border-primary/50 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic border-l border-primary/40 pl-3">PRIMARY_HEX_VALUE</label>
                                <div className="flex gap-4">
                                    <div
                                        className="w-14 h-14 rounded-sm border border-border/50 shadow-xl"
                                        style={{ backgroundColor: formData.primary_color }}
                                    />
                                    <input
                                        value={formData.primary_color}
                                        onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                                        className="flex-1 px-6 py-4 bg-muted/5 border border-border/50 rounded-sm text-xs font-mono font-bold tracking-widest focus:border-primary/50 outline-none transition-all uppercase"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hud-card p-10 bg-card border-border/50 opacity-40 hover:opacity-100 transition-opacity relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Clock size={40} />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-primary/10 border border-primary/20 rounded-sm text-primary">
                                <Clock size={18} />
                            </div>
                            <h3 className="font-black text-lg uppercase tracking-widest">TEMPORAL_VALIDATION_RULES</h3>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-relaxed">System-wide scheduling validation is currently locked to default parameters. Advanced temporal logic module will be unlocked in the next deployment cycle.</p>
                    </div>

                    <div className="flex justify-end gap-6 pt-6">
                        <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40 mr-auto">
                            <Lock size={12} /> SECURE_HANDSHAKE_ENFORCED
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-primary text-primary-foreground px-12 py-5 rounded-sm font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="relative z-10" />}
                            <span className="relative z-10">COMMIT ALL CHANGES</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
