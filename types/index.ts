export interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  status:
    | "pending"
    | "calling"
    | "no_answer"
    | "scheduled"
    | "not_interested"
    | "error";
  call_attempts: number;
  source: string | null;
  timezone: string;
  last_called_at: string | null;
  cal_booking_uid: string | null;
  follow_up_email_sent: boolean;
  created_at: string;
  updated_at: string;
}
export interface CSVPreviewData {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  timezone?: string;
  source?: string;
}

export interface CSVDialogProps {
  previewData: CSVPreviewData[];
  onConfirm: (data: CSVPreviewData[]) => void;
  onCancel: () => void;
  open: boolean;
}

export interface LeadTableProps {
  initialLeads: Lead[];
  crmKey?: string
}

export interface SortState {
  column: keyof Lead | null;
  direction: "asc" | "desc" | null;
}

export interface EditingCell {
  id: string;
  field: keyof Lead;
}

export interface LeadFormState {
  company_name?: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  timezone?: string;
}
