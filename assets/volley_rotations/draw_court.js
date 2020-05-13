let colors = {
	"L": "#ffee00",  // Yellow
	"O": "#98b33e",  // Green 
	"M": "#bbade8",  // Light Purple
	"R": "#6893fc",  // Light Blue
	"S": "#497afa",  // Blue

};

let homePositions = [
	[0.85, 0.8],
	[0.85, 0.1],
	[0.5, 0.1],
	[0.15, 0.1],
	[0.15, 0.8],
	[0.5, 0.8],
];
let gamePositions = {
	"defense": {
		"L": {
			"back": [0.5, 0.8]
		},
		"M": {
			"back": [0.5, 0.8],
			"front": [0.5, 0.0]
		},
		"R": {
			"back": [0.9, 0.7],
			"front": [0.9, 0.0]
		},
		"S": {
			"back": [0.9, 0.7],
			"front": [0.9, 0.0]
		},
		"O": {
			"back": [0.1, 0.7],
			"front": [0.1, 0.0]
		}
	},
	"attack": {
		"L": {
			"back": [0.5, 0.8]
		},
		"M": {
			"back": [0.5, 0.8],
			"front": [0.5, 0.3]
		},
		"R": {
			"back": [0.9, 0.7],
			"front": [1.1, 0.3]
		},
		"S": {
			"back": [0.9, 0.7],
			"front": [1.1, 0.3]
		},
		"O": {
			"back": [0.1, 0.7],
			"front": [-0.1, 0.3]
		}

	}
};

function copy(obj) {
	return JSON.parse(JSON.stringify(obj));
}
function updateObject(initial, update) {
	let result = copy(initial);
	for (let prop in update) {
		if(typeof initial[prop] === 'object' && typeof update[prop] === 'object') {
			result[prop] = updateObject(result[prop], update[prop]);
		} else {
			result[prop] = copy(update[prop]);
		}
	}
	return result;
}
class Player {
	/* constructor creates a new div.player and appends it to #court
	x and y are 0-1 and will be normalized to absolute
	left: and top: css attributes
	*/
	constructor(x, y, txt) {
		this.element = document.createElement("div");
		this.court = document.getElementById("court");
		this.move(x, y, txt);
		this.element.className += "player";
		this.court.appendChild(this.element);
		// this.enableDraggable();
	}
	enableDraggable() {
		let self = this;
		let courtSize = this.court.getBoundingClientRect().width*0.65;
		let mouseX = 0, mouseY = 0;

		function drag(event) {
			event.preventDefault();
			let x = event.pageX, y = event.pageY;
			self.move(self.x + (x-mouseX)/courtSize, self.y + (y-mouseY)/courtSize);
			mouseX = x;
			mouseY = y;
		}
		function cleanup(event) {
			self.court.removeEventListener("mousemove", drag);
			self.court.removeEventListener("mouseup", cleanup);
			self.court.removeEventListener("mouseleave", cleanup);
		}
		this.element.addEventListener("mousedown", (event) => {
			mouseX = event.pageX;
			mouseY = event.pageY;
			courtSize = this.court.getBoundingClientRect().width*0.65;
			this.court.addEventListener("mousemove", drag);
			this.court.addEventListener("mouseup", cleanup);
			this.court.addEventListener("mouseleave", cleanup);
		})
	}
	// Position the player element according to this.x and this.y
	move(x, y, txt, delay) {
		if (delay) {
			setTimeout(() => { this.move(x, y, txt); }, delay);
			return;
		}
		this.x = x;
		this.y = y;
		if (txt) {
			if (colors[txt]){
				this.element.style.backgroundColor = colors[txt];
				this.element.innerText = txt;
				this.element.style.backgroundImage = "";
			} else {
				this.element.innerText = "";
				this.element.style.backgroundImage = "url(/assets/volley_rotations/team/"+txt+".png)";
			}
		}
		// Court padding in %
		let courtLeft = 10, courtRight = 10, courtTop = 4, courtBottom = 16, playerDiameter = 15;
		this.element.style.left = (courtLeft + (100 - courtLeft - courtRight - playerDiameter) * this.x) + "%";
		this.element.style.top = (courtTop + (100 - courtTop - courtBottom - playerDiameter) * this.y) + "%";
	}

	// Delete all "#court div.player" elements
	static clearAll() {
		let players = document.querySelectorAll("#court div.player");
		players.forEach(player => {player.remove()});
	}
}

class Ball extends Player {
	constructor(x, y) {
		super(x, y, "B");
		this.element.className = "ball";
	}
}

