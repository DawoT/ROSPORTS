import { describe, it, expectTypeOf } from "vitest";
import { Invoice } from "@/core/domain/billing.types";

describe("Billing Structure TDD", () => {
  it("should verify Invoice type adherence", () => {
    // This test forces the type system to verify our Invoice structure
    // If billing.types.ts changes or is missing fields, this will fail compilation
    // or runtime if we validated strict objects.

    const mockInvoice: Invoice = {
      id: "inv_123",
      orderId: "ord_123",
      companyId: "com_123",
      documentType: "01",
      series: "F001",
      correlativeNumber: 1,
      issueDate: new Date(),
      currency: "PEN",
      totalAmount: 118,
      totalIgv: 18,
      totalGravado: 100,
      customerDocType: "6",
      customerDocNumber: "20123456789",
      customerName: "Test Company SAC",
      sunatStatus: "PENDING",
      createdAt: new Date(),
    };

    expectTypeOf(mockInvoice).toMatchTypeOf<Invoice>();
    expectTypeOf(mockInvoice.documentType).toEqualTypeOf<
      "01" | "03" | "07" | "08"
    >();
  });
});
