import matplotlib.pyplot as plt
import numpy as np


def binom(n, r):
    r = min(r, n-r)
    result = 1
    for i, j in zip(range(n, n-r, -1), range(1, r+1)):
        result *= i
        result //= j
    return result


def expected_score(r1, r2):
    return 1/(1+10**((r2-r1)/400))


def rating_change(score, r1, r2, k=10):
    drating = k * (score - expected_score(r1, r2))
    return drating


def rating_graph():
    drs = np.linspace(-1000, 1000)
    colors = []
    Ks = [10, 20, 40]
    for k in Ks:
        line, = plt.plot(drs, rating_change(1, 0, drs, k), label=k)
        colors.append(line.get_c())
    # for c, k in zip(colors, Ks):
    #     line, = plt.plot(drs, rating_change(1, 0, drs, k), ':', color=c)
    for c, k in zip(colors, Ks):
        line, = plt.plot(drs, rating_change(0.5, 0, drs, k), '--', color=c)
    # plt.plot(drs, expected_score(0, drs))
    plt.ylabel('Rating change ($\Delta R_A$)', fontsize='x-large')
    plt.xlabel('Rating difference ($R_B-R_A$)', fontsize='x-large')
    legend = plt.legend(title='K-factor', fontsize='x-large', facecolor=(238/255, 238/255, 238/255))
    plt.setp(legend.get_title(), fontsize='x-large')
    plt.grid(linestyle=':')
    plt.xlim(-1000, 1000)
    plt.ylim(-20, 40)
    plt.title('Change in rating when winning and drawing', fontsize='x-large')
    plt.tight_layout()
    plt.twinx()
    plt.plot([], [], 'k-', label='Win for $A$')
    plt.plot([], [], 'k--', label='Draw')
    legend = plt.legend(title='Game result', loc=4, fontsize='x-large', facecolor=(238/255, 238/255, 238/255))
    plt.setp(legend.get_title(), fontsize='x-large')
    plt.yticks([])
    plt.savefig('rating_change.svg', transparent=True)

def exp_graph():
    drs = np.linspace(-1000, 1000)
    colors = []
    plt.plot(drs, expected_score(0, drs), label="$R_A$")
    plt.plot(drs, 1-expected_score(0, drs), label="$R_B$")
    plt.ylabel('Expected score ($E_A$ and $E_B$)', fontsize='x-large')
    plt.xlabel('Rating difference ($R_B-R_A$)', fontsize='x-large')
    legend = plt.legend(fontsize='x-large', facecolor=(238/255, 238/255, 238/255))
    plt.setp(legend.get_title(), fontsize='x-large')
    plt.grid(linestyle=':')
    # plt.xlim(-1000, 1000)
    # plt.ylim(0, 1)
    plt.title('Expected score for players with different ratings', fontsize='x-large')
    plt.tight_layout()
    plt.savefig('rating_expected.svg', transparent=True)

def caruana_carlsen():
    def probs(p, num_games):
        return [p**i * (1-p)**(num_games-i)*binom(num_games, i) for i in range(num_games+1)]
    dp = 0.0
    carlsen = 2834.7
    caruana = 2832.3
    E = expected_score(carlsen, caruana)
    wp = E - 0.5*dp
    lp = 1 - dp - wp
    print(wp, dp, lp)
    def get_prob(nw, nl, nd):
        return wp**nw * lp**nl * dp**nd * binom(nw+nl+nd, nw)*binom(nl+nd, nl)
    wins, loses, draws = [], [], []
    games = list(range(1, 13))
    for num_games in games:
        win_prob = sum(get_prob(nw, nl, num_games-nw-nl)
                       for nw in range(1, num_games+1)
                       for nl in range(min(nw, num_games-nw+1)))
        lose_prob = sum(get_prob(nw, nl, num_games-nw-nl)
                        for nl in range(1, num_games+1)
                        for nw in range(min(nl, num_games-nl+1)))
        draw_prob = sum(get_prob(nw, nw, num_games-2*nw)
                        for nw in range(0, num_games//2+1))
        wins.append(win_prob)
        loses.append(lose_prob)
        draws.append(draw_prob)
    if 1:
        print(wins[-1], draws[-1], loses[-1])
        plt.plot(games, loses, '.-')
        plt.plot(games, draws, '.-')
        plt.plot(games, wins, '.-')
        plt.grid()
        # plt.xscale('log')
        print()
        plt.show()
    else:
        plt.bar(games, loses, bottom=[w+d for w, d in zip(wins, draws)])
        plt.bar(games, draws, bottom=wins)
        plt.bar(games, wins)
        for i, (w, d, l) in enumerate(zip(wins, draws, loses)):
            plt.text(i+1, 0.5, round(d*100), ha='center', va='bottom')
            plt.text(i+1, 0.01, round(w*100), ha='center', va='bottom')
            plt.text(i+1, 0.99, round(l*100), ha='center', va='top')
        plt.xticks(games)
        plt.ylabel('Probability', fontsize='x-large')
        plt.xlabel('Number of games in a match', fontsize='x-large')
        plt.legend(['Caruana wins', 'Draw', 'Carlsen wins'], ncol=3, loc=8, bbox_to_anchor=(0.5, 1), facecolor='none', fontsize='large')
        plt.plot([11.5, 11.5, 12.5, 12.5, 11.5], [-0.007, 1.007, 1.007, -0.007, -0.007], 'r')
        plt.ylim(-0.02, 1.02)
        plt.tight_layout()
        plt.savefig('championship.svg', transparent=True)

if __name__ == '__main__':
    rating_graph()
    # exp_graph()
    # caruana_carlsen()
