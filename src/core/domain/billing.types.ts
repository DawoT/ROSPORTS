/**
 * Represents an Electronic Invoice (CPE) complying with SUNAT UBL 2.1 standards.
 * Corresponds to `electronic_documents` in ERD.
 */
export interface Invoice {
  id: string;
  orderId: string;
  companyId: string;

  /**
   * Document Type Code (e.g., '01' = Factura, '03' = Boleta).
   */
  documentType: "01" | "03" | "07" | "08";

  /**
   * Series code (e.g., 'F001', 'B001').
   */
  series: string;

  /**
   * Correlative number (e.g., 12345).
   */
  correlativeNumber: number;

  /**
   * Date of issuance.
   */
  issueDate: Date;

  /**
   * Currency code (ISO 4217, e.g., 'PEN', 'USD').
   */
  currency: "PEN" | "USD";

  /**
   * Financial Values
   */
  totalAmount: number;
  totalIgv: number;
  totalGravado: number;

  /**
   * Customer/Receiver Information
   */
  customerDocType: "1" | "6" | "-"; // 1=DNI, 6=RUC, -=No Doc
  customerDocNumber: string;
  customerName: string;
  customerAddress?: string;
  customerEmail?: string;

  /**
   * SUNAT Response Information
   */
  sunatStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "VOIDED";
  sunatMessage?: string;
  xmlHash?: string;
  cdrStatus?: string;

  /**
   * URLs for generated files
   */
  xmlUrl?: string;
  pdfUrl?: string;
  cdrUrl?: string;

  createdAt: Date;
}
