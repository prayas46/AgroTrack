
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { getProfitPlan } from "@/lib/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { ProfitPlannerResults } from "./results";
import type { SuggestProfitableCropsOutput } from "@/ai/flows/suggest-profitable-crops";
import { Loader2 } from "lucide-react";

type ProfitPlannerState = {
  message: string | null;
  data: SuggestProfitableCropsOutput | null;
  errors?: {
    landArea?: string[];
    soilDetails?: string[];
    budget?: string[];
  };
};

const initialState: ProfitPlannerState = {
  message: null,
  data: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Generating Plan..." : "Suggest Crops"}
    </Button>
  );
}

export default function ProfitPlannerPage() {
  const [state, formAction] = useActionState(getProfitPlan, initialState);
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
        title="Profit Prediction Engine"
        description="Get AI-driven suggestions for the most profitable crops based on your farm's data."
      />
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Farm & Budget Details</CardTitle>
            <CardDescription>
              Provide your farm's information to receive tailored crop suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="landArea">Land Area (in acres)</Label>
                    <Input
                        id="landArea"
                        name="landArea"
                        type="number"
                        placeholder="e.g., 50"
                        required
                    />
                     {state.errors?.landArea && (
                        <p className="text-sm font-medium text-destructive">
                        {state.errors.landArea[0]}
                        </p>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="budget">Budget (in Rupees)</Label>
                    <Input
                        id="budget"
                        name="budget"
                        type="number"
                        placeholder="e.g., 800000"
                        required
                    />
                    {state.errors?.budget && (
                        <p className="text-sm font-medium text-destructive">
                        {state.errors.budget[0]}
                        </p>
                    )}
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="soilDetails">Soil Details</Label>
              <Textarea
                id="soilDetails"
                name="soilDetails"
                placeholder="e.g., Loamy soil, pH 6.5, high in organic matter..."
                required
              />
               {state.errors?.soilDetails && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.soilDetails[0]}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.data && <ProfitPlannerResults data={state.data} />}
    </div>
  );
}
