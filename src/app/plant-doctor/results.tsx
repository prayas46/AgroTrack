
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleHelp, Leaf, Microscope, ShieldCheck } from "lucide-react";
import type { DiagnosePlantOutput } from "@/ai/flows/diagnose-plant";

export function PlantDoctorResults({
  data,
  preview,
}: {
  data: DiagnosePlantOutput;
  preview: string | null;
}) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight font-headline">Diagnosis Results</h2>
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
                    <CardTitle className="flex items-center gap-2">
                        <Leaf className="w-6 h-6 text-primary"/>
                        Plant Identification
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold">{data.plantName}</p>
                </CardContent>
            </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="w-6 h-6 text-primary" />
                Disease Diagnosis
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
             <CircleHelp className="h-4 w-4" />
            <AlertTitle>Recommended Fertilizer/Treatment</AlertTitle>
            <AlertDescription>
                {data.recommendedFertilizer}
            </AlertDescription>
          </Alert>

          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Preventive Measures</AlertTitle>
            <AlertDescription>
                {data.preventiveMeasures}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
