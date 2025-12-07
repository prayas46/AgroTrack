
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
  diagnosePlant,
  type DiagnosePlantOutput,
} from "@/ai/flows/diagnose-plant";
import {
  textToSpeech,
  type TextToSpeechOutput,
} from "@/ai/flows/text-to-speech";
import {
  analyzeSoil,
  type SoilAnalysisOutput,
} from "@/ai/flows/soil-analysis";
import {
  ClimateRiskFormSchema,
  MarketplaceFormSchema,
  PlantDoctorFormSchema,
  AadharUploadFormSchema,
  SoilAnalysisFormSchema,
  ProfitPlannerFormSchema,
} from "./definitions";


type FormState<T> = {
  message: string | null;
  data: T | null;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

type UploadFormState = {
    message: string | null;
    success: boolean;
    errors?: {
        [key:string]: string[] | undefined;
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

export async function getPlantDiagnosis(
  prevState: FormState<DiagnosePlantOutput>,
  formData: FormData
): Promise<FormState<DiagnosePlantOutput>> {
  const validatedFields = await PlantDoctorFormSchema.safeParseAsync({
    plantImage: formData.get("plantImage"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const data = await diagnosePlant({
      photoDataUri: validatedFields.data.plantImage,
    });
    return { message: null, data, errors: {} };
  } catch (error) {
    return {
      message: "Failed to diagnose plant. Please try again.",
      data: null,
    };
  }
}


export async function getSpokenText(
  text: string
): Promise<{ audioDataUri: string } | { error: string }> {
  if (!text) {
    return { error: "No text provided to read." };
  }

  try {
    const { audioDataUri } = await textToSpeech({ text });
    return { audioDataUri };
  } catch (error) {
    console.error("Text-to-speech conversion failed:", error);
    return { error: "Failed to convert text to speech. Please try again." };
  }
}

export async function uploadAadharCard(
    prevState: UploadFormState,
    formData: FormData
): Promise<UploadFormState> {
    const validatedFields = AadharUploadFormSchema.safeParse({
        aadharPdf: formData.get("aadharPdf"),
    });

    if (!validatedFields.success) {
        return {
            message: "Invalid file. Please upload a PDF.",
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // In a real application, you would upload this file to a secure storage service.
        // For this demo, we'll just simulate a successful upload.
        console.log("Simulating Aadhar card upload for:", validatedFields.data.aadharPdf.name);
        
        // This is where you would add logic to upload to Firebase Storage, for example.
        // await uploadBytes(storageRef, validatedFields.data.aadharPdf);

        return { message: "Your Aadhar card has been uploaded successfully.", success: true };
    } catch (error) {
        console.error("Aadhar upload failed:", error);
        return { message: "An unexpected error occurred during upload. Please try again.", success: false };
    }
}

export async function getSoilAnalysis(
  prevState: FormState<SoilAnalysisOutput>,
  formData: FormData
): Promise<FormState<SoilAnalysisOutput>> {
  const validatedFields = SoilAnalysisFormSchema.safeParse({
    ph: formData.get("ph"),
    nitrogen: formData.get("nitrogen"),
    phosphorus: formData.get("phosphorus"),
    potassium: formData.get("potassium"),
    moisture: formData.get("moisture"),
    organicMatter: formData.get("organicMatter"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const data = await analyzeSoil(validatedFields.data);
    return { message: null, data, errors: {} };
  } catch (error) {
    return {
      message: "Failed to perform soil analysis. Please try again.",
      data: null,
    };
  }
}
