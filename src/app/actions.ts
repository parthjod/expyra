"use server";

import { suggestInventoryActions } from "@/ai/flows/suggest-inventory-actions";
import { type Product } from "@/lib/types";
import { format } from "date-fns";

export async function getAISuggestion(product: Product) {
  try {
    const suggestion = await suggestInventoryActions({
      productName: product.name,
      expiryDate: format(product.expDate, "yyyy-MM-dd"),
      currentDate: format(new Date(), "yyyy-MM-dd"),
      quantity: product.quantity,
    });
    return { success: true, data: suggestion };
  } catch (error) {
    console.error("Error getting AI suggestion:", error);
    return { success: false, error: "Failed to get AI suggestion." };
  }
}
