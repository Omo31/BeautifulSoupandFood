'use server';

/**
 * @fileOverview AI-powered tool to generate branded video ads for specific business features.
 *
 * - generateVideoAd - A function that handles the video generation process.
 * - GenerateVideoAdInput - The input type for the generateVideoAd function.
 * - GenerateVideoAdOutput - The return type for the generateVideoAd function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateVideoAdInputSchema = z.object({
  topic: z.enum(['custom-orders', 'about-us']).describe('The topic for the video ad.'),
  durationSeconds: z.number().min(5).max(8).default(5).describe('Length of the video in seconds (5-8).'),
  aspectRatio: z.enum(['16:9', '9:16']).default('16:9').describe('Aspect ratio of the video.'),
});

export type GenerateVideoAdInput = z.infer<typeof GenerateVideoAdInputSchema>;

const GenerateVideoAdOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});

export type GenerateVideoAdOutput = z.infer<typeof GenerateVideoAdOutputSchema>;

export async function generateVideoAd(input: GenerateVideoAdInput): Promise<GenerateVideoAdOutput> {
  return generateVideoAdFlow(input);
}

// Helper function to download video and convert to data URI
async function getVideoDataUri(videoUrl: string): Promise<string> {
    const fetch = (await import('node-fetch')).default;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set.');
    }
    const downloadUrl = `${videoUrl}&key=${apiKey}`;

    const response = await fetch(downloadUrl);
    if (!response.ok || !response.body) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    
    const videoBuffer = await response.buffer();
    return `data:video/mp4;base64,${videoBuffer.toString('base64')}`;
}

const topicPrompts = {
    'custom-orders': `
      Create a short, engaging video ad explaining the "Custom Order" feature for an online gourmet food store called "BeautifulSoup&Food".
      The video should visually communicate the following steps:
      1. A customer has a special request for a rare or specific food item.
      2. They fill out a simple "Custom Order" form on the website.
      3. The "BeautifulSoup&Food" team reviews the request and sends a quote.
      4. The happy customer receives their unique, high-quality product.
      The style should be clean, modern, and appetizing.
      End the video with the business name "BeautifulSoup&Food" and the website "www.beautifulsoupandfood.com" clearly displayed.
    `,
    'about-us': `
      Create an inspiring video ad about the brand "BeautifulSoup&Food".
      The video should convey a passion for high-quality, artisan, and gourmet food.
      Showcase a variety of beautiful products like fresh produce, artisan cheeses, and gourmet pantry items.
      The overall feeling should be premium, trustworthy, and about delivering an exceptional food experience.
      End the video with the business name "BeautifulSoup&Food" and the website "www.beautifulsoupandfood.com" clearly displayed.
    `
};


const generateVideoAdFlow = ai.defineFlow(
  {
    name: 'generateVideoAdFlow',
    inputSchema: GenerateVideoAdInputSchema,
    outputSchema: GenerateVideoAdOutputSchema,
  },
  async (input) => {
    // Select the prompt based on the chosen topic
    const prompt = topicPrompts[input.topic];

    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: prompt,
      config: {
        durationSeconds: input.durationSeconds,
        aspectRatio: input.aspectRatio,
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Poll for completion
    while (!operation.done) {
      // Wait for 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
      console.error('Video generation failed:', operation.error);
      throw new Error('Failed to generate video: ' + operation.error.message);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart?.media?.url) {
      throw new Error('Failed to find the generated video in the model response.');
    }
    
    const videoDataUri = await getVideoDataUri(videoPart.media.url);
    
    return {
      videoUrl: videoDataUri,
    };
  }
);
