
'use client';

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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, CloudSun, DollarSign, ShieldCheck, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Climate Risk Forecast",
    description: "Predict pest attacks, disease outbreaks, and extreme weather events with AI-powered forecasting.",
    link: "/climate-risk",
    icon: CloudSun,
    image: PlaceHolderImages.find(img => img.id === "climate-risk-card"),
  },
  {
    title: "Profit Prediction Engine",
    description: "Discover the most profitable crop combinations for your land, budget, and soil conditions.",
    link: "/profit-planner",
    icon: DollarSign,
    image: PlaceHolderImages.find(img => img.id === "profit-planner-card"),
  },
  {
    title: "Agro-Match Marketplace",
    description: "Connect with buyers, suppliers, and logistics providers automatically through our smart marketplace.",
    link: "/marketplace",
    icon: Store,
    image: PlaceHolderImages.find(img => img.id === "marketplace-card"),
  },
  {
    title: "Farm Digital Passport",
    description: "Enhance transparency and fetch higher prices with a blockchain-backed record for every harvest.",
    link: "/passport",
    icon: ShieldCheck,
    image: PlaceHolderImages.find(img => img.id === "passport-card"),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to AgroCast"
        description="Your autonomous partner for climate-adaptive agriculture. Plan, predict, and prosper."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col overflow-hidden group">
            <div className="relative h-48 w-full overflow-hidden">
                {feature.image && (
                    <Image
                    src={feature.image.imageUrl}
                    alt={feature.image.description}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    data-ai-hint={feature.image.imageHint}
                    />
                )}
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <feature.icon className="h-6 w-6 text-primary" />
                {feature.title}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild variant="outline">
                <Link href={feature.link}>
                  Go to Feature <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
