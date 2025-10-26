# Complaint Form Backend Setup

This complaint form needs a backend service to send emails. Here are several options:

## Option 1: Formspree (Recommended - Easiest)

1. Go to [Formspree.io](https://formspree.io)
2. Create a free account
3. Create a new form and get the form endpoint URL
4. Update the JavaScript in `complaint.js` to use the Formspree endpoint

## Option 2: Netlify Forms (If using Netlify)

1. Add `netlify` attribute to the form tag
2. Add `name` attributes to form fields
3. Deploy to Netlify

## Option 3: Custom Backend (Advanced)

Create a serverless function or backend service that:
1. Receives POST requests at `/api/complaint`
2. Sends emails using a service like SendGrid, Mailgun, or Nodemailer
3. Handles CORS for the frontend

## Current Implementation

The form is currently set up to send to `/api/complaint` endpoint. You'll need to implement one of the above options to make it functional.

For immediate testing, you can modify the JavaScript to use Formspree or another form service.
