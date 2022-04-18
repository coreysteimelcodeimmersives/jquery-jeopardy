async function readJeopardyData() {
    let rawJeopardyData = await fetch('jeopardy.json');
    let jeopardyData = await rawJeopardyData.json();
    console.log(jeopardyData);
    // group data by date
    let dataByDate = _.groupBy(jeopardyData, 'date');
    console.log(dataByDate)
    console.log(typeof (dataByDate));
    // next group date data by round for each date

    for (let key in dataByDate) {
        console.log(key, dataByDate[key]);
        let roundData = _.groupBy(dataByDate[key], 'round');
        console.log(roundData);
        dataByDate[key] = roundData;
        for (let key in roundData){
            let categoryData = _.groupBy(roundData[key], 'category');
            roundData[key] = categoryData;
        }
    }

    console.log(dataByDate);

}

readJeopardyData();