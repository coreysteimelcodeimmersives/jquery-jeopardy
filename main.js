// GLOBAL VARIABLES
let selectedQuestionArr = localStorage.getItem('selectedQuestions');
let selectedQuestionDOM;
let jeopardyRound = localStorage.getItem('jeopardyRound');
let gameData = localStorage.getItem('gameData');
let questions = document.querySelectorAll('#questions > div > button');
let categories = document.querySelectorAll('#categories > button');
let jeopardyCategory = localStorage.getItem('jeopardyCategory');
let roundValuesArr = localStorage.getItem('roundValueArr');
let catOneQuestions = document.querySelectorAll('#catOneQuestions > button');
let catTwoQuestions = document.querySelectorAll('#catTwoQuestions > button');
let catThreeQuestions = document.querySelectorAll('#catThreeQuestions > button');
let catFourQuestions = document.querySelectorAll('#catFourQuestions > button');
let catFiveQuestions = document.querySelectorAll('#catFiveQuestions > button');
let catsixQuestions = document.querySelectorAll('#catsixQuestions > button');
let categoriesDomArr = [catOneQuestions, catTwoQuestions, catThreeQuestions, catFourQuestions, catFiveQuestions, catsixQuestions];


// THE CODE.
async function readJeopardyData() {
    let rawJeopardyData = await fetch('jeopardy.json');
    let jeopardyData = await rawJeopardyData.json();
    let dataByDate = _.groupBy(jeopardyData, 'date');
    for (let key in dataByDate) {
        let roundData = _.groupBy(dataByDate[key], 'round');
        dataByDate[key] = roundData;
        for (let key in roundData) {
            let categoryData = _.groupBy(roundData[key], 'category');
            roundData[key] = categoryData;
            for (let key in categoryData) {
                let valueData = _.groupBy(categoryData[key], 'value');
                categoryData[key] = valueData;
            }
        }
    }
    console.log(dataByDate);
    gameData = setUpGameData(dataByDate);
    jeopardyRound = setUpJeopardyRound();
    console.log(jeopardyRound);
    console.log(gameData[jeopardyRound]);
    jeopardyCategory = setUpCategories(gameData[jeopardyRound]);
    roundValuesArr = setUpValues(gameData[jeopardyRound], jeopardyCategory, categoriesDomArr);
    // resetLocalStorage();
    selectedQuestionArr = setUpSelectedQuestion();
    setUpQuestionListener();
}

readJeopardyData();



// Helper Functions
function setUpQuestionListener() {
    for (let i = 0; i < questions.length; i++) {
        let question = questions[i];
        question.addEventListener('click', function () {
            if (question.className == 'question') {
                setQuestionToSelected(question.id);
                submitAnswer();
            }
        })
    }
}

let setUpSelectedQuestion = () => {
    selectedQuestionArr = localStorage.getItem('selectedQuestions');
    if (selectedQuestionArr === null) {
        selectedQuestionArr = [];
    } else {
        selectedQuestionArr = JSON.parse(selectedQuestionArr);
        for (let i = 0; i < selectedQuestionArr.length; i++) {
            selectedQuestionDOM = document.querySelector(`#${selectedQuestionArr[i]}`);
            selectedQuestionDOM.removeAttribute('data-bs-toggle');
            selectedQuestionDOM.removeAttribute('data-bs-target');
            selectedQuestionDOM.classList.remove('question');
            selectedQuestionDOM.classList.add('selected');
        }
    }
    return selectedQuestionArr;
}

let setUpGameData = (data) => {
    gameData = localStorage.getItem('gameData');
    if (gameData === null) {
        gameData = _.sample(data);
        localStorage.setItem('gameData', JSON.stringify(gameData));
        console.log(gameData);
        return gameData;
    } else {
        gameData = JSON.parse(gameData);
        console.log(gameData);
        return gameData;
    }
}

