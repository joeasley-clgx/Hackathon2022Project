let THE_DATA;
fetch('/Data.JSON')
    .then((response) => response.json())
    .then((json) => filterData(json.timeSeries));

const idleThreshold = 0.01

function filterData(json) {
    THE_DATA = json.filter(e => e.metric.labels.instance_name.startsWith("fnccuweb"));
    console.log(THE_DATA);

    updateDailyChart();
    updateWeeklyChart();
}

function getDataSets(name, startTime, endTime) {
    if (!THE_DATA) return [];

    let dataSet = [];
    const sets = THE_DATA.filter(e => e.metric.labels.instance_name.startsWith(name));

    for (var index in sets) {
        const label = sets[index].metric.labels.instance_name;
        // p.interval.startTime and endTime are the same in our mock data
        const points = sets[index].points
            .filter(p => new Date(p.interval.endTime) >= startTime && new Date(p.interval.endTime) < endTime)
            .map(p => { return { x: p.interval.endTime, y: p.value.doubleValue }; });

        const isGreen = label.startsWith(name + 'g')

        dataSet.push({ 
            label: (isGreen ? 'Green ' : 'Blue ') + parseInt(label.substr(-2)),
            data: points, 
            backgroundColor: isGreen ? '#7bea9d' : '#5766c4',
            borderColor: isGreen ? '#7bea9d' : '#5766c4',
            borderWidth: 1
        });
    }

    console.log(dataSet)

    return dataSet;
}

function getNodeInfo(name){
    if (!THE_DATA) return [];

    let data = [];
    const instanceData = THE_DATA.filter(e => e.metric.labels.instance_name.startsWith(name));

    for (var index in sets) {
        const totalIdleNodes = instanceData[index].points.reduce((acc, object) => object.value.doubleValue <= idleThreshold ? acc + 1 : acc);


    }

    console.log(data)

    return data;
}

function updateDailyChart() {
    dailyChart.data.datasets = getDataSets(targetedFarm, new Date('2022-10-18T00:00:00'), new Date('2022-10-19T00:00:00'));
    dailyChart.update();
}

function updateWeeklyChart() {
    weeklyChart.data.datasets = getDataSets(targetedFarm, new Date('2022-10-12T00:00:00'), new Date('2022-10-19T00:00:00'));
    weeklyChart.update();
}


// Charts
const dailyChart = new Chart(document.getElementById('daily-chart'), {
    type: 'line',
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour'
                }
            }
        }
    }
});

const weeklyChart = new Chart(document.getElementById('weekly-chart'), {
    type: 'line',
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour'
                }
            }
        }
    }
});

const optimalChart = new Chart(document.getElementById('optimal-chart'), {
    type: 'doughnut',
    data: {
        labels: ['Used Nodes', 'Unused Nodes'],
        datasets: [{
            label: '# of Nodes',
            data: [5, 1],
            backgroundColor: [
                '#7bea9d50',
                '#e1060050'
            ],
            borderColor: [
                '#7bea9dff',
                '#e10600ff'
            ],
            borderWidth: 1
        }]
    }
});
