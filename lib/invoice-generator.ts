/**
 * Enterprise Invoice PDF Generator
 * Generates professional, branded PDF invoices for Catalyst Wells
 */

import jsPDF from 'jspdf';

interface InvoiceData {
  // Transaction Details
  transactionId: string;
  invoiceNumber: string;
  invoiceDate: string;
  
  // School Details
  schoolName: string;
  schoolEmail: string;
  schoolId?: string;
  
  // Billing Address (if available)
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  
  // Subscription Details
  planName: string;
  planPrice: number;
  studentCount: number;
  billingCycle: string;
  
  // Payment Details
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  
  // Amounts
  subtotal: number;
  gst?: number;
  total: number;
}

export class EnterpriseInvoiceGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private currentY: number = 20;
  
  // Brand Colors (matching your neon theme)
  private colors = {
    primary: '#00D9FF',      // Neon Cyan
    secondary: '#9D00FF',    // Neon Purple
    dark: '#0A0A0A',         // Almost Black
    darkGray: '#1A1A1A',     // Dark Gray
    mediumGray: '#666666',   // Medium Gray
    lightGray: '#999999',    // Light Gray
    white: '#FFFFFF',
    success: '#00FF88',      // Neon Green
    accent: '#FF006E',       // Neon Pink
  };

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  /**
   * Generate complete invoice PDF
   */
  public generateInvoice(data: InvoiceData): jsPDF {
    this.addHeader();
    this.addCompanyInfo();
    this.addInvoiceDetails(data);
    this.addBillingInfo(data);
    this.addItemsTable(data);
    this.addPaymentInfo(data);
    this.addFooter();
    
    return this.doc;
  }

  /**
   * Add professional header with branding
   */
  private addHeader(): void {
    const headerHeight = 35;
    
    // Dark header background with gradient effect (simulated)
    this.doc.setFillColor(26, 26, 26);
    this.doc.rect(0, 0, this.pageWidth, headerHeight, 'F');
    
    // Accent line at top
    this.doc.setFillColor(0, 217, 255); // Neon Cyan
    this.doc.rect(0, 0, this.pageWidth, 2, 'F');
    
    // Company Logo Area (text-based logo for now)
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(24);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('CATALYST', this.margin, 15);
    
    this.doc.setFontSize(22);
    this.doc.setTextColor(0, 217, 255); // Neon Cyan
    this.doc.text('WELLS', this.margin + 42, 15);
    
    // Tagline
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(153, 153, 153);
    this.doc.text('Enterprise Education Management Platform', this.margin, 21);
    
    // INVOICE label (right side)
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(28);
    this.doc.setTextColor(157, 0, 255); // Neon Purple
    this.doc.text('INVOICE', this.pageWidth - this.margin, 18, { align: 'right' });
    
    // Professional separator line
    this.doc.setDrawColor(0, 217, 255);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, headerHeight - 2, this.pageWidth - this.margin, headerHeight - 2);
    
    this.currentY = headerHeight + 5;
  }

  /**
   * Add company information
   */
  private addCompanyInfo(): void {
    const startY = this.currentY;
    
    // Company Details
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(0, 217, 255);
    this.doc.text('FROM', this.margin, startY);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Catalyst Wells Technologies Pvt. Ltd.', this.margin, startY + 5.5);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('Innovation Hub, Tech Park', this.margin, startY + 10);
    this.doc.text('Bangalore, Karnataka 560001', this.margin, startY + 14);
    this.doc.text('India', this.margin, startY + 18);
    
    this.doc.setFontSize(7.5);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 217, 255);
    this.doc.text('Email: ', this.margin, startY + 23);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('billing@catalystwells.com', this.margin + 12, startY + 23);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 217, 255);
    this.doc.text('Phone: ', this.margin, startY + 27.5);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('+91 88888 88888', this.margin + 12, startY + 27.5);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 217, 255);
    this.doc.text('GSTIN: ', this.margin, startY + 32);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('29AABCT1234C1Z5', this.margin + 12, startY + 32);
    
    this.currentY = startY + 37;
  }

  /**
   * Add invoice details (number, date, etc.)
   */
  private addInvoiceDetails(data: InvoiceData): void {
    const rightX = this.pageWidth - this.margin;
    const startY = 45;
    
    // Invoice details box
    const boxWidth = 70;
    const boxHeight = 35;
    const boxX = rightX - boxWidth;
    
    // Subtle background
    this.doc.setFillColor(250, 250, 255);
    this.doc.roundedRect(boxX, startY, boxWidth, boxHeight, 2, 2, 'F');
    
    // Border
    this.doc.setDrawColor(0, 217, 255);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(boxX, startY, boxWidth, boxHeight, 2, 2, 'S');
    
    let detailY = startY + 6;
    
    // Invoice Number
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('INVOICE NO:', boxX + 3, detailY);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(data.invoiceNumber, rightX - 3, detailY, { align: 'right' });
    
    detailY += 8;
    
    // Date
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('DATE:', boxX + 3, detailY);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(data.invoiceDate, rightX - 3, detailY, { align: 'right' });
    
    detailY += 8;
    
    // Transaction ID
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('TRANSACTION:', boxX + 3, detailY);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    this.doc.setTextColor(0, 0, 0);
    const txnId = data.transactionId.substring(0, 12);
    this.doc.text(txnId, rightX - 3, detailY, { align: 'right' });
    
    detailY += 8;
    
    // Status Badge
    this.doc.setFillColor(0, 255, 136); // Success green
    this.doc.roundedRect(boxX + 3, detailY - 2.5, 18, 5, 1, 1, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('PAID', boxX + 12, detailY + 1, { align: 'center' });
  }

  /**
   * Add billing information
   */
  private addBillingInfo(data: InvoiceData): void {
    const startY = this.currentY;
    
    // Billed To section
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(157, 0, 255); // Neon Purple
    this.doc.text('BILLED TO', this.margin, startY);
    
    // School name
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(data.schoolName, this.margin, startY + 6);
    
    // School details
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(102, 102, 102);
    
    let billingY = startY + 11;
    
    if (data.address) {
      this.doc.text(data.address, this.margin, billingY);
      billingY += 4.5;
    }
    
    if (data.city && data.state) {
      this.doc.text(`${data.city}, ${data.state} ${data.pincode || ''}`, this.margin, billingY);
      billingY += 4.5;
    }
    
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(0, 217, 255);
    this.doc.text('Email: ', this.margin, billingY);
    this.doc.setTextColor(102, 102, 102);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(data.schoolEmail, this.margin + 12, billingY);
    billingY += 4.5;
    
    if (data.schoolId) {
      this.doc.setTextColor(0, 217, 255);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('School ID: ', this.margin, billingY);
      this.doc.setTextColor(102, 102, 102);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(data.schoolId.substring(0, 16), this.margin + 17, billingY);
      billingY += 4.5;
    }
    
    this.currentY = billingY + 10;
  }

  /**
   * Add items table with professional styling
   */
  private addItemsTable(data: InvoiceData): void {
    const tableStartY = this.currentY;
    const tableWidth = this.pageWidth - (2 * this.margin);
    
    // Table header
    const headerHeight = 9;
    this.doc.setFillColor(26, 26, 26);
    this.doc.rect(this.margin, tableStartY, tableWidth, headerHeight, 'F');
    
    // Accent line on header
    this.doc.setFillColor(0, 217, 255);
    this.doc.rect(this.margin, tableStartY, tableWidth, 1, 'F');
    
    // Column headers
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(255, 255, 255);
    
    const col1 = this.margin + 3;
    const col2 = this.margin + 85;
    const col3 = this.margin + 110;
    const col5 = this.pageWidth - this.margin - 3;
    
    this.doc.text('DESCRIPTION', col1, tableStartY + 6);
    this.doc.text('QTY', col2, tableStartY + 6);
    this.doc.text('RATE', col3, tableStartY + 6);
    this.doc.text('AMOUNT', col5, tableStartY + 6, { align: 'right' });
    
    // Item row
    const rowY = tableStartY + headerHeight + 6;
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(data.planName, col1, rowY);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text(`${data.billingCycle.charAt(0).toUpperCase() + data.billingCycle.slice(1)} Subscription`, col1, rowY + 4);
    this.doc.text('Education Management Platform', col1, rowY + 7.5);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(data.studentCount.toString(), col2, rowY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('students', col2, rowY + 4);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`₹${data.planPrice.toFixed(2)}`, col3, rowY);
    this.doc.setFontSize(7);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('per student', col3, rowY + 4);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`₹${data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, col5, rowY, { align: 'right' });
    
    // Line separator
    const lineY = rowY + 12;
    this.doc.setDrawColor(230, 230, 230);
    this.doc.setLineWidth(0.2);
    this.doc.line(this.margin, lineY, this.pageWidth - this.margin, lineY);
    
    // Totals section
    let totalY = lineY + 6;
    const labelX = this.pageWidth - this.margin - 55;
    const valueX = this.pageWidth - this.margin - 3;
    
    // Subtotal
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('Subtotal:', labelX, totalY);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`₹${data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, valueX, totalY, { align: 'right' });
    
    totalY += 5.5;
    
    // GST (if applicable)
    if (data.gst && data.gst > 0) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(102, 102, 102);
      this.doc.text('GST (18%):', labelX, totalY);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`₹${data.gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, valueX, totalY, { align: 'right' });
      totalY += 5.5;
    }
    
    // Separator before total
    this.doc.setDrawColor(0, 217, 255);
    this.doc.setLineWidth(0.4);
    this.doc.line(labelX - 2, totalY + 1, valueX, totalY + 1);
    
    totalY += 6;
    
    // Total amount with highlight
    const totalBoxWidth = 60;
    const totalBoxHeight = 9;
    this.doc.setFillColor(250, 250, 255);
    this.doc.roundedRect(labelX - 4, totalY - 4, totalBoxWidth, totalBoxHeight, 2, 2, 'F');
    
    this.doc.setDrawColor(157, 0, 255);
    this.doc.setLineWidth(0.4);
    this.doc.roundedRect(labelX - 4, totalY - 4, totalBoxWidth, totalBoxHeight, 2, 2, 'S');
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(157, 0, 255);
    this.doc.text('TOTAL:', labelX, totalY + 1.5);
    this.doc.setFontSize(11);
    this.doc.text(`₹${data.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, valueX - 2, totalY + 1.5, { align: 'right' });
    
    this.currentY = totalY + 12;
  }

  /**
   * Add payment information
   */
  private addPaymentInfo(data: InvoiceData): void {
    const startY = this.currentY;
    const boxHeight = 18;
    
    // Payment details box
    this.doc.setFillColor(245, 250, 255);
    this.doc.roundedRect(this.margin, startY, this.pageWidth - (2 * this.margin), boxHeight, 2, 2, 'F');
    
    this.doc.setDrawColor(0, 217, 255);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(this.margin, startY, this.pageWidth - (2 * this.margin), boxHeight, 2, 2, 'S');
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(0, 217, 255);
    this.doc.text('PAYMENT INFORMATION', this.margin + 3, startY + 5);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(102, 102, 102);
    
    let payY = startY + 9.5;
    this.doc.text(`Payment Method: ${data.paymentMethod}`, this.margin + 3, payY);
    
    if (data.razorpayOrderId) {
      payY += 4;
      this.doc.text(`Razorpay Order ID: ${data.razorpayOrderId}`, this.margin + 3, payY);
    }
    
    if (data.razorpayPaymentId) {
      payY += 4;
      this.doc.text(`Razorpay Payment ID: ${data.razorpayPaymentId}`, this.margin + 3, payY);
    }
    
    this.currentY = startY + boxHeight + 5;
  }

  /**
   * Add professional footer
   */
  private addFooter(): void {
    const footerY = this.pageHeight - 32;
    
    // Thank you message
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(157, 0, 255);
    this.doc.text('Thank you for choosing Catalyst Wells!', this.pageWidth / 2, footerY, { align: 'center' });
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('Your trust in our platform drives educational excellence.', this.pageWidth / 2, footerY + 4, { align: 'center' });
    
    // Separator line
    this.doc.setDrawColor(0, 217, 255);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, footerY + 7, this.pageWidth - this.margin, footerY + 7);
    
    // Footer info
    const footerInfoY = footerY + 11;
    this.doc.setFontSize(6.5);
    this.doc.setTextColor(153, 153, 153);
    
    this.doc.text('Web: www.catalystwells.com', this.pageWidth / 2 - 55, footerInfoY);
    this.doc.text('Email: support@catalystwells.com', this.pageWidth / 2 - 15, footerInfoY);
    this.doc.text('Phone: +91 88888 88888', this.pageWidth / 2 + 40, footerInfoY);
    
    // Terms
    this.doc.setFontSize(5.5);
    this.doc.setTextColor(180, 180, 180);
    this.doc.text('This is a computer-generated invoice and does not require a signature.', this.pageWidth / 2, footerInfoY + 4.5, { align: 'center' });
    this.doc.text('For support or queries, please contact us at support@catalystwells.com', this.pageWidth / 2, footerInfoY + 7.5, { align: 'center' });
    
    // Bottom accent line
    this.doc.setFillColor(0, 217, 255);
    this.doc.rect(0, this.pageHeight - 2, this.pageWidth, 2, 'F');
  }

  /**
   * Download the generated PDF
   */
  public download(filename: string = 'invoice.pdf'): void {
    this.doc.save(filename);
  }

  /**
   * Get PDF as blob for upload or email
   */
  public getBlob(): Blob {
    return this.doc.output('blob');
  }

  /**
   * Get PDF as base64 string
   */
  public getBase64(): string {
    return this.doc.output('dataurlstring');
  }
}

/**
 * Helper function to generate invoice from subscription data
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

  const generator = new EnterpriseInvoiceGenerator();
  return generator.generateInvoice(invoiceData);
}
