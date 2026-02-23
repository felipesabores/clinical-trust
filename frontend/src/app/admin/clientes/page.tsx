'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UserPlus,
    Search,
    Plus,
    ChevronRight,
    Loader2,
    Info,
    Phone,
    History as HistoryIcon,
    AlertCircle,
    MoreVertical,
    Trash2,
    Edit3,
    Calendar,
    Dog,
    Cat,
    Rabbit,
    ShieldCheck,
    Dna,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import CustomerModal from '@/components/CustomerModal';
import PetModal from '@/components/PetModal';
import AppointmentModal from '@/components/AppointmentModal';
import AppointmentList from '@/AppointmentList';
import { useTenant } from '@/context/TenantContext';

import { API } from '@/config';

const petIconMap: Record<string, any> = {
    DOG: Dog,
    CAT: Cat,
    RABBIT: Rabbit,
    OTHER: Info,
};

export default function ClientesPage() {
    const { config } = useTenant();
    const tenantId = config?.id;
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<any>(null);
    const [editingPet, setEditingPet] = useState<any>(null);

    const fetchCustomers = async (q = '') => {
        if (!tenantId) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API}/api/customers?tenantId=${tenantId}&q=${q}`);
            setCustomers(res.data || []);
            if (res.data.length > 0 && !selectedCustomer) {
                fetchDetail(res.data[0].id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetail = async (id: string) => {
        try {
            const res = await axios.get(`${API}/api/customers/${id}`);
            setSelectedCustomer(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteCustomer = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o tutor ${name}? Isso removerá todos os seus pets e agendamentos.`)) return;
        try {
            await axios.delete(`${API}/api/customers/${id}`);
            if (selectedCustomer?.id === id) setSelectedCustomer(null);
            fetchCustomers(searchQuery);
        } catch (e: any) {
            alert(e.response?.data?.error || 'Erro ao excluir tutor');
        }
    };

    const handleDeletePet = async (petId: string, petName: string) => {
        if (!confirm(`Excluir o pet ${petName}?`)) return;
        try {
            await axios.delete(`${API}/api/pets/${petId}`);
            if (selectedCustomer) fetchDetail(selectedCustomer.id);
            fetchCustomers(searchQuery);
        } catch (e: any) {
            alert(e.response?.data?.error || 'Erro ao excluir pet');
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && tenantId) {
            fetchCustomers(searchQuery);
        }
    }, [tenantId, searchQuery, isMounted]);

    if (!isMounted) return null;

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-64px)] flex flex-col bg-[#F7F8F0] dark:bg-slate-950 overflow-x-hidden text-foreground">
            <CustomerModal
                isOpen={isCustomerModalOpen}
                onClose={() => {
                    setIsCustomerModalOpen(false);
                    setEditingCustomer(null);
                }}
                initialData={editingCustomer}
                onSuccess={(id) => {
                    fetchCustomers();
                    if (id) fetchDetail(id);
                }}
            />

            {selectedCustomer && (
                <PetModal
                    isOpen={isPetModalOpen}
                    onClose={() => {
                        setIsPetModalOpen(false);
                        setEditingPet(null);
                    }}
                    initialData={editingPet}
                    onSuccess={() => fetchDetail(selectedCustomer.id)}
                    customerId={selectedCustomer.id}
                    customerName={selectedCustomer.name}
                />
            )}

            {selectedCustomer && (
                <AppointmentModal
                    isOpen={isAppointmentModalOpen}
                    onClose={() => setIsAppointmentModalOpen(false)}
                    onSuccess={() => {
                        // Refresh customer details to show any new appointments
                        fetchDetail(selectedCustomer.id);
                    }}
                />
            )}

            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
                <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-[#355872] dark:text-white flex items-center gap-3">
                        <UserPlus className="text-[#7AAACE]" size={28} />
                        Diretório de Tutores
                    </h2>
                    <p className="text-sm text-[#355872]/60 mt-1 font-medium">
                        Gerencie seus clientes e seus respectivos pets com precisão.
                    </p>
                </div>
                <button
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-[#7AAACE] hover:bg-[#355872] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#7AAACE]/20 hover:shadow-[#355872]/20 transition-all duration-300 w-full sm:w-auto justify-center"
                >
                    <Plus size={18} />
                    <span className="sm:inline">Novo Registro</span>
                </button>
            </header>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 flex-1 min-h-0">
                {/* List Side */}
                <div className="flex-1 lg:max-w-md xl:max-w-lg flex flex-col min-w-0">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Pesquisar por nome ou celular..."
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none text-sm text-foreground placeholder:text-muted-foreground shadow-sm"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {loading && customers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-indigo-400 gap-4">
                                <Loader2 className="animate-spin" size={40} />
                                <span className="text-sm font-medium animate-pulse text-slate-400">Carregando clientes...</span>
                            </div>
                        ) : (
                            customers.map(customer => (
                                <div
                                    key={customer.id}
                                    onClick={() => fetchDetail(customer.id)}
                                    className={cn(
                                        "p-4 rounded-3xl cursor-pointer transition-all flex items-center justify-between group border shadow-sm",
                                        selectedCustomer?.id === customer.id
                                            ? "bg-white dark:bg-primary/10 border-[#7AAACE] shadow-xl shadow-[#7AAACE]/10"
                                            : "bg-white/50 dark:bg-slate-900/40 border-[#E4E9D5] dark:border-white/5 hover:border-[#7AAACE]/30 hover:bg-white"
                                    )}
                                >
                                    <div className="flex gap-4 items-center min-w-0">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold transition-all shrink-0 overflow-hidden",
                                            selectedCustomer?.id === customer.id
                                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 group-hover:text-primary"
                                        )}>
                                            {customer.avatar_url ? (
                                                <img src={customer.avatar_url} className="w-full h-full object-cover" alt={customer.name} />
                                            ) : (
                                                customer.name[0]?.toUpperCase()
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-heading font-semibold text-slate-900 dark:text-slate-200 truncate group-hover:text-primary transition-colors">{customer.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                                    <Phone size={12} className="text-slate-500" /> {customer.phone}
                                                </p>
                                                <span className="w-1 h-1 bg-white/10 rounded-full" />
                                                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">{customer.pets?.length || 0} PETS</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:translate-x-2 lg:group-hover:translate-x-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCustomer(customer);
                                                setIsCustomerModalOpen(true);
                                            }}
                                            className="p-2 hover:bg-indigo-500/20 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                                            title="Editar Tutor"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCustomer(customer.id, customer.name);
                                            }}
                                            className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                                            title="Excluir Tutor"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        {customers.length === 0 && !loading && (
                            <div className="text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-xl bg-slate-900/20">
                                <p className="text-sm font-medium">Nenhum tutor encontrado.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Side */}
                <div className="flex-1 min-w-0 h-full">
                    {selectedCustomer ? (
                        <div className="h-full bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-3xl flex flex-col overflow-hidden relative border border-[#E4E9D5] dark:border-white/10 shadow-2xl">
                            {/* Decorative background circle */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7AAACE]/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                            {/* Detail Header */}
                            <div className="p-8 pb-6 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60 relative z-10">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/5 overflow-hidden shrink-0 shadow-lg relative group">
                                        {selectedCustomer.avatar_url ? (
                                            <img src={selectedCustomer.avatar_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-semibold text-slate-300 dark:text-slate-500">{selectedCustomer.name[0]?.toUpperCase()}</span>
                                        )}
                                        <div className="absolute inset-0 ring-4 ring-primary/0 group-hover:ring-primary/20 transition-all rounded-2xl" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs flex items-center gap-1 font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                                                <UserPlus size={12} /> Cliente Registrado
                                            </span>
                                            <span className="text-xs font-mono text-muted-foreground">ID: {selectedCustomer.id.slice(0, 8)}</span>
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3 truncate">{selectedCustomer.name}</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-sm text-foreground bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
                                                <Phone size={14} className="text-primary" />
                                                {selectedCustomer.phone}
                                            </div>
                                            {(selectedCustomer.pets?.length ?? 0) > 0 && (
                                                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                    <ShieldCheck size={16} /> Verificado
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
                                <section>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2 text-primary font-medium">
                                            <Dog size={18} />
                                            <h5 className="text-sm">Pets Vinculados</h5>
                                        </div>
                                        <button
                                            onClick={() => setIsPetModalOpen(true)}
                                            className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-all border border-primary/20"
                                        >
                                            Novo Pet
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedCustomer.pets?.map((pet: any) => {
                                            const PetIcon = petIconMap[pet.type] || Info;
                                            return (
                                                <div key={pet.id} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-primary/30 transition-all shadow-sm">
                                                    <div className="flex gap-4 items-start mb-4">
                                                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-white/5 group-hover:border-primary/20 group-hover:shadow-md transition-all">
                                                            {pet.avatar_url ? (
                                                                <img src={pet.avatar_url} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <PetIcon size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <p className="font-heading font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-primary transition-colors">{pet.name}</p>

                                                                <div className="flex items-center lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingPet(pet);
                                                                            setIsPetModalOpen(true);
                                                                        }}
                                                                        className="p-1 hover:text-indigo-400 text-slate-500 transition-colors"
                                                                    >
                                                                        <Edit3 size={14} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeletePet(pet.id, pet.name)}
                                                                        className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-slate-400 mt-1 truncate">{pet.breed || 'SRD'}</p>
                                                            <span className="inline-block mt-2 text-[10px] font-black px-2.5 py-1 bg-[#355872]/5 text-[#355872]/60 rounded-lg border border-[#E4E9D5] uppercase tracking-widest tabular-nums">
                                                                {pet.type === 'DOG' ? 'CÃO' :
                                                                    pet.type === 'CAT' ? 'GATO' :
                                                                        pet.type === 'RABBIT' ? 'COELHO' : 'OUTRO'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {pet.notes ? (
                                                        <div className="text-[10px] font-medium text-[#355872]/60 bg-[#F7F8F0] dark:bg-slate-800/50 p-4 rounded-xl border border-[#E4E9D5] dark:border-white/5 leading-relaxed relative overflow-hidden italic">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#7AAACE]" />
                                                            <p>"{pet.notes}"</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 border-t border-white/5 pt-3">
                                                            <Info size={14} /> Nenhuma observação registrada
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {selectedCustomer.pets?.length === 0 && (
                                            <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl bg-slate-900/20 text-slate-500">
                                                <Dog className="mx-auto mb-3 opacity-50" size={32} />
                                                <p className="text-sm font-medium">Nenhum pet cadastrado para este tutor.</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section className="p-6 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 rounded-2xl relative overflow-hidden group shadow-inner">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10">
                                        <HistoryIcon size={64} className="text-slate-500 group-hover:rotate-12 transition-transform duration-700" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-3 text-slate-600 dark:text-slate-300 font-medium">
                                        <HistoryIcon size={16} className="text-slate-400" />
                                        <h6 className="text-sm">Logs de Atividade Recentes</h6>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed italic relative z-10 max-w-lg">
                                        O histórico completo de agendamentos e interações aparecerá aqui em tempo real. (Em construção)
                                    </p>
                                </section>
                            </div>

                            {/* Seção de Agendamentos */}
                            <div className="p-6 border-t border-[#E4E9D5] dark:border-white/5 bg-[#F7F8F0]/50 dark:bg-slate-900/30">
                                <AppointmentList 
                                    appointments={selectedCustomer.pets.flatMap((pet: any) => 
                                        pet.appointments.map((appointment: any) => ({
                                            ...appointment,
                                            pet: { name: pet.name, type: pet.type }
                                        }))
                                    )}
                                />
                            </div>

                            <div className="p-6 pt-0 mt-auto shrink-0 relative z-10 border-t border-[#E4E9D5] dark:border-white/5 bg-[#F7F8F0]/50 dark:bg-slate-900/30">
                                <button 
                                    onClick={() => setIsAppointmentModalOpen(true)}
                                    className="w-full py-4 mt-6 bg-[#355872] hover:bg-[#7AAACE] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#355872]/20 hover:shadow-[#7AAACE]/20 transition-all duration-500 flex items-center justify-center gap-3 group"
                                >
                                    <Calendar size={18} className="group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                                    Agendar Procedimento
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-12 text-center text-slate-500 bg-slate-900/20">
                            <UserPlus size={64} className="mb-4 opacity-30" />
                            <p className="text-base font-medium text-slate-400">Selecione um cliente para ver os detalhes</p>
                            <p className="text-sm mt-2 opacity-70">Ou pesquise na barra lateral para encontrar rapidamente.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
