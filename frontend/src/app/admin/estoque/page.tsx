'use client';

import {
    Package,
    Search,
    Plus,
    Filter,
    AlertTriangle,
    TrendingDown,
    MoreVertical,
    Tag,
    Boxes,
    BarChart2,
    Zap,
} from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
import { cn } from '@/lib/utils';

function StockBadge({ stock, min }: { stock: number; min: number }) {
    if (stock === 0) return (
        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-sm">
            <AlertTriangle size={10} /> ESGOTADO
        </span>
    );
    if (stock <= min) return (
        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-sm">
            <TrendingDown size={10} /> CRÍTICO
        </span>
    );
    return (
        <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-sm">
            NOMINAL
        </span>
    );
}

const categories = ['Todos', 'Banho', 'Tosa', 'Higiene / Estética', 'Acessórios', 'Alimentos'];

export default function EstoquePage() {
    const { config } = useTenant();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        if (!config?.id) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API}/api/products?tenantId=${config.id}`);
            setItems(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [config?.id]);
    const lowStock = items.filter(i => i.stock <= i.min).length;

    return (
        <div className="p-8 space-y-10 bg-background text-foreground min-h-screen">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 uppercase">
                        <Boxes className="text-primary" size={32} />
                        Gerenciamento <span className="text-primary">Insumos</span>
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground mt-2 opacity-60 italic">LOGÍSTICA DE MATERIAIS // TERMINAL INVENTORY-09</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-sm text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all border border-primary/50">
                    <Plus size={18} /> CADASTRAR ITEM
                </button>
            </header>

            {/* Metrics Bar */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Itens Totais', value: '142', icon: Tag, color: 'text-primary' },
                    { label: 'Valor em Estoque', value: 'R$ 12.450', icon: BarChart2, color: 'text-primary' },
                    { label: 'Saídas (Hoje)', value: '24', icon: Zap, color: 'text-emerald-500' },
                    { label: 'Alertas', value: lowStock.toString(), icon: AlertTriangle, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className="hud-card p-4 flex items-center gap-4 bg-muted/5">
                        <div className={cn("p-2.5 bg-muted/10 border border-border/50 rounded-sm", stat.color)}>
                            <stat.icon size={18} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{stat.label}</p>
                            <p className="text-lg font-black tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alert bar */}
            {lowStock > 0 && (
                <div className="flex items-center gap-5 p-5 bg-amber-500/[0.03] border border-amber-500/20 rounded-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-sm flex items-center justify-center shrink-0">
                        <AlertTriangle size={24} className="text-amber-500 animate-pulse" />
                    </div>
                    <div>
                        <p className="font-black text-amber-500 text-xs uppercase tracking-widest flex items-center gap-2">
                            ALERTA DE REPOSIÇÃO NECESSÁRIA
                        </p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-70 italic">
                            {lowStock} material(is) abaixo do limite de segurança.
                        </p>
                    </div>
                    <button className="ml-auto text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors border-b border-amber-500/30 hover:border-amber-500">
                        EXECUTAR COMPRA
                    </button>
                </div>
            )}

            {/* Control Bar */}
            <div className="flex items-center gap-6 flex-wrap sticky top-0 bg-background/80 backdrop-blur-md py-4 z-10">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-30" size={18} />
                    <input
                        type="text"
                        placeholder="BUSCAR PRODUTO OU SKU..."
                        className="w-full pl-14 pr-5 py-5 bg-muted/10 border border-border/50 rounded-sm focus:border-primary/50 transition-all outline-none font-black uppercase text-[10px] tracking-widest shadow-sm placeholder:opacity-30"
                    />
                </div>
                <div className="flex gap-2 p-1.5 bg-muted/10 border border-border/50 rounded-sm">
                    {categories.map((cat, i) => (
                        <button
                            key={cat}
                            className={cn(
                                "px-5 py-2.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all",
                                i === 0
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-3 px-6 py-4 bg-muted/10 border border-border/50 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-muted/20 transition-all">
                    <Filter size={16} className="text-primary" /> FILTROS AVANÇADOS
                </button>
            </div>

            {/* Item grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.sku} className="hud-card p-0 overflow-hidden bg-card border-border/50 group hover:border-primary/40 transition-all shadow-xl shadow-transparent hover:shadow-primary/5 border-t-2 border-transparent hover:border-t-primary">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-muted/20 border border-border/50 rounded-sm flex items-center justify-center group-hover:bg-primary/5 transition-colors relative">
                                    <Package size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-card border border-border/50 flex items-center justify-center">
                                        <Tag size={10} className="text-primary/40" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StockBadge stock={item.stock} min={item.min} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 italic">{item.sku}</span>
                                </div>
                            </div>

                            <h3 className="font-black text-lg uppercase tracking-tight mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50 mb-6">{item.category}</p>

                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border/10">
                                <div>
                                    <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 opacity-40 underline underline-offset-4 decoration-primary/30">QUANTIDADE</p>
                                    <p className="text-3xl font-black tabular-nums tracking-tighter">
                                        {item.stock}
                                        <span className="text-[10px] font-bold text-muted-foreground ml-2 opacity-40">{item.unit}</span>
                                    </p>
                                </div>
                                <div className="border-l border-border/10 pl-4">
                                    <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 opacity-40 underline underline-offset-4 decoration-primary/30">VALOR UNIT.</p>
                                    <p className="text-xl font-black tabular-nums tracking-tight">{item.price}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest italic">Estoque Mínimo: {item.min} {item.unit}</p>
                                <button className="p-2.5 bg-muted/10 hover:bg-primary/20 rounded-sm text-primary transition-all border border-border/50 hover:border-primary/30">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </div>
                        {/* Status bar at bottom */}
                        <div className={cn("h-1 w-full bg-border/20", item.stock === 0 ? "bg-red-500" : (item.stock <= item.min ? "bg-amber-500" : "bg-primary/30"))} />
                    </div>
                ))}
            </div>
        </div>
    );
}
