import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import aws from 'aws-sdk';
import IMailTemplateProvider from '@shared/providers/MailTemplateProvider/models/IMailTemplateProvider';

import mailConfig from '@config/mail';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
class SESMailProvider implements IMailProvider {
  private mailTemplate: IMailTemplateProvider;

  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    mailTemplate: IMailTemplateProvider,
  ) {
    this.mailTemplate = mailTemplate;
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
      }),
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplate.parse(templateData),
    });
  }
}

export default SESMailProvider;
