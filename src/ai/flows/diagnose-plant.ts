
'use server';

/**
 * @fileOverview An AI agent that diagnoses plant diseases and recommends fertilizers.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  plantName: z.string().describe("The common name of the plant identified in the image."),
  disease: z.string().describe("The name of the disease affecting the plant. If the plant is healthy, this should be 'Healthy'."),
  confidenceScore: z.number().describe("A confidence score (0-100) for the disease diagnosis."),
  recommendedFertilizer: z.string().describe("The recommended fertilizer or treatment to address the identified disease. Provide a reason for the recommendation."),
  preventiveMeasures: z.string().describe("Preventive measures that can be taken to avoid this disease in the future."),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(input: DiagnosePlantInput): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  input: { schema: DiagnosePlantInputSchema },
  output: { schema: DiagnosePlantOutputSchema },
  prompt: `You are a virtual plant doctor and agricultural expert.

  Analyze the provided image of a plant. Your tasks are to:
  1.  Identify the plant.
  2.  Diagnose any disease it may have. If it's healthy, state that clearly.
  3.  Provide a confidence score for your diagnosis.
  4.  Recommend an appropriate fertilizer or treatment plan to address the issue.
  5.  Suggest preventive measures for the future.

  Image: {{media url=photoDataUri}}

  Please provide your response in the requested JSON format.
`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
