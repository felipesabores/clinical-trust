'use client';

import { Calendar, Clock, User, Dog } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Appointment {
    id: string;
    pet_id: string;
    pet: {
        name: string;
        type: string;
    };
    scheduled_at: string;
    status: string;
    staff?: {
        name: string;
    };
}

interface AppointmentListProps {
    appointments: Appointment[];
    onEdit?: (appointment: Appointment) => void;
}

const statusColors = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    RECEPTION: 'bg-yellow-100 text-yellow-800',
    BATHING: 'bg-purple-100 text-purple-800',
    GROOMING: 'bg-pink-100 text-pink-800',
    DRYING: 'bg-orange-100 text-orange-800',
    READY: 'bg-green-100 text-green-800',
};

const statusLabels = {
    SCHEDULED: 'Agendado',
    RECEPTION: 'Recepção',
    BATHING: 'Banho',
    GROOMING: 'Tosa',
    DRYING: 'Secagem',
    READY: 'Pronto',
};

export default function AppointmentList({ appointments, onEdit }: AppointmentListProps) {
    if (appointments.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Nenhum agendamento encontrado</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Agendamentos
            </h3>
            {appointments.map((appointment) => (
                <div
                    key={appointment.id}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Dog className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-800">{appointment.pet.name}</span>
                        </div>
                        <span className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            statusColors[appointment.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                        )}>
                            {statusLabels[appointment.status as keyof typeof statusLabels] || appointment.status}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(appointment.scheduled_at).toLocaleDateString('pt-BR')}
                        </div>
                        {appointment.staff && (
                            <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {appointment.staff.name}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}