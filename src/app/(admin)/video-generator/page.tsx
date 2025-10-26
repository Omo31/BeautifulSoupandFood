'use client';

import { useState } from 'react';
import { VideoGeneratorForm } from '@/components/video-generator/video-generator-form';
import { VideoDisplay } from '@/components/video-generator/video-display';
import type { GenerateVideoAdOutput } from '@/ai/flows/generate-video-ad';

export default function VideoGeneratorPage() {
  const [result, setResult] = useState<GenerateVideoAdOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleDelete = () => {
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">AI-Powered Video Ad Generator</h1>
        <p className="text-muted-foreground">
          Generate a branded video ad for a specific feature of your business.
        </p>
      </div>
      <VideoGeneratorForm 
        setResult={setResult} 
        setLoading={setLoading} 
        loading={loading}
        setLoadingProgress={setLoadingProgress} 
      />
      <VideoDisplay 
        result={result} 
        loading={loading}
        loadingProgress={loadingProgress}
        onDelete={handleDelete}
      />
    </div>
  );
}
