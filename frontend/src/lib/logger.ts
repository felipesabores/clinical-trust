/**
 * logger.ts — Logger centralizado para o frontend do Clinical Trust.
 *
 * Cada log inclui:
 *  - timestamp ISO
 *  - módulo (quem chamou)
 *  - nível: info | warn | error
 *  - mensagem legível
 *  - payload de contexto (opcional — ex: response.data, status, url)
 *  - stack trace completo (para erros)
 *
 * Em produção os logs aparecem no console do devtools do browser e podem
 * ser enviados para um serviço externo (Sentry, Datadog, etc.) no futuro.
 */

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    module: string;
    message: string;
    context?: Record<string, unknown>;
    stack?: string;
}

function buildEntry(
    level: LogLevel,
    module: string,
    message: string,
    error?: unknown,
    context?: Record<string, unknown>
): LogEntry {
    const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        module,
        message,
        context,
    };

    if (error instanceof Error) {
        entry.stack = error.stack;
        // Enrich context with axios-specific details when available
        const axiosErr = error as any;
        if (axiosErr.response) {
            entry.context = {
                ...entry.context,
                http_status: axiosErr.response.status,
                http_url: axiosErr.config?.url,
                http_method: axiosErr.config?.method?.toUpperCase(),
                response_data: axiosErr.response.data,
            };
        }
    }

    return entry;
}

function emit(entry: LogEntry) {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.module}]`;
    const style = {
        info: 'color: #3b82f6; font-weight: bold',
        warn: 'color: #f59e0b; font-weight: bold',
        error: 'color: #ef4444; font-weight: bold',
    }[entry.level];

    // eslint-disable-next-line no-console
    console.groupCollapsed(`%c${prefix} ${entry.message}`, style);
    if (entry.context) console.table(entry.context);
    if (entry.stack) console.error(entry.stack);
    // eslint-disable-next-line no-console
    console.groupEnd();

    // TODO: send to external service (e.g. Sentry) in production
    // if (process.env.NODE_ENV === 'production') { Sentry.captureException(...) }
}

const logger = {
    info(module: string, message: string, context?: Record<string, unknown>) {
        emit(buildEntry('info', module, message, undefined, context));
    },

    warn(module: string, message: string, context?: Record<string, unknown>) {
        emit(buildEntry('warn', module, message, undefined, context));
    },

    error(module: string, message: string, error?: unknown, context?: Record<string, unknown>) {
        emit(buildEntry('error', module, message, error, context));
    },
};

export default logger;
