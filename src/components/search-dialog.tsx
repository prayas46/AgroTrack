"use client"

import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    navItems: {
        href: string;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
    }[];
}

export function SearchDialog({ open, onOpenChange, navItems }: SearchDialogProps) {
  const router = useRouter()

  const runCommand = React.useCallback((command: () => unknown) => {
    onOpenChange(false)
    command()
  }, [onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Links">
          {navItems.map((navItem) => (
            <CommandItem
              key={navItem.href}
              value={navItem.label}
              onSelect={() => {
                runCommand(() => router.push(navItem.href as string))
              }}
            >
              {(() => {
                const Icon = navItem.icon;
                return <Icon className="mr-2 h-4 w-4" />;
              })()}
              {navItem.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
