const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNExVdkQzN1JHZHh3aDNVb2Q2ZFRia004TjYwRnhnT0JyS3BPTVBWdkEwaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTVJEVjZhWTljczdtRng5ZFNVbFlicEtacmF4bElwZjdoZHFRckpuWVhBOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJVRXJFaGdHeURIQkVBUk1FRE5kdW55bWs1VENqOGJFUlV2S1JhL2xwY2tFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIwNW5Qb0hXUWVRSG0xemRMb3puYzQrVkxtZjVISnJ5Q1k0SG1YR3JrUWxNPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IllIeTlVclg5ckJwdXZWNllvU0QxelV1WXEybkVUMENBTXFtajgzUnBPM3c9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Inp2TGlPNVh0bDFGb3BjY2xWMFZTc0ZYT29QVy9MT1lLQXU5T25yR1pUd0k9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMkU0UXYza2wxaDUvdUhEUmNnaDJzYUlpRWZlS1Vma01DMUE1MlQzN05ITT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYUN3cklRWGdtUnhybCtnRERqYTU5ZU8vOFJPeEJDUVhBKzN3eko5S0Mwaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpQdmM4ZWdwUjI5R0pnWEJINFlyekhaS01rZjdOdHJrRXNGWGNyU0IzNE10a0lnTFZPVFh0QkVaRVl5Nis4aWNxMitTVXdlRkpWVXZuRGRqeS83bEJBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjE2LCJhZHZTZWNyZXRLZXkiOiJ4dCtvWDRhOW9PRTA1eUtEcjI5cmpDT2NEczdLaTVMd1Zsb0VrTXZqekNJPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJLMzNuc0xnLVJvR0xTWnJhMFFjc0xBIiwicGhvbmVJZCI6IjkwZjU0NjA0LWYyZTgtNDc2Yy1hYzM2LWQ3NjcyMWUyMjNmOSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJaSlMvWVV3dUJnOVl3UTlDTHVic0Y1SFBnSnM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWlIrQ3d3d2kzZWt5di9UWmVPdWttcW1Yd3ZZPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjdFWlY1VEJGIiwibWUiOnsiaWQiOiIyNzc5MzkyMTgyOToxN0BzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUHFuL3JZSEVQU1dvN1lHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiODBWSGYzWjBtMk1YQnlGbUZibVovS0dRRGJwdmdtRlZaclVVRlF3UHVpND0iLCJhY2NvdW50U2lnbmF0dXJlIjoiS1E3MnRTOEZLblEwWmJ4TkFnWko2L1Vqd290OWZYWW9VUUNkVWZ3MTRnTGp3NG50WVdia2NmNDMvL3Y4RUMzd1F2ajRUK081Nm9QUms5ZTVHYmVhQXc9PSIsImRldmljZVNpZ25hdHVyZSI6Ik50bGxWN2JIOE9QMGNCQjZJczl0bi9zRjk2WlI4RlZHZys3SXk0azByREFOZllWM2JCdlpwSnl5a3BLYmFwb0MzU08zZ0F0dGU1UWVTaUFrWk5lN0J3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjc3OTM5MjE4Mjk6MTdAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZk5GUjM5MmRKdGpGd2NoWmhXNW1meWhrQTI2YjRKaFZXYTFGQlVNRDdvdSJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyNDQzNTMyOX0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Geraldine",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "27793921829",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'QUEEN SAVAGE',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/179fe48ce0290c09d75a6.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '1',
    //GPT : process.env.OPENAI_API_KEY || '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',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
   DB: process.env.DB || 'postgres://neoverse:pomrleUMXwlmlpIcW2oFJmMX0CXzaFkf@dpg-combonun7f5s73d7uoog-a.oregon-postgres.render.com/neoverse_wz98',
                  /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
