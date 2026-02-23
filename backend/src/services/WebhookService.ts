import axios from 'axios';

export class WebhookService {
    private static WEBHOOK_URL = process.env.WEBHOOK_NOTIFICATION_URL || '';

    static async sendLiveLink(data: {
        petName: string;
        customerPhone: string;
        magicLink: string;
        tenantName: string
    }) {
        console.log(`[WebhookService] Sending live link for ${data.petName} to ${data.customerPhone}`);

        if (!this.WEBHOOK_URL) {
            console.warn('[WebhookService] WEBHOOK_NOTIFICATION_URL not set. Skipping external call.');
            return;
        }

        // Validar dados obrigatórios
        if (!data.petName || !data.customerPhone || !data.magicLink || !data.tenantName) {
            console.warn('[WebhookService] Dados incompletos para webhook:', {
                petName: !!data.petName,
                customerPhone: !!data.customerPhone,
                magicLink: !!data.magicLink,
                tenantName: !!data.tenantName
            });
            return;
        }

        try {
            await axios.post(this.WEBHOOK_URL, {
                event: 'LIVE_LINK_GENERATED',
                payload: {
                    pet_name: data.petName,
                    customer_phone: data.customerPhone,
                    magic_link: data.magicLink,
                    tenant_name: data.tenantName,
                    message: `Olá! Seu pet ${data.petName} começou o procedimento. Acompanhe ao vivo aqui: ${data.magicLink}`
                }
            });
            console.log('[WebhookService] Webhook enviado com sucesso');
        } catch (error) {
            console.error('[WebhookService] Error sending webhook:', error);
            // Re-throw para que o chamador saiba que falhou
            throw error;
        }
    }
}
