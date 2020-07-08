---
layout: post
title:  "Dancing with myself"
date:   2020-04-01 18:00:00 +0000
categories: GIMP photoshop party quarantine isolation
---

Don't let the limited number of people you live with in quarantine prevent you from appearing like a party animal on social media.

![party]({{"/assets/quarantine_party/party.jpg"}})

During the both boring and nerve-wrecking times of self isolation thrust upon us by a world pandemic our options of spending free time is severely limited. We can listen to [thematic music][playlist] and watch movies. But one thing we absolutely shouldn't do is go out and party with other people.

Above is the picture Pavla and I made to make it look like we partied harder than we ever did when the world wasn't in lockdown. Below are the steps to recreate the image.

[playlist]: https://music.youtube.com/playlist?list=PLpkaJOXe4OxFX6OEOaID0nJvKM2v3ffFK
[pandemic-movie]: https://www.imdb.com/title/tt3774802/

# Plan your scene out in advance

It might be tempting to just start shooting from the hip like [Rambo][rambo] and see where inspiration takes you. However, that's a good way to have to redo a lot of your work when you eventually mess up.

[rambo]: https://giphy.com/gifs/animated-rambo-gifmania-ql2lUYvISjpaE/fullscreen

At this point you want to decide on the camera position and location of all your characters. You should also place all the props that your room and characters might need. Empty bottles? Check. Guitar? Check.

Be careful when positioning everything. The back cast can accidentally be hidden by the people in front. Unless your goal is to create monsters different characters should not be occupying the same space. 

It's also worth mentioning that it's in your interest to have as little overlap as possible between different characters. Or you can aspire to make a crowded dance floor and curse your past self on the last step...

# Mount your camera

It's crucial that your camera doesn't move during the entirety of the photoshoot. If you have a tripod, that's brilliant. If you have a DSLR camera, maybe reading this whole post is a waste of time for you?

Our setup was strapping my Pixel 2 to a music stand using a capo. Yay, for having a musician in your household!

![Pixel]({{"/assets/quarantine_party/pixel.jpg"}})

You also have to make sure to not disturb the camera while taking photos. You can get a [custom trigger][remote], a [specialized app][timer-app], but we used Google assistant to trigger the camera using the command

> "Hey, Google, take a photo."

[remote]: https://www.amazon.co.uk/dp/B07515QVG6
[timer-app]: https://play.google.com/store/apps/details?id=com.vlysov.auto.selfie.camera&hl=en

# Take the photos

This should be a straight forward process. Change your props and clothes and take photos of every character. Make sure to take multiple backup photos so that photogenicity of your face doesn't catch you off guard and leave you without a usable photo.
 
![Guitar]({{"/assets/quarantine_party/guitar.gif"}}){:style='width:50%;'}![Groupie]({{"/assets/quarantine_party/groupie.gif"}}){:style='width:50%;'}
![Drinker]({{"/assets/quarantine_party/drinker.gif"}}){:style='width:50%;'}![Dancer]({{"/assets/quarantine_party/dancers.gif"}}){:style='width:50%;'}

It's extremely useful to have your photos automatically backed up to cloud or a service like [Google Photos](https://photos.google.com), so that you can check your photos on another device in real time.

# Combine photos

So you've shot all the photos and selected one favorite of every character. Now it's time to flex your image manipulation skills. My program of choice is the open-source [GIMP][gimp], Photoshop will do fine if you have it, you might even be able to use Microsoft Paint if you're a masochist. 

[gimp]: https://gimp.org

![Making of]({{"/assets/quarantine_party/making_of.gif"}})

Starting with the characters in the back stack all the photos into layers. Every time you add a new layer erase all parts of it that are covering the relevant parts on previous photos. Make sure to also include shadows and reflections of your characters, otherwise the whole scene is going to look off. Moreover you might want to add additional shadows where one character is covering up the source of light to another character.

<div id="toggleLayers">
	Show individual layers:
	<input type="checkbox" value="1" id="layer1" onchange="showhide(event)"><label for="layer1">1</label>
	<input type="checkbox" value="2" id="layer2" onchange="showhide(event)"><label for="layer2">2</label>
	<input type="checkbox" value="3" id="layer3" onchange="showhide(event)"><label for="layer3">3</label>
	<input type="checkbox" value="4" id="layer4" onchange="showhide(event)"><label for="layer4">4</label>
	<input type="checkbox" value="5" id="layer5" onchange="showhide(event)"><label for="layer5">5</label>
	<input type="checkbox" value="6" id="layer6" onchange="showhide(event)"><label for="layer6">6</label>
	<input type="checkbox" value="7" id="layer7" onchange="showhide(event)"><label for="layer7">7</label>
	<input type="checkbox" value="8" id="layer8" onchange="showhide(event)"><label for="layer8">8</label>
	<input type="checkbox" value="9" id="layer9" onchange="showhide(event)"><label for="layer9">9</label>
	<label onclick="hideAll()" title='Hide all'>⚪</label>
	<input type="checkbox" checked/>
	<label onclick="showAll()" title='Show all'>⚫</label>
</div>

<div id="display">
	<img src="/assets/quarantine_party/layers/bg.png" style="z-index: -1; position: relative;" alt="background">
</div>

That's it. You've successfully wasted a couple of hours in our meaningless journey towards death. If you're lucky, like us, you might even fool a couple of people into thinking you're an irresponsible twat that's actually hosting parties while you're supposed to be isolated.

<script>
	let allImages = {};
	function showhide(event) {
		console.log(event);
		let num = event.target.value;
		let show = event.target.checked;
		if (show && allImages[num] === undefined) {
			showPic(num);
		}
		if (!show && allImages[num] != undefined) {
			hidePic(num);
		}
	}
	function showPic(num) {
		allImages[num] = document.createElement('img');
		allImages[num].src = '{{"/assets/quarantine_party/layers/"}}' + num + '.png';
		allImages[num].style = 'z-index: ' + num;
		document.getElementById('display').appendChild(allImages[num]);
	}
	function hidePic(num) {
		allImages[num].remove();
		allImages[num] = undefined;
	}
	function showAll() {
		for (let i = 1; i <= 9; i++) {
			let inp = document.getElementById('layer' + i);
			if (!inp.checked) inp.click();
		}
	}
	function hideAll() {
		for (let i = 1; i <= 9; i++) {
			let inp = document.getElementById('layer' + i);
			if (inp.checked) inp.click();
		}
	}
</script>
<style>
	#display {
		width: 100%;
		position: relative;
	}
	#display img {
		position: absolute;
		top: 0;
		left: 0;
	}
	#toggleLayers input {
		display: none;
	}
	#toggleLayers input:checked + label {
	    background-color: #337ab7;
	    border-color: #2e6da4;
	}
	#toggleLayers label {
	    background-color: #5bc0de;
	    border-color: #46b8da;
	    color: white;
		cursor: pointer;
		display: inline-block;
		border-radius: 1em;
		border: 1px solid;
		width: 1.5em;
		height: 1.5em;
		text-align: center;
	}
</style>