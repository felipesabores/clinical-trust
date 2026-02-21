'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface TenantConfig {
    id: string;
    name: string;
    description: string;
    logo_url?: string;
    primary_color: string;
    whatsapp?: string;
}

interface TenantContextType {
    config: TenantConfig | null;
    loading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function TenantProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<TenantConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axios.get(`${API}/api/config`);
                setConfig(res.data);

                // Dynamically update CSS variables for colors
                if (res.data.primary_color) {
                    document.documentElement.style.setProperty('--primary', res.data.primary_color);
                    // You could also calculate hsl values here if needed for Tailwind
                }
            } catch (error) {
                console.error('Failed to load tenant config:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return (
        <TenantContext.Provider value={{ config, loading }}>
            {children}
        </TenantContext.Provider>
    );
}

export function useTenant() {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
}
