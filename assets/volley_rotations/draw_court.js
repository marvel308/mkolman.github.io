let colors = {
	L: "#ffee00",  // Yellow
	O: "#98b33e",  // Green
	M: "#bbade8",  // Light Purple
	R: "#6893fc",  // Light Blue
	S: "#497afa",  // Blue

};

const TIME_DELAY = 2000;

let homePositions = [
	[0.85, 0.8],
	[0.85, 0.1],
	[0.5, 0.1],
	[0.15, 0.1],
	[0.15, 0.8],
	[0.5, 0.8],
];

let allPositions = {
	server: [1, 1.23],
	setter: [0.8, 0.05],
	receivers: [[0.1, 0.7], [0.5, 0.8], [0.9, 0.7]],
	attackers: [[-0.1, 0.3], [0.5, 0.3], [1.1, 0.3]],
	spikers: [[0, 0], [0.5, 0], [1, 0]],
	blockers: [[0.1, 0], [0.5, 0], [0.9, 0]],
	passers: [[0.1, 0.7], [0.5, 0.8], [0.9, 0.7]],
	diggers: [[0.1, 0.5], [0.5, 0.6], [0.9, 0.5]],
};

class Rotation {
	constructor(rotation) {
		this.name = rotation.name;
		this.serve = rotation.serve; // legacy
		this.receive = rotation.receive; // legacy
		this.players = rotation.players;
		this.setter = rotation.setter;
		this.receivers = rotation.receivers;
		this.attackers = rotation.attackers;
		this.first_attackers = rotation.first_attackers;
		this.receive_stack = rotation.receive_stack;
		this.serve_stack = rotation.serve_stack;
		this.makeBlockers();
		this.makePassers();
		// Player -> Rotation -> State -> (x, y)
		// Player = 1...6
		// Rotation = 1...6
		// State = home, serve, receive, attack, defend
		this.initPositions();
		this.makePositions();
	}
	getPlayerPosition(player, rotation) {
		return (player + 6 - rotation) % 6;
	}
	initPositions() {
		// Set all positions to home to init
		this.playerPositions = [];
		for (let player = 0; player < 6; player++) {
			let rotationPositions = [];
			for (let rotation = 0; rotation < 6; rotation++) {
				let hp = homePositions[this.getPlayerPosition(player, rotation)];
				let pos = {home: hp, serve: hp, receive: hp, attack: hp, defend: hp, firstAttack: hp};
				rotationPositions.push(pos);
			}
			this.playerPositions.push(rotationPositions);
		}
	}
	makePassers() {
		this.passers = [];
		for (let rotation = 0; rotation < 6; rotation++) {
			this.passers.push([0, 0, 0]);
			for (let i = 0; i < 3; i++) {
				// Back row players (4, 5, 0), (5, 0, 1),...
				let player = (4 + i + rotation) % 6;
				let name = this.players[player];
				if (name == "O") this.passers[rotation][0] = player;
				else if (name == "M") this.passers[rotation][1] = player;
				else if (name == "S" || name == "R") this.passers[rotation][2] = player;
				else this.passers[rotation][i] = player; // Unnamed players don't have a set position
			}
		}
	}
	makeBlockers() {
		this.blockers = [];
		for (let rotation = 0; rotation < 6; rotation++) {
			this.blockers.push([0, 0, 0]);
			for (let i = 0; i < 3; i++) {
				// Front row players (1, 2, 3), (2, 3, 4),...
				let player = (1 + i + rotation) % 6;
				let name = this.players[player];
				if (name == "O") this.blockers[rotation][0] = player;
				else if (name == "M") this.blockers[rotation][1] = player;
				else if (name == "S" || name == "R") this.blockers[rotation][2] = player;
				else this.blockers[rotation][2-i] = player; // Unnamed players don't have a set position
			}
		}
	}
	makePositions() {
		for (let rotation = 0; rotation < 6; rotation++) {
			// Set attackers positions
			for (let i in this.attackers[rotation]) {
				let player = this.attackers[rotation][i];
				if (player === null) continue;
				this.playerPositions[player][rotation].attack = allPositions.attackers[i];
				this.playerPositions[player][rotation].attack_delayed = allPositions.spikers[i];
			}
			// Set first_attackers positions
			for (let i in this.first_attackers[rotation]) {
				let player = this.first_attackers[rotation][i];
				if (player === null) continue;
				this.playerPositions[player][rotation].firstAttack = allPositions.attackers[i];
				this.playerPositions[player][rotation].firstAttack_delayed = allPositions.spikers[i];
			}
			// Set receivers positions
			for (let i in this.receivers[rotation]) {
				let player = this.receivers[rotation][i];
				if (player === null) continue;
				this.playerPositions[player][rotation].receive = allPositions.receivers[i];
			}
			// Set passers positions
			for (let i in this.passers[rotation]) {
				let player = this.passers[rotation][i];
				if (player === null) continue;
				this.playerPositions[player][rotation].defend = allPositions.passers[i];
				this.playerPositions[player][rotation].attack = allPositions.diggers[i];
				this.playerPositions[player][rotation].firstAttack = allPositions.diggers[i];
			}
			// Set blockers positions
			for (let i in this.blockers[rotation]) {
				let player = this.blockers[rotation][i];
				if (player === null) continue;
				this.playerPositions[player][rotation].defend = allPositions.blockers[i];
			}
			// Set receive stacking
			for (let player in this.receive_stack[rotation]) {
				this.playerPositions[+player][rotation].receive = this.receive_stack[rotation][player];
			}
			// Set serve stacking
			for (let player in this.serve_stack[rotation]) {
				this.playerPositions[+player][rotation].serve = this.serve_stack[rotation][player];
			}
			// Set setter position
			let setter = this.setter[rotation];
			this.playerPositions[setter][rotation].attack = allPositions.setter;
			this.playerPositions[setter][rotation].firstAttack = allPositions.setter;
			// Set setter position
			let server = rotation;
			this.playerPositions[server][rotation].serve = allPositions.server;
		}
	}
}