let setUpCategories = (round) => {
    jeopardyCategory = localStorage.getItem('jeopardyCategory');
    if (jeopardyCategory === null) {
        jeopardyCategory = [];
        i = 0;
        for (let key in round) {
            let categoryText = key;
            jeopardyCategory.push(key);
            let categoryBox = categories[i];
            categoryBox.id = categoryText;
            categoryBox.innerText = key;
            i++
        }
        localStorage.setItem('jeopardyCategory', JSON.stringify(jeopardyCategory));
        return jeopardyCategory;
    } else {
        jeopardyCategory = JSON.parse(jeopardyCategory);
        for (let i = 0; i < categories.length; i++) {
            let categoryBox = categories[i];
            categoryBox.id = jeopardyCategory[i];
            categoryBox.innerText = jeopardyCategory[i];
        }
        return jeopardyCategory;
    }

}

let setUpValues = (round, jepCatArr, catDomArr) => {
    roundValuesArr = localStorage.getItem('roundValuesArr');
    if (roundValuesArr === null) {
        roundValuesArr = [];
        for (let i = 0; i < jepCatArr.length; i++) {
            let catName = jepCatArr[i];
            let arr = [];
            let questionCategoryDom = catDomArr[i];
            let x = 0;
            for (key in round[catName]) {
                arr.push(key);
                let questionValue = questionCategoryDom[x];
                questionValue.innerText = key;
                x++;
            }
            roundValuesArr.push(arr);
        }
        localStorage.setItem('roundValuesArr', JSON.stringify(roundValuesArr));
        return roundValuesArr;
    } else {
        roundValuesArr = JSON.parse(roundValuesArr);
        console.log(roundValuesArr)
        for (let i = 0; i < categoriesDomArr.length; i++){
            let categoryRow = categoriesDomArr[i];
            let values = roundValuesArr[i];
            console.log('this the values for the row')
            console.log(values);
            console.log('this is the row length, should be 5 everytime')
            console.log(categoryRow.length);
            let diffChecker = categoryRow.length - values.length;
            console.log('this is the difference in values')
            console.log(diffChecker);
            if (diffChecker != 0){
                for (let i = 0; i < diffChecker; i++){
                    values.push('X');
                }
            }
            console.log('RECHECK VALUES LENGTH -- SHOULD BE 5 NOW');
            console.log(values.length);
            for (let i = 0; i < categoryRow.length; i++){
                let question = categoryRow[i];
                question.innerText = values[i];
            }
        }
    //     for (let i = 0; jepCatArr.length; i++) {
    //         let catName = jepCatArr[i];
    //         let questionCategoryDom = catDomArr[i];
    //         let x = 0;
    //         for (key in round[catName]) {
    //             let questionValue = questionCategoryDom[x];
    //             questionValue.innerText = key;
    //             x++;
    //         }
    //     }
    //     return roundValuesArr;
    }
}

let setUpJeopardyRound = () => {
    jeopardyRound = localStorage.getItem('jeopardyRound');
    if (jeopardyRound === null) {
        jeopardyRound = "Jeopardy!"
    }
    return jeopardyRound;
}

function setQuestionToSelected(str) {
    selectedQuestionDOM = document.querySelector(`#${str}`);
    selectedQuestionDOM.removeAttribute('data-bs-toggle');
    selectedQuestionDOM.removeAttribute('data-bs-target');
    selectedQuestionDOM.classList.remove('question');
    selectedQuestionDOM.classList.add('selected');
    selectedQuestionArr.push(str);
    localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestionArr));
}

function submitAnswer() {
    let answerInput = document.querySelector('#answerInput');
    let submitButton = document.querySelector('#submitButton');
    submitButton.addEventListener('click', function () {
        console.log('answer input?')
        console.log(answerInput.value);

    })
}

function resetLocalStorage() {
    selectedQuestionArr = [];
    localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestionArr));
    localStorage.clear();
}