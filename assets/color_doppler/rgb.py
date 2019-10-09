from matplotlib import pyplot as plt
import numpy as np

from xyz import XYZ, M

class RGB(object):
  def __init__(self):
    self.lams = [x for x, _, _, _ in XYZ]
    self.rgb = []
    for lxyz in XYZ:
      self.rgb.append(self.fromXYZ(lxyz[1:]))

  def fromXYZ(self, xyz):
    rgb = [0, 0, 0]
    for i in range(3):
      for m, x in zip(M[i], xyz):
        rgb[i] += m*x
      rgb[i] = max(0, rgb[i])**(1/2.4)
    return rgb;

  def fromLam(self, lam):
    lam = min(max(lam, self.lams[0]), self.lams[-2])
    dlam = (self.lams[-1] - self.lams[0]) // (len(self.lams)-1)
    idx = int(lam - self.lams[0]) // dlam
    assert self.lams[idx] <= lam < self.lams[idx+1]
    lamError = (lam - self.lams[idx])/dlam
    result = [low * (1-lamError) + hi * lamError
              for low, hi in zip(self.rgb[idx], self.rgb[idx+1])]
    return result

class Transformer(object):
  def __init__(self, v=0):
    self.k = self.getDopplerK(v)
    self.worker = RGB()
    # Wavelengths of RGB and its intensity at the given frequency
    self.rgblam = [630, 530, 465]
    self.intensity = [1.229984710219796, 1.1698075238707224, 1.116628675204342]
    self.lam = [self.k * l for l in self.rgblam]

  def transformRGB(self, rgb):
    intensity = [c/i for c, i in zip(rgb, self.intensity)]
    result = [0, 0, 0]
    for i, l in zip(intensity, self.lam):
      for j, c in enumerate(self.worker.fromLam(l)):
        result[j] += i * c
    return result

  def getDopplerK(self, v):
    """ Returns ratio between original and observed
    frequency at velocity v[c] """
    return ((1+v)/(1-v))**0.5

def plotRGB():
  rgb = RGB()
  lams = list(range(380, 750, 1))
  clrs = [[max(min(c, 1), 0) for c in rgb.fromLam(lam)] for lam in lams]
  plt.scatter(lams, [0 for _ in lams], marker='|', c=clrs, zorder=5)

  r, g, b = zip(*rgb.rgb)
  z = [0 for _ in r]
  for d, label in zip([r, g, b], ["Red", "Green", "Blue"]):
    plt.plot(rgb.lams, d, label[0], label=label, zorder=2)
    plt.fill_between(rgb.lams, z, d, facecolor=label[0],
                     alpha=0.5, zorder=3+(label=="Red"))

  plt.grid(linestyle=":")
  plt.legend()
  plt.xlim(380, 750)
  plt.xlabel(r"Wavelength [$nm$]")
  plt.ylabel(r"Sensitivity density [$nm^{-1}$]")
  plt.gcf().set_size_inches(7, 3.5)
  plt.tight_layout()
  plt.savefig("rgb.svg", dpi=500, transparent=True)

def getRGBShift(lams=list(range(0, 2001, 5)), nv=200, vs=None):
  if vs is None:
    vs = [v/nv for v in range(int(-1*nv), int(1*nv)+1)]
  worker = RGB()
  result = []
  for v in vs:
    if abs(v) == 1:
      result.append([[0, 0, 0] for _ in lams])
      continue
    result.append([])
    tr = Transformer(v)
    for l in lams:

      l *= tr.k
      rgb = worker.fromLam(l)
      rgb = [min(c, 1) for c in rgb]
      result[-1].append(rgb)
  return lams, vs, result

def getSpectrumMat(lams, result, start=350, end=750, rgb=[0.1, 0.1, 0.1]):
  for row in result:
    for i, lam in enumerate(lams):
      if start <= lam <= end and sum(row[i]) < 0.1:
        row[i] = rgb[:]

