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
        <div className="p-8 space-y-10 bg-[#F7F8F0] dark:bg-slate-950 text-foreground min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-black tracking-tighter flex items-center gap-4 text-[#355872] dark:text-white uppercase transition-all duration-300">
                        <Settings className="text-[#7AAACE]" size={40} />
                        Orquestração <span className="text-[#7AAACE]">Sistêmica</span>
                    </h1>
                    <p className="text-[10px] uppercase font-black tracking-[0.5em] text-[#355872]/40 dark:text-slate-500 mt-2 pl-1">
                        CENTRAL DE CONTROLE GLOBAL // PARÂMETROS NATIVOS
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="group relative overflow-hidden bg-[#355872] hover:bg-[#7AAACE] text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-[#355872]/20 flex items-center gap-3 border-2 border-[#355872]/10"
                >
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    {loading ? <Loader2 className="animate-spin relative z-10" size={18} /> : <Save size={18} className="relative z-10" />}
                    <span className="relative z-10">Implementar Alterações</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Navigation Nodes */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="space-y-2">
                        {[
                            { id: 'profile', icon: Building2, label: 'PERFIL DA MARCA' },
                            { id: 'appearance', icon: Palette, label: 'AJUSTE VISUAL (HUD)' },
                            { id: 'security', icon: Shield, label: 'ENCRIPTAÇÃO & ACESSO' },
                            { id: 'integrations', icon: Globe, label: 'TÚNEIS DE DADOS' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 group",
                                    activeTab === tab.id
                                        ? "bg-white text-[#355872] border-2 border-[#7AAACE] shadow-2xl shadow-[#7AAACE]/10"
                                        : "bg-white/40 border border-[#E4E9D5] text-[#355872]/40 hover:bg-white hover:text-[#355872] hover:border-[#7AAACE]/40"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon size={18} className={cn("transition-colors", activeTab === tab.id ? "text-[#7AAACE]" : "group-hover:text-[#7AAACE]")} />
                                    {tab.label}
                                </div>
                                <Activity size={12} className={cn("transition-opacity", activeTab === tab.id ? "opacity-100" : "opacity-0")} />
                            </button>
                        ))}
                    </div>

                    {/* Technical Status */}
                    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] border border-[#E4E9D5] dark:border-white/5 relative overflow-hidden ring-1 ring-black/5 hover:shadow-2xl transition-all duration-500">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#355872]/30 dark:text-slate-500 mb-6">DIAGNÓSTICO_CORE</p>
                        <div className="space-y-5">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-[#355872]/50">Integridade</span>
                                <span className="text-emerald-500 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    NOMINAL
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-[#355872]/50">Uptime Global</span>
                                <span className="text-[#7AAACE]">99.98%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Control Area */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-[#E4E9D5] dark:border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 p-8 opacity-[0.02] dark:opacity-[0.05] group-hover:opacity-[0.05] group-hover:rotate-12 transition-all duration-1000">
                            <Zap size={300} />
                        </div>

                        <div className="flex items-center gap-6 mb-12">
                            <div className="p-4 bg-[#7AAACE]/10 border-2 border-[#7AAACE]/20 rounded-2xl text-[#355872]">
                                <Building2 size={32} />
                            </div>
                            <div>
                                <h3 className="font-heading font-black text-3xl text-[#355872] dark:text-white uppercase tracking-tighter">Assinatura de Marca</h3>
                                <p className="text-[10px] text-[#355872]/30 font-black uppercase tracking-[0.4em] mt-1 pl-1">PREMIUM IDENTITY & COMMUNICATION ASSETS</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-12 pb-12 border-b border-[#E4E9D5] dark:border-white/10">
                                <div className="w-40 h-40 bg-[#F7F8F0] dark:bg-slate-800 rounded-[2rem] flex items-center justify-center relative overflow-hidden group/logo border-2 border-[#E4E9D5] hover:border-[#7AAACE] transition-all duration-500 shadow-inner">
                                    {formData.logo_url ? (
                                        <img src={formData.logo_url} className="w-full h-full object-cover transition-all duration-500 filter hover:contrast-125" />
                                    ) : (
                                        <Camera className="text-[#355872]/10" size={48} />
                                    )}
                                    <div className="absolute inset-0 bg-[#355872]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-all duration-500 cursor-pointer">
                                        <label className="cursor-pointer text-white text-[10px] font-black uppercase tracking-widest px-4 text-center">Alterar Logotipo</label>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#355872]/40 dark:text-slate-400 italic border-l-4 border-[#7AAACE] pl-4">PATH_FONTE_VISUAL</label>
                                    <input
                                        value={formData.logo_url}
                                        onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                                        placeholder="EX: CLOUD.STORAGE/BRAND/LOGO.SVG"
                                        className="w-full px-8 py-5 bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl text-sm font-bold text-[#355872] dark:text-white placeholder:text-[#355872]/20 focus:border-[#7AAACE] focus:ring-4 focus:ring-[#7AAACE]/5 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#355872]/40 dark:text-slate-400 italic border-l-4 border-[#7AAACE] pl-4">NOME ESTRUTURAL</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-8 py-5 bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl text-xl font-heading font-black tracking-tight text-[#355872] dark:text-white uppercase focus:border-[#7AAACE] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#355872]/40 dark:text-slate-400 italic border-l-4 border-[#7AAACE] pl-4">TAGLINE // META_TAG</label>
                                <input
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-8 py-5 bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl text-sm font-bold tracking-widest text-[#355872]/80 dark:text-white uppercase focus:border-[#7AAACE] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#355872]/40 dark:text-slate-400 italic border-l-4 border-[#7AAACE] pl-4">CANAL WHATSAPP_API</label>
                                <input
                                    value={formData.whatsapp}
                                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    placeholder="+55 11 99999-9999"
                                    className="w-full px-8 py-5 bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl text-sm font-black tracking-[0.2em] text-[#355872] dark:text-white focus:border-[#7AAACE] outline-none transition-all tabular-nums"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#355872]/40 dark:text-slate-400 italic border-l-4 border-[#7AAACE] pl-4">CSS_PRIMARY_HEX</label>
                                <div className="flex gap-4">
                                    <div
                                        className="w-16 h-16 rounded-2xl border-4 border-white shadow-2xl relative z-10"
                                        style={{ backgroundColor: formData.primary_color }}
                                    >
                                        <div className="absolute inset-0 bg-black/5 rounded-xl shadow-inner" />
                                    </div>
                                    <input
                                        value={formData.primary_color}
                                        onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                                        className="flex-1 px-8 py-5 bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl text-sm font-mono font-black text-[#355872] dark:text-white focus:border-[#7AAACE] outline-none transition-all uppercase"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm p-10 rounded-[2.5rem] border border-[#E4E9D5] dark:border-white/5 opacity-60 hover:opacity-100 transition-all duration-500 relative group overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 p-8 opacity-[0.03] group-hover:rotate-45 transition-transform duration-1000">
                            <Clock size={160} />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#355872]/5 rounded-xl text-[#355872]">
                                <Clock size={24} />
                            </div>
                            <h3 className="font-black text-xl text-[#355872] uppercase tracking-[0.2em]">VALIDAÇÃO_TEMPORAL</h3>
                        </div>
                        <p className="text-[10px] text-[#355872]/60 font-black uppercase tracking-[0.3em] leading-relaxed max-w-2xl">A lógica de agendamento está restrita aos parâmetros de core. Módulos avançados de heurística temporal estarão ativos no próximo ciclo de sincronização.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 px-4">
                        <div className="flex items-center gap-4 text-[10px] font-black text-[#355872]/30 uppercase tracking-[0.4em]">
                            <div className="flex items-center justify-center p-2 bg-[#F7F8F0] rounded-lg">
                                <Lock size={14} className="text-[#355872]/40" />
                            </div>
                            Conexão Segura // Protocolo AES-256
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full md:w-auto bg-[#355872] hover:bg-[#7AAACE] text-white px-16 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_24px_48px_-12px_rgba(53,88,114,0.4)] hover:shadow-[0_24px_48px_-12px_rgba(122,170,206,0.4)] hover:scale-[1.05] active:scale-95 transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            {loading ? <Loader2 className="animate-spin relative z-10" size={24} /> : <Zap size={24} className="relative z-10 text-[#7AAACE]" />}
                            <span className="relative z-10">Consolidar Infraestrutura</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
