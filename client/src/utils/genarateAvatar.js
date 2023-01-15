class AvatarCanvas {
	canvas = document.createElement("canvas");
	ctx = this.canvas.getContext("2d");

	constructor(name, size, font = "sans-serif") {
		this.name = name;
		this.font = font;
		this.size = size;
	}

	generateColor() {
		const charCodeRed = this.name.charCodeAt(0),
			charCodeGreen = this.name.charCodeAt(1);

		const red = Math.pow(charCodeRed, 7) % 256,
			green = Math.pow(charCodeGreen, 7) % 256,
			blue = (red + green) % 256;

		const brightFactor = Math.floor((red + green + blue) / 3);
		const backColor = `rgb(${red}, ${green}, ${blue})`,
			textColor = brightFactor > 127 ? "black" : "white";

		return [backColor, textColor];
	}

	generateCodeName() {
		return this.name
			.match(/(^\p{L}{2}(?!\p{L}+\s))|(^\p{L})|(?<=\s)(\p{L}(?=\p{L}+$|$))/giu)
			.join()
			.toUpperCase();
	}

	generateAvatar() {
		const nameCode = this.generateCodeName(this.name);
		const [backColor, textColor] = this.generateColor(this.name);

		const nameCodeSize = this.ctx.measureText(nameCode);

		this.canvas.width = this.canvas.height = this.size;

		this.ctx.beginPath();
		this.ctx.fillStyle = backColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.font = `${this.canvas.width / 2 - nameCodeSize.width / 2}px ${this.font}`;
		this.ctx.fillStyle = textColor;
		this.ctx.fillText(
			nameCode,
			this.canvas.width / 2,
			this.canvas.height / 2 + nameCodeSize.width / 4
		);
		this.ctx.closePath();

		return this.canvas.toDataURL();
	}

	static getUrl() {
		const avatar = new AvatarCanvas(...arguments);
		const url = avatar.generateAvatar();

		return url;
	}
}

export { AvatarCanvas as default };
