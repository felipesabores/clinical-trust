'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UserPlus,
    Search,
    Dog,
    Cat,
    Rabbit,
    Info,
    Phone,
    History,
    AlertCircle,
    Plus,
    ChevronRight,
    Loader2,
    Calendar
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import CustomerModal from '@/components/CustomerModal';
import PetModal from '@/components/PetModal';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'test-tenant-123';

const petIconMap: Record<string, any> = {
    DOG: Dog,
    CAT: Cat,
    RABBIT: Rabbit,
    OTHER: Info,
};

export default function ClientesPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);

    const fetchCustomers = async (q = '') => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/api/customers?tenantId=${TENANT_ID}&q=${q}`);
            setCustomers(res.data || []);
            // Auto-select first if none selected
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

    useEffect(() => {
        setIsMounted(true);
        fetchCustomers();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isMounted) fetchCustomers(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    if (!isMounted) return null;

    return (
        <div className="p-8 h-screen flex flex-col bg-background overflow-hidden">
            <CustomerModal
                isOpen={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                onSuccess={(id) => {
                    fetchCustomers();
                    if (id) fetchDetail(id);
                }}
            />

            {selectedCustomer && (
                <PetModal
                    isOpen={isPetModalOpen}
                    onClose={() => setIsPetModalOpen(false)}
                    onSuccess={() => fetchDetail(selectedCustomer.id)}
                    customerId={selectedCustomer.id}
                    customerName={selectedCustomer.name}
                />
            )}

            <header className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <UserPlus className="text-primary" size={28} />
                        Base de Clientes
                    </h1>
                    <p className="text-muted-foreground font-medium italic">Gerencie tutores e seus pets</p>
                </div>
                <button
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    <Plus size={18} /> CADASTRAR NOVO TUTOR
                </button>
            </header>

            <div className="flex gap-8 flex-1 min-h-0">
                {/* List Side */}
                <div className="flex-[1.5] flex flex-col min-w-0">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={20} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por nome ou telefone..."
                            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl focus:border-primary transition-all outline-none font-bold shadow-sm"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {loading && customers.length === 0 ? (
                            <div className="flex items-center justify-center py-20 text-muted-foreground">
                                <Loader2 className="animate-spin mr-2" /> Carregando base...
                            </div>
                        ) : (
                            customers.map(customer => (
                                <div
                                    key={customer.id}
                                    onClick={() => fetchDetail(customer.id)}
                                    className={cn(
                                        "bg-card border p-5 rounded-[2rem] cursor-pointer transition-all hover:shadow-md flex items-center justify-between group",
                                        selectedCustomer?.id === customer.id ? "border-primary ring-1 ring-primary/20 bg-primary/[0.02]" : "border-border hover:border-primary/30"
                                    )}
                                >
                                    <div className="flex gap-4 items-center min-w-0">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-colors shrink-0 overflow-hidden",
                                            selectedCustomer?.id === customer.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                        )}>
                                            {customer.avatar_url ? (
                                                <img src={customer.avatar_url} className="w-full h-full object-cover" alt={customer.name} />
                                            ) : (
                                                customer.name[0]
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm truncate uppercase tracking-tight">{customer.name}</h4>
                                            <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-2">
                                                <Phone size={10} /> {customer.phone}
                                                <span className="w-1 h-1 bg-border rounded-full" />
                                                <span className="font-black text-primary/70">{customer._count?.pets || 0} PETS</span>
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className={cn("text-muted-foreground/30 transition-all", selectedCustomer?.id === customer.id && "text-primary translate-x-1")} size={18} />
                                </div>
                            ))
                        )}
                        {customers.length === 0 && !loading && (
                            <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-[2rem]">
                                Nengum cliente encontrado com "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Side */}
                <div className="flex-[1.2] min-w-0">
                    {selectedCustomer ? (
                        <div className="h-full bg-card border border-border rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl shadow-primary/5">
                            <div className="p-8 pb-4 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2rem] mx-auto flex items-center justify-center mb-4 border border-primary/10 overflow-hidden">
                                    {selectedCustomer.avatar_url ? (
                                        <img src={selectedCustomer.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <UserPlus className="text-primary" size={32} />
                                    )}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">{selectedCustomer.name}</h3>
                                <p className="text-xs font-bold text-muted-foreground flex items-center justify-center gap-2">
                                    <Phone size={12} /> {selectedCustomer.phone}
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-6 custom-scrollbar">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pets Vinculados</h5>
                                        <button
                                            onClick={() => setIsPetModalOpen(true)}
                                            className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1"
                                        >
                                            <Plus size={12} /> Adicionar Pet
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {selectedCustomer.pets?.map((pet: any) => {
                                            const PetIcon = petIconMap[pet.type] || Info;
                                            return (
                                                <div key={pet.id} className="p-5 bg-muted/30 rounded-3xl border border-border group hover:border-primary/20 transition-all">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex gap-3 items-center">
                                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-border">
                                                                {pet.avatar_url ? (
                                                                    <img src={pet.avatar_url} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <PetIcon size={22} className="text-primary" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-black text-sm uppercase leading-none">{pet.name}</p>
                                                                    <span className="text-[8px] px-2 py-0.5 bg-background border border-border rounded-full font-black text-muted-foreground">{pet.type}</span>
                                                                </div>
                                                                <p className="text-[10px] font-bold text-muted-foreground mt-1">{pet.breed || 'SRD'}</p>
                                                            </div>
                                                        </div>
                                                        {pet.appointments?.[0] && (
                                                            <div className="text-right">
                                                                <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Última Visita</p>
                                                                <p className="text-[10px] font-bold">{new Date(pet.appointments[0].scheduled_at).toLocaleDateString()}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {pet.notes && (
                                                        <div className="flex gap-2 p-3 bg-primary/5 rounded-2xl border border-primary/10">
                                                            <AlertCircle size={14} className="text-primary shrink-0" />
                                                            <p className="text-[10px] font-medium leading-relaxed italic">{pet.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {selectedCustomer.pets?.length === 0 && (
                                            <div className="p-8 text-center border-2 border-dashed border-border rounded-3xl opacity-50">
                                                <Dog className="mx-auto mb-2 opacity-20" size={32} />
                                                <p className="text-xs font-black uppercase text-muted-foreground">Nenhum pet cadastrado</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 bg-accent/30 rounded-3xl border border-border text-center">
                                    <History size={24} className="mx-auto text-muted-foreground mb-3" />
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Histórico de Agendamentos</p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-2">Em breve: Visão completa de todas as visitas e serviços realizados.</p>
                                </div>
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <Calendar size={18} /> NOVO AGENDAMENTO
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border border-border border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <UserPlus size={48} className="mb-4 opacity-10" />
                            <p className="font-bold text-sm">Selecione um cliente para ver os detalhes e seus pets.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
