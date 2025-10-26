'use server';

/**
 * @fileOverview AI-powered tool to generate marketing flyers and ads with configurable options and integration of store-specific details and branding.
 *
 * - generateMarketingFlyer - A function that handles the marketing flyer generation process.
 * - GenerateMarketingFlyerInput - The input type for the generateMarketingFlyer function.
 * - GenerateMarketingFlyerOutput - The return type for the generateMarketingFlyer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingFlyerInputSchema = z.object({
  productName: z.string().describe('The name of the product being advertised.'),
  productDescription: z.string().describe('A brief description of the product.'),
  storeName: z.string().describe('The name of the store.'),
  storeSlogan: z.string().describe('The store slogan.'),
  primaryColor: z.string().describe('The primary color of the store branding (e.g., #3D9951).'),
  accentColor: z.string().describe('The accent color for highlights (e.g., #26BFA8).'),
  headlineFont: z.string().describe('The headline font for the flyer (e.g., Playfair).'),
  bodyFont: z.string().describe('The body font for the flyer (e.g., PT Sans).'),
  callToAction: z.string().describe('The call to action (e.g., Visit us today!).'),
  flyerType: z.enum(['digital', 'print']).describe('The type of flyer (digital or print).'),
  imagePrompt: z.string().optional().describe('A prompt for the AI image generator, describing the desired image for the flyer.'),
});

export type GenerateMarketingFlyerInput = z.infer<typeof GenerateMarketingFlyerInputSchema>;

const GenerateMarketingFlyerOutputSchema = z.object({
  flyerText: z.string().describe('The text content of the generated marketing flyer.'),
  imageUrl: z.string().describe('The URL of the generated image for the flyer.'),
});

export type GenerateMarketingFlyerOutput = z.infer<typeof GenerateMarketingFlyerOutputSchema>;

export async function generateMarketingFlyer(input: GenerateMarketingFlyerInput): Promise<GenerateMarketingFlyerOutput> {
  return generateMarketingFlyerFlow(input);
}

const flyerPrompt = ai.definePrompt({
  name: 'flyerPrompt',
  input: {schema: GenerateMarketingFlyerInputSchema},
  output: {schema: z.object({flyerText: z.string()})},
  prompt: `You are a marketing expert specializing in creating promotional flyers and ads.

  Create marketing flyer text for the following product:
  Product: {{productName}}
  Description: {{productDescription}}

  Use the following store details for branding:
  Store Name: {{storeName}}
  Slogan: {{storeSlogan}}
  Primary Color: {{primaryColor}}
  Accent Color: {{accentColor}}
  Headline Font: {{headlineFont}}
  Body Font: {{bodyFont}}
  Call to Action: {{callToAction}}

  The flyer is for {{flyerType}} use.

  Ensure the flyer text is engaging and persuasive, encouraging customers to take action.

  Just provide the flyer text, nothing else.`,
});

const generateMarketingFlyerFlow = ai.defineFlow(
  {
    name: 'generateMarketingFlyerFlow',
    inputSchema: GenerateMarketingFlyerInputSchema,
    outputSchema: GenerateMarketingFlyerOutputSchema,
  },
  async input => {
    const {output} = await flyerPrompt(input);

    const imageGenerationPrompt = input.imagePrompt || `Generate an image of ${input.productName} from ${input.storeName}, ${input.productDescription}, in the style matching the branding with primary color ${input.primaryColor} and accent color ${input.accentColor}`;
    
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: imageGenerationPrompt,
    });
    
    return { flyerText: output?.flyerText ?? '', imageUrl: media.url };
  }
);
