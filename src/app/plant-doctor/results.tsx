
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CircleHelp, Leaf, Loader2, Microscope, ShieldCheck, Volume2 } from "lucide-react";
import type { DiagnosePlantOutput } from "@/ai/flows/diagnose-plant";
import { getSpokenText } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

function ReadAloudButton({ text }: { text: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleReadAloud = async () => {
    setIsLoading(true);
    // Stop any previously playing audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const result = await getSpokenText(text);
    setIsLoading(false);

    if ("audioDataUri" in result) {
      const newAudio = new Audio(result.audioDataUri);
      setAudio(newAudio);
      newAudio.play();
    } else {
      toast({
        variant: "destructive",
        title: "Speech Error",
        description: result.error,
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleReadAloud}
      disabled={isLoading}
      aria-label="Read aloud"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  );
}

export function PlantDoctorResults({
  data,
  preview,
}: {
  data: DiagnosePlantOutput;
  preview: string | null;
}) {
  const fullDiagnosisText = `
    Plant: ${data.plantName}.
    Diagnosis: ${data.disease}.
    Confidence: ${data.confidenceScore} percent.
    Recommendation: ${data.recommendedFertilizer}.
    Prevention: ${data.preventiveMeasures}.
  `;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Diagnosis Results</h2>
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Read full summary</span>
            <ReadAloudButton text={fullDiagnosisText} />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {preview && (
            <Card>
              <CardHeader>
                <CardTitle>Your Plant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-64">
                    <Image
                    src={preview}
                    alt="Uploaded plant"
                    fill
                    className="object-contain rounded-md"
                    />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Leaf className="w-6 h-6 text-primary"/>
                            Plant Identification
                        </div>
                        <ReadAloudButton text={`Plant name: ${data.plantName}`} />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold">{data.plantName}</p>
                </CardContent>
            </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Microscope className="w-6 h-6 text-primary" />
                    Disease Diagnosis
                 </div>
                 <ReadAloudButton text={`Diagnosis: ${data.disease}. Confidence score: ${data.confidenceScore} percent.`} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{data.disease}</p>
                 <Badge variant={data.disease === 'Healthy' ? 'secondary' : 'destructive'}>{data.disease}</Badge>
              </div>
              <div>
                <div className="mb-1 flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Confidence</span>
                    <span className="text-sm font-semibold">{data.confidenceScore}%</span>
                </div>
                <Progress value={data.confidenceScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Alert>
             <div className="flex items-center justify-between w-full">
                <AlertTitle className="flex items-center gap-2">
                    <CircleHelp className="h-4 w-4" />
                    Recommended Fertilizer/Treatment
                </AlertTitle>
                <ReadAloudButton text={data.recommendedFertilizer} />
             </div>
            <AlertDescription className="pt-2">
                {data.recommendedFertilizer}
            </AlertDescription>
          </Alert>

          <Alert>
             <div className="flex items-center justify-between w-full">
                <AlertTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Preventive Measures
                </AlertTitle>
                <ReadAloudButton text={data.preventiveMeasures} />
             </div>
            <AlertDescription className="pt-2">
                {data.preventiveMeasures}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
