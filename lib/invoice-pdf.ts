/**
 * Premium Enterprise Invoice Generator - Version 2
 * Completely redesigned for professional, clean layout
 */

import jsPDF from 'jspdf';

interface InvoiceData {
  transactionId: string;
  invoiceNumber: string;
  invoiceDate: string;
  schoolName: string;
  schoolEmail: string;
  schoolId?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  planName: string;
  planPrice: number;
  studentCount: number;
  billingCycle: string;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  subtotal: number;
  gst?: number;
  total: number;
}

export function generatePremiumInvoice(data: InvoiceData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // ============================================
  // HEADER SECTION - Dark with Branding
  // ============================================
  
  // Dark header background
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Top accent line
  doc.setFillColor(0, 217, 255);
  doc.rect(0, 0, pageWidth, 2, 'F');

  // Company Logo/Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('CATALYST', margin, 15);
  
  doc.setTextColor(0, 217, 255);
  doc.text('WELLS', margin + 38, 15);
  
  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('Enterprise Education Management Platform', margin, 20);

  // INVOICE Label (right side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(157, 0, 255);
  doc.text('INVOICE', pageWidth - margin, 18, { align: 'right' });

  // ============================================
  // INVOICE INFO BOX (Top Right)
  // ============================================
  
  const infoBoxX = pageWidth - margin - 65;
  const infoBoxY = 45;
  
  // Light background
  doc.setFillColor(248, 250, 255);
  doc.roundedRect(infoBoxX, infoBoxY, 65, 30, 2, 2, 'F');
  
  // Border
  doc.setDrawColor(0, 217, 255);
  doc.setLineWidth(0.5);
  doc.roundedRect(infoBoxX, infoBoxY, 65, 30, 2, 2, 'S');
  
  let infoY = infoBoxY + 7;
  
  // Invoice Number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('INVOICE NO:', infoBoxX + 3, infoY);
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(data.invoiceNumber, pageWidth - margin - 2, infoY, { align: 'right' });
  
  infoY += 7;
  
  // Date
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('DATE:', infoBoxX + 3, infoY);
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(data.invoiceDate, pageWidth - margin - 2, infoY, { align: 'right' });
  
  infoY += 7;
  
  // Transaction
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('TRANSACTION:', infoBoxX + 3, infoY);
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  const txnShort = data.transactionId.substring(0, 10);
  doc.text(txnShort, pageWidth - margin - 2, infoY, { align: 'right' });
  
  infoY += 8;
  
  // PAID Badge
  doc.setFillColor(0, 255, 136);
  doc.roundedRect(infoBoxX + 3, infoY - 3, 16, 5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text('PAID', infoBoxX + 11, infoY, { align: 'center' });

  // ============================================
  // COMPANY INFO (Left Side)
  // ============================================
  
  let currentY = 48;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(0, 217, 255);
  doc.text('FROM', margin, currentY);
  
  currentY += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('Catalyst Wells Technologies Pvt. Ltd.', margin, currentY);
  
  currentY += 4;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Innovation Hub, Tech Park', margin, currentY);
  currentY += 4;
  doc.text('Bangalore, Karnataka 560001', margin, currentY);
  currentY += 4;
  doc.text('India', margin, currentY);
  
  currentY += 5;
  
  doc.setFontSize(7);
  doc.setTextColor(0, 217, 255);
  doc.text('Email:', margin, currentY);
  doc.setTextColor(80, 80, 80);
  doc.text('billing@catalystwells.com', margin + 12, currentY);
  
  currentY += 4;
  
  doc.setTextColor(0, 217, 255);
  doc.text('Phone:', margin, currentY);
  doc.setTextColor(80, 80, 80);
  doc.text('+91 88888 88888', margin + 12, currentY);
  
  currentY += 4;
  
  doc.setTextColor(0, 217, 255);
  doc.text('GSTIN:', margin, currentY);
  doc.setTextColor(80, 80, 80);
  doc.text('29AABCT1234C1Z5', margin + 12, currentY);

  // ============================================
  // BILLED TO SECTION
  // ============================================
  
  currentY = 85;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(157, 0, 255);
  doc.text('BILLED TO', margin, currentY);
  
  currentY += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(data.schoolName, margin, currentY);
  
  currentY += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  
  if (data.address) {
    doc.text(data.address, margin, currentY);
    currentY += 4;
  }
  
  if (data.city && data.state) {
    doc.text(`${data.city}, ${data.state} ${data.pincode || ''}`, margin, currentY);
    currentY += 4;
  }
  
  doc.setFontSize(7);
  doc.setTextColor(0, 217, 255);
  doc.text('Email:', margin, currentY);
  doc.setTextColor(80, 80, 80);
  doc.text(data.schoolEmail, margin + 12, currentY);
  
  if (data.schoolId) {
    currentY += 4;
    doc.setTextColor(0, 217, 255);
    doc.text('School ID:', margin, currentY);
    doc.setTextColor(80, 80, 80);
    doc.text(data.schoolId.substring(0, 15), margin + 18, currentY);
  }

  // ============================================
  // ITEMS TABLE
  // ============================================
  
  currentY = 120;
  const tableWidth = pageWidth - (2 * margin);
  
  // Table Header
  doc.setFillColor(20, 20, 20);
  doc.rect(margin, currentY, tableWidth, 8, 'F');
  
  doc.setFillColor(0, 217, 255);
  doc.rect(margin, currentY, tableWidth, 0.8, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  
  doc.text('DESCRIPTION', margin + 3, currentY + 5.5);
  doc.text('QTY', margin + 95, currentY + 5.5);
  doc.text('RATE', margin + 120, currentY + 5.5);
  doc.text('AMOUNT', pageWidth - margin - 3, currentY + 5.5, { align: 'right' });
  
  // Table Row
  currentY += 8;
  const rowY = currentY + 5;
  
  // Description
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text(data.planName, margin + 3, rowY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(`${data.billingCycle.charAt(0).toUpperCase() + data.billingCycle.slice(1)} Subscription`, margin + 3, rowY + 4);
  doc.text('Education Management Platform', margin + 3, rowY + 7.5);
  
  // Quantity
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(data.studentCount.toString(), margin + 95, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('students', margin + 95, rowY + 4);
  
  // Rate
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(`₹${data.planPrice.toFixed(2)}`, margin + 120, rowY);
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('per student', margin + 120, rowY + 4);
  
  // Amount
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(`₹${data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - margin - 3, rowY, { align: 'right' });
  
  // Separator Line
  currentY += 18;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // ============================================
  // TOTALS SECTION
  // ============================================
  
  currentY += 6;
  const labelX = pageWidth - margin - 50;
  const valueX = pageWidth - margin - 3;
  
  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Subtotal:', labelX, currentY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`₹${data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, valueX, currentY, { align: 'right' });
  
  // GST if applicable
  if (data.gst && data.gst > 0) {
    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('GST (18%):', labelX, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`₹${data.gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, valueX, currentY, { align: 'right' });
  }
  
  currentY += 5;
  
  // Separator
  doc.setDrawColor(0, 217, 255);
  doc.setLineWidth(0.5);
  doc.line(labelX - 3, currentY, valueX, currentY);
  
  currentY += 6;
  
  // Total Box
  doc.setFillColor(250, 248, 255);
  doc.roundedRect(labelX - 5, currentY - 5, 55, 9, 2, 2, 'F');
  
  doc.setDrawColor(157, 0, 255);
  doc.setLineWidth(0.5);
  doc.roundedRect(labelX - 5, currentY - 5, 55, 9, 2, 2, 'S');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(157, 0, 255);
  doc.text('TOTAL:', labelX, currentY + 1);
  doc.setFontSize(11);
  doc.text(`₹${data.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, valueX - 2, currentY + 1, { align: 'right' });

  // ============================================
  // PAYMENT INFORMATION
  // ============================================
  
  currentY += 15;
  
  doc.setFillColor(245, 250, 255);
  doc.roundedRect(margin, currentY, pageWidth - (2 * margin), 16, 2, 2, 'F');
  
  doc.setDrawColor(0, 217, 255);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, pageWidth - (2 * margin), 16, 2, 2, 'S');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(0, 217, 255);
  doc.text('PAYMENT INFORMATION', margin + 3, currentY + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  
  let payY = currentY + 9;
  doc.text(`Payment Method: ${data.paymentMethod}`, margin + 3, payY);
  
  if (data.razorpayOrderId) {
    payY += 3.5;
    doc.text(`Razorpay Order ID: ${data.razorpayOrderId}`, margin + 3, payY);
  }

  // ============================================
  // FOOTER
  // ============================================
  
  const footerY = pageHeight - 28;
  
  // Thank you
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(157, 0, 255);
  doc.text('Thank you for choosing Catalyst Wells!', pageWidth / 2, footerY, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Your trust in our platform drives educational excellence.', pageWidth / 2, footerY + 4, { align: 'center' });
  
  // Separator
  doc.setDrawColor(0, 217, 255);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY + 7, pageWidth - margin, footerY + 7);
  
  // Contact Info
  doc.setFontSize(6.5);
  doc.setTextColor(120, 120, 120);
  const contactY = footerY + 11;
  
  doc.text('Web: www.catalystwells.com', pageWidth / 2 - 50, contactY);
  doc.text('Email: support@catalystwells.com', pageWidth / 2 - 10, contactY);
  doc.text('Phone: +91 88888 88888', pageWidth / 2 + 35, contactY);
  
  // Terms
  doc.setFontSize(5.5);
  doc.setTextColor(150, 150, 150);
  doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, contactY + 4, { align: 'center' });
  doc.text('For support or queries, please contact us at support@catalystwells.com', pageWidth / 2, contactY + 7, { align: 'center' });
  
  // Bottom accent
  doc.setFillColor(0, 217, 255);
  doc.rect(0, pageHeight - 2, pageWidth, 2, 'F');

  return doc;
}

/**
 * Generate invoice from subscription data
 */
export function generateInvoiceFromSubscription(subscription: any): jsPDF {
  const invoiceData: InvoiceData = {
    transactionId: subscription.id.substring(0, 16).toUpperCase(),
    invoiceNumber: `INV-${new Date(subscription.created_at).getFullYear()}-${subscription.id.substring(0, 8).toUpperCase()}`,
    invoiceDate: new Date(subscription.created_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    schoolName: subscription.school_name || subscription.metadata?.school_name || 'School',
    schoolEmail: subscription.user_email,
    schoolId: subscription.school_id,
    planName: subscription.plan_name,
    planPrice: subscription.plan_price,
    studentCount: subscription.student_count || subscription.metadata?.student_count || 100,
    billingCycle: subscription.billing_cycle || 'monthly',
    paymentMethod: 'Razorpay (Secured Payment Gateway)',
    razorpayOrderId: subscription.razorpay_subscription_id,
    subtotal: subscription.plan_price * (subscription.student_count || subscription.metadata?.student_count || 100),
    total: subscription.plan_price * (subscription.student_count || subscription.metadata?.student_count || 100),
  };

  return generatePremiumInvoice(invoiceData);
}
