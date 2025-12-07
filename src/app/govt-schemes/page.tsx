
'use client';

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const schemes = [
    {
        name: "Farmer Registration :: PMKisan Samman Nidhi",
        url: "https://share.google/rsF5mKv03fbTeln3t"
    },
    {
        name: "Generic Scheme Link",
        url: "https://share.google/tjnPIcyNMuzcJqfDc"
    }
]

export default function GovtSchemesPage() {
  const govtSchemeImage = PlaceHolderImages.find(img => img.id === 'govt-schemes-card');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Government Schemes & Documents"
        description="Access important government schemes and manage your documents."
      />

      {govtSchemeImage && (
        <div className="relative h-64 w-full overflow-hidden rounded-lg border">
          <Image
            src={govtSchemeImage.imageUrl}
            alt={govtSchemeImage.description}
            fill
            className="object-cover"
            data-ai-hint={govtSchemeImage.imageHint}
          />
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Aadhar Card</CardTitle>
            <CardDescription>
              Upload your Aadhar card in PDF format for your records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
                <Input id="aadhar-pdf" type="file" accept="application/pdf" className="flex-1"/>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Please upload a single PDF file only.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheme Links</CardTitle>
            <CardDescription>
              Quick access to important government scheme portals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {schemes.map((scheme) => (
                <Button asChild variant="outline" className="w-full h-auto whitespace-normal" key={scheme.name}>
                    <Link href={scheme.url} target="_blank" rel="noopener noreferrer" className="justify-center">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        {scheme.name}
                    </Link>
                </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
