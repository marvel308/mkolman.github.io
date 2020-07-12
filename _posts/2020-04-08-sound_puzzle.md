---
layout: post
title:  "Find the hidden message in this audio file"
date:   2020-04-08 8:00:00 +0000
categories: puzzle music secret problem encoding audio wav
decrypt: yes
---

Test your puzzle solving skills by figuring out the secrets of the sound?

Your skills as a code-breaker are requested by a Famous But Insecure organization investigating a _German_{:.slant} gang of paramilitary extremist. They need your help finding the secret alias used by the gang leader.

Below is an audio file they intercepted. Can you find the alias of the person you are up against?

<center id="audioCenter">
    <audio controls>
        <source src="{{'/assets/sound_puzzle/message.mp3'}}" type="audio/mpeg">
        <source src="{{'/assets/sound_puzzle/message.wav'}}" type="audio/wav">
    </audio>
    <a href="{{'/assets/sound_puzzle/message.wav'}}" download> ⇩Download </a>
</center>
<style>
    #audioCenter > * {
        vertical-align: middle;
    }
    .slant {
        -moz-transform:    skew(-15deg, 0deg);
        -webkit-transform: skew(-15deg, 0deg);
        -o-transform:      skew(-15deg, 0deg);
        -ms-transform:     skew(-15deg, 0deg);
        transform:         skew(-15deg, 0deg);
        display: inline-block; 
    }
</style>


Check if your answer is correct here
<input type="text" id="answer" placeholder="Check answer" onkeyup="handleAnswer(event);" /> <span id="answerIndicator">[Not Correct]</span>

<div style="display: none; background: rgba(255, 255, 255, 0.5); border: 1px solid; padding: 1em; padding-bottom: 0; margin-bottom: 1em;" id="correctAnswer" markdown="block">
# Your answer is correct!

If you want to be featured on the below leader board enter your github username and [send me a pull request](https://github.com/MKolman/mkolman.github.io/blob/master/_posts/2020-04-09-sound_puzzle.md) with the below line added. Or if that is too much work [send me an email](mailto:maks+sound_puzzle@kolman.si) with your answer and I'll add you.
<br>
<input type="text" placeholder="Username" onkeyup="handleUsername(event);" />
<br>
<code id="diff" style="white-space: nowrap; display: block; overflow-x: auto">
| [MKolman](https://github.com/MKolman/) | `60F8F44E66B44FA46E3FF8C818488E8054AEFD5FEC2A7B28D8EBBD5397CBA484` |
</code>
</div>


# Leader board
<div class="horizontal-scroll" markdown="block">
<!-- Add your name to the bottom of this table -->

| Username | Signature   |
|-----------------------------|
| Ultimate Vexation | `832711B6B8B877574D64A2E59D74BDE8D2DABB06C3BB1CB4EE96986E9DFE9289` |

<!-- Add your name above -->

</div>

# More puzzles?
If you're interested in solving more problems like this make sure to check out [this older post]({{"/blog/aes_game/"}}).

<script>
    HASH_PREFIX = 'EE8426C21BDB6B56EDAC3BB98B66169A50150517C83DDB32CB505DE';
    function calcHash(txt) {
        let inp = txt.replace(' ', '').toUpperCase();
        return CryptoJS.SHA256(inp).toString().toUpperCase();
    }
    function handleUsername(event) {
        let answer = document.getElementById('answer').value;
        let username = event.target.value;
        let txt = '| [{usr}](https://github.com/{usr}/) | `';
        document.getElementById('diff').innerText = txt.replace(/{usr}/g, username)+calcHash(username+'-'+answer)+'` |';
    }
    function handleAnswer(event) {
        let indicator = document.getElementById('answerIndicator');
        indicator.innerText = '';
        let hash = calcHash(event.target.value);
        if (hash.startsWith(HASH_PREFIX)){
            indicator.innerText = '[Correct]';
            document.getElementById("correctAnswer").style.display = 'block';
        } else {
            indicator.innerText = '[Not correct]';
            document.getElementById("correctAnswer").style.display = 'none';
        }
    }
</script>
