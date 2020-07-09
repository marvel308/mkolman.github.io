---
layout: page
title: Links
permalink: /links/
---

A collection of websites in creation of which I contributed.

# Physics

* [ogenj.kolman.si](#ogenj.kolman.si){:.toggle-description name="ogenj.kolman.si"} [[visit]](http://ogenj.kolman.si/)
    *What happens if you put a flame in electric field?*{:.link-description.hidden}
* [lebdenje.kolman.si](#lebdenje.kolman.si){:.toggle-description name="lebdenje.kolman.si"} [[visit]](http://lebdenje.kolman.si/)
    *Levitating a ping-pong ball in a stream of air.*{:.link-description.hidden}

# Games

* [elo.kolman.si](#elo.kolman.si){:.toggle-description name="elo.kolman.si"} [[visit]](http://elo.kolman.si)
    *ELO rating system ment primarily for chess.*{:.link-description.hidden}
* [pokemongo.si](#pokemongo.si){:.toggle-description name="pokemongo.si"} [[visit]](http://pokemongo.si)
    *A slovenian website for Pokémon GO.*{:.link-description.hidden}

<script>
    function toggleDescription(event) {
        event.preventDefault();
        event.target.parentElement.querySelector('.link-description').classList.toggle('hidden');
    }
    document.querySelectorAll('.toggle-description').forEach(function(el){
        el.addEventListener('click', toggleDescription, false);
    });
</script>
