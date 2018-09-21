const nodemailer = require('nodemailer');

nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'accela_noreply@atlantaga.gov',
            pass: ''
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    let mailOptions = {
        from: 'accela_noreply@atlantaga.gov',
        to: 'jbullock@atlantaga.gov',
        subject: 'Testing nodemailer',
        text: 'nodemailer is working',
        html: '<b>Hello!</b>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.log(error);
        }
        console.log('Message sent %s', info.messageId);
        console.log('Preview URL %s'. nodemailer.getTestMessageUrl(info));
    });
});