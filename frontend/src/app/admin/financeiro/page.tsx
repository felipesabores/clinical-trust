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

import { API } from '@/config';

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
        <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="animate-spin text-indigo-400" size={40} />
            <span className="text-sm font-medium text-slate-400">Carregando dados financeiros...</span>
        </div>
    );

    return (
        <div className="p-8 space-y-10 bg-background text-foreground min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-heading font-semibold tracking-tight text-white flex items-center gap-3">
                        <DollarSign className="text-indigo-400" size={24} />
                        Financeiro
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Gerencie as receitas, despesas e o fluxo de caixa da clínica.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Nova Transação
                </button>
            </header>

            {/* KPI HUD */}
            {/* KPI HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Saldo Atual', value: stats.balance, icon: DollarSign, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                    { label: 'Total de Receitas', value: stats.total_income, icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: 'Total de Despesas', value: stats.total_expenses, icon: ArrowDownLeft, color: 'text-rose-400', bg: 'bg-rose-400/10' },
                ].map((kpi, i) => (
                    <div key={i} className="glass-panel p-6 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <p className="font-medium text-slate-400 text-sm">{kpi.label}</p>
                            <div className={cn("p-2 rounded-lg", kpi.bg)}>
                                <kpi.icon size={20} className={kpi.color} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm text-slate-500 font-medium">R$</span>
                            <h3 className={cn("text-3xl font-heading font-semibold tracking-tight", kpi.color)}>
                                {kpi.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Ledger Table */}
            <div className="glass-panel overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Activity className="text-indigo-400" size={20} />
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-slate-100">Histórico de Transações</h3>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                            <input
                                placeholder="Buscar transação..."
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                            />
                        </div>
                        <button className="p-2 bg-slate-800 border border-white/5 rounded-xl hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-200 flex-shrink-0">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-slate-900/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400">Data</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400">Categoria</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400">Descrição</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 text-right">Valor (R$)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((t: any) => (
                                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-slate-300">
                                        {new Date(t.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="bg-slate-800 border border-white/10 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300">
                                            {t.category === 'SERVICE' ? 'Serviço' :
                                                t.category === 'PRODUCT' ? 'Produto' :
                                                    t.category === 'RENT' ? 'Aluguel' :
                                                        t.category === 'SALARY' ? 'Salário' :
                                                            t.category === 'TAX' ? 'Impostos' :
                                                                t.category === 'OTHER' ? 'Outros' : t.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-200">
                                        {t.description}
                                    </td>
                                    <td className={cn(
                                        "px-6 py-4 text-sm font-semibold text-right tabular-nums",
                                        t.type === 'INCOME' ? "text-emerald-400" : "text-rose-400"
                                    )}>
                                        {t.type === 'INCOME' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="w-2 h-2 rounded-full mx-auto bg-emerald-500/20 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                                        Nenhuma transação encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="glass-panel w-full max-w-lg relative p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <h2 className="text-xl font-heading font-semibold text-white mb-6 flex items-center gap-3 shrink-0">
                            <Plus className="text-indigo-400" />
                            Nova Transação
                        </h2>

                        <div className="space-y-6 overflow-y-auto custom-scrollbar-thin pr-2">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'INCOME' })}
                                    className={cn(
                                        "py-3 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2",
                                        newTransaction.type === 'INCOME' ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-slate-800/50 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                    )}
                                >
                                    <TrendingUp size={16} />
                                    Receita
                                </button>
                                <button
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'EXPENSE' })}
                                    className={cn(
                                        "py-3 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2",
                                        newTransaction.type === 'EXPENSE' ? "bg-rose-500/10 border-rose-500/50 text-rose-400" : "bg-slate-800/50 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                    )}
                                >
                                    <TrendingDown size={16} />
                                    Despesa
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Valor (R$)</label>
                                <input
                                    type="number"
                                    value={newTransaction.amount}
                                    onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value as any })}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-2xl font-semibold text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Descrição</label>
                                    <input
                                        value={newTransaction.description}
                                        onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                        placeholder="Ex: Consulta Dr. Silva"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Categoria</label>
                                    <div className="relative">
                                        <select
                                            value={newTransaction.category}
                                            onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all appearance-none pr-10"
                                        >
                                            <option value="SERVICE">Serviço</option>
                                            <option value="PRODUCT">Produto</option>
                                            <option value="RENT">Aluguel</option>
                                            <option value="SALARY">Salário</option>
                                            <option value="TAX">Impostos</option>
                                            <option value="OTHER">Outros</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-white/5 shrink-0">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-indigo-500/20"
                            >
                                Salvar Transação
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
