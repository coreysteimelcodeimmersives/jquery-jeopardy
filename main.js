// GLOBAL VARIABLES
let selectedQuestionArr = localStorage.getItem('selectedQuestions');
let selectedQuestionDOM;
let jeopardyRound = localStorage.getItem('jeopardyRound');
let gameData = localStorage.getItem('gameData');
let questions = document.querySelectorAll('#questions > div > button');
let categories = document.querySelectorAll('#categories > button');
let categoryArr = localStorage.getItem('categoryArr');
let valueArr = localStorage.getItem('valueArr');
let questionArr = localStorage.getItem('questionArr');
let roundAnswersArr = localStorage.getItem('roundAnswersArr');
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
    console.log('round')
    console.log(jeopardyRound);
    console.log('round data')
    let roundData = gameData[jeopardyRound];
    console.log(roundData);
    categoryArr = setUpCategories(roundData);
    valueArr = setUpLocalStorageValuesArr(roundData, categoryArr);
    setUpQuestionValueDoms(valueArr, categoriesDomArr);
    console.log('value doms arr')
    console.log(valueArr);
    questionArr =
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

let setUpCategories = (roundData) => {
    categoryArr = localStorage.getItem('categoryArr');
    if (categoryArr === null) {
        categoryArr = [];
        i = 0;
        for (let key in roundData) {
            let categoryText = key;
            categoryArr.push(key);
            let categoryBox = categories[i];
            categoryBox.id = categoryText;
            categoryBox.innerText = key;
            i++
        }
        localStorage.setItem('categoryArr', JSON.stringify(categoryArr));
        return categoryArr;
    } else {
        categoryArr = JSON.parse(categoryArr);
        for (let i = 0; i < categories.length; i++) {
            let categoryBox = categories[i];
            categoryBox.id = categoryArr[i];
            categoryBox.innerText = categoryArr[i];
        }
        return categoryArr;
    }

}

let setUpLocalStorageQuestionsArr = (roundData, categoryArr, valueArr) => {
    questionArr = localStorage.getItem('questionArr');
    if (questionArr === null) {
        questionArr = [];
        for (let i = 0; i < valueArr.length; i++){

        }
        
    } else {
        questionArr = JSON.parse(questionArr);
        console.log('the else round question arr');
        console.log(questionArr);
        return questionArr;
    }
}

let setUpLocalStorageValuesArr = (roundData, categoryArr) => {
    valueArr = localStorage.getItem('valueArr');
    if (valueArr === null) {
        valueArr = [];
        for (let i = 0; i < categoryArr.length; i++) {
            let catName = categoryArr[i];
            let arr = [];
            let x = 0;
            for (key in roundData[catName]) {
                arr.push(key);
                x++;
            }
            valueArr.push(arr);
        }
        localStorage.setItem('valueArr', JSON.stringify(valueArr));
        console.log('round value arr')
        console.log(valueArr);
        return valueArr;
    } else {
        valueArr = JSON.parse(valueArr);
        return valueArr;
    }
}

let setUpQuestionValueDoms = (valueArr, categoriesDomArr) => {
    for (let i = 0; i < categoriesDomArr.length; i++) {
        let categoryRow = categoriesDomArr[i];
        let values = valueArr[i];
        let diffChecker = categoryRow.length - values.length;
        if (diffChecker != 0) {
            for (let i = 0; i < diffChecker; i++) {
                values.push('X');
            }
        }
        for (let i = 0; i < categoryRow.length; i++) {
            let question = categoryRow[i];
            question.innerText = values[i];
        }
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