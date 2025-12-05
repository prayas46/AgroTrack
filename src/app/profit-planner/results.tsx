import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { SuggestProfitableCropsOutput } from "@/ai/flows/suggest-profitable-crops";
import { LineChart, TrendingUp } from "lucide-react";

export function ProfitPlannerResults({
  data,
}: {
  data: SuggestProfitableCropsOutput;
}) {
  if (!data.cropSuggestions || data.cropSuggestions.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-semibold">No suggestions available</h3>
        <p className="text-muted-foreground">
          The AI could not generate a profit plan. Please try adjusting your inputs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight font-headline">
        Crop Suggestions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {data.cropSuggestions.map((suggestion, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex w-full items-center justify-between pr-4">
                <span className="text-lg font-semibold text-primary font-headline">
                  {suggestion.cropName}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Expected ROI</span>
                  <Badge variant="secondary" className="text-base bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                    {suggestion.expectedRoi}%
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Cost Breakdown</h4>
                        <p>{suggestion.costBreakdown}</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center gap-2"><LineChart className="w-4 h-4 text-primary" /> Historical Market Price Trend</h4>
                        <p>{suggestion.historicalMarketPriceTrend}</p>
                    </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