function chooseRandom(choices, banned) {
  	let result;
  	do {
		result = choices[Math.floor(Math.random() * choices.length)];
  	} while (banned.includes(result));
	return result;
}

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

var app = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		selection: {
			type: "2",
			rotation: "0",
			libero: true,
			serve: true,
			haikyu: false,
			gameState: "home",
		},
		trackPlayer: null,
		allRotations: [],
		allGameStates: ["home", "serve", "receive", "defend", "attack", "firstAttack"],
		players: [
			{x: 0, y: 0, name: "", imgCount: 0}, {x: 0, y: 0, name: "", imgCount: 0},
			{x: 0, y: 0, name: "", imgCount: 0}, {x: 0, y: 0, name: "", imgCount: 0},
			{x: 0, y: 0, name: "", imgCount: 0}, {x: 0, y: 0, name: "", imgCount: 0},
		],
		ball: {x: -0.12, y: -0.05, img: "B", name: "B"},
		attackerReceiverId: 0,
		gameStatesFlow: {
			serve: [
				{id: "home", name: "start"},
				{id: "serve", name: "serve"},
				{id: "defend", name: "defend"},
				{id: "attack", name: "attack"},
			],
			receive: [
				// {id: "home", name: "start"},
				{id: "receive", name: "receive"},
				{id: "firstAttack", name: "attack"},
				{id: "defend", name: "defend"},
				{id: "attack", name: "attack"},
			],
		},
	},
	computed: {
		currentRotation() {
			if (this.allRotations.length == 0) { return {}; }
			let result = new Rotation(this.allRotations[+this.selection.type]);
			return result;
		},
		playerRoles() {
			let rot = +this.selection.rotation;
			return {
				setter: this.currentRotation.setter[rot],
				receivers: this.currentRotation.receivers[rot],
				attackers: this.currentRotation.attackers[rot],
				first_attackers: this.currentRotation.first_attackers[rot],
				passers: this.currentRotation.passers[rot],
				blockers: this.currentRotation.blockers[rot],
				server: rot,
			}
		},
		nextStateName() {
			let data = {
				home: ["receive", "serve"],
				serve: ["defense", "defense"],
				receive: ["attack", "attack"],
				defend: ["attack", "attack"],
				attack: ["next rotation", "receive rotation"],
				firstAttack: ["defense", "receive rotation"],
			};
			return data[this.selection.gameState][+this.selection.serve];
		},
		thisStateName() {
			let data = {
				home: ["start", "start"],
				serve: ["serve", "serve"],
				receive: ["serve receive", "serve receive"],
				defend: ["defense", "defense"],
				attack: ["attack", "attack"],
				firstAttack: ["attack", "attack"],
			};
			return data[this.selection.gameState][+this.selection.serve];
		},
		trackedPlayerPositionLimits() {
			if (this.trackPlayer == null || ["attack", "defend", "firstAttack"].includes(this.selection.gameState)) {
				return [];
			}
			let allLimits = {
				0: {top: 1, left: 5},
				1: {bottom: 0, left: 2},
				2: {bottom: 5, left: 3, right: 1},
				3: {bottom: 4, right: 2},
				4: {top: 3, right: 5},
				5: {top: 2, left: 4, right: 0},
			};
			this.trackPlayer = +this.trackPlayer;
			let posId = this.getPosition(this.trackPlayer);
			let player = this.players[this.trackPlayer];
			let limits = allLimits[posId];
			let lines = [], linesExtra = [];
			let START = -7.5/65, END = 1+7.5/65;
			let isServe = this.selection.gameState === "serve";
			if (isServe && posId == 0) {
				lines = [
					{primary: true, top: END, bottom: player.y, left: player.x, right: player.x},
					{primary: true, top: player.y, bottom: player.y, left: player.x, right: END},
					{primary: true, top: player.y, bottom: player.y, left: START, right: player.x},
				];
			} else {
				for (let key of ["top", "bottom", "left", "right"]) {
					let line = {top: player.y, bottom: player.y, left: player.x, right: player.x, primary: true};
					if (limits[key] === undefined || (isServe && limits[key] == 0)) {
						if (key == "top" || key == "left") line[key] = START;
						else line[key] = END;
					} else {
						let other = this.players[this.getIndex(limits[key])];
						if (key == "left" || key == "right") {
							line[key] = other.x;
							linesExtra.push({left: other.x, right: other.x,
								top: Math.min(other.y, player.y) - 0.05,
								bottom: Math.max(other.y, player.y) + 0.05 });
						} else {
							line[key] = other.y;
							linesExtra.push({top: other.y, bottom: other.y,
								left: Math.min(other.x, player.x) - 0.05,
								right: Math.max(other.x, player.x) + 0.05 });
						}
					}
					lines.push(line);
				}
			}
			let lineStyles = [];
			for (let r of lines.concat(linesExtra)) {
				let topLeft = this.coorToCourt(r.left, r.top);
				let bottomRight = this.coorToCourt(r.right, r.bottom);
				lineStyles.push({
					left: topLeft.centerLeft + "%",
					top: topLeft.centerTop + "%",
					right: 100 - bottomRight.centerLeft + "%",
					bottom: 100 - bottomRight.centerTop + "%",
					borderStyle: r.primary ? "solid" : "dashed",
					// borderWidth: r.pri ? "3px" : "1px",
					borderColor: r.primary ? "#d32f2f" : "black",
				});
			}
			return lineStyles;
		}
	},
	watch: {
		selection: {
			deep: true,
			handler() {
				if (!this.currentRotation.players) return;
				if (this.selection.serve && this.selection.gameState == "receive") {
					this.selection.gameState = "serve";
				}
				if (!this.selection.serve && this.selection.gameState == "serve") {
					this.selection.gameState = "receive";
				}
				this.setPlayerNames();
				this.updatePlayers();
				window.location.hash = window.encodeURI(JSON.stringify(this.selection));
			},
		},
	},
	created() {
		let self = this;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				self.allRotations = JSON.parse(this.responseText);
				self.setPlayerNames();
				self.updatePlayers();
				self.$forceUpdate();
			}
		};
		xmlhttp.open("GET", "/assets/volley_rotations/rotations.json", true);
		xmlhttp.send();
		if (window.location.hash.length > 2) {
			this.selection = JSON.parse(window.decodeURI(window.location.hash.substring(1)));
		}

	},
	methods: {
		getPlayerPos(playerId) {
			return this.currentRotation.playerPositions[playerId][+this.selection.rotation][this.selection.gameState];
		},
		getDelayedPlayerPos(playerId) {
			return this.currentRotation.playerPositions[playerId][+this.selection.rotation][this.selection.gameState+"_delayed"];
		},
		isBackRow(playerId) {
			return [4, 5, 0].includes(this.getPosition(playerId));
		},
		isFrontRow(playerId) {
			return [1, 2, 3].includes(this.getPosition(playerId));
		},
		setPlayerNames() {
			let imgCounter = {};
			for (let i = 0; i < 6; i++) {
				let name = this.currentRotation.players[i];
				let cnt = imgCounter[name] || 0;
				this.players[i].name = name;
				this.players[i].imgCount = cnt;
				imgCounter[name] = cnt+1;
			}
		},
		updatePlayers() {
			if (this.selection.gameState == "firstAttack") {
				this.attackerReceiverId =  chooseRandom(this.playerRoles.first_attackers, [null, this.playerRoles.setter]);
			} else if (this.selection.gameState == "attack") {
				this.attackerReceiverId =  chooseRandom(this.playerRoles.attackers, [null, this.playerRoles.setter]);
			} else if (this.selection.gameState == "defend") {
				this.attackerReceiverId =  chooseRandom(this.playerRoles.passers, [null, this.playerRoles.setter]);
			} else if (this.selection.gameState == "receive") {
				this.attackerReceiverId =  chooseRandom(this.playerRoles.receivers, [null, this.playerRoles.setter]);
			}
			let x=0, y=0;
			for (let playerId = 0; playerId < 6; playerId++) {
				let name = this.currentRotation.players[playerId];
				let posId = this.getPosition(playerId);
				[x, y] = this.getPlayerPos(playerId);
				this.moveObj(this.players[playerId], x, y);
				this.updateBall(playerId, posId, name, x, y);

				let delayPos = this.getDelayedPlayerPos(playerId);
				if (delayPos) {
					this.moveObj(this.players[playerId], delayPos[0], delayPos[1], TIME_DELAY);
				}
			}
		},
		updateBall(i, posId, name, x, y) {
			if (i == 0) {
				// This is independant of any coordinates
				if (this.selection.gameState == "home") {
					this.moveObj(this.ball, -0.12, -0.05);
				} else if (this.selection.gameState == "serve") {
					this.moveObj(this.ball, 1, 1.23);
					this.moveObj(this.ball, 0.5, -0.2, TIME_DELAY+500);
				} else if (this.selection.gameState == "receive") {
					this.moveObj(this.ball, 0.2, -0.2);
				} else if (this.selection.gameState == "defend") {
					this.moveObj(this.ball, 0.8, -0.2);
				} else if (this.selection.gameState.endsWith("ttack")) {
					this.moveObj(this.ball, 0.8, 0.15);
				}
			}

			// Take current state into account
			let myBall = i == this.attackerReceiverId;
			if (this.selection.gameState == "receive" && myBall) {
				this.moveObj(this.ball, x, y, TIME_DELAY);
			} else if (this.selection.gameState == "defend" && myBall) {
				this.moveObj(this.ball, x, y, TIME_DELAY);
			} else if (this.selection.gameState.endsWith("ttack")) {
				let attackers = this.selection.gameState == "attack"?this.playerRoles.attackers:this.playerRoles.first_attackers;
				let spikeX = [0, 0.5, 1][attackers.indexOf(this.attackerReceiverId)];
				if (myBall) {
					this.moveObj(this.ball, spikeX, 0, TIME_DELAY+10);
					this.moveObj(this.ball, (spikeX+0.4)%1, -0.2, TIME_DELAY*1.8);
				}
			}
		},
		moveObj(obj, x, y, timeout) {
			if (timeout) {
				setTimeout(() => {this.moveObj(obj, x, y)}, timeout);
			} else {
				obj.x = x;
				obj.y = y;
			}
		},
		coorToCourt(x, y) {
			// Court padding in %
			let courtLeft = 10,  courtTop = 4, courtSize = 80, playerDiameter = 15;
			result = {
				left: (courtLeft + (courtSize - playerDiameter) * x),
				top: (courtTop + (courtSize - playerDiameter) * y),
			};
			result.right = 100 - result.left - playerDiameter;
			result.bottom = 100 - result.top - playerDiameter;
			result.centerLeft = result.left + playerDiameter/2;
			result.centerTop = result.top + playerDiameter/2;
			return result;
		},
		getStyle(player) {
			let result = {};
			if (this.selection.haikyu || player.name == "B"){
				result.backgroundImage = "url(/assets/volley_rotations/team/"+player.img+".png)";
			} else {
				result.backgroundColor = player.color;
			}
			let court = this.coorToCourt(player.x, player.y);
			result.left = court.left + "%";
			result.top = court.top + "%";
			return result;
		},
		getPosition(id) {
			return (id+6-this.selection.rotation) % 6;
		},
		getIndex(position) {
			return (+this.selection.rotation+position) % 6;
		},
		getDisplayPlayers()  {
			let players = copy(this.players);
			for (let i = 0; i < 6; i++) {
				let posId = this.getPosition(i);
				let isBackRow = posId >= 4 || (posId == 0 && !this.selection.serve);
				if (isBackRow && this.selection.libero && players[i].name == "M") {
					players[i].name = "L";
					players[i].imgCount = "0";
				}
				players[i].img = players[i].name + players[i].imgCount;
				players[i].color = colors[players[i].name];
			}
			return players;
		},
		setNextState() {
			switch (this.selection.gameState) {
				case "home":
					if (this.selection.serve) {
						this.selection.gameState = "serve";
					} else {
						this.selection.gameState = "receive";
					}
					break;
				case "serve":
					this.selection.gameState = "defend";
					break;
				case "receive":
					this.selection.gameState = "firstAttack";
					break;
				case "defend":
					this.selection.gameState = "attack";
					break;
				case "attack":
					if (this.selection.serve) {
						this.selection.gameState = "receive";
						this.selection.serve = false;
					} else {
						this.selection.gameState = "home";
						this.selection.rotation = (+this.selection.rotation + 1) % 6;
						this.selection.serve = true;
					}
					break;
				case "firstAttack":
					if (this.selection.serve) {
						this.selection.gameState = "home";
						this.selection.serve = false;
					} else {
						this.selection.gameState = "defend";
					}
					break;
			}
		}
	}
});
