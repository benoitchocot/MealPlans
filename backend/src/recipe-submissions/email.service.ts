import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        // Configure email transporter
        // Support for SMTP or Gmail
        const emailConfig = {
            host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
            port: parseInt(this.configService.get('SMTP_PORT') || '587'),
            secure: this.configService.get('SMTP_SECURE') === 'true', // true for 465, false for other ports
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        };

        if (emailConfig.auth.user && emailConfig.auth.pass) {
            this.transporter = nodemailer.createTransport(emailConfig);
        }
    }

    async sendApprovalEmail(
        to: string,
        submissionId: string,
        recipeTitle: string,
        submitterEmail: string,
        approvalUrl: string,
    ) {
        if (!this.transporter) {
            console.warn('Email not configured. Approval email not sent.');
            console.log(`Approval URL for submission ${submissionId}: ${approvalUrl}`);
            return;
        }

        const mailOptions = {
            from: this.configService.get('SMTP_FROM') || this.configService.get('SMTP_USER'),
            to,
            subject: `[FoodTrack] Nouvelle recette à approuver: ${recipeTitle}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #10b981; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
                        .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🍳 Nouvelle recette à approuver</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour,</p>
                            <p>Une nouvelle recette a été soumise sur FoodTrack et nécessite votre approbation.</p>
                            
                            <h2>Détails de la recette</h2>
                            <ul>
                                <li><strong>Titre:</strong> ${recipeTitle}</li>
                                <li><strong>Soumis par:</strong> ${submitterEmail}</li>
                                <li><strong>ID de soumission:</strong> ${submissionId}</li>
                            </ul>
                            
                            <p>
                                <a href="${approvalUrl}" class="button">Voir et approuver la recette</a>
                            </p>
                            
                            <p>Ou copiez ce lien dans votre navigateur:</p>
                            <p style="word-break: break-all; color: #6b7280;">${approvalUrl}</p>
                        </div>
                        <div class="footer">
                            <p>Cet email a été envoyé automatiquement par FoodTrack.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Approval email sent to ${to} for submission ${submissionId}`);
        } catch (error) {
            console.error('Failed to send approval email:', error);
            throw error;
        }
    }
}

