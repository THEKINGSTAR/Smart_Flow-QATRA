import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  DropletIcon, 
  MapPinIcon, 
  UsersIcon, 
  BarChart2, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  BellIcon, 
  HelpCircleIcon,
  SearchIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  label?: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: <DropletIcon className="h-5 w-5" />,
    label: "12",
  },
  {
    title: "Zones",
    href: "/admin/zones",
    icon: <MapPinIcon className="h-5 w-5" />,
  },
  {
    title: "Teams",
    href: "/admin/teams",
    icon: <UsersIcon className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-background border-r">
        <div className="flex flex-col flex-1 h-full">
          <div className="flex h-16 items-center px-6 border-b bg-background">
            <Link href="/" className="flex items-center gap-2">
              <DropletIcon className="h-6 w-6 text-teal-600" />
              <span className="text-lg font-bold">SmartFlow</span>
              <span className="text-xs bg-teal-100 text-teal-700 py-0.5 px-1.5 rounded-md">Admin</span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                >
                  <a
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      location === item.href
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-primary"
                    )}
                  >
                    {item.icon}
                    {item.title}
                    {item.label && (
                      <span className="ml-auto bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                        {item.label}
                      </span>
                    )}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                <AvatarFallback>WM</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-medium">Water Admin</span>
                <span className="text-xs text-muted-foreground">admin@smartflow.com</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar trigger */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed left-4 top-3 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col flex-1 h-full">
            <div className="flex h-16 items-center px-6 border-b bg-background">
              <Link href="/" className="flex items-center gap-2">
                <DropletIcon className="h-6 w-6 text-teal-600" />
                <span className="text-lg font-bold">SmartFlow</span>
                <span className="text-xs bg-teal-100 text-teal-700 py-0.5 px-1.5 rounded-md">Admin</span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
              <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <a
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                        location === item.href
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-primary"
                      )}
                    >
                      {item.icon}
                      {item.title}
                      {item.label && (
                        <span className="ml-auto bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                          {item.label}
                        </span>
                      )}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center gap-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                  <AvatarFallback>WM</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-medium">Water Admin</span>
                  <span className="text-xs text-muted-foreground">admin@smartflow.com</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col md:pl-64 w-full">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-6">
          <div className="md:hidden w-4"></div>
          <div className="hidden md:flex max-w-sm w-full relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 bg-muted/30"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <BellIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HelpCircleIcon className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <div className="md:hidden flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                <AvatarFallback>WM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}