class Team {
	constructor(typeData, type, rotation, hasLibero, isServe, gameState, haikyuSkin) {
		this.players = [];
		for (let i = 0; i < 6; i++) { this.players.push(new Player(homePositions[i][0], homePositions[i][1], typeData.players[i])); }
		this.ball = new Ball(-0.15, -0.05);
		this.init(typeData, type, rotation, hasLibero, isServe, gameState, haikyuSkin);
	}
	init(typeData, type, rotation, hasLibero, isServe, gameState, haikyuSkin) {
		this.typeData = typeData;
		this.type = type;
		this.rotation = +rotation;
		this.hasLibero = hasLibero;
		this.isServe = isServe;
		this.gameState = gameState;
		this.haikyuSkin = haikyuSkin;
		this.gamePositions = updateObject(gamePositions, this.typeData.game);
		if (isServe) {
			this.stackPositions = typeData.serve[this.rotation];
		} else {
			this.stackPositions = typeData.receive[this.rotation];
		}
		this.attackerReceiverName = "OM"[Math.round(Math.random())];
	}
	updatePlayers() {
		let imgCounter = {};
		let getterMap = {
			home: (i, p) => { return this.getHomeCoor(i, p); },
			stack: (i, p) => { return this.getStackCoor(i, p); },
			attack: (i, p) => { return this.getAttackCoor(i, p); },
			defend: (i, p) => { return this.getDefenseCoor(i, p); },
		};
		let x=0, y=0, getter=getterMap[this.gameState];
		for (let i = 0; i < 6; i++) {
			let name = this.typeData.players[i];
			let posId = (i+6-this.rotation) % 6;
			let isBackRow = posId >= 4 || (posId == 0 && !this.isServe);
			let cnt = "";
			if (this.haikyuSkin) {
				cnt = imgCounter[name] || 0;
				imgCounter[name] = cnt + 1;
			}
			if (isBackRow && this.hasLibero && name == "M") {
				name = "L";
			}
			[x, y] = getter(i, posId);
			this.players[i].move(x, y, name+cnt);
			this.updateBall(i, posId, name, x, y);
		}
	}
	updateBall(i, posId, name, x, y) {
		if (i == 0) {
			// This is independant of any coordinates
			if (this.gameState == "home") {
				this.ball.move(-0.12, -0.05);
			} else if (this.gameState == "stack" && this.isServe) {
				this.ball.move(1, 1.23);
				this.ball.move(0.5, -0.2, null, 2000);
			} else if (this.gameState == "stack" && !this.isServe) {
				this.ball.move(0.2, -0.2);
			} else if (this.gameState == "defend") {
				this.ball.move(0.8, -0.2);
			} else if (this.gameState == "attack") {
				this.ball.move(0.8, 0.15);
			}
		}

		// Take current state into account
		let amReceiver = (name == this.attackerReceiverName || (this.attackerReceiverName == "M" && name == "L")) && (posId >= 4 || posId == 0);
		let amAttacker = name == this.attackerReceiverName && (0 < posId && posId < 4);
		if (this.gameState == "stack" && !this.isServe && amReceiver) {
			this.ball.move(x, y, null, 1000);
		} else if (this.gameState == "defend" && amReceiver) {
			this.ball.move(x, y, null, 1000);
		} else if (this.gameState == "attack") {
			let spikeX = {M: 0.5, O: 0, R: 1, S: 1}[name];
			if (y == 0.3) {
				this.players[i].move(spikeX, 0, null, 1000)
			}
			if (amAttacker) {
				this.ball.move(spikeX, 0, null, 1000)
				this.ball.move(0.5, -0.4, null, 1800);
			}
		}

	}
	getHomeCoor(i, posId) {
		let x = homePositions[posId][0], y = homePositions[posId][1];
		return [x, y];
	}
	getStackCoor(i, posId) {
		let x = this.stackPositions[posId].x, y = this.stackPositions[posId].y;
		return [x, y];
	}
	getAttackCoor(i, posId, ) {
		let coor = this.gamePositions.attack[this.typeData.players[i]];
		if (posId >= 4 || posId == 0) { return coor.back; }
		else { return coor.front; }
	}
	getDefenseCoor(i, posId, ) {
		let coor = this.gamePositions.defense[this.typeData.players[i]];
		if (posId >= 4 || posId == 0) { return coor.back; }
		else { return coor.front; }
	}
	updatePositions() {
		return this.typeData;
		if (this.players.length != 6) {
			return this.typeData;
		}
		for (let i = 0; i < 6; i++) {
			this.stackPositions[i] = {
				x: this.players[i].x,
				y: this.players[i].y,
			}
		}
		if (this.isServe) {
			this.typeData.serve[this.rotation] = this.stackPositions;
		} else {
			this.typeData.receive[this.rotation] = this.stackPositions;
		}
		return this.typeData;
	}
}