def makeSubplot():
  from mpl_toolkits.axes_grid.inset_locator import inset_axes
  plt.rcParams['xtick.bottom'] = plt.rcParams['xtick.labelbottom'] = False
  plt.rcParams['xtick.top'] = plt.rcParams['xtick.labeltop'] = True
  sub = inset_axes(
    plt.gca(), width=2.8, height=1.9, loc=4
    )
  sub.spines['bottom'].set_color('w')
  sub.spines['top'].set_color('w')
  sub.spines['right'].set_color('w')
  sub.spines['left'].set_color('w')

  sub.tick_params(axis='x', colors='w')
  sub.tick_params(axis='y', colors='w')

  sub.yaxis.label.set_color('w')
  sub.xaxis.label.set_color('w')

  sub.title.set_color('w')
  sub.grid(linestyle=':', alpha=0.5)
  return sub

def subplot():
  sub = makeSubplot()
  vs = np.logspace(-7, -1, 301)[::-1]
  lams = np.logspace(-1, 2, 301)

  _, _, result = getRGBShift(lams=lams, vs=1-vs)
  getSpectrumMat(lams, result, 10, 100, [0.2, 0.1, 0.3])
  getSpectrumMat(lams, result, 0, 10, [0.1, 0.3, 0.2])

  sub.imshow(result, aspect="auto")

  sub.text(100, 25, "X-RAY", c="w", horizontalalignment='center', verticalalignment='center')
  sub.text(240, 25, "UV", c="w", horizontalalignment='center', verticalalignment='center')

  xticks, xlabels = [], []
  for i, lam in enumerate(lams):
    l = int(round(np.log10(lam)))
    if set(str(lam)) <= set("0.1"):
      xticks.append(i)
      xlabels.append(f"{'   ' if lam == 0.1 else ''}{10**l}{'   ' if lam == 100 else ''}")

  sub.set_xticks(xticks)
  sub.set_xticklabels(xlabels)

  yticks, ylabels = [], []
  for i, v in enumerate(vs):
    l = int(round(np.log10(v)))
    if i % 50 == 0:
      print(i, v)
    if set(str(v)) <= set("0.1") or str(v).startswith('1e-'):
      yticks.append(i)
      ylabels.append(f"-{100-10**(l+2)}")
  print(yticks)
  sub.set_yticks(yticks)
  sub.set_yticklabels(ylabels)


def plotShift():

  lams, vs, result = getRGBShift(list(range(0, 2001, 4)), 400)

  getSpectrumMat(lams, result, 380, 700, [0.5, 0.3, 0.1])
  getSpectrumMat(lams, result, 10, 380, [0.2, 0.1, 0.3])
  getSpectrumMat(lams, result, 700, 1e6, [0.3, 0.1, 0.1])
  plt.imshow(result, extent=[min(lams), max(lams), 100*min(vs), 100*max(vs)], aspect="auto")
  plt.text(125, 87.5, "UV", c="w", horizontalalignment='center', verticalalignment='center')
  plt.text(530, 87.5, "VISIBLE", c="w", horizontalalignment='center', verticalalignment='center')
  plt.text(875, 87.5, "IR", c="w", horizontalalignment='center', verticalalignment='center')

  # plt.plot([2, 2, 100, 100, 2], [-99.8, -90, -90, -99.8, -99.8], 'r-')
  # plt.plot([100, 750], [-95, -53], "r-")

  plt.grid(c="w", linestyle=":", alpha=0.5)
  plt.ylabel('Observer\'s speed [% speed of light]\naway from source $\leftarrow$    $\\rightarrow$ towards source    ')
  plt.xlabel(r'Wavelength at source [$nm$]')
  # plt.gcf().set_size_inches(8, 1)

  plt.tight_layout()

  # subplot()
  subplotVisible()

  plt.savefig("doppler_shift.svg", dpi=200, transparent=True)

