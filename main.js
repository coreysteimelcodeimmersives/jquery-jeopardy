// GLOBAL VARIABLES
let selectedQuestionArr = localStorage.getItem('selectedQuestions');
let selectedQuestionDOM;


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
    selectedQuestionArr = setUpSelectedQuestion();
    setUpQuestionListener();
}

readJeopardyData();



// Helper Functions
// function setQuestionToSelected

function setUpQuestionListener() {
    let questions = document.querySelectorAll('#questions > div > button');
    for (let i = 0; i < questions.length; i++) {
        let question = questions[i];
        question.addEventListener('click', function () {
            if (question.className == 'question') {
                setQuestionToSelected(question.id);
                // question.classList.toggle('selected');
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
}