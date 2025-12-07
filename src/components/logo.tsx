import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary p-2 rounded-md transition-all duration-300">
        <Leaf className="h-6 w-6 text-primary-foreground transition-all duration-300" />
      </div>
      <h1 className="text-xl font-bold font-headline text-foreground truncate transition-opacity">
        AgroCast
      </h1>
    </div>
  );
}
