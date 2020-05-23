---
layout: post
title:  "Volleyball rotations explained"
date:   2020-04-26 10:00:00 +0000
categories: volley volleyball rotations libero setter hitter middle blocker Haikyu
---

If you know the positions but want to know their movements this is it.

In light of my weekly games of volleyball being taken away from me I was left
without my only form of exercise. I supplemented the volleyball shaped hole in
my soul by watching [Haikyu!!](https://en.wikipedia.org/wiki/Haikyu!!) on
Netflix.

A stronger and better person than me would let the anime inspire them to do some volleyball related strength training. Instead I ran to YouTube to binge volleyball rotations explanation videos and am now compiling this post.

<div id="app">
	<select id="rotationTypeSelect" v-model="selection.type">
		<option :value="index" v-for="(rotationType, index) in allRotations">${ rotationType.name }</option>
	</select>
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
		The 5-1 rotation is played with one setter and 5 attackers. The setter is responsible for setting from both front and back row.
	</p>
	<p v-if="currentRotation.name == '4-2'">
    	The 4-2 rotation is played with two setters and four total attackers. The setter in the back row assumes a defensive role while the front row setter does the actual setting.
	</p>
	<p v-if="currentRotation.name == '6-2'">
    	The 6-2 rotation is played with two setters and six total attackers. The setter in the front row assumes the role of right side hitter while the back row setter does the actual setting.
	</p>
	<div class="navbar rotations">
		<div
			:class="{active: index-1 == selection.rotation}"
			v-for="index in 6"
			v-on:click="selection.rotation = index-1; selection.serve = true; selection.gameState = 'home';"
		>${index}</div>
	</div>
	<div class="navbar states">
		<div
			:class="{active: state.id == selection.gameState}"
			v-on:click="selection.gameState == state.id ? updatePlayers() : selection.gameState = state.id"
			v-for="state in gameStatesFlow"
		>${ state.name }</div>
	</div>
	<div id="court">
		<div class="lecture">This is what it is and you can't deal with it</div>
		<!-- Court background -->
		<div class="lines full"></div>
		<div class="lines three"></div>
		<img class="net" src="{{'/assets/volley_rotations/net.png'}}" />
		<img class="haikyu" :class="{ fade: !selection.haikyu }" v-on:click="selection.haikyu = !selection.haikyu;" src="{{'/assets/volley_rotations/haikyu_logo.png'}}" />
		<!-- Rotate left and right -->
		<div
			class="rotate right"
			v-on:click="selection.rotation = (+selection.rotation + 1) % 6; selection.serve = true; selection.gameState = 'home';"
		>⤸</div>
		<div
			class="rotate left"
			v-on:click="selection.rotation = (+selection.rotation + 5) % 6; selection.serve = true; selection.gameState = 'home';"
		>⤹</div>
		<!-- Players and ball -->
		<div class="player" :style="getStyle(player)" v-for="player in getDisplayPlayers()">${ selection.haikyu ? '' : player.name}</div>
		<div class="ball" :style="getStyle(ball)"></div>
		<!-- Bottom left description and "next" button -->
		<div class="description">
			Serve ${ ["receive ", ""][+selection.serve] }rotation ${ +selection.rotation + 1 } <br>
			${ thisStateName } <br>
			<a class="button" v-on:click.stop.prevent="setNextState"> Show ${ nextStateName } </a>
		</div>
	</div>
</div>


<style>
	#rotationTypeSelect {
		font-size: 3em;
		background: none;
		border: none;
		display: block;
		font-family: monospace;
	}
	#court {
		width: 100%;
		position: relative;
		overflow: hidden;
	}
	#court:after {
		content: "";
		display: block;
		padding-bottom: 100%;
	}
	#court img, #court div {
		position: absolute;
	}
	#court .haikyu {
		right: 0;
		top: 84%;
		width: 11%;
		cursor: pointer;
		transition: width 0.5s;
	}
	#court .haikyu.fade {
		opacity: 0.5;
	}
	#court .haikyu:hover {
		width: 12%;
		opacity: 1;
	}
	#court .description {
		left: 0;
		bottom: 0;
		min-height: 15%;
		line-height: 1.0;

	    background-color: #eee;
	    box-shadow: 0 0 5px 5px #eee;
	}
	#court .description .button {
		background: #D32F2F;
		display: inline-block;
		border: none;
		color: white;
		height: 30px;
		line-height: 30px;
		padding-left: 8px;
		padding-right: 3px;
		position: relative;
		cursor: pointer;
		text-decoration: none;
	}
	#court .description .button:after {
		content: "";
		position: absolute;
		left: 100%;
		border-width: 15px;
		border-color: transparent transparent transparent #D32F2F;
		border-style: solid;
		top: 0;
	}
	#court .lecture {
		z-index: 5;
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
		transition: left 1s, top 1s, box-shadow 1s, transform 1s;
		background-size: cover;
	}
	#court .ball {
		width: 7%;
		height: 7%;
		z-index: 3;
		background-color: white;
		font-size: 30px;
		/*border:solid;*/
	}
	#court .player {
		width: 15%;
		height: 15%;
		background-color: #D32F2F;
		font-size: 55px;
	}
	#court .rotate {
		top: 30%;
		font-size: 5em;
		color: black;
		cursor: pointer;
		text-align: center;
	}
	#court .rotate.left {
		left: 0%;
		right: 90%;
	}
	#court .rotate.right {
		right: 0%;
		left: 90%;
		direction: rtl;
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
	}

</style>
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="{{'/assets/volley_rotations/draw_court.js'}}"></script>
