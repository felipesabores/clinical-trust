import {
    Package,
    Search,
    Plus,
    Filter,
    AlertTriangle,
    TrendingDown,
    MoreVertical,
    Tag,
} from 'lucide-react';

const categories = ['Todos', 'Banho', 'Tosa', 'Farmácia', 'Acessórios', 'Alimentos'];

const items = [
    { name: 'Shampoo Neutro 5L', category: 'Banho', stock: 4, min: 5, unit: 'Litro', price: 'R$ 48,00', sku: 'SH-001' },
    { name: 'Tesoura Profissional', category: 'Tosa', stock: 2, min: 2, unit: 'Un.', price: 'R$ 220,00', sku: 'TS-003' },
    { name: 'Condicionador Pelos 2L', category: 'Banho', stock: 12, min: 4, unit: 'Litro', price: 'R$ 35,00', sku: 'CO-002' },
    { name: 'Antipulgas Frontline', category: 'Farmácia', stock: 1, min: 3, unit: 'Un.', price: 'R$ 85,00', sku: 'FP-007' },
    { name: 'Ração Premium 15kg', category: 'Alimentos', stock: 8, min: 2, unit: 'Saco', price: 'R$ 290,00', sku: 'RA-010' },
    { name: 'Perfume Pet Fresh', category: 'Banho', stock: 6, min: 4, unit: 'Spray', price: 'R$ 32,00', sku: 'PF-005' },
];

function StockBadge({ stock, min }: { stock: number; min: number }) {
    if (stock === 0) return (
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle size={10} /> Esgotado
        </span>
    );
    if (stock <= min) return (
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
            <TrendingDown size={10} /> Baixo
        </span>
    );
    return (
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            OK
        </span>
    );
}

export default function EstoquePage() {
    const lowStock = items.filter(i => i.stock <= i.min).length;

    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Package className="text-primary" size={28} />
                        Estoque
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium italic">
                        Gestão de insumos, produtos e materiais.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <Plus size={18} /> Novo Item
                </button>
            </header>

            {/* Alert bar */}
            {lowStock > 0 && (
                <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                        <AlertTriangle size={20} className="text-amber-600" />
                    </div>
                    <div>
                        <p className="font-bold text-amber-800 text-sm">{lowStock} item{lowStock > 1 ? 's' : ''} com estoque baixo ou esgotado</p>
                        <p className="text-xs text-amber-600 mt-0.5">Faça a reposição para evitar interrupções nos serviços.</p>
                    </div>
                    <button className="ml-auto text-xs font-bold text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors">
                        Ver todos
                    </button>
                </div>
            )}

            {/* Search + filter */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar produto ou SKU..."
                        className="w-full pl-11 pr-4 py-3 bg-card border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-card border rounded-2xl text-sm font-semibold hover:bg-accent transition-colors shadow-sm">
                    <Filter size={16} /> Filtrar
                </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap">
                {categories.map((cat, i) => (
                    <button
                        key={cat}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${i === 0
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                            : 'bg-card border text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Item grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {items.map(item => (
                    <div key={item.sku} className="bg-card border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group hover:border-primary/30">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <Package size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex items-center gap-2">
                                <StockBadge stock={item.stock} min={item.min} />
                                <button className="text-muted-foreground hover:bg-muted p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                            <Tag size={12} />
                            <span className="font-medium">{item.sku}</span>
                            <span>·</span>
                            <span>{item.category}</span>
                        </div>

                        <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                            <div>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Em estoque</p>
                                <p className="text-2xl font-black tabular-nums">
                                    {item.stock}
                                    <span className="text-xs font-medium text-muted-foreground ml-1">{item.unit}</span>
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">Mín: {item.min} {item.unit}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Preço unit.</p>
                                <p className="font-black text-lg">{item.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
