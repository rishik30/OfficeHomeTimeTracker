const cron = require('node-cron')
const nodemailer = require('nodemailer')

require('dotenv').config()

const mailOptions = {
  from: 'officehometimetracker@gmail.com',
  to: 'rishabhk3003@gmail.com',
  subject: 'Test Email using Node.js cron',
  text: 'I am cron sending this email!!',
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'officehometimetracker@gmail.com',
    pass: process.env.MAIL_PASSWORD,
  },
})

console.log('Task scheduled 😎')
cron.schedule('* * * * *', () => {
  console.log('running a task every minute')
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
})
