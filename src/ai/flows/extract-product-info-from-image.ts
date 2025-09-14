// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting product information from an image.
 *
 * - extractProductInfoFromImage - A function that extracts product details from an image.
 * - ExtractProductInfoInput - The input type for the extractProductInfoFromImage function.
 * - ExtractProductInfoOutput - The return type for the extractProductInfoFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractProductInfoInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a product label, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type ExtractProductInfoInput = z.infer<
  typeof ExtractProductInfoInputSchema
>;

const ExtractProductInfoOutputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  batchId: z.string().describe('The batch ID of the product.'),
  mfgDate: z
    .string()
    .describe('The manufacturing date of the product (YYYY-MM-DD).'),
  expDate: z
    .string()
    .describe('The expiry date of the product (YYYY-MM-DD).'),
});

export type ExtractProductInfoOutput = z.infer<
  typeof ExtractProductInfoOutputSchema
>;

export async function extractProductInfoFromImage(
  input: ExtractProductInfoInput
): Promise<ExtractProductInfoOutput> {
  return extractProductInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractProductInfoPrompt',
  input: {schema: ExtractProductInfoInputSchema},
  output: {schema: ExtractProductInfoOutputSchema},
  prompt: `You are an expert OCR system. Extract the product name, batch ID, manufacturing date, and expiry date from the following image of a product label. Return the dates in YYYY-MM-DD format.

Image: {{media url=imageDataUri}}
`,
});

const extractProductInfoFlow = ai.defineFlow(
  {
    name: 'extractProductInfoFlow',
    inputSchema: ExtractProductInfoInputSchema,
    outputSchema: ExtractProductInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
