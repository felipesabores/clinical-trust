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
import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
        <div className="p-8 h-screen flex flex-col bg-background overflow-hidden text-foreground">
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

            <header className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 uppercase">
                        <UserPlus className="text-primary" size={32} />
                        Diretório <span className="text-primary">Tutores</span>
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground mt-2 opacity-60 italic">SISTEMA DE GESTÃO CLÍNICA v1.0.5 // NODE 04</p>
                </div>
                <button
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-sm font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 border border-primary/50"
                >
                    <Plus size={18} /> NOVO REGISTRO CLÍNICO
                </button>
            </header>

            <div className="flex gap-8 flex-1 min-h-0">
                {/* List Side */}
                <div className="flex-[1.5] flex flex-col min-w-0">
                    <div className="relative mb-6">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-30" size={18} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="PESQUISAR POR NOME OU ID..."
                            className="w-full pl-14 pr-5 py-5 bg-muted/10 border border-border/50 rounded-sm focus:border-primary/50 transition-all outline-none font-black uppercase text-[10px] tracking-widest shadow-sm placeholder:opacity-30"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {loading && customers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                                <Loader2 className="animate-spin text-primary" size={40} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando base de dados...</span>
                            </div>
                        ) : (
                            customers.map(customer => (
                                <div
                                    key={customer.id}
                                    onClick={() => fetchDetail(customer.id)}
                                    className={cn(
                                        "hud-card p-5 cursor-pointer transition-all flex items-center justify-between group",
                                        selectedCustomer?.id === customer.id ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20 shadow-lg shadow-primary/5" : "hover:border-primary/30"
                                    )}
                                >
                                    <div className="flex gap-5 items-center min-w-0">
                                        <div className={cn(
                                            "w-12 h-12 rounded-sm flex items-center justify-center text-lg font-black transition-all shrink-0 overflow-hidden border border-border/50",
                                            selectedCustomer?.id === customer.id ? "bg-primary text-white border-primary" : "bg-muted/30 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30"
                                        )}>
                                            {customer.avatar_url ? (
                                                <img src={customer.avatar_url} className="w-full h-full object-cover" alt={customer.name} />
                                            ) : (
                                                customer.name[0]?.toUpperCase()
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-[11px] truncate uppercase tracking-[0.1em] group-hover:text-primary transition-colors">{customer.name}</h4>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <p className="text-[9px] text-muted-foreground font-black flex items-center gap-1.5 uppercase tracking-widest opacity-60">
                                                    <Phone size={10} className="text-primary/50" /> {customer.phone}
                                                </p>
                                                <span className="w-1 h-1 bg-border rounded-full" />
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-sm border border-primary/20">{customer.pets?.length || 0} PACIENTES</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCustomer(customer);
                                                setIsCustomerModalOpen(true);
                                            }}
                                            className="p-2.5 bg-muted/10 hover:bg-primary/20 rounded-sm text-primary transition-colors border border-border/50 hover:border-primary/30"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCustomer(customer.id, customer.name);
                                            }}
                                            className="p-2.5 bg-red-500/5 hover:bg-red-500/20 rounded-sm text-red-400 hover:text-red-500 transition-colors border border-red-500/10 hover:border-red-500/30"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        {customers.length === 0 && !loading && (
                            <div className="text-center py-24 text-muted-foreground border border-dashed border-border/20 rounded-sm bg-muted/5">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Nenhum registro encontrado no sistema</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Side */}
                <div className="flex-[1.2] min-w-0 h-full">
                    {selectedCustomer ? (
                        <div className="h-full bg-card border border-border/50 rounded-sm flex flex-col overflow-hidden shadow-2xl shadow-primary/5 border-t-2 border-primary relative">
                            {/* Technical Overlay */}
                            <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-10">
                                <Dna size={80} className="text-primary" />
                            </div>

                            <div className="p-8 pb-8 border-b border-border/30 bg-muted/5 relative">
                                <div className="flex items-start gap-7">
                                    <div className="w-24 h-24 bg-gradient-to-br from-muted/50 to-muted/20 rounded-sm flex items-center justify-center border-2 border-border/50 overflow-hidden shrink-0 shadow-inner group relative">
                                        {selectedCustomer.avatar_url ? (
                                            <img src={selectedCustomer.avatar_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl font-black text-muted-foreground opacity-30">{selectedCustomer.name[0]?.toUpperCase()}</span>
                                        )}
                                        <div className="absolute inset-0 border-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-sm border border-primary/20 uppercase tracking-widest">REGISTRADO</span>
                                            <span className="text-[8px] font-black text-muted-foreground opacity-40 uppercase tracking-widest">ID {selectedCustomer.id.slice(0, 8)}</span>
                                        </div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4 truncate text-foreground/90">{selectedCustomer.name}</h3>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-4">
                                                <p className="text-[10px] font-black text-primary flex items-center gap-2 uppercase tracking-widest bg-primary/5 px-3 py-1.5 border border-primary/10 rounded-sm">
                                                    <Phone size={14} className="opacity-50" /> {selectedCustomer.phone}
                                                </p>
                                                <ShieldCheck size={18} className="text-primary/30" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar-thin">
                                <section className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-border/30 pb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Pacientes Vinculados</h5>
                                        </div>
                                        <button
                                            onClick={() => setIsPetModalOpen(true)}
                                            className="px-4 py-2 bg-muted/20 text-primary text-[9px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-primary hover:text-white transition-all flex items-center gap-2 border border-border/50 hover:border-primary"
                                        >
                                            <Plus size={12} /> Novo Paciente
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {selectedCustomer.pets?.map((pet: any) => {
                                            const PetIcon = petIconMap[pet.type] || Info;
                                            return (
                                                <div key={pet.id} className="hud-card p-6 group relative overflow-hidden bg-gradient-to-br from-white to-muted/5">
                                                    <div className="flex justify-between items-center mb-5">
                                                        <div className="flex gap-5 items-center min-w-0">
                                                            <div className="w-14 h-14 bg-muted/20 rounded-sm flex items-center justify-center overflow-hidden border border-border/50 shrink-0 group-hover:border-primary/40 transition-colors">
                                                                {pet.avatar_url ? (
                                                                    <img src={pet.avatar_url} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <PetIcon size={24} className="text-primary/30 group-hover:text-primary transition-colors" />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-3">
                                                                    <p className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors truncate">{pet.name}</p>
                                                                    <span className="text-[8px] px-2 py-0.5 bg-muted/50 border border-border rounded-sm font-black text-muted-foreground uppercase opacity-60">{pet.type}</span>
                                                                </div>
                                                                <p className="text-[9px] font-black text-muted-foreground tracking-[0.2em] uppercase mt-2 italic opacity-40 border-l border-primary/20 pl-2">{pet.breed || 'SRD'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingPet(pet);
                                                                    setIsPetModalOpen(true);
                                                                }}
                                                                className="p-2.5 bg-muted/30 hover:bg-primary/20 rounded-sm text-primary transition-colors border border-border/50"
                                                            >
                                                                <Edit3 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePet(pet.id, pet.name)}
                                                                className="p-2.5 bg-red-500/5 hover:bg-red-500/20 rounded-sm text-red-400 border border-red-500/10 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {pet.notes ? (
                                                        <div className="p-4 bg-primary/[0.02] border-l-3 border-primary/30 rounded-r-sm relative group/notes">
                                                            <p className="text-[10px] font-bold leading-relaxed italic text-muted-foreground opacity-80">"{pet.notes}"</p>
                                                            <AlertCircle size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/20 group-hover/notes:text-primary/40 transition-colors" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 opacity-20 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground border-t border-border/50 pt-4">
                                                            <HistoryIcon size={12} /> Nenhuma observação registrada
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {selectedCustomer.pets?.length === 0 && (
                                            <div className="py-16 text-center border border-dashed border-border/30 rounded-sm bg-muted/5">
                                                <Dog className="mx-auto mb-3 opacity-10" size={40} />
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Aguardando Pacientes</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section className="p-6 bg-muted/5 border border-border/30 rounded-sm border-dashed relative group">
                                    <div className="absolute top-0 right-0 p-3 opacity-5">
                                        <HistoryIcon size={40} />
                                    </div>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-8 h-8 rounded-sm bg-muted/10 flex items-center justify-center border border-border/50">
                                            <HistoryIcon size={16} className="text-primary/50" />
                                        </div>
                                        <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-70">Logs de Atividade</h6>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed opacity-60 italic">
                                        O histórico completo de agendamentos, transações financeiras e registros clínicos aparecerá aqui conforme o sistema opera em tempo real.
                                    </p>
                                </section>
                            </div>

                            <div className="p-8 pt-0 mt-auto shrink-0">
                                <button className="w-full py-5 bg-foreground text-background rounded-sm font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-4 group border border-transparent hover:border-primary-foreground/20">
                                    <Calendar size={20} className="group-hover:rotate-12 group-hover:scale-110 transition-transform text-primary" />
                                    AGENDAR NOVO PROCEDIMENTO
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-border/30 border-dashed rounded-sm flex flex-col items-center justify-center p-12 text-center text-muted-foreground/20 bg-muted/[0.02]">
                            <UserPlus size={80} className="mb-6 opacity-5 rotate-12" />
                            <p className="font-black text-[11px] uppercase tracking-[0.4em]">Aguardando Seleção de Node</p>
                            <div className="w-20 h-[1px] bg-border/50 mt-4" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
