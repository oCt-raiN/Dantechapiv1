const nodemailer = require('nodemailer');
const { port } = require('../config/config');
const config = require('../config/config');
const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
  transport
    .verify()
    .then(() => console.log('Connected to email server'))
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */

const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  console.log(msg);
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const baseappurl = config.APP_URL;
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrlwithbase = `${baseappurl}/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrlwithbase}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const PasswordResetSuccess = async (to, token) => {
  const subject = 'Reset password Success';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
Your password has been reset successfully`;
  await sendEmail(to, subject, text);
};

const sendConfirmBookingMail = async (to, firstName, lastName, professional, profbooking, existingSlot, professionalData) => {
  const subject = 'Booking confirmation';
  const text = `Dear ${firstName} ${lastName},
    Your booking has been confirmed with ${professional.firstName} ${professional.lastName} for ${profbooking.bookingDate}.
    Booking Number: ${profbooking.bookingNumber}
    Category Name: ${professionalData.categorie[0].categorieName}
    Start Time: ${existingSlot.slotTime}
    End Time: ${existingSlot.endTime}
    Descriptions: ${profbooking.descriptions}
    bookingFor:${profbooking.bookingFor}
    statusInfo:${profbooking.statusInfo}`;

  await sendEmail(to, subject, text);
}

const sendCancelBookingMail = async (to, firstName, lastName, userCancel) => {
  const subject = 'cancel request send to admin';
  const text = `Dear ${firstName} ${lastName},
        Booking Number: ${userCancel.bookingNumber}
        Booking Date: ${userCancel.bookingDate}
        Start Slot: ${userCancel.startSlot}
        End Slot: ${userCancel.endSlot}
        Descriptions: ${userCancel.descriptions}`;

  await sendEmail(to, subject, text);
}

const userregistermail = async (to, clinicname, clinicid, address, phonenumber) => {
  const subject = 'Register confirmation';
  const text = `Dear ${clinicname},
    Thank you for registering in dantech. please complete your profile to place orders. Clinic was registered with the following details.
    Clinic unique id: ${clinicid}
    Email: ${to}
    Address: ${address}
    Phone Number: ${phonenumber} 


    Thank You,
    Dantech Organization.
    `;


  await sendEmail(to, subject, text);
}

const createorderemail = async (to, order_id, doctor_name, doctor_id, clinicname) => {
  const subject = 'Order created';
  const text = `Dear ${clinicname},
    Thank you for placing order in dantech. Order will be approved within 4-6 working days and you can view the status of the order in your order list.
    Order Id: ${order_id}
    Doctor name: ${doctor_name}
    Doctor Id: ${doctor_id}

    Thank You,
    Dantech Organization.
    `;

  await sendEmail(to, subject, text);
}

const approvedmail = async (to, clinicname, clinicid) => {
  const subject = "Profile approved";
  const text = `Dear ${clinicname},
    Your profile has been approved (clinic id: ${clinicid}) and you can proceed with placing order to Dantech labs.
    
    Thank You,
    DAntech Organization.`;
  await sendEmail(to, subject, text);
}


const rejectedmail = async (to, clinicname, clinicid, description) => {
  const subject = "Profile rejected";
  const text = `Dear ${clinicname},
    Sorry, your profile has been rejected (clinic id: ${clinicid}) for the following reasons. 
    Reason for rejection: "${description}"
    Kindly update and try again later.

    
    Thank You,
    DAntech Organization.`;
  await sendEmail(to, subject, text);
}




module.exports = {
  transport,
  sendResetPasswordEmail,
  PasswordResetSuccess,
  sendConfirmBookingMail,
  sendCancelBookingMail,
  userregistermail,
  createorderemail,
  approvedmail,
  rejectedmail,
};