export type Product = {
  id: string;
  name: string;
  batchId: string;
  quantity: number;
  mfgDate: Date;
  expDate: Date;
};

export type ProductStatus = "Valid" | "Near Expiry" | "Expired";

export type InventoryStats = {
  total: number;
  valid: number;
  nearExpiry: number;
  expired: number;
  donationReady: number;
};

export type ExtractedProductInfo = {
    productName: string;
    batchId: string;
    mfgDate: string;
    expDate: string;
};
