import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Wifi,
    ChevronRight,
    Building2,
    Clock,
    Phone,
} from 'lucide-react';

const sections = [
    {
        title: 'Perfil da Empresa',
        icon: Building2,
        fields: [
            { label: 'Nome da Empresa', value: 'Banho e Tosa - Unidade Principal', type: 'text' },
            { label: 'CNPJ', value: '12.345.678/0001-99', type: 'text' },
            { label: 'Telefone', value: '(11) 3456-7890', type: 'tel' },
            { label: 'E-mail', value: 'contato@petspa.com.br', type: 'email' },
        ],
    },
    {
        title: 'Horário de Funcionamento',
        icon: Clock,
        fields: [
            { label: 'Segunda a Sexta', value: '08:00 – 18:00', type: 'text' },
            { label: 'Sábado', value: '08:00 – 14:00', type: 'text' },
            { label: 'Domingo', value: 'Fechado', type: 'text' },
        ],
    },
];

const toggles = [
    { label: 'Notificações por WhatsApp', desc: 'Enviar confirmações automáticas para clientes', enabled: true },
    { label: 'Lembretes de Vacinação', desc: 'Alertar tutores sobre vencimento de vacinas', enabled: true },
    { label: 'Streaming Automático', desc: 'Iniciar transmissão ao mover pet para Banho', enabled: false },
    { label: 'Relatório Diário', desc: 'Enviar resumo por e-mail ao fechar o dia', enabled: true },
];

const navItems = [
    { icon: User, label: 'Perfil da Empresa' },
    { icon: Bell, label: 'Notificações' },
    { icon: Palette, label: 'Aparência' },
    { icon: Shield, label: 'Segurança' },
    { icon: Wifi, label: 'Integrações' },
    { icon: Phone, label: 'Suporte' },
];

export default function ConfiguracoesPage() {
    return (
        <div className="p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Settings className="text-primary" size={28} />
                    Configurações
                </h1>
                <p className="text-muted-foreground mt-1 text-sm font-medium italic">
                    Personalize a plataforma para o seu negócio.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Nav */}
                <div className="lg:col-span-1">
                    <nav className="bg-card border rounded-[2rem] p-3 shadow-sm space-y-1">
                        {navItems.map((item, i) => (
                            <button
                                key={item.label}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${i === 0
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`}
                            >
                                <item.icon size={18} className={i === 0 ? '' : 'group-hover:text-primary transition-colors'} />
                                {item.label}
                                {i !== 0 && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 space-y-6">
                    {sections.map(section => (
                        <div key={section.title} className="bg-card border rounded-[2.5rem] p-8 shadow-sm">
                            <h3 className="font-bold text-lg flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <section.icon size={18} className="text-primary" />
                                </div>
                                {section.title}
                            </h3>
                            <div className="space-y-5">
                                {section.fields.map(field => (
                                    <div key={field.label}>
                                        <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            defaultValue={field.value}
                                            className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-2xl text-sm font-medium focus:border-primary/30 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Toggles */}
                    <div className="bg-card border rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="font-bold text-lg flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Bell size={18} className="text-primary" />
                            </div>
                            Notificações e Automações
                        </h3>
                        <div className="space-y-4">
                            {toggles.map(toggle => (
                                <div key={toggle.label} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-border transition-colors">
                                    <div>
                                        <p className="font-bold text-sm">{toggle.label}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{toggle.desc}</p>
                                    </div>
                                    <button
                                        className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ml-4 ${toggle.enabled ? 'bg-primary' : 'bg-muted border'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${toggle.enabled ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save button */}
                    <div className="flex justify-end gap-3">
                        <button className="px-6 py-3 bg-card border rounded-2xl text-sm font-bold hover:bg-accent transition-colors">
                            Descartar
                        </button>
                        <button className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
