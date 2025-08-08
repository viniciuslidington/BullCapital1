import type {
  CalendarInfo,
  DividendInfo,
  RecommendationInfo,
} from "@/types/dividends";
import { api } from "./api";

export const DividendsService = {
  getDividends: async (symbol: string): Promise<DividendInfo> => {
    const res = await api.get(`/${symbol}/dividends`);
    return res.data;
  },

  getRecommendations: async (symbol: string): Promise<RecommendationInfo> => {
    const res = await api.get(`/${symbol}/recommendations`);
    return res.data;
  },

  getCalendar: async (symbol: string): Promise<CalendarInfo> => {
    const res = await api.get(`/${symbol}/calendar`);
    return res.data;
  },
};
