---
layout: post
title:  "Volleyball rotations explained"
date:   2020-06-13 10:00:00 +0000
categories: volley volleyball rotations libero setter hitter middle blocker attacker opposite outside hitter Haikyu
image: /assets/volley_rotations/thumbnail.png
---

Explanation of different volleyball rotations and guidelines on how to move around the court.

In light of my weekly games of volleyball being taken away from me I was left
without my only form of exercise. I filled this volleyball shaped hole in my
soul by watching [Haikyu!!](https://en.wikipedia.org/wiki/Haikyu!!) on
Netflix.

A stronger and better person than me would let the anime inspire them to do
some volleyball related strength training. Instead I ran to YouTube to binge
volleyball offensive system explanation videos. I was underwhelmed by the
amount of interactive system explorers there are online so I decided to make
one myself.

# Game rotations

At all times there are 6 players on every side of the court. Three in the
front row and three in the back row. Their positions are named 1-6, with 1
starting in the back right and continuing counter-clockwise to 6 in the middle
back.

![positions]({% link /assets/volley_rotations/positions.png %}){:.img-positions}

Before each serve players must not pass their direct neighbor to any of the
four sides e.g. they must be right of their left neighbor if they have one,
otherwise they are bound by the outside court lines. Failure to do so will
result in referee calling "out of rotation" fault and awarding a point to their
opponents.

Every time your team wins a point on your opponent's serve the players rotate
one spot clockwise (player on position 1 goes to 6, 6 goes to 5, 5 to 4,
etc.). This means that in total there are 6 different rotations that we have
to understand in order to play any offensive system.

# Player roles

**Setters** are the players that handles the ball the most. They are entitled
to every second touch during an attack, which they use to set the ball for the
hitters. In defense they cover the right side of the court by blocking while
in the front row and passing while in the back.

**Outside hitters** or **left side hitters** are players who hit and block on
the front left side of the court. They also pass from the left side of the
court and are usually one of the main receivers of opponent's serves.

**Middle blockers** or **middle attackers** thrive in the middle third of the
court. They are usually tall and use that height to block opposing attacks and
hit fast attacks. While in the back row they may be switched out in favor of
Libero or they might assume the defense of the middle of the court.

**Right side hitter** or **opposite hitter** is the player opposite to the
setter in the rotation. As their name implies they specialize in attacking
from the right side of the court. In the back row they also cover the right
side of the court.

**Libero** is a special player role used in defense. Unlike other players they
switch in and out as often as they please but that comes at a cost. They are
not allowed to serve, attack, or set the ball overhead within 3m of the net.
You will always notice them as the player on the team with a contrasting
uniform. They will usually switch out middle blockers when they rotate into
back row. Libero will always receive serves and try to pass opponent's spikes
from the middle of the court. Because libero is not allowed to serve they will
not be playing when it's middle blocker's turn to serve.

<div id="app">
	<div id="above-court">
	<select style="display: inline-block;" id="rotationTypeSelect" v-model="selection.type">
		<option :value="index" :key="index" v-for="(rotationType, index) in allRotations">${ rotationType.name }</option>
	</select>
	<h2 style="font-size: 2em; display: inline-block; margin-left: 0.2em;">system</h2>
	<div style="display: none">
		<select v-model="selection.rotation">
			<option :value="index-1" v-for="index in 6">Rotation ${ index }</option>
		</select>
		<select v-model="selection.gameState">
			<option
				:value="state"
				v-for="(state, index) in allGameStates"
			>${index+1}. ${state} </option>
		</select>
		<input type="checkbox" id="liberoCheckbox" v-model="selection.libero"/><label for="liberoCheckbox"> Libero </label>
		<input type="checkbox" id="serveCheckbox" v-model="selection.serve"/><label for="serveCheckbox"> Serve </label>
		<input type="checkbox" id="haikyuCheckbox" v-model="selection.haikyu"/><label for="haikyuCheckbox"> Haikyu </label>
	</div>
	<p v-if="currentRotation.name == '5-1'">
		The 5-1 rotation is played with one setter and 5 attackers. The setter is responsible for setting from both front and back row. Libero and both outside hitters are responsible for receiving serves in every rotation.
	</p>
	<p v-if="currentRotation.name == '4-2'">
    	The 4-2 rotation is played with two setters and four total attackers. The setter in the back row assumes a defensive role while the front row setter does the actual setting. Because the active setter is always in the front row all the passing and receiving can be done by the players in the back row.
	</p>
	<p v-if="currentRotation.name == '6-2'">
    	The 6-2 rotation is played with two setters and six total attackers - all six players act as attacker while in the front row. That includes the setter who in the front row assumes the role of right side hitter while the back row setter does the actual setting. Libero and both outside hitters are responsible for receiving serves in every rotation.
	</p>
	<p v-if="currentRotation.name == '6-6'">
    	The 6-0 rotation is most often played in amateur level volleyball. No player has a designated role or position. Players change roles every rotation with the middle player in the front row usually taking the role of the setter. This eliminates the need to change your position after a serve which is a welcome simplification in casual games.
	</p>
	<!-- Rotation title -->
	<h2> Rotation ${+selection.rotation+1} - ${thisStateName} </h2>
	<!-- Button to go to next game state -->
	<a class="button next" v-on:click.stop.prevent="setNextState"> Show ${ nextStateName } </a>
	</div>
	<div id="court">
		<div class="lecture">This is what it is and you can't deal with it</div>
		<!-- Court background -->
		<div class="lines full"></div>
		<div class="lines three"></div>
		<img class="net" src="{% link /assets/volley_rotations/net.png %}" alt="net"/>
		<!-- Rotate left and right -->
		<img
			class="rotate right"
			src="{% link /assets/volley_rotations/ccw_arrow.png %}"
			v-on:click="selection.rotation = (+selection.rotation + 1) % 6; selection.serve = true; selection.gameState = 'home';"
			alt="right"
		/>
		<img
			class="rotate left"
			v-on:click="selection.rotation = (+selection.rotation + 5) % 6; selection.serve = true; selection.gameState = 'home';"
			src="{% link /assets/volley_rotations/cw_arrow.png %}"
			alt="left"
		/>
		<!-- Players and ball -->
		<div
			class="player"
			:class="{active: trackPlayer == index, notActive: trackPlayer != null && trackPlayer != index}"
			v-on:click="trackPlayer == index ? trackPlayer = null : trackPlayer = index"
			:style="getStyle(player)"
			v-for="(player, index) in getDisplayPlayers()"
		>${ selection.haikyu ? '' : player.name }</div>
		<div class="ball" :style="getStyle(ball)"></div>
		<!-- Position lines -->
		<div class="position-limits" :style="line" v-for="line in trackedPlayerPositionLimits"></div>
		<!-- Switches -->
		<div
			title="Use libero"
			class="switch"
			:class="{down: !selection.libero}"
			style="bottom: 30%"
			v-on:click="selection.libero = !selection.libero"
		>
			<label>${["Middle ", "Libero"][+selection.libero]}</label>
			<span class="flip"></span>
			<span class="top">L</span>
			<span class="bottom">M</span>
		</div>
		<div
			title="Use Haikyu skin"
			class="switch"
			:class="{down: selection.haikyu}"
			style="bottom: 18%"
			v-on:click="selection.haikyu = !selection.haikyu"
		>
			<label>${["Names", "Haikyu"][+selection.haikyu]}</label>
			<span class="flip"></span>
			<span class="top">N</span>
			<span class="bottom haikyu-back"></span>
		</div>
		<!-- Mark areas -->
		<div v-if="selection.gameState == 'defend'" class="area pass">PASS</div>
		<div v-if="selection.gameState == 'defend'" class="area block">BLOCK</div>
		<div v-if="selection.gameState.endsWith('ttack')" class="area spike">SET & SPIKE</div>
		<div v-if="selection.gameState.endsWith('ttack')" class="area dig">DIG BLOCKED</div>
		<div v-if="selection.gameState == 'receive'" class="area pass">SERVE RECEIVE</div>
	</div>
	<div id="below-court">
	<!-- Navbars -->
	<div class="navbar rotations">
		<div
			:class="{active: index-1 == selection.rotation}"
			v-for="index in 6"
			v-on:click="selection.rotation = index-1;"
		>${index}</div>
	</div>
	<div class="navbar states">
		<div
			:class="{active: state.id == selection.gameState && selection.serve}"
			v-on:click="selection.gameState == state.id && selection.serve ? updatePlayers() : [selection.gameState, selection.serve] = [state.id, true]"
			v-for="state in gameStatesFlow.serve"
		>${ state.name }</div>
	</div>
	<div class="navbar states">
		<div
			:class="{active: state.id == selection.gameState && !selection.serve}"
			v-on:click="selection.gameState == state.id && !selection.serve ? updatePlayers() : [selection.gameState, selection.serve] = [state.id, false]"
			v-for="state in gameStatesFlow.receive"
		>${ state.name }</div>
	</div>
	<p v-if="selection.gameState == 'home'">
		These are the base positions for each player. There are precise rules describing required relative positions between adjacent players which you can see by <b>clicking on individual players</b>. If those rules are not adhered to at the start of the rally, the referee will call <i>out of rotation</i> fault and your opponent will get a point.
	</p>
	<p v-if="selection.gameState == 'serve'">
		When your team serves, the player in the back right position (${playerRoles.server !== undefined ? currentRotation.players[playerRoles.server] : 0}) goes to serve while other players can rearrange on the court in order to get closer to their desired positions. However, they still have to remain in the proper relative positions until the ball is served.
	</p>
	<p v-if="selection.gameState == 'defend'">
		When the ball is on your opponents' side your team prepares for their attack. The front row players will try to block their spiker at the net while the back row players will pass any ball that makes it through the block.
	</p>
	<p v-if="selection.gameState.endsWith('ttack')">
		After the first contact with the ball is made your team gets ready to attack. Setter runs to their designated spot on the center-right side of the net while the attackers take a few steps back to get ready to run in and spike. The setter then sets the ball to one of them to hopefully score a point while the back row players watch the ball to save it in case it gets blocked.
	</p>
	<p v-if="selection.gameState == 'firstAttack' && playerRoles.attackers.toString() != playerRoles.first_attackers.toString()">
		<b>Note:</b> after a serve receive the attackers in this rotation don't have enough time to get to their preferred attacking positions. That means that the attackers will be spiking from positions they are not as specialized in during the first attack.
	</p>
	<p v-if="selection.gameState == 'receive'">
		During a serve receive the players have to respect the relative positions described by the rotation. <b> Click on players </b> to see their bounds. Generally speaking the back row players are responsible for receiving the ball and the front row players try to position in a way to make the following attack as easy as possible.
		<span v-if="isBackRow(playerRoles.setter)">
			In this rotation the setter is in the back row. Because we don't want them to receive we move them out of the way and instead bring back the outside hitter from the front row to help with receiving.
		</span>
	</p>
	</div>
</div>

<style>
	.img-positions {
		float: right;
		width: 50%;
	}
	#rotationTypeSelect {
		font-size: 2em;
		background: none;
		border: none;
		display: block;
		font-family: monospace;
	}
	#court {
		width: 100%;
		position: relative;
		overflow: hidden;
		margin-bottom: -15%;
	}
	#court:after {
		content: "";
		display: block;
		padding-bottom: 100%;
	}
	#court img, #court > div {
		position: absolute;
	}
	#court .area {
		background-color: #D32F2F60;
		border: solid #D32F2F 1px;
		border-radius: 3em;
		display: flex;
		justify-content: center;
		width: 70%;
		left: 15%;
		font-weight: bold;
		box-sizing: border-box;
	}
	#court .area.pass {
		height: 27%;
		top: 45%;
	}
	#court .area.dig {
		height: 24%;
		top: 35%;
	}
	#court .area.block {
		align-items: flex-end;
		height: 23%;
		top: 3%;
	}
	#court .area.spike {
		align-items: flex-end;
		height: 28%;
		top: 3%;
		width: 85%;
		left: 7.5%;
	}
	#court .switch {
		left: 0%;
		width: 9.8%;
		height: 5%;
		border: solid 2px #D32F2F;
		border-radius: 100px;
		cursor: pointer;
		box-sizing: border-box;
	}
	#court .switch label {
		position: absolute;
		bottom: 100%;
		width: 100%;
		text-align: center;
		display: block;
		overflow: hidden;
	}
	#court .switch span {
		display: flex;
		position: absolute;
		width: 51%;
		height: 100%;
		justify-content: center;
		color: #D32F2F;
		align-items: center;
	}
	#court .switch .top {
		left: -1%;
		color: white;
	}
	#court .switch.down .top {
		color: #D32F2F;
	}
	#court .switch .bottom {
		right: 0;
		color: #D32F2F;
	}
	#court .switch .haikyu-back {
		background-image: url({% link /assets/volley_rotations/haikyu_short.png %});
		background-size: 80%;
		background-position: center;
		background-repeat: no-repeat;
	}
	#court .switch.down .bottom {
		color: white;
	}
	#court .switch .flip {
		width: 51%;
		height: 102%;
		left: -1%;
		border-radius: 100%;
		background-color: #D32F2F;
		top: -1%;
		transition: left 0.2s;
	}
	#court .switch.down .flip {
		left: 50%;
	}
	#court .position-limits {
		border: 1px dashed black;
		z-index: 4;
	}
	.next.button {
		background: #D32F2F;
		display: block;
		border: none;
		color: white;
		height: 60px;
		line-height: 60px;
		position: relative;
		cursor: pointer;
		text-decoration: none;
		text-align: center;
		font-size: 2em; 
		border-right: 30px solid #eee;
		padding-left: 5px;
		z-index: 15;
	}
	.next.button:after {
		content: "";
		position: absolute;
		left: 100%;
		border-width: 30px;
		border-color: transparent transparent transparent #D32F2F;
		border-style: solid;
		top: 0;
	}
	#court .lecture {
		z-index: 7;
		background: rgba(0, 0, 0, 0.8);
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 1em;
		color: white;
		display: none;
	}
	#court .net {
		left: 0;
		top: 2px;
	}
	#court .lines.three {
		height: 26.667%;
		border-bottom: 5px solid black;
	}
	#court .lines.full {
		height: 80%;
		border: 5px solid black;
	}
	#court .lines {
		box-sizing: border-box;
		width: 80%;
		left: 10%;
		top: 4%;
	}
	#court .player:hover {
		box-shadow: 0px 0px 50px 10px black;
		transform-origin: center center;
		transform: scale(1.1);
		z-index: 10;
	}
	#court .player, #court .ball {
		border-radius: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0px 0px 10px black;
		color: black;
		cursor: pointer;
		transition: left 2s, top 2s, box-shadow 1s, transform 1s, opacity 0.3s;
		background-size: cover;
	}
	#court .ball {
		width: 7%;
		height: 7%;
		z-index: 5;
		background-color: white;
		font-size: 30px;
		/*border:solid;*/
	}
	#court .player {
		width: 15%;
		height: 15%;
		background-color: #D32F2F;
		font-size: 55px;
		z-index: 3;
	}
	#court .player.active {
		box-shadow: 0px 0px 10px 5px #D32F2F;
		transform-origin: center center;
		transform: scale(1.05);
		z-index: 3;
	}
	#court .player.notActive {
		opacity: 0.7;
	}
	#court .rotate {
		top: 25%;
		height: 10%;
		cursor: pointer;
	}
	#court .rotate.left {
		right: 91%;
	}
	#court .rotate.right {
		left: 91%;
	}

	.navbar {
		height: 30px;
		display: flex;
	}
	.navbar > div {
		display: inline-block;
		position: relative;
		height: 100%;
		line-height: 30px;
		text-align: center;
		border: 1px solid #D32F2F;
		color: #D32F2F;
		box-sizing: border-box;
		cursor: pointer;
		flex: 1;
		font-size: 1.5em;
	}
	.navbar > div:not(:first-child) {
		border-left: none;
		padding-left: 15px;
	}
	.navbar > div:not(:last-child) {
		border-right: none;
	}
	.navbar > div:hover, .navbar > div.active {
		background: #D32F2F;
		color: white;
	}
	.navbar > div:not(:last-child):after, .navbar > div:not(:last-child):before {
		content:"";
		display:inline-block;
		position: absolute;
		z-index: 1;
		border-width: 15px;
		border-style: solid;
		border-right: none;
		width: 0px;
		height: 0px;
		left: 100%;
		top: -1px;
	}
   .navbar > div:not(:last-child):before{
		border-width: 14px;
		display: block;
		border-color: transparent transparent transparent #eeeeee;
		z-index: 2;
		top:0px;
	}
   .navbar > div:not(:last-child):after, .navbar > div:not(:last-child):hover:before , .navbar > div:not(:last-child).active:before {
		border-color: transparent transparent transparent #D32F2F;
	}

	@media(max-width: 500px) {
		#court .rotate {
			font-size: 3em;
		}
		#court .player {
			font-size: 30px;
		}

		.next.button {
			height: 30px;
			line-height: 30px;
			font-size: initial;
			border-right-width: 15px;
		}
		.next.button:after {
			border-width: 15px;
		}

		#court .switch {
			font-size: x-small;
		}

		.navbar > div {
			font-size: initial;
		}
	}
	@media(min-width: 1400px) {
		#app {
			width: 1333px;
			margin-left: -266px;
		}
		#above-court, #below-court {
			float: left;
			width: 530px;
		}
		#above-court {
			margin-top: 3em;
		}
		#court {
			float: right;
			width: 800px;
			margin-bottom: 0;
		}

		.next.button {
			margin-bottom: 1em;
		}
		.navbar.states + p {
			margin-top: 1em;
		}
	}

</style>
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="{% link /assets/volley_rotations/draw_court.js %}"></script>
