'use server';

/**
 * @fileOverview An AI agent that matches farmers with potential market participants.
 *
 * - matchWithMarketParticipants - A function that handles the matching process.
 * - MatchWithMarketParticipantsInput - The input type for the matchWithMarketParticipants function.
 * - MatchWithMarketParticipantsOutput - The return type for the matchWithMarketParticipants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchWithMarketParticipantsInputSchema = z.object({
  farmDetails: z.string().describe('Details about the farm, including location, size, and types of crops grown.'),
  harvestDetails: z.string().describe('Details about the current harvest, including quantity, quality, and any certifications.'),
  priceExpectations: z.string().describe('The farmer’s expectations for pricing and payment terms.'),
  desiredPartners: z.array(z.enum(['buyers', 'suppliers', 'storage units', 'transport providers'])).describe('The types of market participants the farmer is looking for.'),
});
export type MatchWithMarketParticipantsInput = z.infer<typeof MatchWithMarketParticipantsInputSchema>;

const MatchWithMarketParticipantsOutputSchema = z.object({
  matches: z.array(
    z.object({
      type: z.enum(['buyer', 'supplier', 'storage unit', 'transport provider']),
      name: z.string().describe('The name of the potential match.'),
      contactInformation: z.string().describe('Contact information for the potential match.'),
      relevanceScore: z.number().describe('A score indicating how well the match aligns with the farmer’s needs.'),
      details: z.string().describe('Additional details about the match, such as services offered or products needed.'),
    })
  ).describe('A list of potential matches with market participants.'),
});
export type MatchWithMarketParticipantsOutput = z.infer<typeof MatchWithMarketParticipantsOutputSchema>;

export async function matchWithMarketParticipants(input: MatchWithMarketParticipantsInput): Promise<MatchWithMarketParticipantsOutput> {
  return matchWithMarketParticipantsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchWithMarketParticipantsPrompt',
  input: {schema: MatchWithMarketParticipantsInputSchema},
  output: {schema: MatchWithMarketParticipantsOutputSchema},
  prompt: `You are an AI-powered agricultural marketplace expert, specializing in matching farmers with the most suitable market participants.

  Given the following details about the farmer's farm, harvest, and preferences, identify potential matches from the following categories: buyers, suppliers, storage units, and transport providers.

  Farm Details: {{{farmDetails}}}
  Harvest Details: {{{harvestDetails}}}
  Price Expectations: {{{priceExpectations}}}
  Desired Partners: {{#each desiredPartners}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Provide a list of potential matches, including their name, contact information, a relevance score (out of 100), and any relevant details. The relevance score should reflect how well the match aligns with the farmer's stated needs and preferences.
  Ensure that only the 'type' field is one of the following: buyer, supplier, storage unit, transport provider.
  Return your answer as a JSON object.`,
});

const matchWithMarketParticipantsFlow = ai.defineFlow(
  {
    name: 'matchWithMarketParticipantsFlow',
    inputSchema: MatchWithMarketParticipantsInputSchema,
    outputSchema: MatchWithMarketParticipantsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
