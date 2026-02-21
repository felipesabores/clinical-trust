'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 bg-white/10 dark:bg-black/20 rounded-full p-1 transition-colors outline-none ring-primary/50 focus:ring-2 border border-white/10"
        >
            <motion.div
                animate={{ x: theme === 'dark' ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white dark:bg-primary rounded-full flex items-center justify-center shadow-lg"
            >
                {theme === 'light' ? (
                    <Sun size={12} className="text-amber-500 fill-amber-500" />
                ) : (
                    <Moon size={12} className="text-white fill-white" />
                )}
            </motion.div>
        </button>
    );
}
