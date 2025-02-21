const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (if needed)
app.use(express.static('./'));

app.set('views', path.join(__dirname, './'));
app.set('view engine', 'ejs');

// SMTP configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER || "smtp.gmail.com", // Replace with your SMTP server (e.g., smtp.gmail.com)
    port: process.env.SMTP_PORT, // Use 465 for secure connections
    secure: false, // Set to true if using port 465
    auth: {
        user: process.env.SMTP_EMAIL, // Replace with your email
        pass: process.env.SMTP_PASSWORD, // Replace with your email password or app password
    },
});




app.get('/', (req, res) => {
    const message = req.session.message;
    req.session.message = null;
    res.render('index.ejs', {message});
})


// Route to handle form submission
app.post('/submit-form', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Email content
    const mailOptions = {
        from: `"Website Contact Form" <${email}>`, // Sender's email
        to: process.env.SMTP_EMAIL, // Replace with the email you want to receive messages at
        subject: `New Contact Form Submission: ${subject}`,
        text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p>You received a new message:</p><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        req.session.message = 'Form submitted successfully!';
        res.redirect('/');
        // res.status(200).send('Your message has been sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send the message. Please try again later.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
