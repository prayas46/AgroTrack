
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { getSoilAnalysis } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SoilAnalysisResults } from './results';
import type { SoilAnalysisOutput } from '@/ai/flows/soil-analysis';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type SoilAnalysisState = {
  message: string | null;
  data: SoilAnalysisOutput | null;
  errors?: {
    ph?: string[];
    nitrogen?: string[];
    phosphorus?: string[];
    potassium?: string[];
    moisture?: string[];
    organicMatter?: string[];
  };
};

const initialState: SoilAnalysisState = {
  message: null,
  data: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Analyzing...' : 'Analyze Soil'}
    </Button>
  );
}

export default function SoilAnalysisPage() {
  const [state, formAction] = useActionState(getSoilAnalysis, initialState);
  const { toast } = useToast();
  const soilAnalysisImage = PlaceHolderImages.find(p => p.id === 'soil-analysis-hero');

  useEffect(() => {
    if (state.message && !state.data) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Soil Analysis"
        description="Enter your soil's composition to get an AI-powered analysis and actionable recommendations."
      />

      {soilAnalysisImage && (
         <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg border group">
            <Image
                src={soilAnalysisImage.imageUrl}
                alt={soilAnalysisImage.description}
                fill
                className="object-cover animate-pulse-subtle"
                data-ai-hint={soilAnalysisImage.imageHint}
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Soil Parameters</CardTitle>
            <CardDescription>
              Input the data from your soil test report for an expert analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ph">pH Level</Label>
              <Input id="ph" name="ph" type="number" step="0.1" placeholder="e.g., 6.8" required />
              {state.errors?.ph && <p className="text-sm font-medium text-destructive">{state.errors.ph[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nitrogen">Nitrogen (ppm)</Label>
              <Input id="nitrogen" name="nitrogen" type="number" placeholder="e.g., 42" required />
              {state.errors?.nitrogen && <p className="text-sm font-medium text-destructive">{state.errors.nitrogen[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phosphorus">Phosphorus (ppm)</Label>
              <Input id="phosphorus" name="phosphorus" type="number" placeholder="e.g., 25" required />
              {state.errors?.phosphorus && <p className="text-sm font-medium text-destructive">{state.errors.phosphorus[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="potassium">Potassium (ppm)</Label>
              <Input id="potassium" name="potassium" type="number" placeholder="e.g., 150" required />
              {state.errors?.potassium && <p className="text-sm font-medium text-destructive">{state.errors.potassium[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="moisture">Moisture (%)</Label>
              <Input id="moisture" name="moisture" type="number" step="0.1" placeholder="e.g., 68" required />
              {state.errors?.moisture && <p className="text-sm font-medium text-destructive">{state.errors.moisture[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="organicMatter">Organic Matter (%)</Label>
              <Input id="organicMatter" name="organicMatter" type="number" step="0.1" placeholder="e.g., 3.2" required />
              {state.errors?.organicMatter && <p className="text-sm font-medium text-destructive">{state.errors.organicMatter[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.data && <SoilAnalysisResults data={state.data} />}
    </div>
  );
}
