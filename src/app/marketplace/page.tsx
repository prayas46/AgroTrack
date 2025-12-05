
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { getMarketMatches } from "@/lib/actions";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarketplaceResults } from "./results";
import type { MatchWithMarketParticipantsOutput } from "@/ai/flows/match-with-market-participants";
import { Loader2 } from "lucide-react";

type MarketplaceState = {
  message: string | null;
  data: MatchWithMarketParticipantsOutput | null;
  errors?: {
    farmDetails?: string[];
    harvestDetails?: string[];
    priceExpectations?: string[];
    desiredPartners?: string[];
  };
};

const initialState: MarketplaceState = {
  message: null,
  data: null,
  errors: {},
};

const partnerTypes = [
  { id: "buyers", label: "Buyers" },
  { id: "suppliers", label: "Suppliers" },
  { id: "storage units", label: "Storage Units" },
  { id: "transport providers", label: "Transport Providers" },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Finding Matches..." : "Find Matches"}
    </Button>
  );
}

export default function MarketplacePage() {
  const [state, formAction] = useActionState(getMarketMatches, initialState);
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
        title="Agro-Match Marketplace"
        description="Connect with buyers, suppliers, and more. Let our AI find the perfect match for your needs."
      />
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Matching Criteria</CardTitle>
            <CardDescription>
              Fill in your details to find relevant market partners.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="farmDetails">Farm Details</Label>
                <Textarea
                  id="farmDetails"
                  name="farmDetails"
                  placeholder="e.g., 50-acre organic farm in Napa Valley specializing in grapes."
                  required
                />
                 {state.errors?.farmDetails && <p className="text-sm font-medium text-destructive">{state.errors.farmDetails[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="harvestDetails">Harvest Details</Label>
                <Textarea
                  id="harvestDetails"
                  name="harvestDetails"
                  placeholder="e.g., 10 tons of Cabernet Sauvignon, expected mid-October, certified organic."
                  required
                />
                 {state.errors?.harvestDetails && <p className="text-sm font-medium text-destructive">{state.errors.harvestDetails[0]}</p>}
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="priceExpectations">Price & Payment Expectations</Label>
              <Textarea
                id="priceExpectations"
                name="priceExpectations"
                placeholder="e.g., Seeking premium pricing, payment within 30 days of delivery."
                required
              />
               {state.errors?.priceExpectations && <p className="text-sm font-medium text-destructive">{state.errors.priceExpectations[0]}</p>}
            </div>
            <div className="space-y-3">
              <Label>Desired Partners</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {partnerTypes.map((partner) => (
                  <div key={partner.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={partner.id}
                      name="desiredPartners"
                      value={partner.id}
                    />
                    <Label
                      htmlFor={partner.id}
                      className="text-sm font-normal"
                    >
                      {partner.label}
                    </Label>
                  </div>
                ))}
              </div>
               {state.errors?.desiredPartners && <p className="text-sm font-medium text-destructive">{state.errors.desiredPartners[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.data && <MarketplaceResults data={state.data} />}
    </div>
  );
}
