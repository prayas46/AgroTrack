
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_PDF_TYPES = ["application/pdf"];

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

const fileSchema = z
    .any()
    .refine((file) => file, "File is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`);

export const PlantDoctorFormSchema = z.object({
    plantImage: fileSchema
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .transform(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        return `data:${file.type};base64,${base64}`;
    })
});

export const AadharUploadFormSchema = z.object({
    aadharPdf: fileSchema
    .refine(
      (file) => ACCEPTED_PDF_TYPES.includes(file.type),
      "Only .pdf format is supported."
    )
});

export const SoilAnalysisFormSchema = z.object({
    ph: z.coerce.number().min(0).max(14, "pH must be between 0 and 14."),
    nitrogen: z.coerce.number().min(0, "Nitrogen cannot be negative."),
    phosphorus: z.coerce.number().min(0, "Phosphorus cannot be negative."),
    potassium: z.coerce.number().min(0, "Potassium cannot be negative."),
    moisture: z.coerce.number().min(0).max(100, "Moisture must be between 0 and 100."),
    organicMatter: z.coerce.number().min(0).max(100, "Organic matter must be between 0 and 100."),
});
