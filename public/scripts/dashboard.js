let idleThreshold; // set by input element
let THE_DATA;

fetch('/Data.JSON')
    .then((response) => response.json())
    .then((json) => filterData(json.timeSeries));


function filterData(json) {
    THE_DATA = json.filter(e => e.metric.labels.instance_name.startsWith("fnccuweb"));
    console.log(THE_DATA);

    updateIdleThreshold();
    updateDailyChart();
    updateWeeklyChart();
    updateOptimalChart();
}

// Manipulate THE_DATA
function getDataSets(name, startTime, endTime) {
    if (!THE_DATA) return [];

    let dataSet = [];
    const sets = THE_DATA.filter(e => e.metric.labels.instance_name.startsWith(name));

    for (var index in sets) {
        const label = sets[index].metric.labels.instance_name;
        // p.interval.startTime and endTime are the same in our mock data
        // p.value.doubleValue is from 0-1, multiply by 100 to get percentage utilization
        const points = sets[index].points
            .filter(p => new Date(p.interval.endTime) >= startTime && new Date(p.interval.endTime) < endTime)
            .map(p => { return { x: p.interval.endTime, y: p.value.doubleValue * 100 }; });

        const isGreen = label.startsWith(name + 'g')

        dataSet.push({ 
            label: (isGreen ? 'Green ' : 'Blue ') + parseInt(label.substr(-2)),
            data: points, 
            backgroundColor: isGreen ? '#7bea9d' : '#5766c4',
            borderColor: isGreen ? '#7bea9d' : '#5766c4',
            borderWidth: 1
        });
    }

    return dataSet;
}

function getNodeInfo(name){
    if (!THE_DATA) return [];

    // Use all data related to a node instead of just a week's time span
    const instanceData = THE_DATA.filter(e => e.metric.labels.instance_name.startsWith(name));

    let unusedCount = 0;
    for (var index in instanceData){
        if (Math.max(...instanceData[index].points.map(p => p.value.doubleValue * 100)) <= idleThreshold)
            unusedCount++;
    }

    return [instanceData.length - unusedCount, unusedCount];
}

// Chart updates
function updateDailyChart() {
    dailyChart.data.datasets = getDataSets(targetedFarm, new Date('2022-10-18T12:00:00'), new Date('2022-10-19T12:00:00'));
    dailyChart.update();
}

function updateWeeklyChart() {
    weeklyChart.data.datasets = getDataSets(targetedFarm, new Date('2022-10-12T00:00:00'), new Date('2022-10-19T12:00:00'));
    weeklyChart.update();
}

function updateOptimalChart() {
    optimalChart.data.datasets[0].data = getNodeInfo(targetedFarm);
    optimalChart.update();
}

function updateIdleThreshold() {
    idleThreshold = document.getElementById("idleThresholdInput").value;
    console.log(idleThreshold);
    updateOptimalChart();
}

document.getElementById("idleThresholdInput").addEventListener("change", updateIdleThreshold);

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
            },
            y: {
                ticks: {
                    callback: function (value) {
                        console.log(value.toString().substr(0, 5))
                        return value.toString().substr(0, 5) + '%';
                    }
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
                    unit: 'day'
                }
            },
            y: {
                ticks: {
                    callback: function (value) {
                        console.log(value.toString().substr(0, 5))
                        return value.toString().substr(0, 5) + '%';
                    }
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
