import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    // Validate inputs
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "StyleAura <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d4a574; font-family: 'Playfair Display', serif;">Thank you for contacting StyleAura!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Dear ${name},
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We have received your message and our team will get back to you as soon as possible.
          </p>
          <div style="background-color: #f9f5f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #666; margin: 0;"><strong>Your Message:</strong></p>
            <p style="color: #666; margin: 10px 0 0 0;">${message}</p>
          </div>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Best regards,<br>
            <strong>The StyleAura Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            StyleAura | 123 Aura Lane, Mumbai, India | hello@styleaura.com
          </p>
        </div>
      `,
    });

    console.log("Customer confirmation email sent:", customerEmailResponse);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "StyleAura Contact Form <onboarding@resend.dev>",
      to: ["hello@styleaura.com"], // Replace with your actual admin email
      subject: `New Contact Form Submission${subject ? ': ' + subject : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4a574;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Name:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Email:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${email}</td>
            </tr>
            ${subject ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Subject:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${subject}</td>
            </tr>
            ` : ''}
          </table>
          <div style="background-color: #f9f5f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="margin: 10px 0 0 0;">${message}</p>
          </div>
        </div>
      `,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        customerEmail: customerEmailResponse,
        adminEmail: adminEmailResponse
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
