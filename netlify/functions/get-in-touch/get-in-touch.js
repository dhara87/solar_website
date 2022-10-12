
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
    const {name,email,mobile,address} = JSON.parse(event.body);

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
      subject: `Message from get-in-touch`,
      html: "<div>" + "<span>"+ "Name: " + name + "<span>" + "<br>" +
            "<span>"+ "Mobile No.: " + mobile + "<span>" + "<br>" +
            "<span>"+ "Email: " + email + "<span>" + "<br>" +
            "<span>"+ "address: " + address + "<span>" + "<br>" +
            "</div>",
    };
    
    const msgToClient = {
      to: email,
      from: process.env.NODEMAILER_USER,
      subject: `Contact Energy Platform`,
      html: "<div>"+ "<h3>" + "Thank You " + name + "</h3>" +
            "<h4>" + "We Will Contact Back You Soon" + "</h4>" +
            "<span>"+ "Name: " + name + "<span>" + "<br>" +
            "<span>"+ "Mobile No.: " + mobile + "<span>" + "<br>" +
            "<span>"+ "Email: " + email + "<span>" + "<br>" +
            "<span>"+ "address: " + address + "<span>" + "<br>" +
           "</div>"
    };

    let infoForOwnerEmail = await transporter.sendMail(msgToOwner);
    let infoForClientEmail = await transporter.sendMail(msgToClient);
    if (infoForOwnerEmail.messageId && infoForClientEmail.messageId ){
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