
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
import { ArrowRight, CloudSun, DollarSign, Download, Droplets, FileText, FlaskConical, Sprout, Store, Stethoscope, Tractor } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

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
    title: "Plant Doctor",
    description: "Upload an image of a plant to diagnose diseases and get fertilizer recommendations.",
    link: "/plant-doctor",
    icon: Stethoscope,
    image: PlaceHolderImages.find(img => img.id === "plant-doctor-card"),
  },
   {
    title: "Soil Analysis",
    description: "Get AI-driven soil analysis and fertilizer recommendations based on your soil's composition.",
    link: "/soil-analysis",
    icon: FlaskConical,
    image: PlaceHolderImages.find(img => img.id === "soil-analysis-card"),
  },
  {
    title: "Irrigation Management",
    description: "Monitor and control your farm's irrigation zones with real-time data and smart controls.",
    link: "/irrigation",
    icon: Droplets,
    image: PlaceHolderImages.find(img => img.id === "irrigation-card"),
  },
   {
    title: "Crop Management",
    description: "Track the health and progress of your crops from planting to harvest.",
    link: "/crop-management",
    icon: Sprout,
    image: PlaceHolderImages.find(img => img.id === "crop-management-card"),
  },
  {
    title: "Equipment Tracking",
    description: "Monitor the status, fuel levels, and efficiency of your farm equipment in real-time.",
    link: "/equipment",
    icon: Tractor,
    image: PlaceHolderImages.find(img => img.id === "equipment-card"),
  },
  {
    title: "Government Schemes",
    description: "Access important government schemes and manage your documents like your Aadhar card.",
    link: "/govt-schemes",
    icon: FileText,
    image: PlaceHolderImages.find(img => img.id === "govt-schemes-card"),
  },
];

const recentReports = [
  { title: "Soil Analysis Report", date: "2024-03-01" },
  { title: "Weekly Irrigation Report", date: "2024-02-28" },
  { title: "Monthly Crop Yield Report", date: "2024-02-25" },
  { title: "Equipment Maintenance Log", date: "2024-02-20" },
];

export default function DashboardPage() {
  const { toast } = useToast();

  const handleDownload = (reportTitle: string) => {
    toast({
      title: "Downloading Report",
      description: `Your "${reportTitle}" is being prepared.`,
    });
    // In a real app, you would generate and download the actual file here.
    setTimeout(() => {
       toast({
        title: "Download Ready",
        description: `"${reportTitle}" has been downloaded.`,
      });
    }, 1500)
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to AgroCast"
        description="Your autonomous partner for climate-adaptive agriculture. Plan, predict, and prosper."
      />

       <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            A summary of your latest generated reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentReports.map((report) => (
              <li key={report.title} className="flex items-center justify-between p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{report.title}</p>
                  <p className="text-sm text-muted-foreground">Generated: {report.date}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDownload(report.title)} aria-label={`Download ${report.title}`}>
                  <Download className="h-5 w-5" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold tracking-tight pt-4">All Features</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
