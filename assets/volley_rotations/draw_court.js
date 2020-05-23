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
		allRotations: [],
		allGameStates: ["home", "stack", "defend", "attack"],
		players: [
			{x: 0, y: 0, name: "", imgCount: 0}, {x: 0, y: 0, name: "", imgCount: 0},
			{x: 0, y: 0, name: "", imgCount: 0}, {x: 0, y: 0, name: "", imgCount: 0},
			{x: 0, y: 0, name: "", imgCount: 0}, {x: 0, y: 0, name: "", imgCount: 0},
		],
		ball: {x: -0.12, y: -0.05, img: "B", name: "B"},
		attackerReceiverName: "M",
	},
	computed: {
		gameStatesFlow() {
			if (this.selection.serve) {
				// Serving: serve rotation
				return [
					{id: "home", name: "start"},
					{id: "stack", name: "serve"},
					{id: "defend", name: "defend"},
					{id: "attack", name: "attack"},
				];
			} else {
				// Not serving: receive rotation
				return [
					{id: "home", name: "start"},
					{id: "stack", name: "receive"},
					{id: "attack", name: "attack"},
					{id: "defend", name: "defend"},
				];
			}
		},
		currentRotation() {
			if (this.allRotations.length == 0) { return {}; }
			return this.allRotations[+this.selection.type]
		},
		stackPositions() {
			if (this.allRotations.length == 0) { return []; }
			if (this.selection.serve) {
				return this.currentRotation.serve[this.selection.rotation];
			} else {
				return this.currentRotation.receive[this.selection.rotation];
			}
		},
		gamePositions() {
			if (this.allRotations.length == 0) { return {}; }
			return updateObject(gamePositions, this.currentRotation.game);
		},
		defensePositions() {
			return this.gamePositions.defense;
		},
		attackPositions() {
			return this.gamePositions.attack;
		},
		nextStateName() {
			let data = {
				home: ["receive", "serve"],
				stack: ["attack", "defense"],
				defend: ["next rotation", "attack"],
				attack: ["defense", "receive rotation"],
			};
			return data[this.selection.gameState][+this.selection.serve];
		},
		thisStateName() {
			let data = {
				home: ["Start positions", "Start positions"],
				stack: ["Serve receive positions", "Serve positions"],
				defend: ["Defense positions", "Defense positions"],
				attack: ["Attack positions", "Attack positions"],
			};
			return data[this.selection.gameState][+this.selection.serve];
		}
	},
	watch: {
		selection: {
			deep: true,
			handler(old, updated) {
				this.setPlayerNames();
				this.updatePlayers();
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
	},
	methods: {
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
			let getterMap = {
				home: (i, p) => { return this.getHomeCoor(i, p); },
				stack: (i, p) => { return this.getStackCoor(i, p); },
				attack: (i, p) => { return this.getAttackCoor(i, p); },
				defend: (i, p) => { return this.getDefenseCoor(i, p); },
			};
			this.attackerReceiverName = "OM"[Math.round(Math.random())];
			let x=0, y=0, getter=getterMap[this.selection.gameState];
			for (let i = 0; i < 6; i++) {
				let name = this.currentRotation.players[i];
				let posId = this.getPosition(i);
				[x, y] = getter(i, posId);
				this.moveObj(this.players[i], x, y);
				this.updateBall(i, posId, name, x, y);
			}
		},
		updateBall(i, posId, name, x, y) {
			if (i == 0) {
				// This is independant of any coordinates
				if (this.selection.gameState == "home") {
					this.moveObj(this.ball, -0.12, -0.05);
				} else if (this.selection.gameState == "stack" && this.selection.serve) {
					this.moveObj(this.ball, 1, 1.23);
					this.moveObj(this.ball, 0.5, -0.2, 2000);
				} else if (this.selection.gameState == "stack" && !this.selection.serve) {
					this.moveObj(this.ball, 0.2, -0.2);
				} else if (this.selection.gameState == "defend") {
					this.moveObj(this.ball, 0.8, -0.2);
				} else if (this.selection.gameState == "attack") {
					this.moveObj(this.ball, 0.8, 0.15);
				}
			}

			// Take current state into account
			let amReceiver = name == this.attackerReceiverName && (posId >= 4 || posId == 0);
			let amAttacker = name == this.attackerReceiverName && (0 < posId && posId < 4);
			if (this.selection.gameState == "stack" && !this.selection.serve && amReceiver) {
				this.moveObj(this.ball, x, y, 1000);
			} else if (this.selection.gameState == "defend" && amReceiver) {
				this.moveObj(this.ball, x, y, 1000);
			} else if (this.selection.gameState == "attack") {
				let spikeX = {M: 0.5, O: 0, R: 1, S: 1}[name];
				if (y == 0.3) {
					this.moveObj(this.players[i], spikeX, 0, 1000);
				}
				if (amAttacker) {
					this.moveObj(this.ball, spikeX, 0, 1010);
					this.moveObj(this.ball, 0.5, -0.4, 1800);
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
		getHomeCoor(i, posId) {
			return homePositions[posId];
		},
		getStackCoor(i, posId) {
			return [this.stackPositions[posId].x, this.stackPositions[posId].y];
		},
		getAttackCoor(i, posId, ) {
			let coor = this.attackPositions[this.players[i].name];
			if (posId >= 4 || posId == 0) { return coor.back; }
			else { return coor.front; }
		},
		getDefenseCoor(i, posId, ) {
			let coor = this.defensePositions[this.players[i].name];
			if (posId >= 4 || posId == 0) { return coor.back; }
			else { return coor.front; }
		},
		getStyle(player) {
			let result = {};
			if (this.selection.haikyu || player.name == "B"){
				result.backgroundImage = "url(/assets/volley_rotations/team/"+player.img+".png)";
			} else {
				result.backgroundColor = player.color;
			}

			// Court padding in %
			let courtLeft = 10, courtRight = 10, courtTop = 4, courtBottom = 16, playerDiameter = 15;
			result.left = (courtLeft + (100 - courtLeft - courtRight - playerDiameter) * player.x) + "%";
			result.top = (courtTop + (100 - courtTop - courtBottom - playerDiameter) * player.y) + "%";
			return result;
		},
		getPosition(id) {
			return (id+6-this.selection.rotation) % 6;
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
					this.selection.gameState = "stack";
					break;
				case "stack":
					if (this.selection.serve) {
						this.selection.gameState = "defend";
					} else {
						this.selection.gameState = "attack";
					}
					break;
				case "defend":
					if (this.selection.serve) {
						this.selection.gameState = "attack";
					} else {
						this.selection.gameState = "home";
						this.selection.rotation = (+this.selection.rotation + 1) % 6;
						this.selection.serve = true;
					}
					break;
				case "attack":
					if (this.selection.serve) {
						this.selection.gameState = "home";
						this.selection.serve = false;
					} else {
						this.selection.gameState = "defend";
					}
					break;
			}
		},
	}
});