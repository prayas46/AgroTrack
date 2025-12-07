
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
import { useMemo } from "react";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { Report } from "@/lib/reports";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/language-context";

interface Feature {
  id: string;
  titleKey: keyof typeof import('@/locales/en.json')['dashboard']['features'];
  descriptionKey: keyof typeof import('@/locales/en.json')['dashboard']['features'];
  link: string;
  icon: React.ComponentType<{ className?: string }>;
  imageId: string;
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

function ReportSkeleton() {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-9 w-9" />
    </div>
  )
}


export default function DashboardPage() {
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

  const { data: recentReports, isLoading: areReportsLoading } = useCollection<Report>(reportsQuery);

  const processedFeatures = useMemo(() => {
    return featuresWithImages.map(feature => {
      const image = PlaceHolderImages.find(img => img.id === feature.imageId);
      return {
        ...feature,
        title: t('dashboard.features')[feature.titleKey],
        description: t('dashboard.features')[feature.descriptionKey],
        image
      };
    });
  }, [t]);

  const handleDownload = (reportTitle: string) => {
    toast({
      title: "Downloading Report",
      description: `Your "${reportTitle}" is being prepared.`,
    });
    
    setTimeout(() => {
      toast({
        title: "Download Ready",
        description: `"${reportTitle}" has been downloaded.`,
      });
    }, 1500);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) {
      return t('dashboard.reports.justNow');
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
                data-ai-hint={dashboardHeroImage.imageHint}
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
          <Card key={feature.title} className="flex flex-col overflow-hidden group h-full">
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
          <CardTitle>{t('dashboard.reports.title')}</CardTitle>
          <CardDescription>
            {t('dashboard.reports.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4" role="list">
             {areReportsLoading ? (
                <>
                  <ReportSkeleton/>
                  <ReportSkeleton/>
                  <ReportSkeleton/>
                </>
             ) : recentReports && recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <div 
                    key={report.id} 
                    className="flex items-center justify-between p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors"
                    role="listitem"
                  >
                    <div>
                      <p className="font-medium text-foreground">{report.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('dashboard.reports.generated')}: {formatDate(report.createdAt)}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownload(report.title)} 
                      aria-label={`Download ${report.title}`}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                ))
             ) : (
                <div className="text-center py-8 text-muted-foreground">
                    {t('dashboard.reports.noReports')}
                </div>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
