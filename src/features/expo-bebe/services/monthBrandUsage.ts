import { axiosInstanceWithoutToken } from "../../../api/config/axiosConfig";
import type { MonthBrandUsage } from "../types";

/**
 * Returns the brand ids that already have at least one event booked in the
 * given month. Backed by a calendar endpoint extension (pending backend).
 *
 * Defensive by design: any failure (endpoint not yet available, network error)
 * resolves to an empty list so the contract form never blocks a brand on
 * incomplete data — matching `isBrandBlockedForMonth`'s null-safe contract.
 *
 * @param month 1-12
 */
export const getBookedBrandIdsByMonth = async (
  month: number,
  year: number,
): Promise<number[]> => {
  try {
    const response = await axiosInstanceWithoutToken.get<
      MonthBrandUsage | number[]
    >(`/slots/calendar/brands?year=${year}&month=${month}`);
    const data = response.data;
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.bookedBrandIds) ? data.bookedBrandIds : [];
  } catch (error) {
    console.error("Error fetching booked brand ids by month:", error);
    return [];
  }
};
