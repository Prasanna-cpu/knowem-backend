import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";


require("dotenv").config();

console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);



const ses=new SESClient({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!,
    },
})


const createSendEmailCommand = (
    toAddress: string,
    fromAddress: string,
    message: string,
) => {
    return new SendEmailCommand({
        Destination: {
            ToAddresses: [toAddress],
        },
        Source: fromAddress,
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: 'Your one-time password',
            },
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: message,
                },
            },
        },
    });
}

export async function sendEmailToken(email: string, token: string) {
    console.log(`email: ${email} , token: ${token}`);

    const message: string = `Your OTP ${token}`;

    const command: SendEmailCommand = createSendEmailCommand(
        email,
        'kumar22maran@gmail.com',
        message
    );

    try {
        const response = await ses.send(command);
        console.log("Email sent successfully:", response);
        return response;
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
}

// sendEmailToken('kumar22maran@gmail.com', '6825')
//     .then(response => {
//         console.log("Email successfully sent:", response);
//     })
//     .catch(err => {
//         console.log("Error sending email token:", err);
//     });