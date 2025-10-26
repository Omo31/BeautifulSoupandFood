'use server';

/**
 * @fileOverview AI-powered tool to generate branded video ads with voiceover for any given topic.
 *
 * - generateVideoAd - A function that handles the video generation process.
 * - GenerateVideoAdInput - The input type for the generateVideoad function.
 * - GenerateVideoAdOutput - The return type for the generateVideoad function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import wav from 'wav';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import {exec} from 'child_process';

const MAX_DURATION = 24;
const CLIP_DURATION = 8;

const GenerateVideoAdInputSchema = z.object({
  topic: z.string().min(10, 'Please provide a more detailed topic for the ad.'),
  durationSeconds: z
    .number()
    .min(5)
    .max(MAX_DURATION)
    .default(8)
    .describe(`Length of the video in seconds (5-${MAX_DURATION}).`),
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

async function runFfmpeg(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -y ${command}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`ffmpeg stderr: ${stderr}`);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function toWav(pcmData: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    });
    const chunks: Buffer[] = [];
    writer.on('data', chunk => chunks.push(chunk));
    writer.on('end', () => resolve(Buffer.concat(chunks)));
    writer.on('error', reject);
    writer.write(pcmData);
    writer.end();
  });
}

const SceneSchema = z.object({
    sceneNumber: z.number().describe("The sequential number of the scene, starting from 1."),
    videoPrompt: z.string().describe("A detailed visual prompt for an AI video generator for this specific scene. The style should be clean, modern, and inspiring."),
    voiceoverScript: z.string().describe("The portion of the voiceover script that corresponds to this scene."),
});

const AdPlanSchema = z.object({
  scenes: z.array(SceneSchema),
  fullScript: z.string().describe("The complete, combined voiceover script for the entire ad."),
});


const adPlanPrompt = ai.definePrompt({
  name: 'adPlanPrompt',
  input: {schema: z.object({topic: z.string(), durationSeconds: z.number(), businessName: z.string(), website: z.string(), clipDuration: z.number()})},
  output: {schema: AdPlanSchema},
  prompt: `
        You are a creative director for a gourmet food company called "{{businessName}}".
        Your task is to create a plan for a short, compelling video ad based on a given topic.

        Business Name: {{businessName}}
        Website: {{website}}

        Topic: {{{topic}}}
        Total Ad Duration: {{{durationSeconds}}} seconds

        Instructions:
        1.  Divide the ad into multiple scenes. Each scene will be a video clip of approximately {{clipDuration}} seconds.
        2.  For each scene, write a detailed visual prompt for an AI video generator. The prompt should describe the visuals that will accompany the voiceover.
        3.  For each scene, write the corresponding portion of a concise and engaging voiceover script. The script for each scene should be short enough to be spoken within ~{{clipDuration}} seconds.
        4.  Combine all scene scripts into a single 'fullScript'.
        5.  The final scene must conclude by visually showing the business name and website. Make sure the last scene's video prompt includes instructions for this.
        6.  Provide only the JSON output.
    `,
});

const generateVideoAdFlow = ai.defineFlow(
  {
    name: 'generateVideoAdFlow',
    inputSchema: GenerateVideoAdInputSchema,
    outputSchema: GenerateVideoAdOutputSchema,
  },
  async input => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'video-ad-'));

    try {
      // 1. Generate plan
      const {output: adPlan} = await adPlanPrompt({
        ...input,
        businessName: 'BeautifulSoup&Food',
        website: 'www.beautifulsoupandfood.com',
        clipDuration: CLIP_DURATION,
      });

      if (!adPlan?.scenes?.length) {
        throw new Error('Failed to generate a valid ad plan.');
      }
      
      const {scenes, fullScript} = adPlan;

      // 2. Generate video clips and audio sequentially to avoid rate limiting
      const filePaths = [];
      for (const [index, scene] of scenes.entries()) {
        const sceneNumber = index + 1;
        console.log(`Generating assets for scene ${sceneNumber}...`);
        
        const videoResult = await ai.generate({
            model: googleAI.model('veo-2.0-generate-001'),
            prompt: scene.videoPrompt,
            config: {
              durationSeconds: CLIP_DURATION,
              aspectRatio: input.aspectRatio,
            },
        });
        
        const audioResult = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Algenib'}},
              },
            },
            prompt: scene.voiceoverScript,
        });

        let {operation} = videoResult;
        if (!operation) throw new Error(`Video operation failed for scene ${sceneNumber}.`);
        if (!audioResult.media) throw new Error(`Audio generation failed for scene ${sceneNumber}.`);

        console.log(`Polling for video completion for scene ${sceneNumber}...`);
        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          operation = await ai.checkOperation(operation);
        }

        if (operation.error) throw new Error(`Video generation failed for scene ${sceneNumber}: ${operation.error.message}`);
        
        const videoPart = operation.output?.message?.content.find(p => !!p.media);
        if (!videoPart?.media?.url) throw new Error(`No video media found for scene ${sceneNumber}.`);

        const fetch = (await import('node-fetch')).default;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY is not set.');

        console.log(`Downloading assets for scene ${sceneNumber}...`);
        const videoResponse = await fetch(`${videoPart.media.url}&key=${apiKey}`);
        if (!videoResponse.ok) throw new Error(`Failed to download video for scene ${sceneNumber}.`);
        
        const videoBuffer = await videoResponse.buffer();
        const videoPath = path.join(tempDir, `scene-${index}.mp4`);
        await fs.writeFile(videoPath, videoBuffer);
        
        const pcmBuffer = Buffer.from(audioResult.media.url.substring(audioResult.media.url.indexOf(',') + 1), 'base64');
        const wavBuffer = await toWav(pcmBuffer);
        const audioPath = path.join(tempDir, `scene-${index}.wav`);
        await fs.writeFile(audioPath, wavBuffer);

        filePaths.push({ videoPath, audioPath });
      }

      // 3. Combine audio and then video
      console.log('Combining audio and video files...');
      const audioListPath = path.join(tempDir, 'audio_list.txt');
      const audioListContent = filePaths.map(p => `file '${p.audioPath}'`).join('\n');
      await fs.writeFile(audioListPath, audioListContent);

      const combinedAudioPath = path.join(tempDir, 'combined.wav');
      await runFfmpeg(`-f concat -safe 0 -i ${audioListPath} ${combinedAudioPath}`);

      const videoListPath = path.join(tempDir, 'video_list.txt');
      const videoListContent = filePaths.map(p => `file '${p.videoPath}'`).join('\n');
      await fs.writeFile(videoListPath, videoListContent);
      
      const outputPath = path.join(tempDir, 'output.mp4');
      await runFfmpeg(`-f concat -safe 0 -i ${videoListPath} -i ${combinedAudioPath} -c:v copy -c:a aac -shortest ${outputPath}`);

      const finalVideoBuffer = await fs.readFile(outputPath);
      const finalAudioBuffer = await fs.readFile(combinedAudioPath);

      console.log('Video generation complete.');
      return {
        videoUrl: `data:video/mp4;base64,${finalVideoBuffer.toString('base64')}`,
        audioUrl: `data:audio/wav;base64,${finalAudioBuffer.toString('base64')}`,
        script: fullScript,
      };
    } finally {
        await fs.rm(tempDir, { recursive: true, force: true });
    }
  }
);
