'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Package, Loader2, Save, Tag, Hash, Boxes, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTenant } from '@/context/TenantContext';
import { API } from '@/config';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: {
        id: string;
        name: string;
        category: string;
        stock: number;
        min_stock: number;
        unit: string;
        price: number;
        sku: string;
    } | null;
}

const categories = ['Banho', 'Tosa', 'Higiene / Estética', 'Acessórios', 'Alimentos'];

export default function ProductModal({ isOpen, onClose, onSuccess, initialData }: ProductModalProps) {
    const { config: tenantConfig } = useTenant();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Banho',
        stock: 0,
        min_stock: 0,
        unit: 'UN',
        price: 0,
        sku: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                category: initialData.category,
                stock: initialData.stock,
                min_stock: initialData.min_stock,
                unit: initialData.unit,
                price: initialData.price,
                sku: initialData.sku
            });
        } else {
            setFormData({
                name: '',
                category: 'Banho',
                stock: 0,
                min_stock: 0,
                unit: 'UN',
                price: 0,
                sku: `PRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async () => {
        if (!formData.name || !formData.sku) return;
        setLoading(true);
        try {
            if (initialData) {
                await axios.patch(`${API}/api/products/${initialData.id}`, formData);
            } else {
                await axios.post(`${API}/api/products`, {
                    ...formData,
                    tenant_id: tenantConfig?.id
                });
            }
            onSuccess();
            onClose();
        } catch (e) {
            alert('Erro ao salvar produto');
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
                    className="relative bg-card w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden border border-border"
                >
                    <div className="p-8 pb-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">
                                {initialData ? 'Editar Produto' : 'Novo Produto'}
                            </h2>
                            <p className="text-muted-foreground text-sm font-medium">
                                {initialData ? 'Atualize as informações do item' : 'Cadastre um novo item no inventário'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 pt-4 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome do Produto</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={18} />
                                    <input
                                        autoFocus
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ex: Shampoo Antipulgas..."
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">SKU / Código</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={18} />
                                    <input
                                        value={formData.sku}
                                        onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Categoria</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={18} />
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold appearance-none cursor-pointer"
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Estoque Atual</label>
                                <div className="relative">
                                    <Boxes className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={18} />
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold tabular-nums"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Estoque Mínimo</label>
                                <div className="relative">
                                    <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={18} />
                                    <input
                                        type="number"
                                        value={formData.min_stock}
                                        onChange={e => setFormData(prev => ({ ...prev, min_stock: Number(e.target.value) }))}
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold tabular-nums"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preço Sugerido</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={18} />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold tabular-nums"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Unidade</label>
                                <select
                                    value={formData.unit}
                                    onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                                    className="w-full bg-muted/50 border border-border rounded-2xl py-4 px-4 outline-none focus:border-primary transition-all font-bold"
                                >
                                    <option value="UN">UNIDADE</option>
                                    <option value="KG">QUILOGRAMA</option>
                                    <option value="L">LITRO</option>
                                    <option value="ML">MILILITRO</option>
                                    <option value="PACOTE">PACOTE</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.name || !formData.sku}
                            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> {initialData ? 'Atualizar' : 'Salvar'} Produto</>}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

import { AlertTriangle } from 'lucide-react';
