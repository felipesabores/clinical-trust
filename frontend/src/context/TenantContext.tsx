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

import { API } from '@/config';
import { setTenantId } from '@/lib/apiClient';

export function TenantProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<TenantConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // /api/config é rota pública — usa axios direto (sem x-tenant-id)
                const res = await axios.get(`${API}/api/config`);
                setConfig(res.data);

                // Configura o header x-tenant-id para todos os requests protegidos
                if (res.data?.id) {
                    setTenantId(res.data.id);
                }

                // Dynamically update CSS variables for colors
                if (res.data.primary_color) {
                    const hex = res.data.primary_color;
                    // Simple hex to hsl conversion
                    let r = 0, g = 0, b = 0;
                    if (hex.length === 4) {
                        r = parseInt(hex[1] + hex[1], 16);
                        g = parseInt(hex[2] + hex[2], 16);
                        b = parseInt(hex[3] + hex[3], 16);
                    } else if (hex.length === 7) {
                        r = parseInt(hex.substring(1, 3), 16);
                        g = parseInt(hex.substring(3, 5), 16);
                        b = parseInt(hex.substring(5, 7), 16);
                    }
                    r /= 255; g /= 255; b /= 255;
                    const max = Math.max(r, g, b), min = Math.min(r, g, b);
                    let h = 0, s, l = (max + min) / 2;
                    if (max === min) {
                        h = s = 0;
                    } else {
                        const d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                        switch (max) {
                            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                            case g: h = (b - r) / d + 2; break;
                            case b: h = (r - g) / d + 4; break;
                        }
                        h /= 6;
                    }
                    const hslStr = `${(h * 360).toFixed(1)} ${(s! * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
                    document.documentElement.style.setProperty('--primary', hslStr);
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
