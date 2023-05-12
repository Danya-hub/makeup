import { server } from "../../config/server.js";

export function html(text) {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <style>
        :root {
            --step-0: clamp(0.38rem, calc(0.23rem + 0.73vw), 0.75rem);
            --step-1: clamp(0.45rem, calc(0.26rem + 0.95vw), 0.94rem);
            --step-2: clamp(0.54rem, calc(0.29rem + 1.23vw), 1.17rem);
            --step-3: clamp(0.65rem, calc(0.33rem + 1.59vw), 1.47rem);
            --step-4: clamp(0.78rem, calc(0.37rem + 2.06vw), 1.83rem);
        }

        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            text-decoration: none;
            color: rgb(31, 31, 31);
        }
    </style>
</head>

<body style="
    margin: 3vh 2vw;
    background: rgb(239, 239, 239);
    max-width: 600px;
    margin: 0 auto;">
    <a href = "${server.origin}" >
        <img src="https://i.ibb.co/mHKVkyr/Frame-95.png" alt="logo" style="width: 80px;">
    </a>
    <div style="
        background: rgb(255, 255, 255);
        box-shadow: 0 0 8px rgb(0, 0, 0, 0.1);
        padding: 5vh 3vw;
    ">
        <p style="
            font-size: var(--step-0);
            margin-bottom: 30px;    
        ">${text.greetings}</p>
        <header>
            <h1 style="
                text-transform: capitalize;
                text-align: center;
                margin-bottom: 30px;
            ">${text.title}</h1>
        </header>
        <main>
            <p style="
            font-weight: 500;
            text-align: center;
            font-size: var(--step-1);
            line-height: 18px;
            letter-spacing: 0.5px;
        ">${text.purpose}</p>
            <a href="${text.value}" style="
            background: rgb(140, 113, 72);
            color: rgb(255, 255, 255);
            white-space: nowrap;
            text-transform: capitalize;
            font-size: var(--step-1);
            font-weight: 600;
            padding: 10px 15px;
            display: block;
            width: fit-content;
            margin: 20px auto;
            border-radius: 6px;
        ">${text.textLink}</a>
        </main>
        <hr style="
            margin-bottom: 30px;
        "/>
        <footer>
            <p style="
                font-size: var(--step-0);
                color: rgb(129, 129, 129);
                line-height: 18px;
                letter-spacing: 0.5px;
            ">${text.warning}</p>
        </footer>
    </div>
</body>

</html>`;
}

const content = {
    ua: (user) => ({
        subject: "Скидання паролю для акаунту",
        html: html({
            ...user,
            greetings: `Добрий день <b>${user.username}</b>`,
            title: "Скидання паролю",
            purpose: "Якщо ви втратили свій пароль або бажаєте його змінити, натисніть кнопку нижче, щоб почати",
            textLink: "Скинути мій пароль",
            warning: "Якщо ви не запитували скидання пароля, можете проігнорувати це повідомлення. Тільки користувачі, які мають доступ до вашого облікового запису, можуть знехтувати пароль"
        })
    }),
    at: (user) => ({
        subject: "Reset password for account",
        html: html({
            ...user,
            greetings: `Hello <b>${user.username}</b>`,
            title: "Reset password",
            purpose: "If you have lost your password or want to change it, click the button below to get started",
            textLink: "Reset my password",
            warning: "If you did not request a password reset, you can ignore this message. Only users who have access to your account can reset your password"
        })
    }),
};

export default content;