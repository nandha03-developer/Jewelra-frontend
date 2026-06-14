export interface InvoiceData {
  orderId: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export const generateInvoicePDF = async (data: InvoiceData) => {
  if (typeof window === 'undefined') return;

  try {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const themeColor = '#751A20';
    const secondaryColor = '#D4B996';
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;

    // Company Logo / Name Section (Centered)
    const logoUrl = 'https://res.cloudinary.com/dtusyew0a/image/upload/v1775636830/Gemini_Generated_Image_d3hdiid3hdiid3hd-Photoroom_dpe9mh.png';
    const logoWidth = 45;
    const logoHeight = 25;
    const logoX = (pageWidth - logoWidth) / 2;

    try {
      // Attempt to add logo image - Centered
      doc.addImage(logoUrl, 'PNG', logoX, 10, logoWidth, logoHeight);
    } catch (e) {
      // Fallback to text if logo fails to load
      doc.setTextColor(themeColor);
      doc.setFont('serif', 'bold');
      doc.setFontSize(32);
      doc.text('JEWELRA', pageWidth / 2, 25, { align: 'center' });
    }

    // Slogan below logo
    doc.setTextColor(117, 26, 32);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Premium Craftsmanship, Eternal Brilliance', pageWidth / 2, 40, { align: 'center' });

    // Accent Line
    doc.setDrawColor(secondaryColor);
    doc.setLineWidth(0.3);
    doc.line(margin, 45, pageWidth - margin, 45);

    // Header Details Section
    let headerY = 55;

    // Invoice Label
    doc.setTextColor(themeColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', margin, headerY);

    // Basic Info (Top Right)
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`DATE: ${new Date(data.date).toLocaleDateString()}`, pageWidth - margin, headerY, { align: 'right' });
    doc.text(`INVOICE NO: ${data.orderId}`, pageWidth - margin, headerY + 5, { align: 'right' });

    // Heavy Line
    doc.setDrawColor(themeColor);
    doc.setLineWidth(0.8);
    doc.line(margin, headerY + 10, pageWidth - margin, headerY + 10);

    // Company Details vs Date/ID
    let currentY = headerY + 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('JEWELRA', margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('NandhaKumar.M', margin, currentY + 5);
    doc.text('M.M. Street, Amman Sannathi St', margin, currentY + 10);
    doc.text('Kallukatti, Karaikudi', margin, currentY + 15);
    doc.text('Tamil Nadu - 630001', margin, currentY + 20);
    doc.text('Phone: +91 98949 34429', margin, currentY + 25);
    doc.text('Email: jewelra2026@gmail.com', margin, currentY + 30);

    // Buyer Details (Left)
    let buyerY = currentY + 45;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', margin, buyerY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(data.customer.name, margin, buyerY + 5);
    doc.text(data.customer.address, margin, buyerY + 10);
    doc.text(`${data.customer.city}, ${data.customer.state} - ${data.customer.postal}`, margin, buyerY + 15);
    doc.text(`Phone: ${data.customer.phone}`, margin, buyerY + 20);
    doc.text(`Email: ${data.customer.email}`, margin, buyerY + 25);

    // Shipping Reference (Right)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SUPPLIER REFERENCE:', pageWidth - margin, buyerY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Standard Luxury Express', pageWidth - margin, buyerY + 5, { align: 'right' });
    doc.text('Tracking: Processing', pageWidth - margin, buyerY + 10, { align: 'right' });

    // Table Header
    currentY = buyerY + 35;
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, currentY, pageWidth - (margin * 2), 10, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, currentY, pageWidth - (margin * 2), 10);

    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION', margin + 5, currentY + 6);
    doc.text('QTY', margin + 110, currentY + 6, { align: 'center' });
    doc.text('RATE (INR)', margin + 140, currentY + 6, { align: 'center' });
    doc.text('AMOUNT (INR)', pageWidth - margin - 5, currentY + 6, { align: 'right' });

    // Table Rows
    doc.setFont('helvetica', 'normal');
    data.items.forEach((item, index) => {
      currentY += 10;
      doc.rect(margin, currentY, pageWidth - (margin * 2), 10);

      // Vertical Separators
      doc.line(margin + 100, currentY, margin + 100, currentY + 10);
      doc.line(margin + 120, currentY, margin + 120, currentY + 10);
      doc.line(margin + 160, currentY, margin + 160, currentY + 10);

      doc.text(item.name.length > 55 ? item.name.substring(0, 52) + '...' : item.name, margin + 5, currentY + 6);
      doc.text(item.quantity.toString(), margin + 110, currentY + 6, { align: 'center' });
      doc.text(item.price.toLocaleString(), margin + 140, currentY + 6, { align: 'center' });
      doc.text((item.price * item.quantity).toLocaleString(), pageWidth - margin - 5, currentY + 6, { align: 'right' });
    });

    // Totals Section
    currentY += 20;
    const totalsX = pageWidth - margin - 60;

    // Labels
    doc.setFont('helvetica', 'bold');
    doc.text('SUBTOTAL:', totalsX, currentY);
    doc.text('SHIPPING FEE:', totalsX, currentY + 7);
    doc.text('GST (5%):', totalsX, currentY + 14);

    doc.setFillColor(117, 26, 32); // #751A20
    doc.rect(totalsX - 5, currentY + 18, 65, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('GRAND TOTAL:', totalsX, currentY + 25);

    // Values
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`INR ${data.subtotal.toLocaleString()}`, pageWidth - margin - 5, currentY, { align: 'right' });
    doc.text(`INR ${data.shipping.toLocaleString()}`, pageWidth - margin - 5, currentY + 7, { align: 'right' });
    doc.text(`INR ${data.tax.toLocaleString()}`, pageWidth - margin - 5, currentY + 14, { align: 'right' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`INR ${data.total.toLocaleString()}`, pageWidth - margin - 5, currentY + 25, { align: 'right' });

    // Amount in Words
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text('AMOUNT IN WORDS:', margin, currentY + 45);
    doc.setFont('helvetica', 'italic');
    doc.text(`${numberToWords(data.total)} Rupees Only`, margin, currentY + 50);

    // Signature Area
    const signatureUrl = 'https://res.cloudinary.com/dtusyew0a/image/upload/v1776185283/signature_d6llb3.png';

    currentY += 60; // Push further down

    try {
      // Signature image
      doc.addImage(signatureUrl, 'PNG', pageWidth - margin - 40, currentY - 12, 30, 15);
    } catch (e) {
      console.error('Signature failed to load');
    }

    doc.line(pageWidth - margin - 50, currentY + 5, pageWidth - margin, currentY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Authorized Signature', pageWidth - margin - 25, currentY + 10, { align: 'center' });

    // Footer Message
    currentY += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(117, 26, 32);
    doc.text('THANK YOU FOR YOUR BUSINESS!', pageWidth / 2, currentY, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Terms & Conditions Apply. All checks payable to Jewelra India Ltd.', pageWidth / 2, currentY + 7, { align: 'center' });

    doc.save(`Jewelra_Invoice_${data.orderId}.pdf`);
  } catch (error) {
    console.error('Invoice Generation Error:', error);
    throw error;
  }
};

// Helper function to convert number to words (Simple version for demo)
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  const convert = (n: number): string => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    return n.toString(); // Fallback
  };

  return convert(num);
}
