import nodemailer from "nodemailer";

export default class Email {
  static async createTransporter() {
    let account = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass // generated ethereal password
      }
    });
  }
  static async sendCreateEventEmails({ clients = [], name }) {
    const sentResults = [];
    const transporter = this.createTransporter();
    clients.forEach(async client => {
      const { email, password } = client;
      const mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `${name} -> ${password}` // html body
      };

      let info = await transporter.sendMail(mailOptions);

      sentResults.push({ id: info.messageId, url: nodemailer.getTestMessageUrl(info) });
    });
  }
}
