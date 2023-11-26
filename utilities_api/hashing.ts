import { createCipheriv, createDecipheriv, createHash, createHmac, createVerify, randomBytes, verify } from "crypto";

// export const encrypt = (datas) => {
//     const hash = createHmac('sha256', process.env.ENCRYPTION_SECRET)
//         .update(datas)
//         .digest('hex');
//     console.log({ hash });
//     return hash;
// };

// export const dcrypt = (datas) => {
//     const hash = createDecipheriv('sha256', process.env.ENCRYPTION_SECRET, datas)
//     console.log({ hash });
//     return hash;
// }

const secretKey = createHash("sha256").update(process.env.ENCRYPTION_SECRET, "ascii").digest();;

// Generate an initialization vector
var iv = "1234567890123456";

export const encrypt = (data: [] | string | {}) => {
    const plainText: string = JSON.stringify(data);
    // create cipher object
    const cipher = createCipheriv("aes-256-cbc", secretKey, iv);

    // encrypt the data
    let encryptedText = cipher.update(plainText, "utf-8", "hex");

    // finalize the encryption
    encryptedText += cipher.final("hex");

    // console.log("eeee",typeof encryptedText );
    // console.log({encryptedText:JSON.stringify(encryptedText)})
    return JSON.stringify(encryptedText);
}

export const dcrypt = (encryptedText) => {
    try {
        
        // create Decipher object
        const decipher = createDecipheriv("aes-256-cbc", secretKey, iv);

        // decrypt the data
        let decryptedText = decipher.update(JSON.parse(encryptedText), "hex", "utf-8");

        // finalize the decryption
        decryptedText += decipher.final("utf-8");

        const parseData = JSON.parse(decryptedText);
        return [null, parseData];
    }
    catch (err) {
        console.log({ err: err.message })
        return [err.message, null];
    }
}