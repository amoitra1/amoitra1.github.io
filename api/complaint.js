// Serverless function to handle complaint form submissions
// This can be deployed to Vercel, Netlify Functions, or similar platforms

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const complaintData = JSON.parse(event.body);
        
        // Create email content
        const emailContent = `
New Complaint About Anay

From: ${complaintData.complainerName}
Email: ${complaintData.complainerEmail}
Subject: ${complaintData.subject}
Severity: ${complaintData.severity}

Complaint:
${complaintData.message}

Suggestions:
${complaintData.suggestions}

---
Sent via Complaint Form
        `;

        // Configure email transporter (you'll need to set up environment variables)
        const transporter = nodemailer.createTransporter({
            service: 'gmail', // or your preferred email service
            auth: {
                user: process.env.EMAIL_USER, // Set this in your environment variables
                pass: process.env.EMAIL_PASS, // Set this in your environment variables
            },
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'anaymoitra@gmail.com',
            subject: `Complaint: ${complaintData.subject}`,
            text: emailContent,
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Complaint sent successfully' }),
        };

    } catch (error) {
        console.error('Error sending complaint:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to send complaint' }),
        };
    }
};
