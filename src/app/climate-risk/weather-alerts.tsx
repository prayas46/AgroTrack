
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import type { ClimateRiskForecastOutput } from "@/ai/flows/climate-risk-forecast";

type WeatherAlert = NonNullable<ClimateRiskForecastOutput['weatherAlerts']>[number];

const severityMap = {
  MINOR: {
    icon: Info,
    color: "bg-yellow-500 hover:bg-yellow-500/90",
    label: "Minor",
  },
  MODERATE: {
    icon: AlertTriangle,
    color: "bg-orange-500 hover:bg-orange-500/90",
    label: "Moderate",
  },
  SEVERE: {
    icon: ShieldAlert,
    color: "bg-red-600 hover:bg-red-600/90",
    label: "Severe",
  },
  EXTREME: {
    icon: ShieldAlert,
    color: "bg-red-800 hover:bg-red-800/90",
    label: "Extreme",
  },
  UNKNOWN: {
    icon: Info,
    color: "bg-gray-500 hover:bg-gray-500/90",
    label: "Unknown",
  },
};

const getSeverityDetails = (severity: string) => {
  const upperSeverity = severity.toUpperCase();
  return severityMap[upperSeverity as keyof typeof severityMap] || severityMap.UNKNOWN;
};

export function WeatherAlerts({ alerts }: { alerts: WeatherAlert[] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        No active weather alerts for this region.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {alerts.map((alert, index) => {
        const severityDetails = getSeverityDetails(alert.severity);
        const SeverityIcon = severityDetails.icon;

        return (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex w-full items-center justify-between pr-4">
                <div className="flex items-center gap-3">
                  <SeverityIcon className={`h-5 w-5 text-white ${severityDetails.color} rounded-full p-0.5`} />
                  <span className="font-semibold text-foreground">
                    {alert.alertTitle}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{alert.certainty.toLowerCase()}</Badge>
                  <Badge className={`${severityDetails.color} text-white`}>
                    {severityDetails.label}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pl-6 space-y-4">
              <div className="space-y-1">
                <h4 className="font-semibold">Description</h4>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Recommended Action</h4>
                <p className="text-sm text-muted-foreground">{alert.instruction}</p>
              </div>
               <div className="flex justify-end pt-2">
                 <Badge variant="secondary" className="capitalize text-xs">
                    Urgency: {alert.urgency.toLowerCase()}
                </Badge>
               </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
