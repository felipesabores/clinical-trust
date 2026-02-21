'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Wifi,
    ChevronRight,
    Building2,
    Clock,
    Phone,
    Loader2,
    Save,
    Camera
} from 'lucide-react';
import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ConfiguracoesPage() {
    const { config, loading: contextLoading } = useTenant();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        whatsapp: '',
        logo_url: '',
        primary_color: '#7c3aed'
    });

    useEffect(() => {
        if (config) {
            setFormData({
                name: config.name || '',
                description: config.description || '',
                whatsapp: config.whatsapp || '',
                logo_url: config.logo_url || '',
                primary_color: config.primary_color || '#7c3aed'
            });
        }
    }, [config]);

    const handleSave = async () => {
        try {
            setLoading(true);
            await axios.patch(`${API}/api/config`, formData);
            alert('Configurações salvas com sucesso!');
            window.location.reload(); // Quick way to refresh context
        } catch (error: any) {
            console.error(error);
            const data = error.response?.data;
            const msg = data?.error || error.message || 'Erro ao salvar configurações';
            const details = data?.details ? `\n\nDetalhes: ${data.details}` : '';
            const code = data?.code ? `\nCódigo: ${data.code}` : '';
            alert(`Erro: ${msg}${details}${code}`);
        } finally {
            setLoading(false);
        }
    };

    if (contextLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Settings className="text-primary" size={28} />
                        Configurações White Label
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium italic">
                        Personalize a identidade da sua clínica e as regras de negócio.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-8 py-3 bg-primary text-white rounded-2xl text-sm font-black shadow-xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 border border-white/20"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    SALVAR ALTERAÇÕES
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Nav */}
                <div className="lg:col-span-1">
                    <nav className="bg-card border rounded-[2rem] p-3 shadow-sm space-y-1">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-primary text-primary-foreground shadow-md">
                            <Building2 size={18} /> Perfil da Clínica
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-all opacity-50 cursor-not-allowed">
                            <Palette size={18} /> Aparência (Em breve)
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-all opacity-50 cursor-not-allowed">
                            <Shield size={18} /> Segurança
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-card border rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="font-black text-lg flex items-center gap-3 mb-8 uppercase tracking-tighter">
                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Building2 size={18} className="text-primary" />
                            </div>
                            Identidade Visual e Contato
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 flex items-center gap-6 mb-4">
                                <div className="w-24 h-24 bg-muted rounded-[2rem] flex items-center justify-center relative overflow-hidden group border border-dashed border-border hover:border-primary/50 transition-colors">
                                    {formData.logo_url ? (
                                        <img src={formData.logo_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="text-muted-foreground" size={32} />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <label className="cursor-pointer text-white text-[10px] font-bold">TROCAR</label>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground">URL do Logotipo</label>
                                    <input
                                        value={formData.logo_url}
                                        onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                                        placeholder="https://suaclinica.com/logo.png"
                                        className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-2xl text-sm font-medium focus:border-primary/30 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Nome Comercial da Clínica</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-2xl text-sm font-bold focus:border-primary/30 outline-none"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Slogan / Descrição Curta</label>
                                <input
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-2xl text-sm font-medium focus:border-primary/30 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">WhatsApp de Contato (DDI+DDD+N)</label>
                                <input
                                    value={formData.whatsapp}
                                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    placeholder="5511999999999"
                                    className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-2xl text-sm font-medium focus:border-primary/30 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Cor Principal (Hex)</label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        value={formData.primary_color}
                                        onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                                        className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer"
                                    />
                                    <input
                                        value={formData.primary_color}
                                        onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                                        className="flex-1 px-4 py-3 bg-muted/50 border border-transparent rounded-2xl text-sm font-mono focus:border-primary/30 outline-none uppercase"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-[2.5rem] p-8 shadow-sm opacity-60">
                        <h3 className="font-black text-lg flex items-center gap-3 mb-6 uppercase tracking-tighter">
                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Clock size={18} />
                            </div>
                            Horário de Funcionamento (Configurável via Admin)
                        </h3>
                        <p className="text-sm font-medium">Os horários serão usados para validar agendamentos automáticos em breve.</p>
                    </div>

                    {/* Bottom Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-12 py-4 bg-primary text-white rounded-[2rem] text-lg font-black shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                            SALVAR TUDO AGORA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
