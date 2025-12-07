
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
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
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';

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
];

export default function AppSidebar() {
  const pathname = usePathname();

  const mainNav = (
    <nav className="flex flex-col gap-1 p-2">
      {navItems.map((item) => (
        <Button
          key={item.href}
          asChild
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          className="justify-start"
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <SheetHeader className="border-b p-4">
                <Logo />
              </SheetHeader>
              {mainNav}
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-3 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-2',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-foreground/60'
                )}
              >
                <span>{item.emoji}</span>
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-9 w-9">
                    <AvatarFallback className='bg-primary text-primary-foreground'>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Demo User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    farmer@agrotrack.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
