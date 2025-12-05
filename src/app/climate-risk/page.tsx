
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { getClimateRiskForecast } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClimateRiskResults } from "./results";
import type { ClimateRiskForecastOutput } from "@/ai/flows/climate-risk-forecast";
import { Loader2 } from "lucide-react";

type ClimateRiskFormState = {
  message: string | null;
  data: ClimateRiskForecastOutput | null;
  errors?: {
    region?: string[];
    days?: string[];
  };
};

const initialState: ClimateRiskFormState = {
  message: null,
  data: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Forecasting..." : "Get Forecast"}
    </Button>
  );
}

export default function ClimateRiskPage() {
  const [state, formAction] = useActionState(getClimateRiskForecast, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Climate Risk Forecast"
        description="Predict potential climate-related challenges for your farm using AI analysis."
      />
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Forecast Parameters</CardTitle>
            <CardDescription>
              Enter a region and select a time period to generate a forecast.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                name="region"
                placeholder="e.g., Punjab, India"
                required
              />
              {state.errors?.region && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.region[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="days">Forecast Period</Label>
               <Select name="days" required>
                <SelectTrigger id="days">
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Next 7 Days</SelectItem>
                  <SelectItem value="30">Next 30 Days</SelectItem>
                  <SelectItem value="60">Next 60 Days</SelectItem>
                  <SelectItem value="90">Next 90 Days</SelectItem>
                </SelectContent>
              </Select>
               {state.errors?.days && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.days[0]}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.data && <ClimateRiskResults data={state.data} />}
    </div>
  );
}
