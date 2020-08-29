const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'mondalsaidul3232@gmail.com',
        subject:'Thanks for joining in!',
        text:`Welcome to the app ${name}.Let me know how you get along with the app.`
    })
}

const sendGoodbyMail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'mondalsaidul3232@gmail.com',
        subject:'Very sad moments!',
        text:`We were happy togather ${name}.Let me know what made to leave.`
    })
} 
//ok

module.exports = {
    sendWelcomeMail,
    sendGoodbyMail

}

// sgMail.send({
//     to:'bibiasem007@gmail.com',
//     from:'mondalsaidul3232@gmail.com',
//     subject:'This is my first creation!',
//     text:'I hope this one acctually get to you'
// })