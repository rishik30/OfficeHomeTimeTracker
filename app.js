const cron = require('node-cron')
const nodemailer = require('nodemailer')
const axios = require('axios')
require('dotenv').config()

const getMailOptions = (sub, html) => ({
  from: 'officehometimetracker@gmail.com',
  to: 'rishabhk3003@gmail.com',
  subject: sub || 'Test Email using Node.js cron',
  ...(html ? { html } : { text: 'I am cron sending this email!!' })
})

const config = {
  method: 'get',
  url: 'https://maps.googleapis.com/maps/api/distancematrix/json',
  params: {
    origins: 'Vatika towers, Gurgaon',
    destinations: 'Vikaspuri, New Delhi',
    travelMode: 'DRIVING',
    key: process.env.API_KEY
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'officehometimetracker@gmail.com',
    pass: process.env.MAIL_PASSWORD,
  },
})

const CRON_SCHEDULE_TIME = '0 15-21 * * 1-5' //  At minute 0 past every hour from 15 through 21 on every day-of-week from Monday through Friday.

console.log('Task scheduled 😎')
cron.schedule(CRON_SCHEDULE_TIME, () => {
  console.log('fetching map data...')
  axios(config)
    .then(({ data }) => {
      let subject = 'ℹ️ You will be happy to drive'
      if (
        data.rows[0].elements[0].duration.value > 4500 &&
        data.rows[0].elements[0].duration.value < 5400
      ) {
        subject = "⚠️ You can go if it's urgent"
      } else if (data.rows[0].elements[0].duration.value > 5400) {
        subject = '⛔️ What are you thinking buddy?'
      }
      const html = `
        <h3>Below are the details:</h3>
        <div>
          <span><b>🚦Distance:</b></span>
          <span>${data.rows[0].elements[0].distance.text}</span>
        </div>
        <br/>
        <div>
          <span><b>⏰ Duration:</b></span>
          <span>${data.rows[0].elements[0].duration.text}</span>
        </div>
      `
      const mailOptions = getMailOptions(subject, html)
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error)
        } else {
          console.log('Email sent: ' + info.response)
        }
      })
    })
    .catch(function (error) {
      console.log(error)
    })
})
