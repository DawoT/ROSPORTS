import { Invoice } from '@/core/domain/billing.types';

/**
 * Interface for Billing/Invoicing Gateway (OSE/PSE).
 */
export interface IBillingGateway {
    /**
     * Sign and generate the XML for the invoice.
     * @param invoice The invoice data to sign.
     * @returns The signed XML content or URL.
     */
    signInvoice(invoice: Invoice): Promise<{ xmlContent: string; hash: string }>;

    /**
     * Send the signed XML to the OSE (Operador de Servicios Electrónicos) or SUNAT.
     * @param signedXml The signed XML content.
     * @param fileName The name of the XML file (e.g., 20600000001-01-F001-1.xml).
     * @returns The ticket or immediate CDR response.
     */
    sendToOSE(
        signedXml: string,
        fileName: string
    ): Promise<{ ticket?: string; cdrUrl?: string; status: string }>;

    /**
     * Check the status of a ticket or document.
     * @param ticket The ticket number received from sendToOSE.
     */
    checkStatus(ticket: string): Promise<{
        status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
        cdrUrl?: string;
        message: string;
    }>;
}
