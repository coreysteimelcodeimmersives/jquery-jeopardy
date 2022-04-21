// GLOBAL VARIABLES
let selectedquestionsArr = localStorage.getItem('selectedQuestions');
let selectedQuestionDOM;
let jeopardyRound = localStorage.getItem('jeopardyRound');
let gameData = localStorage.getItem('gameData');
let roundData = localStorage.getItem('roundData');
let questions = document.querySelectorAll('#questions > div > button');
let categories = document.querySelectorAll('#categories > button');
let categoriesArr = localStorage.getItem('categoriesArr');
let valuesArr = localStorage.getItem('valuesArr');
let questionsArr = localStorage.getItem('questionsArr');
let answersArr = localStorage.getItem('answersArr');
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
    // resetLocalStorage();
    gameData = setUpGameData(dataByDate);
    jeopardyRound = setUpJeopardyRound();
    roundData = setUpRoundData(gameData, jeopardyRound);
    categoriesArr = setUpLocalStorageCategoriesArr(roundData);
    setUpCategoriesDoms(categoriesArr);
    valuesArr = setUpLocalStorageValuesArr(roundData, categoriesArr);
    setUpValueDoms(valuesArr);
    questionsArr = setUpLocalStorageQuestionsArr(roundData, categoriesArr, valuesArr);
    setUpQuestionDoms(questionsArr);
    answersArr = setUpLocalStorageAnswersArr(roundData, categoriesArr, valuesArr);
    setUpAnswerDoms(answersArr);
    selectedquestionsArr = setUpSelectedQuestion();
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
                let questionStr = question.getAttribute('data-question');
                setQuestionModalText(questionStr);
                let answerStr = question.getAttribute('data-answer');
                submitAnswer(answerStr);
            }
        })
    }
}

let setUpSelectedQuestion = () => {
    selectedquestionsArr = localStorage.getItem('selectedQuestions');
    if (selectedquestionsArr === null) {
        selectedquestionsArr = [];
    } else {
        selectedquestionsArr = JSON.parse(selectedquestionsArr);
        for (let i = 0; i < selectedquestionsArr.length; i++) {
            selectedQuestionDOM = document.querySelector(`#${selectedquestionsArr[i]}`);
            selectedQuestionDOM.removeAttribute('data-bs-toggle');
            selectedQuestionDOM.removeAttribute('data-bs-target');
            selectedQuestionDOM.classList.remove('question');
            selectedQuestionDOM.classList.add('selected');
        }
    }
    return selectedquestionsArr;
}

let setUpGameData = (data) => {
    gameData = localStorage.getItem('gameData');
    if (gameData === null) {
        gameData = _.sample(data);
        localStorage.setItem('gameData', JSON.stringify(gameData));
        console.log('if block: game data')
        console.log(gameData);
        return gameData;
    } else {
        gameData = JSON.parse(gameData);
        console.log('else block: game data')
        console.log(gameData);
        return gameData;
    }
}

let setUpRoundData = (gameData, jeopardyRound) => {
    roundData = localStorage.getItem('roundData');
    if (roundData === null) {
        roundData = gameData[jeopardyRound];
        localStorage.setItem('roundData', JSON.stringify(roundData));
        console.log('if block: round data');
        console.log(roundData);
        return roundData;
    } else {
        roundData = JSON.parse(roundData);
        console.log('else block: round data');
        console.log(roundData);
        return roundData;
    }
}

let setUpCategoriesDoms = (categoriesArr) => {
    for (let i = 0; i < categories.length; i++) {
        let categoryBox = categories[i];
        categoryBox.id = categoriesArr[i];
        categoryBox.innerText = categoriesArr[i];
    }
}

let setUpLocalStorageCategoriesArr = (roundData) => {
    categoriesArr = localStorage.getItem('categoriesArr');
    if (categoriesArr === null) {
        categoriesArr = [];
        for (let key in roundData) {
            categoriesArr.push(key);
        }
        localStorage.setItem('categoriesArr', JSON.stringify(categoriesArr));
        console.log('if block: categories arr');
        console.log(categoriesArr);
        return categoriesArr;
    } else {
        categoriesArr = JSON.parse(categoriesArr);
        console.log('else block: categories arr');
        console.log(categoriesArr);
        return categoriesArr;
    }

}

let setUpLocalStorageAnswersArr = (roundData, categoriesArr, valuesArr) => {
    answersArr = localStorage.getItem('answersArr');
    if (answersArr === null) {
        answersArr = [];
        valuesArrCount = 0;
        for (let i = 0; i < categoriesArr.length; i++) {
            let categoryAnswersArr = [];
            let categoryName = categoriesArr[i];
            let categoryValueArr = valuesArr[valuesArrCount];
            for (let i = 0; i < categoryValueArr.length; i++) {
                let answerValue = categoryValueArr[i];
                for (key in roundData[categoryName][answerValue]) {
                    let answer = roundData[categoryName][answerValue][key].answer;
                    // answer.toLowerCase();
                    categoryAnswersArr.push(answer);
                }
            }
            valuesArrCount++
            answersArr.push(categoryAnswersArr);
        }
        console.log('if block: answer arr');
        console.log(answersArr);
        localStorage.setItem('answersArr', JSON.stringify(answersArr));
        return answersArr;
    } else {
        answersArr = JSON.parse(answersArr);
        console.log('the else block: answers arr');
        console.log(answersArr);
        return answersArr;
    }
}

