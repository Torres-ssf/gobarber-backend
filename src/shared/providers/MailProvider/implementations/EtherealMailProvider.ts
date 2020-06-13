import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import IMailTemplateProvider from '@shared/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private mailTemplate: IMailTemplateProvider;

  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    mailTemplate: IMailTemplateProvider,
  ) {
    this.mailTemplate = mailTemplate;
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Gobarber Team',
        address: from?.email || 'team@gobarber.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplate.parse(templateData),
    });

    console.log(nodemailer.getTestMessageUrl(message));
  }
}

export default EtherealMailProvider;
