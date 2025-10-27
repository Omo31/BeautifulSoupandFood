
'use client';

import { useState } from 'react';
import { VideoGeneratorForm } from '@/components/video-generator/video-generator-form';
import { VideoDisplay } from '@/components/video-generator/video-display';
import type { GenerateVideoAdOutput } from '@/ai/flows/generate-video-ad';

export default function VideoGeneratorPage() {
  const [result, setResult] = useState<GenerateVideoAdOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDelete = () => {
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">AI-Powered Video Ad Generator</h1>
        <p className="text-muted-foreground">
          Create compelling, branded video ads for any topic in seconds.
        </p>
      </div>
      <VideoGeneratorForm 
        setResult={setResult} 
        setLoading={setLoading} 
        loading={loading}
        setProgress={setProgress}
      />
      <VideoDisplay 
        result={result} 
        loading={loading} 
        onDelete={handleDelete}
        progress={progress}
      />
    </div>
  );
}
