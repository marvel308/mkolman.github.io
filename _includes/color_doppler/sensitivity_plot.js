
function getDataset(label) {
  let y = sensitivityData[label];
  let colors = sensitivityData.getRGB(y);
  let result = {
      fill: 'origin',
      pointStyle: 'line',
      label: label,
      backgroundColor: `rgba(${10*colors[0]},${10*colors[1]},${10*colors[2]},0.7)`,
      data: []
  }
  for (let i = 0; i < y.length; i++) {
    result.data.push({x: sensitivityData.lambda[i], y: y[i]});
  }
  return result;
}
function plotSensitivity(elementId) {
  let datasets = [
    getDataset('red'),
    getDataset('green'),
    getDataset('blue'),
  ];
  let myChart = new Chart(elementId, {
    type: 'line',
    data: {
      datasets: datasets
    },
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          scaleLabel: {
            display: true,
            labelString: 'Wavelength [nm]',
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Sensitivity [%/nm]',
          }
        }]
      }
    }
  });
}
