function switchView(view) {
  document.getElementById('athleteView').classList.remove('active');
  document.getElementById('adminView').classList.remove('active');

  if (view === 'athlete') {
    document.getElementById('athleteView').classList.add('active');
  } else {
    document.getElementById('adminView').classList.add('active');
  }
}

/* Radar Chart */
new Chart(document.getElementById('radarChart'), {
  type: 'radar',
  data: {
    labels: [
      'Strength','Stamina','Speed','Intelligence',
      'Endurance','Agility','Flexibility','Technique'
    ],
    datasets: [{
      data: [85,80,78,82,88,84,75,90],
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  }
});

/* Line Chart */
new Chart(document.getElementById('lineChart'), {
  type: 'line',
  data: {
    labels: ['Jan','Feb','Mar','Apr','May'],
    datasets: [{
      data: [60,65,70,78,85],
      tension: 0.3
    }]
  },
  options: {
    responsive: true
  }
});
