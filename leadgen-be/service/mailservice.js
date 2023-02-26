const sgMail = require('@sendgrid/mail')

const MailService = async({email,subject,firstName,lastName,message1,message2,message3})=>{
    sgMail.setApiKey('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')
    const msg = {
    to: `${email}`, // Change to your recipient
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
        ${message1}    
    </div>
    <br>
    <div>
        ${message2}    
    </div>
    <br>
    <div>
        ${message3}    
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