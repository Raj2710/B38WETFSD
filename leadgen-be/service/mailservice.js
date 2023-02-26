const sgMail = require('@sendgrid/mail')

const MailService = async({email,subject,firstName,lastName,message})=>{
    sgMail.setApiKey('jjj')
    const msg = {
    to: `nagarajansai2727@gmail.com`, // Change to your recipient
    from: 'nagarajansai2727@gmail.com', // Change to your verified sender
    subject: `${subject}`,
    text: 'and easy to do anywhere, even with Node.js',
    html: `
    <div style="background-color: antiquewhite; margin-left:20%; margin-right:20%;padding:30px;">
    <div>
        <b>Hello ${firstName} ${lastName},</b>
    </div>
    <br>
    <div>
        ${message}    
    </div>
    <br>
    <footer style="text-align: center;">
        Guvi Geek Network Pvt Ltd, Chennai
    </footer>
</div>
    `,
    }
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

}

module.exports = {MailService}