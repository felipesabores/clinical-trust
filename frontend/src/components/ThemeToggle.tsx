'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="group relative flex items-center justify-between w-20 h-8 bg-slate-200 dark:bg-card border-2 border-slate-300 dark:border-border rounded-sm p-1 transition-all overflow-hidden"
        >
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <span className={`text-[8px] font-black tracking-widest z-10 pl-1 transition-colors ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`}>
                LIT
            </span>

            <motion.div
                animate={{ x: theme === 'dark' ? 36 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute left-1 top-1 w-10 h-5 bg-white dark:bg-primary rounded-sm shadow-sm flex items-center justify-center z-20"
            >
                {theme === 'light' ? (
                    <Sun size={10} className="text-amber-500" />
                ) : (
                    <Moon size={10} className="text-primary-foreground" />
                )}
            </motion.div>

            <span className={`text-[8px] font-black tracking-widest z-10 pr-1 transition-colors ${theme === 'dark' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                DRK
            </span>
        </button>
    );
}
