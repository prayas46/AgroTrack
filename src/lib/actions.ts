
"use server";

import { z } from "zod";
import {
  climateRiskForecast,
  type ClimateRiskForecastOutput,
} from "@/ai/flows/climate-risk-forecast";
import {
  suggestProfitableCrops,
  type SuggestProfitableCropsOutput,
} from "@/ai/flows/suggest-profitable-crops";
import {
  matchWithMarketParticipants,
  type MatchWithMarketParticipantsOutput,
} from "@/ai/flows/match-with-market-participants";
import {
  ClimateRiskFormSchema,
  MarketplaceFormSchema,
  ProfitPlannerFormSchema,
} from "./definitions";

type FormState<T> = {
  message: string | null;
  data: T | null;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function getClimateRiskForecast(
  prevState: FormState<ClimateRiskForecastOutput>,
  formData: FormData
): Promise<FormState<ClimateRiskForecastOutput>> {
  const validatedFields = ClimateRiskFormSchema.safeParse({
    region: formData.get("region"),
    days: formData.get("days"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const data = await climateRiskForecast(validatedFields.data);
    return { message: null, data, errors: {} };
  } catch (error) {
    return { message: "Failed to fetch forecast. Please try again.", data: null };
  }
}

export async function getProfitPlan(
  prevState: FormState<SuggestProfitableCropsOutput>,
  formData: FormData
): Promise<FormState<SuggestProfitableCropsOutput>> {
  const validatedFields = ProfitPlannerFormSchema.safeParse({
    landArea: formData.get("landArea"),
    soilDetails: formData.get("soilDetails"),
    budget: formData.get("budget"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const data = await suggestProfitableCrops(validatedFields.data);
    return { message: null, data, errors: {} };
  } catch (error) {
    return {
      message: "Failed to generate profit plan. Please try again.",
      data: null,
    };
  }
}

export async function getMarketMatches(
  prevState: FormState<MatchWithMarketParticipantsOutput>,
  formData: FormData
): Promise<FormState<MatchWithMarketParticipantsOutput>> {
  const validatedFields = MarketplaceFormSchema.safeParse({
    farmDetails: formData.get("farmDetails"),
    harvestDetails: formData.get("harvestDetails"),
    priceExpectations: formData.get("priceExpectations"),
    desiredPartners: formData.getAll("desiredPartners"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const data = await matchWithMarketParticipants(validatedFields.data);
    return { message: null, data, errors: {} };
  } catch (error) {
    return {
      message: "Failed to find market matches. Please try again.",
      data: null,
    };
  }
}
