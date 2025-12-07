
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Beaker, Droplets, FlaskConical, Leaf, Microscope, Sparkles, TestTube2 } from 'lucide-react';
import type { SoilAnalysisOutput } from '@/ai/flows/soil-analysis';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Optimal':
        case 'Adequate':
            return 'text-green-600 dark:text-green-400';
        case 'Low':
        case 'High':
            return 'text-yellow-600 dark:text-yellow-400';
        case 'Very Low':
        case 'Very High':
            return 'text-red-600 dark:text-red-400';
        default:
            return 'text-muted-foreground';
    }
}

const parameterConfig = [
    { key: 'ph', title: 'pH Level', icon: TestTube2, unit: '' },
    { key: 'nitrogen', title: 'Nitrogen', icon: Leaf, unit: 'ppm' },
    { key: 'phosphorus', title: 'Phosphorus', icon: Leaf, unit: 'ppm' },
    { key: 'potassium', title: 'Potassium', icon: Leaf, unit: 'ppm' },
    { key: 'moisture', title: 'Moisture', icon: Droplets, unit: '%' },
    { key: 'organicMatter', title: 'Organic Matter', icon: Beaker, unit: '%' },
] as const;

export function SoilAnalysisResults({ data }: { data: SoilAnalysisOutput }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight font-headline">Analysis Results</h2>

        <Alert>
            <FlaskConical className="h-4 w-4" />
            <AlertTitle>Overall Assessment</AlertTitle>
            <AlertDescription>{data.overallAssessment}</AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-6 w-6 text-primary" />
                    Parameter Breakdown
                </CardTitle>
                <CardDescription>Detailed analysis of each soil component.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 {parameterConfig.map(({ key, title, icon: Icon, unit }) => {
                    const param = data.parameters[key];
                    return (
                        <div key={key} className="p-4 border rounded-lg space-y-2 bg-muted/20">
                           <div className="flex items-center justify-between">
                             <h3 className="font-semibold flex items-center gap-2 text-foreground">
                                <Icon className="w-5 h-5 text-muted-foreground" />
                                {title}
                             </h3>
                             <p className={`font-bold text-lg ${getStatusColor(param.status)}`}>{param.value}{unit}</p>
                           </div>
                           <p className={`text-sm font-medium ${getStatusColor(param.status)}`}>{param.status}</p>
                           <p className="text-xs text-muted-foreground">{param.interpretation}</p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Alert>
            <AlertTitle>Fertilizer Recommendations</AlertTitle>
            <AlertDescription>{data.recommendations.fertilizer}</AlertDescription>
        </Alert>
        <Alert>
            <AlertTitle>Soil Amendment Recommendations</AlertTitle>
            <AlertDescription>{data.recommendations.amendments}</AlertDescription>
        </Alert>
      </div>
      <Alert>
            <AlertTitle>Irrigation Recommendations</AlertTitle>
            <AlertDescription>{data.recommendations.irrigation}</AlertDescription>
      </Alert>

       <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-300">Predicted Impact</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">{data.predictedImpact}</AlertDescription>
        </Alert>

    </div>
  );
}
