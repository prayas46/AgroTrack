
'use server';

/**
 * @fileOverview An AI agent for soil analysis and recommendation.
 *
 * - analyzeSoil - A function that handles the soil analysis process.
 * - SoilAnalysisInput - The input type for the analyzeSoil function.
 * - SoilAnalysisOutput - The return type for the analyzeSoil function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SoilAnalysisInputSchema = z.object({
  ph: z.number().describe('The pH level of the soil.'),
  nitrogen: z.number().describe('The nitrogen content in ppm (parts per million).'),
  phosphorus: z.number().describe('The phosphorus content in ppm.'),
  potassium: z.number().describe('The potassium content in ppm.'),
  moisture: z.number().describe('The soil moisture percentage.'),
  organicMatter: z.number().describe('The organic matter percentage.'),
});
export type SoilAnalysisInput = z.infer<typeof SoilAnalysisInputSchema>;

const ParameterAnalysisSchema = z.object({
  value: z.number().describe('The value of the soil parameter.'),
  status: z.enum(['Very Low', 'Low', 'Adequate', 'Optimal', 'High', 'Very High']).describe('The qualitative status of the parameter.'),
  interpretation: z.string().describe('A brief interpretation of this parameter\'s level and its impact on crops.'),
});

const SoilAnalysisOutputSchema = z.object({
  overallAssessment: z.string().describe('A summary of the overall soil health.'),
  parameters: z.object({
    ph: ParameterAnalysisSchema,
    nitrogen: ParameterAnalysisSchema,
    phosphorus: ParameterAnalysisSchema,
    potassium: ParameterAnalysisSchema,
    moisture: ParameterAnalysisSchema,
    organicMatter: ParameterAnalysisSchema,
  }),
  recommendations: z.object({
    fertilizer: z.string().describe('Specific recommendations for fertilizer application (e.g., Urea, DAP, MOP quantities in kg/ha).'),
    amendments: z.string().describe('Recommendations for soil amendments (e.g., lime for low pH, compost for low organic matter).'),
    irrigation: z.string().describe('Recommendations for irrigation frequency and duration based on moisture levels.'),
  }),
  predictedImpact: z.string().describe('The predicted positive impact on yield, water savings, or cost reduction if recommendations are followed.'),
});
export type SoilAnalysisOutput = z.infer<typeof SoilAnalysisOutputSchema>;

export async function analyzeSoil(input: SoilAnalysisInput): Promise<SoilAnalysisOutput> {
  return analyzeSoilFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSoilPrompt',
  input: { schema: SoilAnalysisInputSchema },
  output: { schema: SoilAnalysisOutputSchema },
  prompt: `You are an expert agronomist AI specializing in soil health analysis.

  Analyze the following soil data provided by a farmer. For each parameter (pH, nitrogen, phosphorus, potassium, moisture, organicMatter), provide its value, a qualitative status (e.g., 'Optimal', 'Low'), and a brief interpretation.

  Then, based on the complete analysis, provide:
  1. An overall assessment of the soil's health.
  2. Specific, actionable recommendations for:
     - Fertilizer application (suggesting types like Urea, DAP, MOP and quantities in kg/ha).
     - Soil amendments (like lime or compost).
     - Irrigation scheduling.
  3. A predicted impact of implementing these recommendations (e.g., potential yield increase, water savings).

  Soil Data:
  - pH: {{{ph}}}
  - Nitrogen: {{{nitrogen}}} ppm
  - Phosphorus: {{{phosphorus}}} ppm
  - Potassium: {{{potassium}}} ppm
  - Moisture: {{{moisture}}}%
  - Organic Matter: {{{organicMatter}}}%

  Provide a complete and well-structured JSON response.
`,
});

const analyzeSoilFlow = ai.defineFlow(
  {
    name: 'analyzeSoilFlow',
    inputSchema: SoilAnalysisInputSchema,
    outputSchema: SoilAnalysisOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid analysis.");
    }
    return output;
  }
);
