/** this library of nodemailer will help us send emails to users like invoice */

import nodemailer from "nodemailer";
import pdfUtils from "./pdfUtils.js";
import { promises as fs } from 'fs';

const sendInvoiceToEmail = async (email, appPassword, recipientEmail, orderDetails) => {


    // create a nodemailer transporter using SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: email,
            pass: appPassword // this has to be an App password generated from gmail or hotmail .etc, not your actual gmail's password
        }
    });


    //TODO: Bring in PovHuam logo into pdf 

    // invoice details and content
    const invoiceContent = 
     `
     <!DOCTYPE html>
<html>
<head>
<title>Invoice</title>
<style>
    /* Global styles */
    body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f7f7f7;
    }

    /* Container styles */
    .invoice-container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    /* Section title styles */
    .section-title {
        font-weight: bold;
        margin-bottom: 10px;
        color: #333;
    }

    /* Client info styles */
    .client-info {
        margin-bottom: 20px;
    }

    /* Product details styles */
    .product-details {
        margin-bottom: 20px;
    }

    /* Total details styles */
    .total-details {
        margin-bottom: 20px;
    }

    /* Payment info styles */
    .payment-info {
        margin-bottom: 20px;
    }

    /* Additional info styles */
    .additional-info {
        margin-bottom: 20px;
    }

    /* Price styles */
    .price {
        float: right;
        color: #808080;
    }

    /* Solid line styles */
    .solid-line {
        border-top: 1px solid #ccc;
        margin: 20px 0;
    }

    /* Footer styles */
    .footer {
        margin-top: 20px;
        text-align: center;
        color: #888;
    }
</style>
</head>
<body>
<div class="invoice-container">
    <div class="client-info">
        <div class="section-title">Your Contact Info:</div>
        <div>${orderDetails.businessName}</div>
        <div>${orderDetails.firstName} ${orderDetails.lastName}</div>
        <div>${orderDetails.email}</div>
        <div>${orderDetails.phone}</div>
    </div>

    <div class="solid-line"></div>

    <div class="product-details">
        <div class="section-title">Product:</div>
        <div>
            <div>Qty: ${orderDetails.totalQty}</div>
            <div>Due Date: ${orderDetails.deliveryDateRequest}</div>
        </div>
    </div>

    <div class="solid-line"></div>

    <div class="total-details">
        <div class="section-title">Grand Total:</div>
        <div>
            <div>Total: <span class="price">$${orderDetails.icost.total}</span></div>
        </div>
    </div>

    <div class="payment-info">
        <div class="section-title">Accepted Payments:</div>
        <ul>
            <li>Paypal</li>
            <li>All major credit cards</li>
            <li>Cash</li>
        </ul>
    </div>

    <div class="additional-info">
        <div class="section-title">Additional Information:</div>
        <div>Depending on the amount ordered, 50% or 100% of the total will be required before the order is processed at the warehouse.</div>
    </div>

    <div class="footer">
        <p>Thank you for your business!</p>
    </div>
</div>
</body>
</html>
      `;
    
    //TODO:  Call the pdfUtil.convertHtmlToPdf function then bring tyhe mailOptions and transporter into it
    

    (async () => {
        try {
            // Generate PDF using Puppeteer with configuration options
            const pdfBuffer = await pdfUtils.generatePDF(invoiceContent);
    
            // Now you have the PDF buffer, you can send it via email or save it to disk
            // For example, you can send it via nodemailer
            const mailOptions = {
                from: email,
                to: recipientEmail,
                subject: 'Pov Haum Studio Invoice: ' + orderDetails.orderId,
                attachments: [
                    {
                        filename: 'pov-haum-studio-invoice.pdf',
                        content: pdfBuffer, // Convert PDF buffer to base64 string
                        contentType: 'application/pdf',
                    }
                ]
            };
        
            // server lets us know when an email was sent or not
            transporter.sendMail(mailOptions)
                .then(info => {
                    console.log('Email sent:', info.response);
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                });
    
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    })();
        
    

    /*
    // email options for html
    const mailOptions = {
        from: email,
        to: recipientEmail,
        subject: 'Povhaum Studio Invoice: ' + orderDetails.orderId,
        html: invoiceContent
    }
    */

    
}





export default {sendInvoiceToEmail};