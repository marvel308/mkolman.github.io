---
layout: post
title:  "How fast do you have to drive to turn red traffic lights green?"
date:   2020-07-06 10:00:00 +0000
categories: relativistic Doppler effect red shift blue shift green color transform image
math: yes
image: /assets/relativistic_doppler/thumbnail.png
---

Items moving at velocities comparable to the speed of light will look very
different for the split second before they leave Earth forever. Upload any
image to see how it would change if it were moving at astronomical speeds and
dive into the world of relativism and color.

<style>
.velocity-labels {
	display: flex;
	justify-content: space-between;
	position: relative;
	margin-left: 0.5em;
	margin-right: 0.5em;
}
.velocity-labels div {
	width: 1em;
	text-align: center;
}
.velocity-labels div::before {
	position: absolute;
	content: attr(data-value);
	width: 0px;
	top: -0.5em;
	height: 0.5em;
	left: var(--left);
	border-left: 1px black solid;
}
.velocity-labels .small {
	display: none;
}
@media(max-width: 500px) {
	.velocity-labels .big {
		display: none;
	}
	.velocity-labels div.small {
		display: inline-block;
	}
}
center {
	margin-bottom: 1em;
}
</style>

# Image at <span class="velocityLabel">0</span>% the speed of light*
<button>
	<label for="uploadimage"> Upload a custom image </label>
</button>
<label for="uploadimage"> <span id="filename">default.png</span></label>
<input type="file" id="uploadimage" style="visibility: hidden;" onchange="loadImg()" accept="image/*" />

Wow, it's TOO BIG. I made the picture smaller. <a href="#image-at-0-the-speed-of-light" onclick="showBigImg()">I want it big!</a>
{: id="oversized" style="display: none;"}

<div class="velocity-labels">
	<span>← away <span class="big">from the image</span></span>
	<span>towards <span class="big">the image</span> →</span>
</div>
<input type="range" min="-50" max="50" id="velocity" style="width: 100%; margin: 0;" />
{: style="margin: 0;"}
<div class="velocity-labels">
	<div style="--left: 0%;">-50%</div>
	<div style="--left: 10%;" class="big">-40%</div>
	<div style="--left: 20%;" class="big">-30%</div>
	<div style="--left: 25%;" class="small">-25%</div>
	<div style="--left: 30%;" class="big">-20%</div>
	<div style="--left: 40%;" class="big">-10%</div>
	<div style="--left: 50%;">&nbsp;0%</div>
	<div style="--left: 60%;" class="big">10%</div>
	<div style="--left: 70%;" class="big">20%</div>
	<div style="--left: 75%;" class="small">25%</div>
	<div style="--left: 80%;" class="big">30%</div>
	<div style="--left: 90%;" class="big">40%</div>
	<div style="--left: 100%;">50%</div>
</div>
<canvas id="canvas" width="740" height="497" style="max-width: 100%; margin: auto; display: block;"></canvas>
<a onclick="downloadCanvas();" download="download" id="download">Download as png</a>

_*This is probably not how this scene would look like in real life going <span
class="velocityLabel">0</span>% the speed of light. But it is how this image
displayed on an RGB screen would look like._

Above you can experiment with the premise of the title. It can help you get a
feeling for what are the velocities involved at which colors start to change.
You might even be able to answer the question but read on if you want to
understand that answer as well.

# What even is color?

Questioning color is something you'd expect to do after injecting too many
marijuanas and not while reading this respectable source of science truths.
However it's imperative that we understand the basics before we go on.

Visible light represent a small section of all electromagnetic spectrum at the
380nm - 700nm wavelength range. Its immediate neighbors are ultraviolet (UV:
10nm - 400nm) and infrared (IR: 700nm - 1mm) light. Other members on the
spectrum are:

* Gamma rays (< 0.01nm)
* X-rays (0.01nm - 10nm)
* Microwaves (1mm - 1m)
* Radiowaves (> 1m)

Thankfully for us, our eyes are borderline magic and can detect some types of
light. Our color vision is made possible by three types of cones that are
sensitive to different wavelengths. Together they trick our brain into seeing
different wavelengths of light as different colors as shown below.

<center>
<img src="{% link /assets/relativistic_doppler/visiblespectrum.png %}" alt="visiblespectrum"/>
<br>
<i>Colors in the visible spectrum at different wavelengths. The shortest wavelengths we can see are violets around 400nm all the way to the red at 700nm.</i>
</center>

