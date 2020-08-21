interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_PROVIDER || 'ethereal',
  defaults: {
    from: {
      email: process.env.AWS_EMAIL_IDENTITIES_FROM_EMAIL,
      name: 'GoBarber Team',
    },
  },
} as IMailConfig;
