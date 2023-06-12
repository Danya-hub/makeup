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
            font-family: sans-serif;
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
    <a href="#">
        <img src="https://i.ibb.co/mHKVkyr/Frame-95.png" alt="logo" style="width: 80px;">
    </a>
    <div style="
        background: rgb(255, 255, 255);
        box-shadow: 0 0 8px rgb(0, 0, 0, 0.1);
        padding: 5vh 3vw;
    ">
        <header>
            <h1 style="
                text-transform: capitalize;
                text-align: center;
                margin-bottom: 30px;
                color: rgb(140, 113, 72);   
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
            <b style="
            display: block;
            margin: 20px auto;
            text-align: center;
            font-size: 22px;
        ">${text.verificationCode}</b>
        </main>
        <hr style="
            margin-bottom: 30px;
        " />
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
    ua: (options) => ({
        subject: "Код підтвердження для акаунту",
        html: html({
            ...options,
            title: "Код підтвердження",
            purpose: "Щоб зареєструватися, вам потрібно ввести код підтвердження, вказаний нижче на нашому сайті",
            verificationCode: options.verificationCode,
            warning: "Якщо ви не запитували код підтвердження, ви можете проігнорувати це повідомлення",
        })
    }),
    at: (options) => ({
        subject: "Confirmation code for account",
        html: html({
            ...options,
            title: "Confirmation code",
            purpose: "To register, you need to enter the verification code below on our website",
            verificationCode: options.verificationCode,
            warning: "If you did not request a verification code, you can ignore this message",
        })
    }),
};

export default content;