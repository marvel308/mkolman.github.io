---
layout: post
title:  "Math predicts Caruana has 39.5% chance of becoming the World Chess Champion"
date:   2018-10-23 22:00:00 +0200
categories: chess FIDE ELO rating math
math: true
---

What does chess rating tell us? How is it calculated and can it predict the
next World Chess Champion?

In November 2018 [the World Chess Championship][wcc2018] (WCC) match between the
current champion [Magnus Carlsen][magnus] and the challenger [Fabiano
Caruana][fabi] is going be held in London.

<center markdown="block">
![caruanavscarlsen]({{"/assets/elo/Caruana_Carlsen.JPG"|relative_url}})
_Caruana (left) playing Carlsen (right) in the Grenke Chess Classic 2015.
[[source]](https://commons.wikimedia.org/wiki/File:Caruana_Carlsen_Grenke_Chess_Classic_2015-2.JPG)_
</center>

When the news of WCC reached amateurs like me, the challenger was already
selected and the countdown to the match began. I started wondering if
Caruana stands a chance against the champion, or will he unavoidably become
Carlsen's latest victim.

This is an interesting mathematical question. [World Chess Organization
(FIDE)](https://www.fide.com/) assigns a rating to all players which can answer
this exact question. At the time of writing Carlsen is the top rated player in
the world with a rating 2834.7 and Caruana is close second with 2832.3.

# Chess 101

Chess is a two player [zero-sum game][zerosum] with [complete information][complete]. This
means that both players have directly opposing goals (i.e. what is good for one
player is equally and oppositely bad for the other) and have full knowledge of
the game's state (i.e. there are no hidden pieces or cards).

If you win a chess game you get one point and the loser gets 0. In a draw both
players get half a point. This scoring system is the basis of determining the
player's ratings.

[complete]: https://en.wikipedia.org/wiki/Complete_information

# Elo rating system

First lets talk about the [rating system][elosystem] used in chess. A physicist
[Arpad Elo][aprad] designed it as a method to judge the skill of players in any
zero-sum game. The higher the rating the better the player and the difference in
players rating determines their relative strength.

[aprad]: https://en.wikipedia.org/wiki/Arpad_Elo
[elosystem]: https://en.wikipedia.org/wiki/Elo_rating_system

Given two ratings $R_A$ and $R_B$ we can calculate the expected scores
players $A$ and $B$ will get with the formula

$$E_A = \frac{1}{1+10^{(R_B-R_A)/400}},\\
E_B = \frac{1}{1+10^{(R_A-R_B)/400}}.$$

<center markdown="block">
![expected]({{"/assets/elo/rating_expected.svg"|relative_url}})<br>
_Graph depicts the expected score for two players with various
rating differences._
</center>

It always holds true that $E_A+E_B=1$. After each game the ratings of both
players have to be adjusted, e.g. if you lose your rating will probably drop.

If in a game player $A$ achieves a score $S_A \in \\{0, \frac{1}{2}, 1\\}$ the
other achieved the score $S_B = 1-S_A$. After the game their ratings are
adjusted proportionally to the difference between their expected and real score.
We can express the change as

$$\Delta R_{A,B} = K(S_{A,B} - E_{A,B}),$$

where $\Delta R_{A,B}$ is the resulting rating change and $K$ is a number called
K-factor. In principle, it is possible that players have different values for
$K$ in which case we would denote $K_A$ and $K_B$ for different players. In
different organizations and even in different stages of players career the
K-factor varies from as low as 10 and up to 40.

<center markdown="block">
![rating]({{"/assets/elo/rating_change.svg"|relative_url}})<br>
_Graph depicts rating change for three K-factors when opponents with different
relative strength draw or win a game._
</center>

## FIDE variant of Elo rating system

The main difference between various implementations of the Elo rating system is
the use of the K-factor. Some have constant value for all players, some have
discrete values for certain groups of players, and some use continuous K-factor
tailored to each individual.

We are concerned with FIDE which uses the following three values:
* $K = 40$ , for a player new to the rating list until the completion of events
with a total of 30 games and for all players until their 18th birthday, as long
as their rating remains under 2300.
* $K = 20$ , for players with a rating always under 2400.
* $K = 10$ , for players with any published rating of at least 2400 and at least
30 games played in previous events. Thereafter it remains permanently at 10.

# Using rating to calculate the probability of winning

Now lets return to Caruana and his 2.4 rating points disadvantage to Carlsen.
What does that mean in terms of his winning chances?

In this section we will use index $M$ for Magnus Carlsen and index $F$ for
Fabiano Caruana. With that in mind we denote the probability of Magnus
winning a $n$ game match as $P_{Mn}$. Similarly, $P_{Dn}$ and $P_{Fn}$ represent
probabilities of him drawing and loosing said match, respectively.

Firstly we have to choose the probability of drawing a single game $P_{D1}$.
Looking at historical data for players at the top-level we will set this value
to

$$P_{D1} = 0.6.$$

The end result is not massively dependent on this figure, so its precision is of
secondary importance. For example, even setting $P_{D1}=0$ would only change 12
game match results by a couple of percentage points.

Using a basic equation for calculating expected values we can write

$$E_M = S_{win} \cdot P_{M1} + S_{draw} \cdot P_{D1}$$

where $S_{win}=1$ is the winning score and $S_{draw}=1/2$ is the drawing score.
Expressing $P_{M1}$ (similarly $P_{F1}$) from the above equation yields

$$P_{M1} = E_M - \frac{P_{D1}}{2} \simeq 20.3 \%,\\
P_{F1} = E_F - \frac{P_{D1}}{2} \simeq 19.7 \% .$$

Next, lets tackle the problem of multiple games. To win an entire $n$-game match
Magnus needs at least one win ($N_M$) and Caruana has to win less than Magnus
($N_F$) with the remaining games being drawn($N_D$). Mathematically this gives
us the following restrictions:

$$ N_M \in \{1, 2, 3, ..., n\} \\
N_F \in \{0, 1, 2, ..., \min\{N_M-1, n-N_M\}=\widetilde{N_F}\}\\
N_D = n - N_M - N_F $$

If we sum over all possible configurations, we get the total probability that
Magnus will win

$$ P_{Mn} = \sum_{N_M=1}^{n}\sum_{N_F=0}^{\widetilde{N_F}} \bar P(N_M, n-N_M-N_F, N_F),$$

where $\bar P(N_M, N_D, N_F)$ represents the probability of a match ending with
$N_M$ wins for Magnus, $N_D$ draws and $N_F$ wins for Fabiano. The drawing
probability is expressed in the same way, except we insist that $N_M=N_F$

$$ P_{Dn} = \sum_{N_W=0}^{n/2} P(N_W, n-2N_W, N_W).$$

The last thing to do is to define the function $\bar P$:

$$\bar P(N_M, N_D, N_F) = \\
P_{M1}^{N_M} \cdot {N_M+N_D+N_F\choose N_M} \cdot\\
P_{F1}^{N_F} \cdot {N_F+N_F\choose N_F} \cdot\\
P_{D1}^{N_D} $$

Beautiful, I know. The first line represents the probability of Magnus winning
$N_M$ games, the second line calculates the probability that Caruana will win
$N_F$ of the remaining games, and lastly we calculate the probability that the
rest of the games are drawn.

# Results

Here we are at last. It is about time we answer the question at the top of the
page. What does math have to say about Caruana's chances of becoming the world
chess champion?

We already formulated the required functions in the previous section, so all
that is left is to plot them.

<center markdown="block">
![win chance]({{"/assets/elo/championship.svg"|relative_url}})<br>
_Probability for every match outcome given a different number of games in the match._
</center>

The above image shows the expected results for matches with up to 20 games.
Though, 12 is the magic number in this case.

| Carlsen | Draw | Caruana |
|------------------------
| 42.4% | 18.1% | 39.5% |

All that is left for us to do is to wish both players good luck and hope for an
interesting championship.

[zerosum]: https://en.wikipedia.org/wiki/Zero-sum_game
[wcc2018]: https://en.wikipedia.org/wiki/World_Chess_Championship_2018
[magnus]: https://en.wikipedia.org/wiki/Magnus_Carlsen
[fabi]: https://en.wikipedia.org/wiki/Fabiano_Caruana
