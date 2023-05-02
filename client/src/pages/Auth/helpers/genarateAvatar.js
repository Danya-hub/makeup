class AvatarCanvas {
	canvas = document.createElement("canvas");

	ctx = this.canvas.getContext("2d");

	constructor(name, size, font = "sans-serif") {
		this.name = name;
		this.font = font;
		this.size = size;
	}

	generateColor() {
		const hue = [...this.name].reduce((acc, char) => char.charCodeAt(0) + (acc * 32 - acc), 0);
		const hsl = `hsl(${hue % 360}, 50%, 50%)`;

		return hsl;
	}

	generateCodeName() {
		return this.name
			.match(/(?<=\s|\P{L}|^)\p{L}/gu)
			.join("")
			.toUpperCase();
	}

	generateAvatar() {
		const nameCode = this.generateCodeName();
		const backColor = this.generateColor();

		const nameCodeSize = this.ctx.measureText(nameCode);

		this.canvas.width = this.size;
		this.canvas.height = this.size;

		this.ctx.beginPath();
		this.ctx.fillStyle = backColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.font = `${this.canvas.width / 2 - nameCodeSize.width / 2}px ${this.font}`;
		this.ctx.fillStyle = "white";
		this.ctx.fillText(
			nameCode,
			this.canvas.width / 2,
			this.canvas.height / 2 + nameCodeSize.width / 4,
		);
		this.ctx.closePath();

		return this.canvas.toDataURL();
	}

	static getUrl(name, size, font) {
		const avatar = new AvatarCanvas(name, size, font);
		const url = avatar.generateAvatar();

		return url;
	}
}

export default AvatarCanvas;
