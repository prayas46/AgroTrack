
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

const WeatherAlertSchema = z.object({
  alertTitle: z.string().describe('The title of the weather alert.'),
  eventType: z.string().describe('The type of weather event (e.g., COASTAL_FLOOD).'),
  severity: z.string().describe('The severity of the alert (e.g., MINOR, MODERATE, SEVERE).'),
  certainty: z.string().describe('The certainty of the alert (e.g., LIKELY, OBSERVED).'),
  urgency: z.string().describe('The urgency of the alert (e.g., EXPECTED, IMMEDIATE).'),
  description: z.string().describe('A detailed description of the alert.'),
  instruction: z.string().describe('Instructions for what to do in response to the alert.'),
});

const ClimateRiskForecastOutputSchema = z.object({
  pestAttackProbability: z
    .string()
    .describe('The probability of pest attacks in the region.'),
  cropDiseaseOutbreak: z.string().describe('The risk of crop disease outbreak.'),
  waterShortageRisk: z.string().describe('The risk of water shortage.'),
  extremeWeatherRisk: z.string().describe('The risk of extreme weather events.'),
  riskMapAnalysis: z.string().describe('A detailed analysis of the generated risk map for the specified region.'),
  riskMapDataUri: z.string().optional().describe("A data URI of a satellite map showing various regions with color-coded risk overlays. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  weatherAlerts: z.array(WeatherAlertSchema).optional().describe('A list of active weather alerts for the region.'),
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
    weatherAlerts: true,
  })},
  prompt: `You are an AI assistant that forecasts climate risks for farmers.

  Based on the region and number of days provided, generate a climate risk forecast, detailing the probability of pest attacks, risk of crop disease outbreak, risk of water shortage, and risk of extreme weather events. Provide a detailed analysis for a risk-map.
  
  Also, check for and include any active weather alerts for the specified region.

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
    // Step 1: Generate the textual analysis and weather alerts first.
    const textResult = await textGenerationPrompt(input);
    const textOutput = textResult.output;

    if (!textOutput) {
        throw new Error('Failed to generate the climate risk text forecast. Please try again.');
    }
    
    // We are no longer generating an image. The UI will use a placeholder.
    return {
        ...textOutput,
        riskMapDataUri: undefined,
    };
  }
);
