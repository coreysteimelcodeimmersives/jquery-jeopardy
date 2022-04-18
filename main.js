async function readJeopardyData() {
    let rawJeopardyData = await fetch('jeopardy.json');
    let jeopardyData = await rawJeopardyData.json();
    console.log(jeopardyData);
    let groupData = _.groupBy(jeopardyData, 'date');
    console.log(groupData)
}

readJeopardyData();