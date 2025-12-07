import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <div className="flex items-center gap-2 group/logo">
      <div className="bg-primary p-2 rounded-md group-data-[sidebar-collapsed=icon]/logo:p-1 transition-all duration-300">
        <Leaf className="h-6 w-6 text-primary-foreground group-data-[sidebar-collapsed=icon]/logo:h-4 group-data-[sidebar-collapsed=icon]/logo:w-4 transition-all duration-300" />
      </div>
      <h1 className="text-xl font-bold font-headline text-foreground truncate group-data-[sidebar-collapsible=icon]:opacity-0 group-data-[sidebar-collapsible=icon]:w-0 transition-opacity">
        AgroCast
      </h1>
    </div>
  );
}
