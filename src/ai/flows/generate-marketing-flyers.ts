'use server';
/**
 * @fileOverview A marketing flyer generation AI agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { config } from 'dotenv';
config();

export const GenerateMarketingFlyerInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A description of the product.'),
  storeName: z.string().describe('The name of the store.'),
  storeSlogan: z.string().describe('The slogan of the store.'),
  primaryColor: z.string().describe('The primary color for branding.'),
  accentColor: z.string().describe('The accent color for branding.'),
  headlineFont: z.string().describe('The font for headlines.'),
  bodyFont: z.string().describe('The font for the body text.'),
  callToAction: z.string().describe('The call to action text.'),
  flyerType: z
    .enum(['digital', 'print'])
    .describe('The type of flyer to generate.'),
  imagePrompt: z.string().optional().describe('An optional prompt for generating an image. If not provided, a default based on product name will be used.'),
});
export type GenerateMarketingFlyerInput = z.infer<
  typeof GenerateMarketingFlyerInputSchema
>;

export const GenerateMarketingFlyerOutputSchema = z.object({
  flyerHtml: z
    .string()
    .describe('The generated flyer content as an HTML string.'),
  flyerText: z.string().describe('The generated flyer content as plain text.'),
  flyerImage: z
    .string()
    .optional()
    .describe(
      "A generated image for the flyer, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateMarketingFlyerOutput = z.infer<
  typeof GenerateMarketingFlyerOutputSchema
>;

export async function generateMarketingFlyer(
  input: GenerateMarketingFlyerInput
): Promise<GenerateMarketingFlyerOutput> {
  return generateMarketingFlyerFlow(input);
}

const flyerGenPrompt = ai.definePrompt({
    name: 'flyerGenPrompt',
    input: { schema: GenerateMarketingFlyerInputSchema },
    output: { schema: GenerateMarketingFlyerOutputSchema },
    prompt: `You are a marketing expert creating a flyer for a product.
  
      Product Name: {{{productName}}}
      Description: {{{productDescription}}}
      Store: {{{storeName}}} - "{{{storeSlogan}}}"
      Call to Action: {{{callToAction}}}
  
      Generate compelling, professional, and creative marketing copy for the flyer based on these details. The output should be formatted as a complete HTML document.
  
      Use the following branding guidelines:
      - Primary Color: {{{primaryColor}}}
      - Accent Color: {{{accentColor}}}
      - Headline Font: {{{headlineFont}}}
      - Body Font: {{{bodyFont}}}
  
      The HTML should be well-structured and include inline CSS for styling. Create a visually appealing layout suitable for a {{{flyerType}}} flyer.
  
      The plain text output should be a concise summary of the flyer's content.`,
});

const generateMarketingFlyerFlow = ai.defineFlow(
  {
    name: 'generateMarketingFlyerFlow',
    inputSchema: GenerateMarketingFlyerInputSchema,
    outputSchema: GenerateMarketingFlyerOutputSchema,
  },
  async (input) => {
    const [textResult, imageResult] = await Promise.all([
      flyerGenPrompt(input),
      ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: input.imagePrompt || `A professional, high-quality marketing photo of ${input.productName}.`,
      }),
    ]);

    const output = textResult.output;
    if (!output) {
      throw new Error('Failed to generate flyer text content.');
    }
    
    return {
      ...output,
      flyerImage: imageResult.media.url,
    };
  }
);
