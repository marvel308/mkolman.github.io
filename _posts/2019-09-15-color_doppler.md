---
layout: post
title:  "How fast do you have to drive to turn a red traffic light green?"
date:   2019-09-15 11:00:00 +0000
categories: Doppler relativity colour color application
---

Discussing Doppler effect of electromagnetic radiation and pushing it to
extremes. Including an application to colour shift your pictures.

# Acoustic Doppler effect
Have you ever had a screaming toddler run at you at full speed? If so, you might
have noticed the change in his scream when you moved out of the way at the
last second. Not only because you tripped him and he started crying, but also
because he went from moving towards you to moving away from you.

Other people might relate more to an ambulance passing you on the street. Same
thing, really. The pitch of the noise changes when its source goes past you.
This phenomena is called **Doppler effect**.

<center markdown="block">
![Doppler](https://upload.wikimedia.org/wikipedia/commons/e/e6/Doppler_Effect.gif)
<br>
_Illustration of acoustic waves emitted from a moving source.
[[wikimedia]](https://commons.wikimedia.org/wiki/File:Doppler_Effect.gif)_
</center>

Whilst sound is moving with a steady 343 m/s through the air its wavelength is
shifted due the movement of either source or the observer.

# What is light?

Electromagnetic spectrum is vast and diverse. From Hulk-creating gamma rays,
every student's best friends - microwaves, X-rays for the broken, all the way
to radio waves bringing horrible ads to your car's stereo.

There is a special subset of electromagnetic radiation with wavelengths between
400nm and 700nm that we call visible light. Unless (color)blind, you have
specialized cells in your eyes that let you distinguish between different
wavelengths of visible light which you perceive as colour.

<center markdown="block">
![Rainbow]({{"/assets/color_doppler/rainbow3.svg"|relative_url}})<br>
_Colors of the rainbow and their corresponding wavelengths._
</center>

# Movement and light

Some guy with messy hair figured out that the speed of light is constant in all
frames of reference. This has significant ripple effects on all commercial and
non-commercial travel close to the speed of light.

The exact nature of length contraction and time dilation are out of scope for
this blog post, but we will talk about on of their consequences: colour shift.

Just like with sound when moving relatively to one another the wavelength of
light at the source might be different that the wavelength measured by an
observer. The equations describing this discrepancy are

<center style="font-style: italic">
  λ<sub>o</sub> = λ<sub>s</sub> K
  <br>

  <span style="display: inline-flex; align-items: center;">
    <span>K<sup>2</sup></span> &nbsp; = &nbsp;
    <span style="display: inline-flex; flex-direction: column;">
      <span style="border-bottom: 1px solid">1 + v/c</span>
      <span>1 - v/c</span>
    </span>
  </span>
</center>

where _λ<sub>s</sub>_ and _λ<sub>o</sub>_ are wavelengths measured at source and
observer respectively, _K_ is the colour shift coefficient used for clarity, _c_
is the speed of light, and _v_ is the relative velocity between source and
observer. Velocity _v_ is negative if the two are approaching and positive if
moving further away from each other.

For velocities much smaller than the speed of light the following is a good
approximation

<center>
  K ~ 1 - v/c,
</center>

meaning that at 3% the speed of light all wavelengths will be increased or
decreased by around 3%.

## Example

Consider Alice and Bob. They modified their vehicles and are testing them on a
German autobahn without speed limits. They are driving towards each other at 5%
the speed of light (_v&nbsp;=&nbsp;-0.05c_). At that speed _K_'s value is 0.95.
Meaning observed wavelengths will be 5% smaller than created. Bob's yellow
(<i style="background:#ffff00">λ<sub>s</sub>&nbsp;=&nbsp;570nm</i>)
racecar looks green
(<i style="background:#00ff00">λ<sub>o</sub>&nbsp;=&nbsp;540nm</i>)
to Alice. Similarly her blue
(<i style="background:#0047ff">λ<sub>s</sub>&nbsp;=&nbsp;470nm</i>)
motorcycle helmet looks purple
(<i style="background:#6d00ff">λ<sub>o</sub>&nbsp;=&nbsp;450nm</i>)
to Bob.

They only enjoyed the moment for a fraction of a second. When they pass each
other (_v_ is now positive 0.05c) _K_ changes to 1.05. Bob's car is now orange
(<i style="background:#ff7700">λ<sub>o</sub>&nbsp;=&nbsp;600nm</i>) to Alice,
who seems to have a cyan
(<i style="background:#00aab3">λ<sub>o</sub>&nbsp;=&nbsp;490nm</i>) helmet
according to Bob.

## Graphical demo

Below is a chart showing how we perceive various wavelengths at different
speeds.

<center markdown="block">
![RGB]({{"/assets/color_doppler/doppler_shift.svg"|relative_url}})<br>
_Electromagnetic spectrum visibility at different velocities. The inset graph
at the bottom right of the image has logarithmic axis. It shows at a wider range
which wavelengths we can perceive._
</center>

We can learn a lot from above image. For example green colour at 500nm comes to
the very edge of visible spectrum at ±25% of the speed of light. It would appear
as faint purple or red, depending on the direction of travel. At those points we
would be able to see infra red (IR) transmitter in your TV remote, or appreciate
how good sunscreen is at absorbing ultraviolet (UV) radiation.

We only have to travel at 99.999% the speed of light to see into the microwave
spectrum with a naked eye. Human-observed X-ray vision becomes possible at
-99.99% speed of light.


<center id="interactiveRainbow">
  <h2> Visible spectrum at <span id="rainbowSpeed">0</span>% speed of light [nm] </h2>
  <input type="range" min="-1000" max="1000" value="0" id="rainbowSlider" onchange="makeRainbowTicks()" oninput="makeRainbowTicks()">
  <img src="{{'/assets/color_doppler/rainbow_raw.png'|relative_url}}" alt="rainbow"/>
  <div id="rainbowScale">
    <div style="left:0"> 350 </div>
    <div style="left:99%"> 750 </div>
  </div>
</center>

<script>
  function getTickWidth(range, targetSteps) {
    // calculate an initial guess at step size
    var tempStep = range / targetSteps;

    // get the magnitude of the step size
    var mag = Math.floor(Math.log(tempStep) / Math.LN10);
    var magPow = Math.pow(10, mag);

    // calculate most significant digit of the new step size
    var magMsd = Math.round(tempStep / magPow + 0.5);

    // promote the MSD to either 1, 2, or 5
    if (magMsd > 5.0)
      magMsd = 10.0;
    else if (magMsd > 2.0)
      magMsd = 5.0;
    else if (magMsd > 1.0)
      magMsd = 2.0;

    return magMsd * magPow;
  }
  function getV() {
    let v = -document.getElementById('rainbowSlider').value/10;
    if (v == 0) return 0;
    if (v > 0) return 1 - Math.pow(10,  -Math.pow(v, 2)/1500);
    if (v < 0) return -1 + Math.pow(10, -Math.pow(v, 2)/1500);
  }
  function getK(v) {
    return Math.sqrt((1-v)/(1+v))
  }
  function getLimits() {
    let v = getV();
    let K = getK(v);
    return [350*K, 750*K];
  }
  function getSpectrumBg(start, end) {
    let limits = [
      { name: "Visible",     start: 380,  end: 700,  clr: "#7f4c19" },
      { name: "Ultraviolet", start: 10,   end: 380,  clr: "#33194c" },
      { name: "Infrared",    start: 700,  end: 1e6,  clr: "#4c1919" },
      { name: "Microwave",   start: 1e6,  end: 1e8,  clr: "#333333" },
      { name: "X-ray",       start: 1e-2, end: 10,   clr: "#194c33" },
      { name: "Gamma",       start: 1e-3, end: 1e-2, clr: "#194c7f" },
    ];
    result = "";
    for (let i = 0; i < limits.length; i++) {
      let spec = limits[i];
      if (spec.start < end && spec.end > start) {
        let left = 100 * (Math.max(start, spec.start) - start)/(end-start);
        let right = 100 - 100 * (Math.min(end, spec.end) - start)/(end-start);
        result += `<div class="background" style="left: ${left}%; right: ${right}%; background: ${spec.clr}">${spec.name}</div>`;
      }
    }
    return result;
  }

  function makeRainbowTicks() {
    let [start, end] = getLimits(), fullWidth = end-start;
    let tickWidth = getTickWidth(fullWidth, 10);
    let t = Math.round(start/tickWidth)*tickWidth;
    let result = getSpectrumBg(start, end);
    while (t < end) {
      result += `<div style="left: ${100*(t-start)/fullWidth}%">${Math.round(t*100)/100}</div>`;
      t += tickWidth;
    }
    document.getElementById("rainbowScale").innerHTML = result;
    document.getElementById("rainbowSpeed").innerHTML = Math.round(10000000*getV())/100000;
  }
  makeRainbowTicks();
</script>
<style>
  #interactiveRainbow {
    width: 100%;
    position: relative;
    overflow: hidden;
    padding-bottom: 2em;
  }
  #rainbowScale div.background {
    padding-top: 1em;
  }
  #rainbowScale div{
    position: absolute;
    border-left: 1px solid white;
    color: white;
  }
  #rainbowSlider {
    width: 100%;
  }
</style>

<canvas id="sensitivity"></canvas>

<canvas id="shift"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js"></script>

<script>
{% include color_doppler/sensitivity_data.js %}
{% include color_doppler/sensitivity_plot.js %}
{% include color_doppler/physics.js %}
// plotSensitivity('sensitivity');

function loadImage() {
  const myCanvas = document.getElementById('shift');
  const myContext = myCanvas.getContext('2d');
  const img = new Image();
  img.src = '/assets/elo/Caruana_Carlsen.JPG';
  img.onload = () => {
    myContext.drawImage(img, 0, 0);
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  };
}
loadImage();

</script>

<style>
#rainbow {
  height: 10px;
}
#rainbowScale {
  height: 10px;
}
</style>
