from sensitivity_data import data

inv = list(zip(*data))
print([sum(inv[i]) * 5 for i in range(1, 4)])
inv[1], inv[-1] = inv[-1], inv[1]
def engineer(freqs):
    result = [sum([i*f for i, f in zip(inv[i], freqs)]) for i in range(1, 4)]
    return [255 * r/max(result) for r in result]

for i, _ in enumerate(data):
    d = [0] * len(data)
    d[i] = 1
    print("'rgba({},{},{})',".format(*engineer(d)))
