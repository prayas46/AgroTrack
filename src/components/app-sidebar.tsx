
'use client';

import { usePathname, useRouter } from 'next/navigation';
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
  User,
  LogOut,
  Settings,
  HelpCircle,
  Menu,
  Search,
} from 'lucide-react';
import { Logo } from './logo';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import React, { useMemo, useState, useEffect } from 'react';
import { SearchDialog } from './search-dialog';
import { logout } from '@/lib/actions';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', emoji: '📊' },
  { href: '/climate-risk', icon: CloudSun, label: 'Climate Risk', emoji: '🌦️' },
  { href: '/profit-planner', icon: DollarSign, label: 'Profit Planner', emoji: '💰' },
  { href: '/marketplace', icon: Store, label: 'Marketplace', emoji: '🛒' },
  { href: '/plant-doctor', icon: Stethoscope, label: 'Plant Doctor', emoji: '🩺' },
  { href: '/soil-analysis', icon: FlaskConical, label: 'Soil Analysis', emoji: '🧪' },
  { href: '/irrigation', icon: Droplets, label: 'Irrigation', emoji: '💧' },
  { href: '/crop-management', icon: Sprout, label: 'Crop Management', emoji: '🌱' },
  { href: '/equipment', icon: Tractor, label: 'Equipment', emoji: '🚜' },
  { href: '/govt-schemes', icon: FileText, label: 'Govt. Schemes', emoji: '📄' },
] as const;

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isUserLoading } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const userInitials = useMemo(() => {
    if (!user?.displayName) return '...';
    const names = user.displayName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.displayName.substring(0, 2).toUpperCase();
  }, [user]);

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
      {navItems.map((item) => {
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
      {navItems.map((item) => {
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
                <div className="border-t p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user?.displayName || "Guest"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email || "Not logged in"}</p>
                    </div>
                  </div>
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

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                  aria-label="User menu"
                >
                  <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {isUserLoading ? '...' : userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{isUserLoading ? "Loading..." : user?.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {isUserLoading ? "" : user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help" className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} navItems={navItems} />
    </>
  );
}

    