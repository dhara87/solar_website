
const nodemailer = require('nodemailer')

exports.handler = async (event) => {

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: "Method not allowed"
    };
  }

  try {
    const {name,email} = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD
      }
    });
  
    const msgToOwner = {
      from: process.env.NODEMAILER_USER,
      to: process.env.NODEMAILER_USER,
      subject: `Add Mailing List`,
      html: "<div>" + "<span>"+ "Name: " + name + "<span>" + "<br>" +
            "<span>"+ "Email: " + email + "<span>" + "<br>" +
            "</div>",
    };
    

    let infoForOwnerEmail = await transporter.sendMail(msgToOwner);
    if (infoForOwnerEmail.messageId){
      return {
        statusCode: 200,
        body: JSON.stringify({
          msg: "Your message was sent. Thank you."
        })
      };
    }

  }
  catch(err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: err
      })
    };
  }

};