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

<select id="typeSelector">
</select>
<select id="rotationSelector">
	<option value="0">Rotation 1</option>
	<option value="1">Rotation 2</option>
	<option value="2">Rotation 3</option>
	<option value="3">Rotation 4</option>
	<option value="4">Rotation 5</option>
	<option value="5">Rotation 6</option>
</select>
<select id="gameStateSelector">
	<option value="home">1. Home</option>
	<option value="stack">2. Stack</option>
	<option value="defend">3. Defend</option>
	<option value="attack">4. Attack</option>
</select>
<input type="checkbox" id="liberoCheckbox" checked/><label for="liberoCheckbox"> Libero </label>
<input type="checkbox" id="serveCheckbox" checked/><label for="serveCheckbox"> Serve </label>
<input type="checkbox" id="haikyuCheckbox"/><label for="haikyuCheckbox"> Haikyu </label>
<div class="navbar rotations">
	<div data-rotation="0">1</div><div data-rotation="1">2</div><div data-rotation="2">3</div><div data-rotation="3">4</div><div data-rotation="4">5</div><div data-rotation="5">6</div>
</div>
<div class="navbar states">
	<div data-serve="1" data-state="home">start</div><div data-serve="1" data-state="stack">serve</div><div data-serve="1" data-state="defend">defend</div><div data-serve="1" data-state="attack">attack</div>
</div>
<div class="navbar states">
	<div data-serve="0" data-state="home">start</div><div data-serve="0" data-state="stack">receive</div><div data-serve="0" data-state="attack">attack</div><div data-serve="0" data-state="defend">defend</div>
</div>
<div id="court">
	<div class="lecture">This is what it is and you can't deal with it</div>
	<div class="description">
		Serve receive rotation 1 <br>
		Start positions <br>
		<span class="button">Show receive</span>
	</div>
	<div class="lines full"></div>
	<div class="lines three"></div>
	<img class="net" src="{{'/assets/volley_rotations/net.png'}}" />
	<div class="rotate right">⤸</div>
	<div class="rotate left">⤹</div>
	<!-- <div class="player pos1">1</div>
	<div class="player pos2">2</div>
	<div class="player pos3">3</div>
	<div class="player pos4">4</div>
	<div class="player pos5">5</div>
	<div class="player pos6">6</div> -->
</div>
<script src="{{'/assets/volley_rotations/draw_court.js'}}" type="text/script"></script>

<style>
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
	#court .description {
		left: 0;
		top: 85%;
		line-height: 1.0;

	    background-color: #eee;
	    z-index: 3;
	     /*border-radius: 40%; */
	    box-shadow: 0 0 10px 10px #eee;
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
<script src="{{'/assets/volley_rotations/draw_court.js'}}"></script>
<!-- 10 | O(15) M(15) S(15) | 10-->