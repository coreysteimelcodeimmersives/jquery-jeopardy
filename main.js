// GLOBAL VARIABLES
let selectedQuestionsArr = localStorage.getItem('selectedQuestions');
let selectedQuestionDOM;
let jeopardyRound = localStorage.getItem('jeopardyRound');
let gameData = localStorage.getItem('gameData');
let roundData = localStorage.getItem('roundData');
// let questions = document.querySelectorAll('#questions > div > button');
let questions = document.querySelector('#questions');
let categories = document.querySelectorAll('#categories > button');
let categoriesArr = localStorage.getItem('categoriesArr');
let valuesArr = localStorage.getItem('valuesArr');
let questionsArr = localStorage.getItem('questionsArr');
let answersArr = localStorage.getItem('answersArr');
let userScore = localStorage.getItem('userScore');
let catOneQuestions = document.querySelectorAll('#catOneQuestions > button');
let catTwoQuestions = document.querySelectorAll('#catTwoQuestions > button');
let catThreeQuestions = document.querySelectorAll('#catThreeQuestions > button');
let catFourQuestions = document.querySelectorAll('#catFourQuestions > button');
let catFiveQuestions = document.querySelectorAll('#catFiveQuestions > button');
let catsixQuestions = document.querySelectorAll('#catsixQuestions > button');
let categoriesDomArr = [catOneQuestions, catTwoQuestions, catThreeQuestions, catFourQuestions, catFiveQuestions, catsixQuestions];
let answerForm = document.querySelector('#myAnswerFormArea');
let answerInput = document.querySelector('#answerInput');
let submitButton = document.querySelector('#submitButton')
let continueButton = document.querySelector('#continueButton');
let answerStr = '';
let questionValue = 0;
let userSubmission = '';
let answerModalBody = document.querySelector('#answerBody');
let questionForm = document.querySelector('#myQuestionFormArea');
let questionObj;
let endSubmit = false;
let questionId = '';



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
    jeopardyRound = setUpLocalStorageJeopardyRound();
    setUpJeopardyRoundDom(jeopardyRound);
    userScore = setUpLocalStorageUserScore();
    setUserScoreDom(userScore);
    roundData = setUpRoundData(gameData, jeopardyRound);
    categoriesArr = setUpLocalStorageCategoriesArr(roundData);
    setUpCategoriesDoms(categoriesArr);
    selectedQuestionsArr = setUpSelectedQuestion();
    valuesArr = setUpLocalStorageValuesArr(roundData, categoriesArr);
    setUpValueDoms(valuesArr);
    questionsArr = setUpLocalStorageQuestionsArr(roundData, categoriesArr, valuesArr);
    setUpQuestionDoms(questionsArr);
    answersArr = setUpLocalStorageAnswersArr(roundData, categoriesArr, valuesArr);
    setUpAnswerDoms(answersArr);
    getQuestion(submitUserAnswer);

}

readJeopardyData();
// getQuestion(submitUserAnswer);
// submitUserAnswer();



// Helper Functions
function currencyToNum(val) {
    console.log('val')
    console.log(val);
    let newVal = '';
    let numArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    for (let i = 0; i < val.length; i++) {
        console.log(val[i])
        if (numArr.includes(val[i])) {
            newVal = newVal + val[i];
            console.log(newVal);
        }

    }
    return newVal;
}

function getQuestion(myCallback) {
    // for (let i = 0; i < questions.length; i++) {
    // let question = questions[i];
    questions.addEventListener('click', function (event) {
        console.log('the question is');
        console.log(event.target);
        myCallback(event.target)
    });
    // }
}

function submitUserAnswer(question) {
    if (question.className == 'question') {
        let questionStr = question.getAttribute('data-question');
        setQuestionModalText(questionStr);
        questionForm.style.display = "block";
        answerStr = question.getAttribute('data-answer');
        questionValue = Number(currencyToNum(question.innerText));
        console.log('question value');
        console.log(questionValue);
        console.log('answer value');
        console.log(answerStr);
        console.log('question id')
        questionId = question.id;
        console.log(questionId);
        endSubmit = false;
        submitButton.addEventListener('click', function () {
            if (!endSubmit) {
                userSubmission = answerInput.value
                if (userSubmission != null) {
                    userSubmission = userSubmission.toLowerCase();
                }
                answerStrLC = answerStr.toLowerCase();
                if (userSubmission == answerStrLC) {
                    answerModalBody.innerText = '\nCongratulations, you are correct!';
                } else if (userSubmission != answerStrLC) {
                    answerModalBody.innerText = `\nI'm sorry. The correct answer is:\n\n${answerStr}`;
                    questionValue = (-1) * questionValue;
                }
                userScore = Number(userScore) + questionValue;
                userScore = userScore.toString();
                localStorage.setItem('userScore', userScore);
                setUserScoreDom(userScore);
                setQuestionToSelected(questionId);
                questionForm.style.display = 'none';
                answerForm.style.display = 'block';
                answerInput.value = '';
                endSubmit = true;
            }
        });
    }

}

