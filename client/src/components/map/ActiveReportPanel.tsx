import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Report } from "@shared/schema";

interface ActiveReportPanelProps {
  report: Report;
  onClose: () => void;
}

export default function ActiveReportPanel({ report, onClose }: ActiveReportPanelProps) {
  // Format the created at date
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Get severity badge color
  const getSeverityBadge = () => {
    switch (report.severity) {
      case 'critical':
        return <Badge variant="destructive" className="bg-error-500"><span className="animate-pulse mr-1">•</span> Critical</Badge>;
      case 'moderate':
        return <Badge variant="default" className="bg-warning-500 text-white"><span className="mr-1">•</span> Moderate</Badge>;
      case 'minor':
        return <Badge variant="default" className="bg-primary-500"><span className="mr-1">•</span> Minor</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get status badge
  const getStatusBadge = () => {
    switch (report.status) {
      case 'resolved':
        return <Badge variant="outline" className="bg-success-500 text-white">Resolved</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-secondary-500 text-white">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-neutral-500 text-white">Pending</Badge>;
      default:
        return null;
    }
  };
  
  // Open directions in Google Maps
  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${report.latitude},${report.longitude}`, '_blank');
  };
  
  // Share the report
  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Water Leak Report: ${report.title}`,
          text: `Check out this water leak at ${report.address}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <Card className="absolute left-4 top-4 max-w-xs w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            {getSeverityBadge()}
            <h3 className="mt-1 text-base font-semibold font-heading text-neutral-900">{report.title}</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-neutral-500" onClick={onClose}>
            <i className="ri-close-line text-xl"></i>
          </Button>
        </div>
        
        <div className="mt-2 text-sm text-neutral-600">
          <p>{report.description}</p>
          
          <div className="mt-2 flex items-center text-xs text-neutral-500">
            <i className="ri-map-pin-line mr-1"></i>
            <span>{report.address}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-neutral-500 mt-1">
            <div className="flex items-center">
              <i className="ri-time-line mr-1"></i>
              <span>Reported {formatDate(report.createdAt)}</span>
            </div>
            {getStatusBadge()}
          </div>
        </div>
        
        {/* Photos */}
        {report.photos && Array.isArray(report.photos) && report.photos.length > 0 && (
          <div className="mt-3">
            <div className="flex -mx-1 overflow-x-auto pb-2">
              {report.photos.map((photo, index) => (
                <img 
                  key={index}
                  src={photo}
                  alt={`Report photo ${index + 1}`}
                  className="h-20 w-20 object-cover rounded mx-1"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button 
            className="flex-1 inline-flex justify-center items-center"
            onClick={openDirections}
          >
            <i className="ri-direction-line mr-1"></i> Directions
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 inline-flex justify-center items-center"
            onClick={shareReport}
          >
            <i className="ri-share-line mr-1"></i> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