At this point I want to reiterate the question in the title of this post. A
red traffic light is shining light at around 650nm. Why would it ever appear
green if there is no light present with wavelengths between 500nm and 550nm?

# Doppler effect

Chances are you already _heard_ of the regular Doppler effect and how it
affects sound. It's why an ambulance siren sounds different depending if the
ambulance is driving towards us or away from us. That can be especially
noticeable when it drives past us.

**Note:** Don't hurt yourself and call an ambulance to test this. The effect
is not present if you're inside the car so you should hurt other people close
by instead.

<center>
<audio controls>
	<source src="https://www.cora.nwra.com/~werne/eos/sound/ambulance.wav" type="audio/x-wav">
</audio>
<br>
<i>Sound of an ambulance siren passing by. <a href="https://www.cora.nwra.com/~werne/eos/text/doppler_effect.html">Source.</a></i>
</center>

Just like how a sound changes when its source is moving, light also changes if
its source is moving. To actually notice the change in either, the speeds
involved have to be comparable (think at least a couple percent) to their
respective speeds.

## Relativistic Doppler effect

Sound travels through air at 343 meters per second (= 767.3&#8239;mph =
1234.8&#8239;km/h). [Humans can reach 2-3% of that on foot][bolt_speed] and we
have exceeded the speed of sound both on [land][wiki_land] and
[air][goog_air].

[bolt_speed]: https://www.google.com/search?q=Usain%20Bolt%27s%20top%20speed
[wiki_land]: https://en.wikipedia.org/wiki/Land_speed_record#1963%E2%80%93present_(jet_and_rocket_propulsion)
[goog_air]: https://www.google.com/search?q=lockheed%20sr-71%20blackbird%20top%20speed

The speed of light, however, has few more zeros at roughly
300&#8239;000&#8239;000&#8239;m/s (~1 billion&#8239;km/h or ~671
million&#8239;mph). And the fastest human made object is [NASA's Parker Solar
Probe][nasa] which will reach its top speed in 2025: a whopping 0.064% of the
speed of light (192&#8239;000&#8239;m/s = 691&#8239;000&#8239;km/h = 429
492&#8239;mph). And we will never ([ever, ever][taytay]) exceed or even reach
the speed of light, because it's against the [law][wiki_light].

[nasa]: https://en.wikipedia.org/wiki/Parker_Solar_Probe
[taytay]: https://youtu.be/WA4iX5D9Z64
[wiki_light]: https://en.wikipedia.org/wiki/Speed_of_light#Upper_limit_on_speeds

Color shifting your selfies above was clearly a pointless waste of time.
You'll never be able to show that Papa Smurf impersonation at 30% the speed of
light.

However, there's more to outer space than the objects we've made and we have
measuring instruments more precise than a naked human eyes. The fastest star
in our galaxy is moving with 1755&#8239;km/s (0.5% speed of light) and
hand-held police radars can measure the Doppler effect on moving cars using
light with wavelengths in centimeter range.

When the source of light is moving, the wavelength it produces gets either
shortened of lengthened by the distance the source travels during that time.
Below is an illustration of that concept.

<center>
	<video loop controls autoplay muted style="max-width: 100%">
		<source src="{% link /assets/relativistic_doppler/doppler.mp4 %}" type="video/mp4">
	</video>
	<br>
	<i>When stationary this source produces a signal with <span style="color: green;">green wavelength</span>. When it starts moving it creates <span style="color: blue;">shorter wavelength</span> in the direction of movement and <span style="color: red;">longer wavelength</span> in the opposite direction.</i>
</center>

The exact formula for how much the transmitted wavelength, marked as
$\lambda$, changes is

$$\lambda' = \lambda \sqrt{\frac{1-v/c}{1+v/c}}$$

where $\lambda'$ is the wavelength observed, $c$ is the speed of light, and
$v$ is the speed of the source. Positive values for $v$ mean approaching and
negative values mean the source is going away from the observer.

# The answer

You did it! You scrolled all the way to the bottom of this page.

We've gathered both pieces of the puzzle needed to solve the title question.
Using the formula from the previous section and the wavelength-color link from
the first section we can construct the below graph.

<center>
<img src="{% link /assets/relativistic_doppler/shifted_spectrum.png %}" alt="shifted_spectrum" />
<br>
<i>Different wavelengths appear differently at various velocities. Wavelengths
around 450nm appear violet when the source is stationary, but becomes green
when moving away from us with 20% speed of light and red at 30%. When the
source is moving towards us the 450nm wavelength goes out of the visible
spectrum at 10% the speed of light.</i>
</center>

Lets explain the graph a bit. The horizontal line at 0% velocity is the same
as the graph from the first section. It just shows how we see colors in
everyday life. The line at 20% velocity tells us how we would see the world
moving at 20% the speed of light - the visible spectra would shift as we would
no longer be able to see wavelengths between 400nm and 500nm.

Now lets take a look at the vertical line at 650nm. Stationary that color is
red. Like the red in a traffic light for example. But when its source is
moving at **20% the speed of light** towards us we will perceive it as green.

Part 2 on this topic which will dive further into color science will be coming
out soon. Make sure to subscribe [via RSS][rss] or [via email][email_sub] to
be notified when it gets released.

[rss]: https://feeds.feedburner.com/ByteSizeSnacks
[email_sub]: https://feedburner.google.com/fb/a/mailverify?uri=ByteSizeSnacks&amp;loc=en_US

<script type="module">
	const img = new Image(),
		canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		filenameLabel = document.getElementById('filename'),
		velocityInput = document.getElementById("velocity"),
		velocityLabels = document.getElementsByClassName("velocityLabel"),
		oversizedText = document.getElementById("oversized"),
		imageInput = document.getElementById("uploadimage"),
		URL = window.URL || window.webkitURL,
		MAX_WIDTH = 740,
		DEFAULT_IMAGE = "{% link /assets/relativistic_doppler/default.png %}";
	let memo = {},
		filename = "default.png";
	img.src = DEFAULT_IMAGE;
	img.onload = function() {
		velocityInput.value = 0;
		resizeCanvas();
		drawImg();
	}
	function updateUI() {
		if (img.width > canvas.width) oversizedText.style.display = "block";
		else oversizedText.style.display = "none";
		filenameLabel.innerHTML = filename;
		for (let label of velocityLabels) label.innerHTML = velocityInput.value;
	}
	function downloadCanvas() {
		const down = document.getElementById("download");
		down.setAttribute("href", canvas.toDataURL("image/png"));
		const name = filename.split('.').slice(0, -1).join('.');
		down.setAttribute("download", name + '_' + velocityInput.value.toString());
	}
	function resizeCanvas() {
		let w = img.width, h = img.height;
		if (w > MAX_WIDTH) {
			h *= MAX_WIDTH/w;
			w = MAX_WIDTH;
		}
		if (h > MAX_WIDTH) {
			w *= MAX_WIDTH/h;
			h = MAX_WIDTH;
		}
		canvas.width = w;
		canvas.height = h;
		memo = {};
	}
	function showBigImg() {
		canvas.width = img.width;
		canvas.height = img.height;
		velocityInput.value = 0;
		memo = {};
		drawImg();
	}
	function drawImg() {
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		updateUI();
	}
	function loadImg() {
		let f = imageInput.files[0];
		if (f) {
			filename = f.name;
			img.src = URL.createObjectURL(f);
		} else {
			filename = "default.png";
			img.src = DEFAULT_IMAGE;
		}
	}
	import init, {color_shift_canvas} from "https://kolman.si/doppler-color-shift/pkg/doppler_color_shift.js";
	async function run() {
		let rateLimitTime = new Date();
		let timeoutId = null;
		await init();
		function doit() {
			let v = velocityInput.value;
			if (memo[v]) {
				ctx.putImageData(memo[v], 0, 0);
				updateUI();
			} else {
				drawImg();
				color_shift_canvas(ctx, -v/100);
				memo[v] = ctx.getImageData(0, 0, canvas.width, canvas.height);
			}
		}
		function rateLimitedDoit() {
			let now = new Date();
			clearTimeout(timeoutId);
			if (!memo[velocityInput.value] && now - rateLimitTime < 300){
				timeoutId = setTimeout(rateLimitedDoit, 300 - now + rateLimitTime);
				return;
			}
			rateLimitTime = now;
			doit()
		};
		velocityInput.addEventListener("input", rateLimitedDoit);
		velocityInput.addEventListener("change", doit);
	}
	run();
</script>
