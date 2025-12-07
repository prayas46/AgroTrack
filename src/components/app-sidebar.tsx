
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
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
} from 'lucide-react';
import { Logo } from './logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/climate-risk', icon: CloudSun, label: 'Climate Risk' },
  { href: '/profit-planner', icon: DollarSign, label: 'Profit Planner' },
  { href: '/marketplace', icon: Store, label: 'Marketplace' },
  { href: '/plant-doctor', icon: Stethoscope, label: 'Plant Doctor' },
  { href: '/soil-analysis', icon: FlaskConical, label: 'Soil Analysis' },
  { href: '/irrigation', icon: Droplets, label: 'Irrigation' },
  { href: '/crop-management', icon: Sprout, label: 'Crop Management' },
  { href: '/equipment', icon: Tractor, label: 'Equipment' },
  { href: '/govt-schemes', icon: FileText, label: 'Govt. Schemes' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const mainNav = (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={isMobile ? undefined : item.label}
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        <div className="md:hidden">
           <Sidebar collapsible="offcanvas">
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon">
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
            <SidebarContent>
              <SidebarHeader>
                <Logo />
              </SidebarHeader>
              {mainNav}
            </SidebarContent>
          </Sidebar>
        </div>

        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-foreground/80 ${
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-4 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="relative h-8 w-8 rounded-full"
              >
                <User className="h-5 w-5" />
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