continueButton.addEventListener('click', function () {
    answerForm.style.display = 'none';
})

let setUpSelectedQuestion = () => {
    selectedQuestionsArr = localStorage.getItem('selectedQuestions');
    if (selectedQuestionsArr === null) {
        selectedQuestionsArr = [];
        console.log('if block: selected questions arr')
        console.log(selectedQuestionsArr);
    } else {
        selectedQuestionsArr = JSON.parse(selectedQuestionsArr);
        for (let i = 0; i < selectedQuestionsArr.length; i++) {
            selectedQuestionDOM = document.querySelector(`#${selectedQuestionsArr[i]}`);
            selectedQuestionDOM.classList.remove('question');
            selectedQuestionDOM.classList.add('selected');
        }
        console.log('if block: selected questions arr')
        console.log(selectedQuestionsArr);
    }
    return selectedQuestionsArr;
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
            if (values[i] == 'X') {
                question.removeAttribute('data-bs-toggle');
                question.removeAttribute('data-bs-target');
                question.classList.remove('question');
                question.classList.add('selected');
                selectedQuestionsArr.push(question.id);
                localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestionsArr));
            }
        }
    }
}

let setUpAnswerDoms = (answersArr) => {
    for (let i = 0; i < categoriesDomArr.length; i++) {
        let categoryRow = categoriesDomArr[i];
        let answers = answersArr[i];
        let diffChecker = categoryRow.length - answers.length;
        if (diffChecker != 0) {
            for (let i = 0; i < diffChecker; i++) {
                answers.push('X');
            }
        }
        for (let i = 0; i < categoryRow.length; i++) {
            let answer = categoryRow[i];
            answer.setAttribute('data-answer', answers[i]);
        }
    }
}


let setUpQuestionDoms = (questionsArr) => {
    for (let i = 0; i < categoriesDomArr.length; i++) {
        let categoryRow = categoriesDomArr[i];
        let questions = questionsArr[i];
        let diffChecker = categoryRow.length - questions.length;
        if (diffChecker != 0) {
            for (let i = 0; i < diffChecker; i++) {
                questions.push('X');
            }
        }
        for (let i = 0; i < categoryRow.length; i++) {
            let question = categoryRow[i];
            question.setAttribute('data-question', questions[i]);
        }
    }
}

let setUpJeopardyRoundDom = (jeopardyRound) => {
    let jeopardyRoundDom = document.querySelector('#title > h1');
    jeopardyRoundDom.innerText = jeopardyRound.toUpperCase();
}

let setUpLocalStorageJeopardyRound = () => {
    jeopardyRound = localStorage.getItem('jeopardyRound');
    if (jeopardyRound === null) {
        jeopardyRound = "Jeopardy!"
        localStorage.setItem('jeopardyRound', jeopardyRound);
        console.log('if block: round')
        console.log(jeopardyRound);
        return jeopardyRound;
    } else {
        console.log('else block: round');
        console.log(jeopardyRound);
        return jeopardyRound;
    }

}

let setUserScoreDom = (userScore) => {
    let userScoreDom = document.querySelector('#score > h3');
    console.log('set dom user score')
    console.log(userScore);
    userScoreDom.innerText = `YOUR SCORE: ${userScore}`;
}

let setUpLocalStorageUserScore = () => {
    userScore = localStorage.getItem('userScore');
    if (userScore === null) {
        userScore = 0;
        localStorage.setItem('userScore', userScore);
        console.log('if block: user score');
        console.log(userScore);
        return userScore;
    } else {
        console.log('else block: user score');
        console.log(userScore);
        return userScore;
    }
}

function setQuestionToSelected(str) {
    selectedQuestionDOM = document.querySelector(`#${str}`);
    console.log('turn this question to selected')
    console.log(selectedQuestionDOM)
    selectedQuestionDOM.classList.remove('question');
    selectedQuestionDOM.classList.add('selected');
    selectedQuestionsArr.push(str);
    localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestionsArr));
}

function setQuestionModalText(str) {
    let questionModalBody = document.querySelector('#questionBody');
    questionModalBody.innerText = `\n${str}`;
}



function resetLocalStorage() {
    selectedQuestionsArr = [];
    localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestionsArr));
    localStorage.setItem('userScore', 0);
    // localStorage.clear();
}