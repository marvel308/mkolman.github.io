---
layout: page
title: Links
permalink: /links/
---

A collection of websites in creation of which I contributed.

# Physics

* [relativno.kolman.si](#relativno.kolman.si){:.toggle-description name="relativno.kolman.si"} [[visit]](http://relativno.kolman.si)
    *A website about special relativity. You can upload images to color-shift them.*{:.link-description.hidden}
* [ogenj.kolman.si](#ogenj.kolman.si){:.toggle-description name="ogenj.kolman.si"} [[visit]](http://ogenj.kolman.si/)
    *What happens if you put a flame in electric field?*{:.link-description.hidden}
* [lebdenje.kolman.si](#lebdenje.kolman.si){:.toggle-description name="lebdenje.kolman.si"} [[visit]](http://lebdenje.kolman.si/)
    *Levitating a ping-pong ball in a stream of air.*{:.link-description.hidden}

# Games

* [dnd.kolman.si](#dnd.kolman.si){:.toggle-description name="dnd.kolman.si"} [[visit]](http://dnd.kolman.si)
    *A Dungeons and dragons blog.*{:.link-description.hidden}
* [dm.kolman.si](#dm.kolman.si){:.toggle-description name="dm.kolman.si"} [[visit]](http://dm.kolman.si)
    *A helping tool for dungeon masters playing D&amp;D 4e.*{:.link-description.hidden}
* [box.kolman.si](#box.kolman.si){:.toggle-description name="box.kolman.si"} [[visit]](http://box.kolman.si)
    *A boxing game for two players, 4 phones, and a computer.*{:.link-description.hidden}
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
