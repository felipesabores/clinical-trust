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
        <div className="p-8 space-y-10 bg-background text-foreground min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
                        <Boxes className="text-indigo-400" size={32} />
                        Estoque
                    </h1>
                    <p className="text-sm text-slate-400 mt-2">
                        Gerencie os insumos e níveis de estoque da clínica.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                >
                    <Plus size={18} /> Cadastrar Item
                </button>
            </header>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Itens Totais', value: '142', icon: Tag, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                    { label: 'Valor em Estoque', value: 'R$ 12.450', icon: BarChart2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    { label: 'Saídas (Hoje)', value: '24', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                    { label: 'Alertas', value: lowStock.toString(), icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-5 rounded-2xl flex items-center gap-4 border border-white/5 shadow-xl">
                        <div className={cn("p-3 rounded-xl border", stat.bg, stat.border, stat.color)}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-heading font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alert bar */}
            {lowStock > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl relative overflow-hidden group shadow-lg shadow-amber-500/5">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <AlertTriangle size={24} className="text-amber-500 animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <p className="font-heading font-semibold text-amber-500 text-base flex items-center gap-2">
                            Atenção Requerida: Reposição de Estoque
                        </p>
                        <p className="text-sm text-slate-300 mt-1">
                            Existem <span className="font-bold text-white">{lowStock}</span> materiais operando abaixo do limite de segurança.
                        </p>
                    </div>
                    <button className="text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 rounded-lg border border-amber-500/20">
                        Analisar Necessidades
                    </button>
                </div>
            )}

            {/* Control Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-4 sticky top-0 bg-[#0F172A]/80 backdrop-blur-xl py-4 z-10 border-b border-white/5 -mx-8 px-8">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar produto ou SKU..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none text-sm text-white placeholder:text-slate-500 shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar-thin">
                    {categories.map((cat, i) => (
                        <button
                            key={cat}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border",
                                i === 0
                                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-md shadow-indigo-500/10'
                                    : 'bg-slate-900/40 text-slate-400 border-white/5 hover:text-white hover:bg-slate-800'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900/40 border border-white/5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all whitespace-nowrap ml-auto lg:ml-0">
                        <Filter size={16} className="text-slate-400" /> Filtros
                    </button>
                </div>
            </div>

            {/* Item grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {items.map(item => (
                    <div key={item.sku} className="glass-panel p-0 overflow-hidden group hover:border-indigo-500/30 transition-all shadow-xl hover:shadow-indigo-500/10 flex flex-col h-full rounded-2xl border border-white/5">
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-5">
                                <div className="w-12 h-12 bg-slate-800 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors relative shadow-inner">
                                    <Package size={20} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                    <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center">
                                        <Tag size={10} className="text-indigo-400" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StockBadge stock={item.stock} min={item.min} />
                                    <span className="text-xs font-mono text-slate-500">{item.sku}</span>
                                </div>
                            </div>

                            <h3 className="font-heading font-semibold text-lg text-white mb-1 group-hover:text-indigo-400 transition-colors line-clamp-2">{item.name}</h3>
                            <p className="text-xs font-medium text-slate-400 mb-6">{item.category}</p>

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
