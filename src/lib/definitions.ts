import { z } from "zod";

export const ClimateRiskFormSchema = z.object({
  region: z.string().min(1, "Region is required."),
  days: z.coerce.number({ invalid_type_error: "Please select a forecast period."}).min(7, "Please select a forecast period."),
});

export const ProfitPlannerFormSchema = z.object({
  landArea: z.coerce.number().positive("Land area must be a positive number."),
  soilDetails: z.string().min(10, "Soil details must be at least 10 characters long."),
  budget: z.coerce.number().positive("Budget must be a positive number."),
});

export const MarketplaceFormSchema = z.object({
  farmDetails: z.string().min(10, "Farm details must be at least 10 characters long."),
  harvestDetails: z.string().min(10, "Harvest details must be at least 10 characters long."),
  priceExpectations: z.string().min(5, "Price expectations must be at least 5 characters long."),
  desiredPartners: z.array(z.enum(['buyers', 'suppliers', 'storage units', 'transport providers'])).min(1, "Please select at least one partner type."),
});
