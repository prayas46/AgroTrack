"use client";

import * as React from "react";
import { useMemo, useState } from "react";
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
import { 
  ArrowRight, 
  CloudSun, 
  DollarSign, 
  Download, 
  Droplets, 
  FileText, 
  FlaskConical, 
  Sprout, 
  Store, 
  Stethoscope, 
  Tractor,
  LucideProps
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { Report } from "@/lib/reports";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/language-context";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Feature {
  id: string;
  titleKey: string;
  descriptionKey: string;
  link: string;
  icon: React.ComponentType<LucideProps>;
  imageId: string;
  title?: string;
  description?: string;
  image?: {
    id: string;
    src: string;
    alt: string;
  };
}

const featuresWithImages: Feature[] = [
  {
    id: "climate-risk",
    titleKey: "climateRisk",
    descriptionKey: "climateRiskDescription",
    link: "/climate-risk",
    icon: CloudSun,
    imageId: "climate-risk-card",
  },
  {
    id: "profit-planner",
    titleKey: "profitPlanner",
    descriptionKey: "profitPlannerDescription",
    link: "/profit-planner",
    icon: DollarSign,
    imageId: "profit-planner-card",
  },
  {
    id: "marketplace",
    titleKey: "marketplace",
    descriptionKey: "marketplaceDescription",
    link: "/marketplace",
    icon: Store,
    imageId: "marketplace-card",
  },
  {
    id: "plant-doctor",
    titleKey: "plantDoctor",
    descriptionKey: "plantDoctorDescription",
    link: "/plant-doctor",
    icon: Stethoscope,
    imageId: "plant-doctor-card",
  },
  {
    id: "soil-analysis",
    titleKey: "soilAnalysis",
    descriptionKey: "soilAnalysisDescription",
    link: "/soil-analysis",
    icon: FlaskConical,
    imageId: "soil-analysis-card",
  },
  {
    id: "irrigation",
    titleKey: "irrigation",
    descriptionKey: "irrigationDescription",
    link: "/irrigation",
    icon: Droplets,
    imageId: "irrigation-card",
  },
  {
    id: "crop-management",
    titleKey: "cropManagement",
    descriptionKey: "cropManagementDescription",
    link: "/crop-management",
    icon: Sprout,
    imageId: "crop-management-card",
  },
  {
    id: "equipment",
    titleKey: "equipment",
    descriptionKey: "equipmentDescription",
    link: "/equipment",
    icon: Tractor,
    imageId: "equipment-card",
  },
  {
    id: "govt-schemes",
    titleKey: "govtSchemes",
    descriptionKey: "govtSchemesDescription",
    link: "/govt-schemes",
    icon: FileText,
    imageId: "govt-schemes-card",
  },
];

const ReportSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-9 w-9" />
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const dashboardHeroImage = PlaceHolderImages.find(img => img.id === 'dashboard-hero');

  const reportsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'reports'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [firestore]);

  const { data: reportsData, isLoading: areReportsLoading } = useCollection<Report>(reportsQuery);
  const reports = reportsData || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || report.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [reports, searchQuery, activeTab]);

  const reportTypes = useMemo(() => {
    const types = new Set<string>();
    reports.forEach(report => types.add(report.type));
    return Array.from(types);
  }, [reports]);

  const processedFeatures = useMemo(() => {
    const features = t('dashboard.features') as Record<string, string>;
    return featuresWithImages.map(feature => ({
      ...feature,
      title: features[feature.titleKey] || feature.titleKey,
      description: features[feature.descriptionKey] || feature.descriptionKey,
      image: PlaceHolderImages.find(img => img.id === feature.imageId)
    }));
  }, [t]);

  const handleDownload = async (report: Report): Promise<void> => {
    try {
      toast({
        title: "Preparing Report",
        description: `Your "${report.title}" is being prepared.`,
      });
      
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.type.toLowerCase().replace(/\s+/g, '-')}-${report.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: `"${report.title}" has been downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) {
      return 'Just now';
    }
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('dashboard.header.title')}
        description={t('dashboard.header.description')}
      />

      {dashboardHeroImage && (
        <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg border group">
            <Image
                src={dashboardHeroImage.imageUrl}
                alt={dashboardHeroImage.description}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-3xl font-bold text-white tracking-tight">{t('dashboard.hero.title')}</h2>
                <p className="text-white/90 mt-2 max-w-2xl">{t('dashboard.hero.description')}</p>
            </div>
        </div>
      )}

      <h2 className="text-2xl font-bold tracking-tight pt-4">{t('dashboard.allFeatures')}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {processedFeatures.map((feature) => (
          <Card key={feature.id} className="flex flex-col overflow-hidden group h-full">
            <div className="relative h-48 w-full overflow-hidden bg-muted/50">
              {feature.image ? (
                <Image
                  src={feature.image.imageUrl}
                  alt={feature.image.description}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={feature.id === "climate-risk"}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <feature.icon className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <feature.icon className="h-6 w-6 text-primary" />
                {feature.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild variant="outline" className="w-full">
                <Link href={feature.link}>
                  {t('dashboard.goToFeature')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       <Card className="mt-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Your Reports</CardTitle>
              <CardDescription>View and manage all your generated reports</CardDescription>
            </div>
            <div className="w-full md:w-64">
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value)}
            className="mt-4"
          >
            <TabsList className="w-full overflow-x-auto flex-nowrap justify-start md:justify-start">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              {reportTypes.map((type) => (
                <TabsTrigger key={type} value={type}>
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="space-y-2 p-0">
          {areReportsLoading ? (
            Array(5).fill(0).map((_, i) => <ReportSkeleton key={i} />)
          ) : filteredReports.length > 0 ? (
            <div className="divide-y">
              {filteredReports.map((report) => (
                <div 
                  key={report.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {report.type}
                      </Badge>
                      <p className="font-medium truncate">{report.title}</p>
                    </div>
                    {report.metadata?.location && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Location: {report.metadata.location}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {format(report.createdAt?.toDate() || new Date(), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => handleDownload(report)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No reports found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery 
                  ? "No reports match your search. Try a different term."
                  : "Generate a new report to get started."}
              </p>
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </CardContent>
        
        {filteredReports.length > 0 && (
          <CardFooter className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredReports.length} of {reports.length} reports
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;