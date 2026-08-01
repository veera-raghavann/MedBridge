import { Injectable } from '@nitrostack/core';
import { google } from 'googleapis';

@Injectable()
export class GmailService {
  private getGmailClient() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI || 'http://localhost:8080'
    );

    // Provide your stored refresh token logic here
    if (process.env.GMAIL_REFRESH_TOKEN) {
      oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      });
    }

    return google.gmail({ version: 'v1', auth: oauth2Client });
  }

  async searchEmails(query: string) {
    const gmail = this.getGmailClient();
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 5,
    });
    return response.data.messages || [];
  }
}
