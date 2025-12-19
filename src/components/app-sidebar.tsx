
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  LayoutDashboard,
  CloudSun,
  DollarSign,
  Store,
  FileText,
  Stethoscope,
  Droplets,
  Sprout,
  Tractor,
  FlaskConical,
  Menu,
  Search,
  Globe,
} from 'lucide-react';
import { Logo } from './logo';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import React, { useMemo, useState, useEffect } from 'react';
import { SearchDialog } from './search-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage } from '@/context/language-context';
import { useSession, signIn, signOut } from 'next-auth/react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard', emoji: '📊' },
  { href: '/climate-risk', icon: CloudSun, labelKey: 'climateRisk', emoji: '🌦️' },
  { href: '/profit-planner', icon: DollarSign, labelKey: 'profitPlanner', emoji: '💰' },
  { href: '/marketplace', icon: Store, labelKey: 'marketplace', emoji: '🛒' },
  { href: '/plant-doctor', icon: Stethoscope, labelKey: 'plantDoctor', emoji: '🩺' },
  { href: '/soil-analysis', icon: FlaskConical, labelKey: 'soilAnalysis', emoji: '🧪' },
  { href: '/irrigation', icon: Droplets, labelKey: 'irrigation', emoji: '💧' },
  { href: '/crop-management', icon: Sprout, labelKey: 'cropManagement', emoji: '🌱' },
  { href: '/equipment', icon: Tractor, labelKey: 'equipment', emoji: '🚜' },
  { href: '/govt-schemes', icon: FileText, labelKey: 'govtSchemes', emoji: '📄' },
] as const;

type NavItemLabelKey = typeof navItems[number]['labelKey'];


export default function AppSidebar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { t, setLanguage, languages } = useLanguage();
  const { data: session, status } = useSession();

  const translatedNavItems = useMemo(() => {
    return navItems.map(item => ({
        ...item,
        label: t('sidebar')[item.labelKey as NavItemLabelKey] || item.labelKey,
    }));
  }, [t]);
  
  // Memoize active path check for performance
  const isActivePath = useMemo(() => {
    return (href: string) => {
      if (href === '/dashboard') {
        return pathname === '/dashboard';
      }
      return pathname.startsWith(href);
    };
  }, [pathname]);

  // Keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const mainNav = (
    <nav className="flex flex-col gap-1 p-2" aria-label="Main navigation">
      {translatedNavItems.map((item) => {
        const active = isActivePath(item.href);
        return (
          <SheetClose key={item.href} asChild>
            <Button
              asChild
              variant={active ? 'secondary' : 'ghost'}
              className="justify-start h-11"
              aria-current={active ? 'page' : undefined}
            >
              <Link href={item.href}>
                <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            </Button>
          </SheetClose>
        );
      })}
    </nav>
  );

  const desktopNav = (
    <nav className="hidden md:flex flex-1 items-center gap-1 text-sm font-medium overflow-x-auto scrollbar-hide" aria-label="Main navigation">
      {translatedNavItems.map((item) => {
        const active = isActivePath(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative px-3 py-2 rounded-md transition-all flex items-center gap-2 min-w-fit',
              active 
                ? 'bg-accent text-accent-foreground font-semibold' 
                : 'text-foreground/70 hover:bg-accent/50 hover:text-accent-foreground'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span role="img" aria-label={item.label} suppressHydrationWarning>{item.emoji}</span>
            <span className="whitespace-nowrap">{item.label}</span>
            {active && (
              <span 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" 
                aria-hidden="true"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center gap-4">
          {/* Logo - Desktop */}
          <div className="mr-4 hidden md:flex">
            <Link href="/dashboard" aria-label="Go to dashboard">
              <Logo className="flex items-center gap-2" />
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 flex flex-col">
                <SheetHeader className="border-b p-4">
                   <SheetTitle className="sr-only">Main Menu</SheetTitle>
                   <Link href="/dashboard" aria-label="Go to dashboard">
                    <Logo className="flex items-center gap-2" />
                  </Link>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  {mainNav}
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Mobile Logo */}
            <Link href="/dashboard" className="flex items-center" aria-label="Go to dashboard">
              <Logo className="flex items-center gap-2" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {desktopNav}

          {/* Right Side Actions */}
          <div className="flex items-center justify-end gap-2">
            {/* Search - Desktop Only */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-9 w-9"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            {status !== 'loading' && (
              session ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <Link href="/auth">Sign in</Link>
                </Button>
              )
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Change language"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} onSelect={() => setLanguage(lang.code as any)}>
                      {lang.name}
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} navItems={translatedNavItems} />
    </>
  );
}