let setUpLocalStorageQuestionsArr = (roundData, categoriesArr, valuesArr) => {
    questionsArr = localStorage.getItem('questionsArr');
    if (questionsArr === null) {
        questionsArr = [];
        valuesArrCount = 0;
        for (let i = 0; i < categoriesArr.length; i++) {
            let categoryQuestionsArr = [];
            let categoryName = categoriesArr[i];
            let categoryValueArr = valuesArr[valuesArrCount];
            for (let i = 0; i < categoryValueArr.length; i++) {
                let questionValue = categoryValueArr[i];
                for (key in roundData[categoryName][questionValue]) {
                    let question = roundData[categoryName][questionValue][key].question;
                    categoryQuestionsArr.push(question);
                }
            }
            valuesArrCount++
            questionsArr.push(categoryQuestionsArr);
        }
        console.log('if block: question arr');
        console.log(questionsArr);
        localStorage.setItem('questionsArr', JSON.stringify(questionsArr));
        return questionsArr;
    } else {
        questionsArr = JSON.parse(questionsArr);
        console.log('the else block: question arr');
        console.log(questionsArr);
        return questionsArr;
    }
}

let setUpLocalStorageValuesArr = (roundData, categoriesArr) => {
    valuesArr = localStorage.getItem('valuesArr');
    if (valuesArr === null) {
        valuesArr = [];
        for (let i = 0; i < categoriesArr.length; i++) {
            let catName = categoriesArr[i];
            let arr = [];
            for (key in roundData[catName]) {
                arr.push(key);
            }
            valuesArr.push(arr);
        }
        localStorage.setItem('valuesArr', JSON.stringify(valuesArr));
        console.log('if block: round value arr')
        console.log(valuesArr);
        return valuesArr;
    } else {
        valuesArr = JSON.parse(valuesArr);
        console.log('else block: round value arr')
        console.log(valuesArr);
        return valuesArr;
    }
}

let setUpValueDoms = (valuesArr) => {
    for (let i = 0; i < categoriesDomArr.length; i++) {
        let categoryRow = categoriesDomArr[i];
        let values = valuesArr[i];
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

let setUpAnswerDoms = (answersArr) => {
    for (let i = 0; i < categoriesDomArr.length; i++){
        let categoryRow = categoriesDomArr[i];
        let answers = answersArr[i];
        let diffChecker = categoryRow.length - answers.length;
        if (diffChecker != 0) {
            for (let i = 0; i < diffChecker; i++){
                answers.push('X');
            }
        }
        for (let i = 0; i < categoryRow.length; i++){
            let answer = categoryRow[i];
            answer.setAttribute('data-answer', answers[i]);
        }
    }
}


let setUpQuestionDoms = (questionsArr) => {
    for (let i = 0; i < categoriesDomArr.length; i++){
        let categoryRow = categoriesDomArr[i];
        let questions = questionsArr[i];
        let diffChecker = categoryRow.length - questions.length;
        if (diffChecker != 0) {
            for (let i = 0; i < diffChecker; i++){
                questions.push('X');
            }
        }
        for (let i = 0; i < categoryRow.length; i++){
            let question = categoryRow[i];
            question.setAttribute('data-question', questions[i]);
        }
    }
}

let setUpJeopardyRound = () => {
    jeopardyRound = localStorage.getItem('jeopardyRound');
    if (jeopardyRound === null) {
        jeopardyRound = "Jeopardy!"
    }
    console.log('round')
    console.log(jeopardyRound);
    return jeopardyRound;
}

function setQuestionToSelected(str) {
    selectedQuestionDOM = document.querySelector(`#${str}`);
    selectedQuestionDOM.removeAttribute('data-bs-toggle');
    selectedQuestionDOM.removeAttribute('data-bs-target');
    selectedQuestionDOM.classList.remove('question');
    selectedQuestionDOM.classList.add('selected');
    selectedquestionsArr.push(str);
    localStorage.setItem('selectedQuestions', JSON.stringify(selectedquestionsArr));
}

function setQuestionModalText(str) {
    let questionModalBody = document.querySelector('#questionBody');
    questionModalBody.innerText = `\n${str}`;
}

function submitAnswer(answerStr) {
    let answerInput = document.querySelector('#answerInput');
    let submitButton = document.querySelector('#submitButton');
    submitButton.addEventListener('click', function () {
        console.log('answer input?')
        console.log(answerInput.value);
        let userSubmission = answerInput.value;
        userSubmission.toLowerCase();
        answerStr.toLowerCase();
        let answerModalBody = document.querySelector('#answerBody');
        if (userSubmission == answerStr){
            answerModalBody.innerText = '\nCongratulations, you are correct!';
        } else {
            answerModalBody.innerText = `\nI'm sorry. The correct answer is:\n\n${answerStr}`;
        }
    });
};

function resetLocalStorage() {
    selectedquestionsArr = [];
    localStorage.setItem('selectedQuestions', JSON.stringify(selectedquestionsArr));
    localStorage.clear();
}