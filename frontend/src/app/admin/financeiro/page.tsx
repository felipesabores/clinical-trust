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
        <div className="p-4 sm:p-6 lg:p-8 space-y-10 bg-[#F7F8F0] dark:bg-slate-950 text-foreground min-h-[calc(100vh-64px)] overflow-x-hidden">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight text-[#355872] dark:text-white flex items-center gap-3">
                        <DollarSign className="text-[#7AAACE]" size={32} />
                        Fluxo Financeiro
                    </h1>
                    <p className="text-[#355872]/60 font-medium mt-1">
                        Gerencie as receitas, despesas e a saúde financeira da sua marca.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-8 py-2.5 bg-[#7AAACE] hover:bg-[#355872] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#7AAACE]/20 hover:shadow-[#355872]/20 transition-all duration-300"
                >
                    <Plus size={18} />
                    Nova Transação
                </button>
            </header>

            {/* KPI HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Saldo Atual', value: stats.balance, icon: DollarSign, color: 'text-[#355872]', bg: 'bg-[#7AAACE]/10', border: 'border-[#7AAACE]/20' },
                    { label: 'Total de Receitas', value: stats.total_income, icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Total de Despesas', value: stats.total_expenses, icon: ArrowDownLeft, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-[#E4E9D5] dark:border-white/5 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-[10px] font-black text-[#355872]/40 dark:text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                            <div className={cn("p-3 rounded-2xl border", kpi.bg, kpi.border)}>
                                <kpi.icon size={20} className={kpi.color} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm text-[#355872]/40 font-black uppercase">BRL</span>
                            <h3 className={cn("text-3xl font-heading font-black tracking-tighter", kpi.color)}>
                                {kpi.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Ledger Table */}
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-[#E4E9D5] dark:border-white/5 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-8 border-b border-[#E4E9D5] dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#7AAACE]/10 rounded-2xl border border-[#7AAACE]/20">
                            <Activity className="text-[#355872]" size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-black text-xl text-[#355872] dark:text-white tracking-tight">Registro de Operações</h3>
                            <p className="text-sm font-medium text-[#355872]/40">Histórico completo de transações</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]/30 group-focus-within:text-[#7AAACE] transition-colors" size={18} />
                            <input
                                placeholder="Buscar por descrição ou categoria..."
                                className="w-full bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm text-[#355872] dark:text-white placeholder:text-[#355872]/20 focus:border-[#7AAACE] focus:ring-4 focus:ring-[#7AAACE]/10 outline-none transition-all font-medium"
                            />
                        </div>
                        <button className="p-3 bg-white dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl hover:bg-[#F7F8F0] transition-all text-[#355872]/40 hover:text-[#355872] shadow-sm">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F7F8F0]/50 dark:bg-slate-900/50">
                                <th className="px-8 py-5 text-[10px] font-black text-[#355872]/40 uppercase tracking-[0.2em]">Data</th>
                                <th className="px-8 py-5 text-[10px] font-black text-[#355872]/40 uppercase tracking-[0.2em]">Categoria</th>
                                <th className="px-8 py-5 text-[10px] font-black text-[#355872]/40 uppercase tracking-[0.2em]">Descrição</th>
                                <th className="px-8 py-5 text-[10px] font-black text-[#355872]/40 uppercase tracking-[0.2em] text-right">Valor Líquido</th>
                                <th className="px-8 py-5 text-[10px] font-black text-[#355872]/40 uppercase tracking-[0.2em] text-center">Protocolo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E9D5] dark:divide-white/5">
                            {transactions.map((t: any) => (
                                <tr key={t.id} className="hover:bg-[#F7F8F0]/80 dark:hover:bg-slate-800/40 transition-all duration-300 group">
                                    <td className="px-8 py-6 text-sm font-bold text-[#355872] tabular-nums">
                                        {new Date(t.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-[#7AAACE]/5 border border-[#7AAACE]/10 px-3 py-1.5 rounded-xl text-[10px] font-black text-[#355872]/60 uppercase tracking-widest">
                                            {t.category === 'SERVICE' ? 'Procedimento' :
                                                t.category === 'PRODUCT' ? 'Insumo' :
                                                    t.category === 'RENT' ? 'Fixas' :
                                                        t.category === 'SALARY' ? 'Pessoal' :
                                                            t.category === 'TAX' ? 'Tributário' :
                                                                t.category === 'OTHER' ? 'Diversos' : t.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium text-[#355872]/80 dark:text-slate-200">
                                        {t.description}
                                    </td>
                                    <td className={cn(
                                        "px-8 py-6 text-lg font-black text-right tabular-nums tracking-tighter",
                                        t.type === 'INCOME' ? "text-emerald-600" : "text-rose-600"
                                    )}>
                                        <span className="text-[10px] mr-1 opacity-50 font-black">R$</span>
                                        {t.type === 'INCOME' ? '' : '-'} {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={cn(
                                            "w-2.5 h-2.5 rounded-full mx-auto border shadow-sm",
                                            t.type === 'INCOME' ? "bg-emerald-500 border-emerald-300" : "bg-rose-500 border-rose-300"
                                        )} />
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-[10px] font-black text-[#355872]/30 uppercase tracking-[0.3em]">Nenhum registro encontrado no período</p>
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
                    <div className="absolute inset-0 bg-[#355872]/60 backdrop-blur-xl" onClick={() => setShowModal(false)} />
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg relative p-10 shadow-[0_32px_128px_-12px_rgba(53,88,114,0.4)] rounded-[2.5rem] border border-[#7AAACE]/20 overflow-hidden flex flex-col max-h-[90vh]">
                        <h2 className="text-3xl font-heading font-black text-[#355872] dark:text-white mb-8 flex items-center gap-4 shrink-0">
                            <Plus className="text-[#7AAACE]" size={32} />
                            Lançamento
                        </h2>

                        <div className="space-y-8 overflow-y-auto custom-scrollbar-thin pr-2 pb-2">
                            <div className="flex p-1.5 bg-[#F7F8F0] dark:bg-slate-800 rounded-2xl gap-2">
                                <button
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'INCOME' })}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2",
                                        newTransaction.type === 'INCOME' ? "bg-[#355872] text-white" : "text-[#355872]/40 hover:text-[#355872]"
                                    )}
                                >
                                    <TrendingUp size={14} /> Receita
                                </button>
                                <button
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'EXPENSE' })}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2",
                                        newTransaction.type === 'EXPENSE' ? "bg-rose-600 text-white" : "text-[#355872]/40 hover:text-rose-600"
                                    )}
                                >
                                    <TrendingDown size={14} /> Despesa
                                </button>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#355872]/40 uppercase tracking-widest ml-1">Valor da Operação</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg font-black text-[#355872]/20">R$</span>
                                    <input
                                        type="number"
                                        value={newTransaction.amount}
                                        onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value as any })}
                                        className="w-full bg-[#F7F8F0] dark:bg-slate-800 border-2 border-[#E4E9D5] dark:border-white/10 rounded-[1.5rem] pl-16 pr-6 py-5 text-4xl font-heading font-black text-[#355872] dark:text-white focus:border-[#7AAACE] outline-none transition-all tabular-nums"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#355872]/40 uppercase tracking-widest ml-1">Descrição</label>
                                    <input
                                        value={newTransaction.description}
                                        onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                        placeholder="Identifique a transação..."
                                        className="w-full bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-[#355872] dark:text-white placeholder:text-[#355872]/20 focus:border-[#7AAACE] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#355872]/40 uppercase tracking-widest ml-1">Categoria de Fluxo</label>
                                    <div className="relative">
                                        <select
                                            value={newTransaction.category}
                                            onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                            className="w-full bg-[#F7F8F0] dark:bg-slate-800 border border-[#E4E9D5] dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-[#355872] dark:text-white focus:border-[#7AAACE] outline-none transition-all appearance-none pr-12"
                                        >
                                            <option value="SERVICE">Remuneração de Serviços</option>
                                            <option value="PRODUCT">Venda de Produtos</option>
                                            <option value="RENT">Aluguel e Infraestrutura</option>
                                            <option value="SALARY">Folha de Pagamento</option>
                                            <option value="TAX">Impostos e Taxas</option>
                                            <option value="OTHER">Diversos / Outros</option>
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7AAACE] pointer-events-none" size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-10 mt-6 border-t border-[#E4E9D5] dark:border-white/5 shrink-0">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-8 py-3 rounded-2xl text-[10px] font-black text-[#355872]/40 hover:text-[#355872] transition-all uppercase tracking-widest"
                            >
                                Descartar
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-12 py-3 bg-[#355872] hover:bg-[#7AAACE] text-white rounded-2xl font-black text-[11px] transition-all shadow-xl shadow-[#355872]/20 uppercase tracking-[0.2em]"
                            >
                                Confirmar Lançamento
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
