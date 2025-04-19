import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function MobileNavigation({
  onAddReport
}: {
  onAddReport: () => void;
}) {
  const [location] = useLocation();

  return (
    <>
      {/* New Report Button (fixed) */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-20">
        <Button
          onClick={onAddReport}
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <i className="ri-add-line text-2xl"></i>
        </Button>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-white shadow-lg border-t border-neutral-200 fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around">
          <Link href="/">
            <a className={cn(
              "flex flex-col items-center justify-center py-2 px-3",
              location === "/" ? "text-primary-700" : "text-neutral-600"
            )}>
              <i className="ri-map-2-line text-xl"></i>
              <span className="text-xs mt-1">Map</span>
            </a>
          </Link>
          
          <Link href="/my-reports">
            <a className={cn(
              "flex flex-col items-center justify-center py-2 px-3",
              location === "/my-reports" ? "text-primary-700" : "text-neutral-600"
            )}>
              <i className="ri-file-list-3-line text-xl"></i>
              <span className="text-xs mt-1">Reports</span>
            </a>
          </Link>
          
          <div className="w-14"></div>
          
          <Link href="/learn">
            <a className={cn(
              "flex flex-col items-center justify-center py-2 px-3",
              location === "/learn" ? "text-primary-700" : "text-neutral-600"
            )}>
              <i className="ri-water-flash-line text-xl"></i>
              <span className="text-xs mt-1">Learn</span>
            </a>
          </Link>
          
          <Link href="/achievements">
            <a className={cn(
              "flex flex-col items-center justify-center py-2 px-3",
              location === "/achievements" ? "text-primary-700" : "text-neutral-600"
            )}>
              <i className="ri-medal-line text-xl"></i>
              <span className="text-xs mt-1">Badges</span>
            </a>
          </Link>
        </div>
      </nav>
    </>
  );
}
