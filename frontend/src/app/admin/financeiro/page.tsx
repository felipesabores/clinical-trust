'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Plus,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Search,
    Loader2,
    Activity,
    CreditCard,
    ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function FinanceiroPage() {
    const { config } = useTenant();
    const tenantId = config?.id;
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ total_income: 0, total_expenses: 0, balance: 0 });
    const [showModal, setShowModal] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        type: 'INCOME',
        category: 'SERVICE',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [transRes, statsRes] = await Promise.all([
                axios.get(`${API}/api/transactions?tenantId=${tenantId}`),
                axios.get(`${API}/api/transactions/stats?tenantId=${tenantId}`)
            ]);
            setTransactions(transRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching financial data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tenantId) fetchData();
    }, [tenantId]);

    const handleCreate = async () => {
        try {
            await axios.post(`${API}/api/transactions`, {
                ...newTransaction,
                tenant_id: tenantId,
                amount: parseFloat(newTransaction.amount as any)
            });
            setShowModal(false);
            fetchData();
        } catch (error) {
            alert('Erro ao criar transação');
        }
    };

    if (loading && transactions.length === 0) return (
        <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Activity className="animate-pulse text-primary" size={48} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">CALIBRATING_LEDGER...</span>
        </div>
    );

    return (
        <div className="p-8 space-y-10 bg-background text-foreground min-h-screen">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 uppercase">
                        <TrendingUp className="text-emerald-500" size={32} />
                        Financial <span className="text-primary">Orchestration</span>
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground mt-2 opacity-60 italic">LEDGER_V1 // CASH_FLOW_MONITOR</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-primary-foreground px-10 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 border border-primary/50"
                >
                    <Plus size={18} />
                    INITIALIZE_ENTRY
                </button>
            </header>

            {/* KPI HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Net Balance', value: stats.balance, icon: DollarSign, color: 'text-primary' },
                    { label: 'Total Income', value: stats.total_income, icon: ArrowUpRight, color: 'text-emerald-500' },
                    { label: 'Total Expenses', value: stats.total_expenses, icon: ArrowDownLeft, color: 'text-rose-500' },
                ].map((kpi, i) => (
                    <div key={i} className="hud-card p-8 bg-card border-border/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <kpi.icon size={48} />
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground mb-4 opacity-50">{kpi.label}</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold opacity-30">BRL</span>
                            <h2 className={cn("text-4xl font-black tracking-tighter tabular-nums", kpi.color)}>
                                {kpi.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h2>
                        </div>
                        <div className="mt-6 flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full animate-pulse", kpi.color.replace('text-', 'bg-'))} />
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Live Sync Active</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Ledger Table */}
            <div className="hud-card bg-card border-border/50 overflow-hidden">
                <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 border border-primary/20 rounded-sm text-primary">
                            <Activity size={18} />
                        </div>
                        <h3 className="font-black text-sm uppercase tracking-widest">TRANSACTION_LOG</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={14} />
                            <input
                                placeholder="FILTER_DESCRIPTION..."
                                className="bg-muted/5 border border-border/50 rounded-sm pl-9 pr-4 py-2 text-[10px] font-black uppercase tracking-widest focus:border-primary/50 outline-none w-64 transition-all"
                            />
                        </div>
                        <button className="p-2 bg-muted/20 border border-border/50 rounded-sm hover:bg-muted/30 transition-colors">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/5">
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Timestamp</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Category</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Description</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Amount (BRL)</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {transactions.map((t: any) => (
                                <tr key={t.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-8 py-5 text-[10px] font-bold tabular-nums opacity-60">
                                        {new Date(t.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-8 py-5 text-[10px]">
                                        <span className="bg-muted/30 border border-border/50 px-3 py-1 rounded-sm font-black uppercase tracking-widest text-[8px] opacity-70">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-[10px] font-black uppercase tracking-tight">
                                        {t.description}
                                    </td>
                                    <td className={cn(
                                        "px-8 py-5 text-sm font-bold tabular-nums text-right",
                                        t.type === 'INCOME' ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {t.type === 'INCOME' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="w-2 h-2 rounded-full mx-auto bg-primary/20 border border-primary/40 group-hover:bg-primary transition-all shadow-[0_0_8px_rgba(var(--primary),0.3)] opacity-0 group-hover:opacity-100" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="hud-card bg-card border-primary/30 w-full max-w-lg relative p-10 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary" />

                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <Plus className="text-primary" />
                            NEW_VALUATION_ENTRY
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'INCOME' })}
                                    className={cn(
                                        "py-4 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-all",
                                        newTransaction.type === 'INCOME' ? "bg-emerald-500 border-emerald-500 text-white" : "border-border/50 opacity-40 hover:opacity-100"
                                    )}
                                >
                                    INCOME (CREDIT)
                                </button>
                                <button
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'EXPENSE' })}
                                    className={cn(
                                        "py-4 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-all",
                                        newTransaction.type === 'EXPENSE' ? "bg-rose-500 border-rose-500 text-white" : "border-border/50 opacity-40 hover:opacity-100"
                                    )}
                                >
                                    EXPENSE (DEBIT)
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mr-2 italic border-l border-primary/40 pl-3">Value (BRL)</label>
                                <input
                                    type="number"
                                    value={newTransaction.amount}
                                    onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value as any })}
                                    className="w-full bg-muted/5 border border-border/50 rounded-sm px-6 py-4 text-3xl font-black tracking-tighter focus:border-primary/50 outline-none tabular-nums"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mr-2 italic border-l border-primary/40 pl-3">Description</label>
                                    <input
                                        value={newTransaction.description}
                                        onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                        placeholder="VALUATION_META_DATA..."
                                        className="w-full bg-muted/5 border border-border/50 rounded-sm px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-primary/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mr-2 italic border-l border-primary/40 pl-3">Category_Tag</label>
                                    <select
                                        value={newTransaction.category}
                                        onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                        className="w-full bg-muted border-border/50 rounded-sm px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-primary/50 outline-none transition-all border appearance-none"
                                    >
                                        <option value="SERVICE">SERVICE_DELIVERY</option>
                                        <option value="PRODUCT">PRODUCT_SALES</option>
                                        <option value="RENT">OPERATIONAL_RENT</option>
                                        <option value="SALARY">HUMAN_CAPITAL</option>
                                        <option value="TAX">REGULATORY_TAX</option>
                                        <option value="OTHER">MISC_ENTRY</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/20 transition-all border border-transparent"
                                >
                                    ABORT_OPERATION
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="px-10 py-4 bg-primary text-primary-foreground rounded-sm font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 border border-primary/50"
                                >
                                    COMMIT_TO_LEDGER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