def subplotVisible():
  sub = makeSubplot()
  vs = 1-np.logspace(-10, 0, 51)
  vs = list(-vs[:-1]) + list(vs[::-1])


  color = [
    (380, 700, [0.5, 0.3, 0.1]),
    (10, 380, [0.2, 0.1, 0.3]),
    (700, 1e6, [0.3, 0.1, 0.1]),
    (1e6, 1e8, [0.2, 0.2, 0.2]),
    (1e-2, 10, [0.1, 0.3, 0.2]),
    (1e-3, 1e-2, [0.1, 0.3, 0.5]),
  ]

  for low, hi, c in color:
    sub.fill_between([low, hi], [0, 0], [len(vs), len(vs)], facecolor=c)
  sub.set_xlim(1e-3, 1e8)
  sub.set_ylim(0, len(vs))

  sub.text(2.3e-3, 3, "$\gamma$", c="w")
  sub.text(0.05, 3, "X-RAY", c="w")
  sub.text(25, 3, "UV", c="w")
  sub.text(330, 3, "V", c="w")
  sub.text(1e4, 3, "IR", c="w")
  sub.text(1e7, 3, "MICRO\nWAVES", c="w", horizontalalignment='center')

  plt_vs = []
  plt_rgb = [[], [], []]
  for v in vs:
    for m in [1]:
      v *= m
      tr = Transformer(v)
      for result, lam in zip(plt_rgb, [400, 500, 700]):
        result.append(lam*tr.k)
  for rgb, c in zip(plt_rgb[::2], [(0.5, 0, 1), 'red']):
    sub.plot(rgb, range(len(vs)), c=c)
  l = sub.legend(["violet", "red"], framealpha=0.4, facecolor='k', edgecolor='k')
  for text in l.get_texts():
      text.set_color("w")

  sub.set_xscale('log')
    # print(vs)
  ticks = list(range(0, 110, 10))
  sub.set_yticks(ticks)
  sub.set_yticklabels([round(100*vs[int(i)], 8) if i <= 80 else "" for i in ticks])
  sub.set_title("       Which wavelengths appear\nviolet/red at different velocities?")

def rainbowColormap():
  from matplotlib.colors import ListedColormap, LinearSegmentedColormap
  rgb = RGB()
  clrs = [norm(rgb.fromLam(lam)) for lam in rgb.lams]
  N = 6
  vals = np.ones((N, 4))
  vals[:, 0] = np.linspace(90/256, 1, N)
  vals[:, 1] = np.linspace(39/256, 1, N)
  vals[:, 2] = np.linspace(41/256, 1, N)
  print(vals)
  return ListedColormap(clrs)

def norm(clrs):
  return [min(1, c) for c in clrs]

def plotRainbow():
  rgb = RGB()
  lams = np.linspace(350, 750, 500)
  c = [norm(rgb.fromLam(lam)) for lam in lams]
  plt.scatter(lams, np.ones(len(lams)), c=c, marker='|', s=10000)
  # plt.grid(axis="x", linestyle=":")

  for side in ['top', 'right', 'left']:
    plt.gca().spines[side].set_color('none')
  plt.xlim(350, 750)
  plt.yticks([])
  plt.xlabel("Wavelength [$nm$]")
  plt.gcf().set_size_inches(8, 1)
  plt.tight_layout()
  plt.savefig('rainbow3.svg', transparent=True)
# rainbowColormap()
# plotRainbow()
# plotRGB()
# plotShift()

# rgb = RGB()
# lams = [570, 540, 470, 450, 600, 490]
# for l in lams:
#   clr = rgb.fromLam(l)
#   clr = [min(1, c) for c in clr]
#   clr = [int(c * 255) for c in clr]
clrs = [
  [0.5, 0.3, 0.1],
  [0.2, 0.1, 0.3],
  [0.3, 0.1, 0.1],
  [0.2, 0.2, 0.2],
  [0.1, 0.3, 0.2],
  [0.1, 0.3, 0.5],
]
for c in clrs:
  print("#{:02x}{:02x}{:02x}".format(*[int(255*x) for x in c]))
