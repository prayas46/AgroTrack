
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
  sustainabilityAnalysis: z.string().describe('A detailed analysis of which crops are suitable for the climate and required soil types or management techniques.'),
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
    sustainabilityAnalysis: true,
    weatherAlerts: true,
  })},
  prompt: `You are an AI assistant that forecasts climate risks and provides sustainability advice for farmers.

  Based on the region and number of days provided, generate a climate risk forecast, detailing the probability of pest attacks, risk of crop disease outbreak, risk of water shortage, and risk of extreme weather events. 
  
  Then, provide a "Sustainability Analysis" that details which crops are suitable for the forecasted climate. Also describe the ideal soil types for those crops and any soil management techniques required to make them grow successfully in this region.

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
    const {output} = await textGenerationPrompt(input);

    if (!output) {
        throw new Error('Failed to generate the climate risk forecast. Please try again.');
    }
    
    return output;
  }
);
