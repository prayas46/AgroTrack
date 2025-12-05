
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState, useRef } from "react";
import { getPlantDiagnosis } from "@/lib/actions";
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
import { Input } from "@/components/ui/input";
import { PlantDoctorResults } from "./results";
import type { DiagnosePlantOutput } from "@/ai/flows/diagnose-plant";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";

type PlantDoctorState = {
  message: string | null;
  data: DiagnosePlantOutput | null;
  errors?: {
    plantImage?: string[];
  };
};

const initialState: PlantDoctorState = {
  message: null,
  data: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Diagnosing..." : "Diagnose Plant"}
    </Button>
  );
}

export default function PlantDoctorPage() {
  const [state, formAction] = useActionState(getPlantDiagnosis, initialState);
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.message && !state.data) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setPreview(null);
    }
  };

  const handleCardClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Plant Doctor"
        description="Upload an image of a plant to get an AI-powered diagnosis and treatment recommendation."
      />
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Upload Plant Image</CardTitle>
            <CardDescription>
              Choose a clear image of the affected plant for the most accurate diagnosis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={handleCardClick}
            >
              <Input
                id="plantImage"
                name="plantImage"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
                required
              />
              {preview ? (
                <div className="relative w-full h-64 mx-auto">
                  <Image src={preview} alt="Plant preview" fill className="object-contain rounded-md" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                  <Upload className="h-12 w-12" />
                  <p className="font-semibold">Click to upload or drag and drop</p>
                  <p className="text-xs">PNG, JPG, JPEG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
            {state.errors?.plantImage && (
              <p className="text-sm font-medium text-destructive mt-2">
                {state.errors.plantImage[0]}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.data && <PlantDoctorResults data={state.data} preview={preview}/>}
    </div>
  );
}
