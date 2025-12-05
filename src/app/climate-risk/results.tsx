import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Biohazard, Bug, Droplets, Map, Wind, AlertTriangle } from "lucide-react";
import type { ClimateRiskForecastOutput } from "@/ai/flows/climate-risk-forecast";

const riskItems = [
    { key: "pestAttackProbability", title: "Pest Attack Probability", icon: Bug },
    { key: "cropDiseaseOutbreak", title: "Crop Disease Outbreak", icon: Biohazard },
    { key: "waterShortageRisk", title: "Water Shortage Risk", icon: Droplets },
    { key: "extremeWeatherRisk", title: "Extreme Weather Risk", icon: Wind },
] as const;

export function ClimateRiskResults({ data }: { data: ClimateRiskForecastOutput }) {
  return (
    <div className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Forecast Results</h2>
        <div className="grid gap-6 md:grid-cols-2">
            {riskItems.map(item => (
                <Card key={item.key}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground">{data[item.key]}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Map className="h-6 w-6 text-primary" />
                    Risk Map
                </CardTitle>
                <CardDescription>Visual overview of high-risk zones in the specified region.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {data.riskMapDataUri ? (
                    <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg border">
                        <Image
                        src={data.riskMapDataUri}
                        alt="AI-generated risk map"
                        fill
                        className="object-cover"
                        />
                         <div className="absolute inset-0 bg-black/10 " />
                    </div>
                ) : (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Map Not Available</AlertTitle>
                        <AlertDescription>
                            The AI was unable to generate the risk map image for this forecast, but the textual analysis is still available.
                        </AlertDescription>
                    </Alert>
                )}
                 <Alert>
                    <AlertTitle>Map Analysis</AlertTitle>
                    <AlertDescription>
                        {data.riskMapAnalysis}
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    </div>
  );
}
