'use client';

import { useState } from 'react';
import { FlyerForm } from '@/components/flyer-generator/flyer-form';
import { FlyerDisplay } from '@/components/flyer-generator/flyer-display';
import type { GenerateMarketingFlyerOutput } from '@/ai/flows/generate-marketing-flyers';

export default function FlyerGeneratorPage() {
  const [result, setResult] = useState<GenerateMarketingFlyerOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">AI-Powered Flyer Generator</h1>
        <p className="text-muted-foreground">
          Create marketing flyers and ads with configurable options and AI-generated content.
        </p>
      </div>
      <FlyerForm setResult={setResult} setLoading={setLoading} loading={loading} />
      <FlyerDisplay result={result} loading={loading} onDelete={handleDelete} />
    </div>
  );
}
