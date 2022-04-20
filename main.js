// GLOBAL VARIABLES
let selectedQuestions = localStorage.getItem('selectedQuestions');


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
    selectedQuestions = setUpSelectedQuestion();
    setUpQuestionListener();
}

readJeopardyData();



// Helper Functions
function setUpQuestionListener() {
    let questions = document.querySelectorAll('#questions > div > button');

    for (let i = 0; i < questions.length; i++) {
        let question = questions[i];
        question.addEventListener('click', function(){
            if (question.className == 'question'){
                setQuestionToSelected(question.id);
                question.classList.toggle('selected');
            }
            
        })
    }
}

let setUpSelectedQuestion = () => {
    selectedQuestions = localStorage.getItem('selectedQuestions');
    if (selectedQuestions === null){
        selectedQuestions = [];
    } else {
        selectedQuestions = JSON.parse(selectedQuestions);
        for (let i = 0; i < selectedQuestions.length; i++){
            let selectedQuestion = document.querySelector(`#${selectedQuestions[i]}`);
            selectedQuestion.classList.toggle('selected');
        }
    }
    return selectedQuestions;
}

function setQuestionToSelected(str){
    selectedQuestions.push(str);
    localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions));
}