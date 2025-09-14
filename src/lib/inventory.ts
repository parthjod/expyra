import { type Product, type ProductStatus } from "@/lib/types";
import { differenceInDays, isPast, isToday } from "date-fns";

export const NEAR_EXPIRY_THRESHOLD_DAYS = 7;

export function calculateProductStatus(expDate: Date): ProductStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isPast(expDate) && !isToday(expDate)) {
    return "Expired";
  }

  const daysUntilExpiry = differenceInDays(expDate, today);

  if (daysUntilExpiry <= NEAR_EXPIRY_THRESHOLD_DAYS) {
    return "Near Expiry";
  }

  return "Valid";
}
