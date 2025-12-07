
'use client';

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { uploadAadharCard } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

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

type UploadState = {
  message: string | null;
  success: boolean;
  errors?: {
    aadharPdf?: string[];
  };
}

const initialState: UploadState = {
    message: null,
    success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      <Upload className="mr-2 h-4 w-4" /> 
      {pending ? "Uploading..." : "Upload"}
    </Button>
  );
}


export default function GovtSchemesPage() {
  const govtSchemeImage = PlaceHolderImages.find(img => img.id === 'govt-schemes-header');
  const [state, formAction] = useActionState(uploadAadharCard, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success",
          description: state.message,
        });
        formRef.current?.reset();
        setFileName(null);
      } else {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };

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
          <form action={formAction} ref={formRef}>
            <CardHeader>
              <CardTitle>Upload Aadhar Card</CardTitle>
              <CardDescription>
                Upload your Aadhar card in PDF format for your records. This is for demo purposes only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Input 
                    id="aadhar-pdf" 
                    name="aadharPdf"
                    type="file" 
                    accept="application/pdf" 
                    required
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {fileName && <p className="text-sm text-muted-foreground">Selected file: {fileName}</p>}
                  {state.errors?.aadharPdf && (
                    <p className="text-sm font-medium text-destructive">
                      {state.errors.aadharPdf[0]}
                    </p>
                  )}
              </div>
            </CardContent>
            <CardFooter>
                <SubmitButton/>
            </CardFooter>
          </form>
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
