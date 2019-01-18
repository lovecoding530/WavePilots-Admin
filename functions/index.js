const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
let ejs = require('ejs');
admin.initializeApp();

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
// firebase functions:config:set gmail.email="myusername@gmail.com" gmail.password="secretpassword"

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

const APP_NAME = 'WavePilots';

const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for
    // this URL must be whitelisted in the Firebase Console.
    url: 'https://wavepilots-67f1c.firebaseapp.com/',
    // This must be true for email link sign-in.
    handleCodeInApp: true,
};

/**
 * Sends a welcome email when user create.
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    const email = user.email; // The email of the user.
    const displayName = user.displayName; // The display name of the user.
    return sendWelcomeEmail(email, displayName);
});

// Sends a welcome email to the given user.
async function sendWelcomeEmail(email, displayName) {
    var verificationLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);
    verificationLink = removeParam('continueUrl', verificationLink);

    let renderedHtml = await ejs.renderFile('./templates/welcome.ejs', {verificationLink});

    const mailOptions = {
        from: `${APP_NAME} <noreply@wavepilots.com>`,
        replyTo: 'noreply@wavepilots.com',
        to: email,
        subject: `Welcome to ${APP_NAME}!`,
        text: `Hey ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service. ${verificationLink}`,
        html: renderedHtml
    };
    console.log(mailOptions);

    await mailTransport.sendMail(mailOptions);
    console.log('New welcome email sent to:', email);

    return null;
}

/**
 * remove parameter from url
 */
function removeParam(key, sourceURL) {
    var resultUrl = sourceURL.split("?")[0];
    var params = [];
    var queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params = queryString.split("&");
        for (var i = params.length - 1; i >= 0; i -= 1) {
            let param = params[i].split("=")[0];
            if (param === key) {
                params.splice(i, 1);
            }
        }
        resultUrl = resultUrl + "?" + params.join("&");
    }
    return resultUrl;
}

/**
 * trigger when waver request to join to wave
 */
exports.waverActivityCreate = functions.database.ref('/wavers_activity/{waveId}/{waverId}').onCreate((snapshot, context)=>{
    const waveId = context.params.waveId;
    const waverId = context.params.waverId;

})

/**
 * trigger when pilot accept waver's join request
 */
exports.catchedWaveCreate = functions.database.ref('/catched_waves/{waverId}/{waveId}').onCreate((snapshot, context)=>{
    const waverId = context.params.waverId;
    const waveId = context.params.waveId;
    
})