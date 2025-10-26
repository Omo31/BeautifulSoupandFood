'use server';

/**
 * @fileOverview AI-powered tool to generate branded video ads with voiceover for any given topic.
 *
 * - generateVideoAd - A function that handles the video generation process.
 * - GenerateVideoAdInput - The input type for the generateVideoAd function.
 * - GenerateVideoAdOutput - The return type for the generateVideoAd function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const GenerateVideoAdInputSchema = z.object({
  topic: z.string().min(10, "Please provide a more detailed topic for the ad."),
  durationSeconds: z.number().min(5).max(8).default(5).describe('Length of the video in seconds (5-8).'),
  aspectRatio: z.enum(['16:9', '9:16']).default('16:9').describe('Aspect ratio of the video.'),
});

export type GenerateVideoAdInput = z.infer<typeof GenerateVideoAdInputSchema>;

const GenerateVideoAdOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
  audioUrl: z.string().describe('The data URI of the generated audio.'),
  script: z.string().describe('The generated script for the voiceover.'),
});

export type GenerateVideoAdOutput = z.infer<typeof GenerateVideoAdOutputSchema>;

export async function generateVideoAd(input: GenerateVideoAdInput): Promise<GenerateVideoAdOutput> {
  return generateVideoAdFlow(input);
}

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

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const adScriptPrompt = ai.definePrompt({
    name: 'adScriptPrompt',
    input: { schema: z.object({ topic: z.string(), durationSeconds: z.number() }) },
    output: { schema: z.object({ script: z.string(), videoPrompt: z.string() }) },
    prompt: `
        You are a creative director for a gourmet food company called "BeautifulSoup&Food".
        Your task is to create a short, compelling script for a video ad based on a given topic. The ad will have a voiceover.

        Business Name: BeautifulSoup&Food
        Website: www.beautifulsoupandfood.com

        Topic: {{{topic}}}
        Ad Duration: {{{durationSeconds}}} seconds

        Instructions:
        1. Write a concise and engaging voiceover script that explains the topic clearly and effectively within the given duration. The script should be natural-sounding and persuasive.
        2. Create a detailed visual prompt for an AI video generator. This prompt should describe the visuals that will accompany the voiceover, creating a cohesive and appetizing video. The style should be clean, modern, and inspiring.
        3. The ad must conclude by visually showing the business name and website. Make sure your video prompt includes instructions for this.

        Provide only the JSON output with the 'script' and 'videoPrompt'.
    `,
});


const generateVideoAdFlow = ai.defineFlow(
  {
    name: 'generateVideoAdFlow',
    inputSchema: GenerateVideoAdInputSchema,
    outputSchema: GenerateVideoAdOutputSchema,
  },
  async (input) => {
    
    // 1. Generate script and video prompt
    const { output: scriptAndPrompt } = await adScriptPrompt(input);
    if (!scriptAndPrompt) {
        throw new Error('Failed to generate ad script and video prompt.');
    }
    const { script, videoPrompt } = scriptAndPrompt;

    // 2. Generate video and audio in parallel
    const [videoResult, audioResult] = await Promise.all([
        // Generate Video
        ai.generate({
            model: googleAI.model('veo-2.0-generate-001'),
            prompt: videoPrompt,
            config: {
                durationSeconds: input.durationSeconds,
                aspectRatio: input.aspectRatio,
            },
        }),
        // Generate Audio
        ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Algenib' },
                    },
                },
            },
            prompt: script,
        })
    ]);
    
    let { operation } = videoResult;

    if (!operation) {
      throw new Error('Expected the model to return an operation for video generation.');
    }
    if (!audioResult.media) {
      throw new Error('Failed to generate audio for the voiceover.');
    }

    // 3. Poll for video completion
    while (!operation.done) {
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
    
    // 4. Process and prepare outputs
    const videoPromise = getVideoDataUri(videoPart.media.url);
    const audioPromise = toWav(Buffer.from(audioResult.media.url.substring(audioResult.media.url.indexOf(',') + 1), 'base64')).then(wav => `data:audio/wav;base64,${wav}`);

    const [videoDataUri, audioDataUri] = await Promise.all([videoPromise, audioPromise]);

    return {
      videoUrl: videoDataUri,
      audioUrl: audioDataUri,
      script: script,
    };
  }
);
