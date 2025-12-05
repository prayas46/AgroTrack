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
  riskMap: z.string().describe('Description of a risk map for the specified region.'),
});
export type ClimateRiskForecastOutput = z.infer<typeof ClimateRiskForecastOutputSchema>;

export async function climateRiskForecast(input: ClimateRiskForecastInput): Promise<ClimateRiskForecastOutput> {
  return climateRiskForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'climateRiskForecastPrompt',
  input: {schema: ClimateRiskForecastInputSchema},
  output: {schema: ClimateRiskForecastOutputSchema},
  prompt: `You are an AI assistant that forecasts climate risks for farmers.

  Based on the region and number of days provided, generate a climate risk forecast, detailing the probability of pest attacks, risk of crop disease outbreak, risk of water shortage, and risk of extreme weather events.

  Region: {{{region}}}
  Days: {{{days}}}

  Pest Attack Probability: Describe the probability of pest attacks in the region for the specified time frame.
  Crop Disease Outbreak: Describe the risk of crop disease outbreak in the region for the specified time frame.
  Water Shortage Risk: Describe the risk of water shortage in the region for the specified time frame.
  Extreme Weather Risk: Describe the risk of extreme weather events in the region for the specified time frame.
  Risk Map: Describe a risk map for the specified region, mentioning key areas of concern.

  {{output}}
`,
});

const climateRiskForecastFlow = ai.defineFlow(
  {
    name: 'climateRiskForecastFlow',
    inputSchema: ClimateRiskForecastInputSchema,
    outputSchema: ClimateRiskForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
