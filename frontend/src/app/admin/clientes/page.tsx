import {
    UserPlus,
    Search,
    Dog,
    Cat,
    Mail,
    Phone,
    MessageSquare,
    History,
    AlertCircle,
    Plus
} from 'lucide-react';

const clients = [
    {
        id: 1,
        name: 'Ricardo Silva',
        phone: '(11) 98765-4321',
        email: 'ricardo@email.com',
        pets: [{ name: 'Max', breed: 'Golden Retriever', type: 'Dog' }],
        lastVisit: '2 dias atrás',
        status: 'Exigente',
        note: 'Prefere secagem manual silenciosa.'
    },
    {
        id: 2,
        name: 'Ana Paula',
        phone: '(11) 91234-5678',
        email: 'ana.p@email.com',
        pets: [{ name: 'Bella', breed: 'Gato Persa', type: 'Cat' }],
        lastVisit: '1 semana atrás',
        status: 'Regular',
        note: 'Sempre traz petiscos próprios.'
    },
];

export default function ClientesPage() {
    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestão de Clientes</h2>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Controle de tutores e pets integrados.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <UserPlus size={18} />
                    Cadastrar Novo
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome, pet ou telefone..."
                            className="w-full pl-12 pr-4 py-4 bg-card border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm"
                        />
                    </div>

                    <div className="space-y-4">
                        {clients.map(client => (
                            <div key={client.id} className="bg-card border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-primary/30">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {client.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{client.name}</h4>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Phone size={14} /> {client.phone}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Mail size={14} /> {client.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"><MessageSquare size={18} /></button>
                                        <button className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"><History size={18} /></button>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    {client.pets.map(pet => (
                                        <div key={pet.name} className="flex items-center gap-3 px-4 py-2 bg-muted rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                                            {pet.type === 'Dog' ? <Dog size={16} className="text-orange-500" /> : <Cat size={16} className="text-blue-500" />}
                                            <span className="text-sm font-bold">{pet.name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{pet.breed}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-card border rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-3xl bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-300">
                                    MS
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                                    <Plus size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Max & Ricardo</h3>
                                <p className="text-sm text-muted-foreground">Golden Retriever • 3 anos</p>
                            </div>
                        </div>

                        <div className="mt-10 space-y-6">
                            <div className="space-y-3">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status Sanitário</h5>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                                        <span className="text-xs font-bold">V10 Anual</span>
                                        <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full uppercase">OK</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-100">
                                        <span className="text-xs font-bold">Antirrábica</span>
                                        <span className="text-[10px] bg-orange-100 px-2 py-0.5 rounded-full uppercase">Vence em 15 dias</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-muted rounded-2xl border border-slate-100 flex gap-3">
                                <AlertCircle className="text-orange-500 shrink-0" size={20} />
                                <div>
                                    <h6 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Nota Importante</h6>
                                    <p className="text-xs font-medium leading-relaxed">
                                        Max prefere secagem manual silenciosa. Tutor evita uso excessivo de perfume.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
