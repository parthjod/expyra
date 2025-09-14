// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting inventory actions based on product expiry status.
 *
 * - suggestInventoryActions - A function that suggests actions for products nearing expiry.
 * - SuggestInventoryActionsInput - The input type for the suggestInventoryActions function.
 * - SuggestInventoryActionsOutput - The return type for the suggestInventoryActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInventoryActionsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  expiryDate: z.string().describe('The expiry date of the product (YYYY-MM-DD).'),
  currentDate: z.string().describe('The current date (YYYY-MM-DD).'),
  quantity: z.number().describe('The quantity of the product in stock.'),
});

export type SuggestInventoryActionsInput = z.infer<
  typeof SuggestInventoryActionsInputSchema
>;

const SuggestInventoryActionsOutputSchema = z.object({
  suggestedAction: z
    .string()
    .describe(
      'The suggested action to take for the product (e.g., apply discount, mark for donation, remove stock).'
    ),
  reason: z.string().describe('The reasoning behind the suggested action.'),
});

export type SuggestInventoryActionsOutput = z.infer<
  typeof SuggestInventoryActionsOutputSchema
>;

export async function suggestInventoryActions(
  input: SuggestInventoryActionsInput
): Promise<SuggestInventoryActionsOutput> {
  return suggestInventoryActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInventoryActionsPrompt',
  input: {schema: SuggestInventoryActionsInputSchema},
  output: {schema: SuggestInventoryActionsOutputSchema},
  prompt: `You are an inventory management expert in a supermarket. Based on the product's expiry date, current date, and quantity, suggest an action to take to minimize losses and reduce waste.

Product Name: {{{productName}}}
Expiry Date: {{{expiryDate}}}
Current Date: {{{currentDate}}}
Quantity: {{{quantity}}}

Consider these actions: apply discount, mark for donation, remove stock.

Provide a suggested action and a brief reason for the suggestion. Return your answer in JSON format.
`,
});

const suggestInventoryActionsFlow = ai.defineFlow(
  {
    name: 'suggestInventoryActionsFlow',
    inputSchema: SuggestInventoryActionsInputSchema,
    outputSchema: SuggestInventoryActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
