---
layout: post
title:  "How my sound card crashed my home network"
date:   2018-11-10 21:00:00 +0000
categories: debugging SRE network bug
---

A story about my non-trivial debugging experience.

A _'fake it \'till you make it'_ attitude led me to a job as a [Site Reliability
Engineer][GoogleSRE] at Google Dublin. On 2018-11-05 I started as a Software
Developer on a team responsible for the Google search frontend (you might have
seen [the website][GoogleSearch] before). It is hard to _fake it_ when you are
responsible for the website that people routinely use to check if their internet
connection works.

To feel better about my experience and skill I am going back to the first
incident where more than a simple search was needed to solve my problems. The
year was 2012, I was still in high school, and was rocking an Ubuntu 12.04
laptop.

# What were the first symptoms of the incident

I just started my computer and was browsing the web for a short while when the
internet went down. Every request either failed or never finished. I was in the
dark. Checked the WiFi on my phone: the same. Asked my brother and he also
confirmed that everything just stopped.

# Testing the obvious problems

Without a though I went to our router, plugged it out the wall, waited a couple
of seconds and plugged it back in. Thinking from experience I was fairly
confident that this will solve any network problem.

I go back to my computer, wait for it to reconnect and voilà! The internet
worked... for around 10 seconds and then everything started failing same as
before. I guessed the ISP is to blame so I closed my laptop and went away while
I waited for the problems to blow over.

After a while I used my phone to check if the internet is working. To my
surprise everything worked fine for quite some time. But as soon as I got back
on my laptop the problems [returned][repeatGIF] like an exam you keep failing
but never study for.

# When blaming others does not work, blame yourself

I finally accepted that my computer might be to blame for the outages our
household experienced. I disconnected my computer from the network and sure
enough everything went back to normal.

This realization left me Googling on my phone and trying multiple generic fixes,
all of which I had to copy by hand and none of them worked. Damn. It was time to
take things seriously. I want to see what exactly happens on my computer when it
connects.

# Let's sniff some packets

I fire up WireShark and connect. After a couple of seconds a ton of identical
requests floods my screen. All of them multicast, all of them headed to
`224.0.0.56`.

It became clear that this is the cause of the problems. I was sending so much
hidden network traffic that our cheap router could not handle any more requests.
But where Exactly was I sending it?

Googling `224.0.0.56` produced a single result. It was a [bug report for
pulseaudio][bugReport] flooding the network with multicast packets. Knowing that
I'm not alone made me feel reassured.

The issue was that with certain configurations the service I used to stream
audio to a remote speaker lost all decency and self-control which resulted in
endless data streams on your network.  One workaround for the issue was to
continuously kill the self-restarting pulseaudio

```
while true; do killall pulseaudio; sleep 1; done
```

Beautiful. I opted for the more sane approach and simply disabled network audio
streaming.


# Post mortem (aka TLDR)

A faulty pulse audio (multicast/RDP) service flooded my network with UDP
requests which effectively caused a denial-of-service attack on our home router.

Two possible improvements that would help with dealing the same problem:
* get a better router so that medium amounts of traffic are not fatal,
* have readily available stats on network usage so the problem can be detected sooner.


[GoogleSearch]: https://www.google.com
[GoogleSRE]: https://landing.google.com/sre/
[littleGIF]: https://media.giphy.com/media/3o6Zt5osQGe9Nk3D4A/giphy.gif
[repeatGIF]: https://media.giphy.com/media/3o85xKfKHgdPsdDH44/giphy.gif
[bugReport]: https://bugs.launchpad.net/ubuntu/+source/pulseaudio/+bug/411688
