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
    Edit3,
    Trash2,
} from 'lucide-react';
import ProductModal from '@/components/ProductModal';
import { useTenant } from '@/context/TenantContext';
import axios from 'axios';
import { useState, useEffect } from 'react';

import { API } from '@/config';
import { cn } from '@/lib/utils';

function StockBadge({ stock, min }: { stock: number; min: number }) {
    if (stock === 0) return (
        <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg">
            <AlertTriangle size={14} /> Esgotado
        </span>
    );
    if (stock <= min) return (
        <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg">
            <TrendingDown size={14} /> Crítico
        </span>
    );
    return (
        <span className="text-xs font-medium px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            Regular
        </span>
    );
}

const categories = ['Todos', 'Banho', 'Tosa', 'Higiene / Estética', 'Acessórios', 'Alimentos'];

export default function EstoquePage() {
    const { config } = useTenant();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

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

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja remover ${name} do estoque?`)) return;
        try {
            await axios.delete(`${API}/api/products/${id}`);
            fetchItems();
        } catch (e) {
            alert('Erro ao excluir produto');
        }
    };
    const lowStock = items.filter(i => i.stock <= i.min).length;

    return (
        <div className="p-8 space-y-10 bg-[#F7F8F0] dark:bg-slate-950 text-foreground min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight text-[#355872] dark:text-white flex items-center gap-3">
                        <Boxes className="text-[#7AAACE]" size={32} />
                        Controle de Estoque
                    </h1>
                    <p className="text-[#355872]/60 font-medium mt-1">
                        Gerencie os insumos e níveis de estoque com precisão.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-8 py-2.5 bg-[#7AAACE] hover:bg-[#355872] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#7AAACE]/20 hover:shadow-[#355872]/20 transition-all duration-300"
                >
                    <Plus size={18} /> Cadastrar Item
                </button>
            </header>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Itens Totais', value: '142', icon: Tag, color: 'text-[#355872]', bg: 'bg-[#7AAACE]/10', border: 'border-[#7AAACE]/20' },
                    { label: 'Valor em Estoque', value: 'R$ 12.450', icon: BarChart2, color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    { label: 'Saídas (Hoje)', value: '24', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                    { label: 'Alertas', value: lowStock.toString(), icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl flex items-center gap-4 border border-[#E4E9D5] dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className={cn("p-3 rounded-2xl border flex items-center justify-center", stat.bg, stat.border, stat.color)}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#355872]/40 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-heading font-black text-[#355872] dark:text-white mt-1 tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alert bar */}
            {lowStock > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[2rem] relative overflow-hidden group shadow-xl shadow-amber-500/5">
                    <div className="absolute top-0 left-0 w-2 h-full bg-amber-400" />
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0">
                        <AlertTriangle size={24} className="text-amber-500 animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <p className="font-heading font-black text-amber-600 text-lg flex items-center gap-2">
                            Reposição Pendente
                        </p>
                        <p className="text-sm text-amber-700/60 dark:text-slate-300 mt-1 font-medium">
                            Há <span className="font-bold text-amber-600">{lowStock}</span> itens operando abaixo da reserva técnica mínima.
                        </p>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-white transition-all bg-white dark:bg-amber-500/10 hover:bg-amber-500 px-6 py-2.5 rounded-xl border border-amber-200 dark:border-amber-500/20 shadow-sm">
                        Analisar Necessidades
                    </button>
                </div>
            )}

            {/* Control Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-6 sticky top-0 bg-[#F7F8F0]/90 dark:bg-[#0F172A]/80 backdrop-blur-xl py-6 z-10 border-b border-[#E4E9D5] dark:border-white/5 -mx-8 px-8">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]/40 group-focus-within:text-[#7AAACE] transition-all" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar no catálogo de insumos..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-[#E4E9D5] dark:border-white/10 rounded-2xl focus:border-[#7AAACE]/50 focus:ring-4 focus:ring-[#7AAACE]/10 transition-all outline-none text-sm text-[#355872] dark:text-white placeholder:text-[#355872]/30"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar-thin">
                    {categories.map((cat, i) => (
                        <button
                            key={cat}
                            className={cn(
                                "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border uppercase tracking-widest",
                                i === 0
                                    ? 'bg-[#355872] text-white border-[#355872] shadow-xl shadow-[#355872]/20'
                                    : 'bg-white dark:bg-slate-900/40 text-[#355872]/60 dark:text-slate-400 border-[#E4E9D5] dark:border-white/5 hover:text-[#355872] hover:bg-[#E4E9D5]/20'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900/40 border border-[#E4E9D5] dark:border-white/5 rounded-2xl text-[10px] font-black text-[#355872] hover:bg-[#E4E9D5]/20 transition-all whitespace-nowrap ml-auto lg:ml-0 uppercase tracking-tighter">
                        <Filter size={16} className="text-[#7AAACE]" /> Filtros
                    </button>
                </div>
            </div>

            {/* Item grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {items.map(item => (
                    <div key={item.sku} className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-[#E4E9D5] dark:border-white/5 overflow-hidden group hover:border-[#7AAACE]/30 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col h-full relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#7AAACE]/5 to-transparent rounded-bl-full pointer-events-none" />
                        <div className="p-6 flex-1 flex flex-col relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-[#7AAACE]/10 transition-colors shadow-sm">
                                    <Package size={24} className="text-[#355872]/40 group-hover:text-[#7AAACE] transition-colors" />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StockBadge stock={item.stock} min={item.min} />
                                    <span className="text-[10px] font-black text-[#355872]/30 uppercase tracking-tighter">{item.sku}</span>
                                </div>
                            </div>

                            <h3 className="font-heading font-black text-xl text-[#355872] dark:text-white mb-1 group-hover:text-[#7AAACE] transition-colors line-clamp-2 tracking-tight">{item.name}</h3>
                            <p className="text-[10px] font-bold text-[#7AAACE] uppercase tracking-widest mb-6">{item.category}</p>

                            <div className="grid grid-cols-2 gap-4 py-5 border-y border-white/5 mt-auto">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Quantidade</p>
                                    <p className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-1">
                                        {item.stock}
                                        <span className="text-sm font-normal text-slate-400">{item.unit}</span>
                                    </p>
                                </div>
                                <div className="border-l border-white/5 pl-4">
                                    <p className="text-xs text-slate-500 mb-1">Valor Unit.</p>
                                    <p className="text-lg font-semibold text-emerald-400 tracking-tight">{item.price}</p>
                                </div>
                            </div>
                        </div>

                        {/* Status bar and actions */}
                        <div className="px-6 py-4 bg-slate-900/50 border-t border-white/5 flex items-center justify-between shrink-0">
                            <p className="text-xs text-slate-500">
                                Min: <span className="font-medium text-slate-300">{item.min} {item.unit}</span>
                            </p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        setEditingItem(item);
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 hover:bg-indigo-500/20 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id, item.name)}
                                    className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className={cn("h-1 w-full shrink-0", item.stock === 0 ? "bg-rose-500" : (item.stock <= item.min ? "bg-amber-500" : "bg-emerald-500"))} />
                    </div>
                ))}
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchItems}
                initialData={editingItem}
            />
        </div>
    );
}
