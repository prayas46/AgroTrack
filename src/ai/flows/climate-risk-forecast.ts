
'use server';

/**
 * @fileOverview A climate risk forecast AI agent.
 *
 * - climateRiskForecast - A function that handles the climate risk forecast process.
 * - ClimateRiskForecastInput - The input type for the climateRiskForecast function.
 * - ClimateRiskForecastOutput - The return type for the climateRiskForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ClimateRiskForecastInputSchema = z.object({
  region: z.string().describe('The region for which to forecast climate risks.'),
  days: z
    .number()
    .min(7)
    .max(90)
    .describe('The number of days for the forecast (7-90).'),
});
export type ClimateRiskForecastInput = z.infer<typeof ClimateRiskForecastInputSchema>;

const ClimateRiskForecastOutputSchema = z.object({
  pestAttackProbability: z
    .string()
    .describe('The probability of pest attacks in the region.'),
  cropDiseaseOutbreak: z.string().describe('The risk of crop disease outbreak.'),
  waterShortageRisk: z.string().describe('The risk of water shortage.'),
  extremeWeatherRisk: z.string().describe('The risk of extreme weather events.'),
  riskMapAnalysis: z.string().describe('A detailed analysis of the generated risk map for the specified region.'),
  riskMapDataUri: z.string().optional().describe("A data URI of a satellite map showing various regions with color-coded risk overlays. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ClimateRiskForecastOutput = z.infer<typeof ClimateRiskForecastOutputSchema>;

export async function climateRiskForecast(input: ClimateRiskForecastInput): Promise<ClimateRiskForecastOutput> {
  return climateRiskForecastFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
  name: 'climateRiskTextPrompt',
  input: {schema: ClimateRiskForecastInputSchema},
  output: {schema: ClimateRiskForecastOutputSchema.pick({
    pestAttackProbability: true,
    cropDiseaseOutbreak: true,
    waterShortageRisk: true,
    extremeWeatherRisk: true,
    riskMapAnalysis: true,
  })},
  prompt: `You are an AI assistant that forecasts climate risks for farmers.

  Based on the region and number of days provided, generate a climate risk forecast, detailing the probability of pest attacks, risk of crop disease outbreak, risk of water shortage, and risk of extreme weather events. Provide a detailed analysis for a risk map.

  Region: {{{region}}}
  Days: {{{days}}}
`,
});

const climateRiskForecastFlow = ai.defineFlow(
  {
    name: 'climateRiskForecastFlow',
    inputSchema: ClimateRiskForecastInputSchema,
    outputSchema: ClimateRiskForecastOutputSchema,
  },
  async input => {
    const imagePrompt = `A satellite image of ${input.region} with color-coded overlays indicating different climate risk levels. Use distinct colors for high, medium, and low-risk zones for factors like water shortage, pest attacks, and extreme weather. Include a legend.`;

    // Run text and image generation in parallel
    const [textResult, imageResult] = await Promise.all([
      textGenerationPrompt(input).catch(err => {
        console.error("Text generation failed:", err);
        return null; // Return null if text generation fails
      }),
      ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: imagePrompt,
      }).catch(err => {
        console.error("Image generation failed:", err);
        return null; // Return null if image generation fails
      })
    ]);

    const textOutput = textResult?.output;
    const imageUrl = imageResult?.media?.url;

    if (!textOutput) {
        throw new Error('Failed to generate the climate risk text forecast. Please try again.');
    }

    return {
        ...textOutput,
        riskMapDataUri: imageUrl,
    };
  }
);
