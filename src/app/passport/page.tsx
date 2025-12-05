
'use client';
import { useMemo } from 'react';
import { PageHeader } from "@/components/page-header";
import { QRCodeIcon } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, MapPin, TestTube2, Sprout, Droplets, Footprints, Loader2 } from "lucide-react";
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function PassportPage() {
  const firestore = useFirestore();

  // IMPORTANT: You must memoize the document reference
  const passportRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'passports', 'sample-passport') : null),
    [firestore]
  );
  const { data: passport, isLoading, error } = useDoc(passportRef);

  const passportDetails = useMemo(() => {
    if (!passport) return [];
    return [
      { icon: Fingerprint, label: "Crop Variety", value: passport.cropVariety },
      { icon: MapPin, label: "Location", value: passport.location },
      { icon: TestTube2, label: "Fertilizer Usage", value: passport.fertilizerUsage },
      { icon: Sprout, label: "Pesticide Usage", value: passport.pesticideUsage },
      { icon: Droplets, label: "Water Usage", value: passport.waterUsage },
      { icon: Footprints, label: "Carbon Footprint", value: passport.carbonFootprint },
    ];
  }, [passport]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 border rounded-lg bg-destructive/10 text-destructive">
        <h3 className="text-lg font-semibold">Error loading passport</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-semibold">No passport data found</h3>
        <p className="text-muted-foreground">
         The sample passport document does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Farm Digital Passport"
        description="Showcasing a blockchain-backed, transparent record for a single harvest batch."
      />
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
              <CardTitle className="text-2xl font-headline">Harvest Batch: {passport.batchId}</CardTitle>
              <CardDescription>
                A complete, immutable record from seed to sale.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                Verified on Blockchain
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="p-4 border rounded-lg bg-muted/50">
                <QRCodeIcon className="h-32 w-32 text-foreground"/>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Blockchain ID:</p>
              <p className="text-xs font-mono break-all">{passport.blockchainId}</p>
            </div>

            <div className="md:col-span-2 space-y-4">
                <h3 className="font-semibold text-lg">Provenance Details</h3>
                <Separator />
                <ul className="space-y-3">
                    {passportDetails.map((item) => (
                        <li key={item.label} className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-md">
                                <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">{item.label}</p>
                                <p className="font-semibold text-foreground">{item.value}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