class Rotations {
	constructor() {
		this.loadRotations();
	}
	loadRotations() {
		let self = this;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				self.rotations = JSON.parse(this.responseText);


				// self.rotations[2].serve[0] = self.rotations[1].serve[0];
				// self.rotations[2].receive[0] = self.rotations[1].receive[0];

				// self.rotations[2].serve[1] = self.rotations[1].serve[1];
				// self.rotations[2].receive[1] = self.rotations[1].receive[1];

				// self.rotations[2].serve[2] = self.rotations[1].serve[2];
				// self.rotations[2].receive[2] = self.rotations[1].receive[2];

				// self.rotations[2].serve[3] = self.rotations[0].serve[1];
				// self.rotations[2].receive[3] = self.rotations[0].receive[1];

				// self.rotations[2].serve[4] = self.rotations[0].serve[2];
				// self.rotations[2].receive[4] = self.rotations[0].receive[2];

				// self.rotations[2].serve[5] = self.rotations[0].serve[3];
				// self.rotations[2].receive[5] = self.rotations[0].receive[3];

				// for (let type in self.rotations) {
				// 	for (let i = 0; i < 3; i++) {
				// 		self.rotations[type].serve[i+3] = self.rotations[type].serve[i];
				// 		self.rotations[type].receive[i+3] = self.rotations[type].receive[i];
				// 	}
				// }
				loadInterface(self.rotations);
				Player.clearAll();
				self.makeTeam();
			}
		};
		xmlhttp.open("GET", "/assets/volley_rotations/rotations.json", true);
		xmlhttp.send();
	}
	makeTeam() {
		if (this.team) {
			this.rotations[this.team.type] = this.team.updatePositions();
		}
		let data = this.getSelections();
		if (this.team) {
			this.team.init(this.rotations[data.type], data.type, data.rotation, data.libero, data.serve, data.state, data.haikyu);
		} else {
			this.team = new Team(this.rotations[data.type], data.type, data.rotation, data.libero, data.serve, data.state, data.haikyu);
		}
		this.team.updatePlayers();
		sertActiveNavBar(data.rotation, data.serve, data.state);
	}

	getSelections() {
		let result = {
			type: document.getElementById("typeSelector").value,
			rotation: document.getElementById("rotationSelector").value,
			libero: document.getElementById("liberoCheckbox").checked,
			serve: document.getElementById("serveCheckbox").checked,
			state: document.getElementById("gameStateSelector").value,
			haikyu: document.getElementById("haikyuCheckbox").checked,
		};
		return result;
	}
}


function loadInterface(rotations) {
	let typeSelect = document.getElementById("typeSelector");
	for (let i in rotations) {
		typeSelect.innerHTML = `<option value="${i}">${rotations[i].name}</option>`+typeSelect.innerHTML;
	}
}

function sertActiveNavBar(rotation, isServe, gameState) {
	document.querySelectorAll("div.navbar div.active").forEach(nav => {
		nav.className = "";
	});
	let selector = 'div.navbar.states div[data-serve="{serve}"][data-state="{state}"]'
		.replace("{serve}", +isServe)
		.replace("{state}", gameState);
	// if (gameState != "home") {
	document.querySelector(selector).className = "active";
	// }
	selector = 'div.navbar.rotations div[data-rotation="{rot}"]'
		.replace("{rot}", rotation);
	document.querySelector(selector).className = "active";
}


function setup() {
	rotations = new Rotations();
	document.getElementById("typeSelector").addEventListener("change", () => {rotations.makeTeam()});
	document.getElementById("rotationSelector").addEventListener("change", () => {rotations.makeTeam()});
	document.getElementById("liberoCheckbox").addEventListener("change", () => {rotations.makeTeam()});
	document.getElementById("serveCheckbox").addEventListener("change", () => {rotations.makeTeam()});
	document.getElementById("haikyuCheckbox").addEventListener("change", () => {rotations.makeTeam()});
	document.getElementById("gameStateSelector").addEventListener("change", () => {rotations.makeTeam()});
	document.querySelectorAll("div.navbar.states div").forEach(nav => {
		let data = nav.dataset;
		nav.addEventListener("click", () => {
			document.getElementById("serveCheckbox").checked = data.serve === "1";
			document.getElementById("gameStateSelector").value = data.state;
			rotations.makeTeam();
		});
	});
	function setRotation(rotation) {
		document.getElementById("serveCheckbox").checked = true;
		document.getElementById("gameStateSelector").value = "home";
		document.getElementById("rotationSelector").value = rotation;
		rotations.makeTeam();
	}
	document.querySelectorAll("div.navbar.rotations div").forEach(nav => {
		let data = nav.dataset;
		nav.addEventListener("click", () => { setRotation(data.rotation); });
	});
	document.querySelector("#court div.rotate.left").addEventListener("click", () => {
		let rot = document.getElementById("rotationSelector");
		setRotation((+rot.value + 5) % 6);
	});
	document.querySelector("#court div.rotate.right").addEventListener("click", () => {
		let rot = document.getElementById("rotationSelector");
		setRotation((+rot.value + 1) % 6);
	});
	players = [
		new Player(0.15, 0.1),
		new Player(0.50, 0.1),
		new Player(0.85, 0.1),
		new Player(0.15, 0.8),
		new Player(0.50, 0.8),
		new Player(0.85, 0.8),
	];
}

setup();
