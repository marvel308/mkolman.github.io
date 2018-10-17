---
layout: post
title:  "First Post"
date:   2018-10-17 8:30:27 +0200
categories: jekyll first test github
---

This is a static website made with [Jekyll](https://jekyllrb.com). Source is
hosted on [GitHub](https://github.com/MKolman/mkolman.github.io) so not only can
you bask in my code, you can create pull requests to fix my tipos.

> A static website? What about dynamic content? I thought you were a __real__
> developer.

I hear you ask through time and space. Firstly, I do not appreciate the tone of
the voice I put in your mouth. And secondly, I guess that means I am
[no true Scotsman](https://en.wikipedia.org/wiki/No_true_Scotsman).

But Jekyll has some cool functionality. Check out this python code block:
{% highlight python %}
a = 'a = {}\nprint(a.format(repr(a)))'
print(a.format(repr(a)))
{% endhighlight %}
_Woaah_... Code that prints itself.

Want an image? BAM!
![This is an image of a sentence that is a description of this image]({{"assets/img/this-is-an-image.jpg"|relative_url}})

* Let's
* get
* some
  * nested
* lists
  1. up
    * in
  1. here.

All in all this is rather [easy to do][this-post]. Also Good Guy GitHub [hosts
my website][Github-Jekyll] for free with integration so good, my lifetime
expectancy increased just because of the stress involved in self-hosting.

If I ever need authentication or weird backend functionality I can always set up
an API server and [hit it using JS](https://i.imgur.com/vpgdPYB.jpg).


[this-post]: https://github.com/MKolman/mkolman.github.io/tree/master/_posts/2018-10-17-first_post.md
[Github-Jekyll]: https://help.github.com/articles/about-github-pages-and-jekyll/
