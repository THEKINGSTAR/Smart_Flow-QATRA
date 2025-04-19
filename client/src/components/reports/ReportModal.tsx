import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReportForm from "./ReportForm";
import { InsertReport } from "@shared/schema";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsertReport) => void;
  loading: boolean;
}

export default function ReportModal({ isOpen, onClose, onSubmit, loading }: ReportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-primary-700 font-heading">
            Report a Leak
          </DialogTitle>
        </DialogHeader>
        
        <ReportForm 
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
