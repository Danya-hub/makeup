import axios from "axios";

const telegramBotHelper = {
	createMessage(template) {
		return axios.post(`https://api.telegram.org/bot${process.env.BOT_TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.BOT_CHAT_ID}&parse_mode=${process.env.BOT_PARSE_MODE_MESSAGE}&text=${template}`);
	},
};

export default telegramBotHelper;