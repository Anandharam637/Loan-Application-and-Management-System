import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  ShieldCheck, 
  Sparkles, 
  Ban,
  ArrowUpRight
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'SUBMITTED':
        return {
          className: 'badge-submitted',
          icon: <Clock size={12} />,
          text: 'Submitted'
        };
      case 'KYC_VERIFIED':
        return {
          className: 'badge-kyc',
          icon: <ShieldCheck size={12} />,
          text: 'KYC Verified'
        };
      case 'CREDIT_APPRAISED':
        return {
          className: 'badge-credit',
          icon: <FileCheck size={12} />,
          text: 'Credit Checked'
        };
      case 'DEPT_REVIEWED':
        return {
          className: 'badge-credit',
          icon: <FileCheck size={12} />,
          text: 'Dept Reviewed'
        };
      case 'SANCTIONED':
      case 'APPROVED':
        return {
          className: 'badge-sanctioned',
          icon: <Sparkles size={12} />,
          text: 'Sanctioned'
        };
      case 'DISBURSED':
        return {
          className: 'badge-disbursed',
          icon: <CheckCircle2 size={12} />,
          text: 'Disbursed'
        };
      case 'ACTIVE':
        return {
          className: 'badge-active',
          icon: <CheckCircle2 size={12} />,
          text: 'Active'
        };
      case 'OVERDUE':
        return {
          className: 'badge-overdue',
          icon: <AlertCircle size={12} />,
          text: 'Overdue'
        };
      case 'REJECTED':
      case 'NPA':
        return {
          className: 'badge-rejected',
          icon: <Ban size={12} />,
          text: status === 'NPA' ? 'NPA Default' : 'Rejected'
        };
      case 'PAID':
        return {
          className: 'badge-success',
          icon: <CheckCircle2 size={12} />,
          text: 'Paid'
        };
      case 'DUE':
        return {
          className: 'badge-warning',
          icon: <Clock size={12} />,
          text: 'Due Now'
        };
      case 'UPCOMING':
        return {
          className: 'badge-submitted',
          icon: <Clock size={12} />,
          text: 'Upcoming'
        };
      case 'VERIFIED':
        return {
          className: 'badge-success',
          icon: <CheckCircle2 size={12} />,
          text: 'Verified'
        };
      case 'PENDING':
        return {
          className: 'badge-warning',
          icon: <Clock size={12} />,
          text: 'Pending'
        };
      default:
        return {
          className: 'badge-submitted',
          icon: <Clock size={12} />,
          text: status || 'Unknown'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
};
