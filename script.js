// משתנים גלובליים
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 10; // ברירת מחדל למוד רגיל
let usedQuestions = [];
let gameMode = 'normal'; // 'normal' או 'endless'
let allQuestions = [...questions]; // עותק של כל השאלות למוד אין סוף
let answered = false;

// DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const normalModeBtn = document.getElementById('normalModeBtn');
const endlessModeBtn = document.getElementById('endlessModeBtn');
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const percentageElement = document.getElementById('percentage');
const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');
const explanationContainer = document.getElementById('explanation-container');
const explanationText = document.getElementById('explanation-text');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    normalModeBtn.addEventListener('click', () => startGame('normal'));
    endlessModeBtn.addEventListener('click', () => startGame('endless'));
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartGame);
    shareBtn.addEventListener('click', shareResults);
});

function startGame(mode) {
    gameMode = mode;
    
    if (mode === 'normal') {
        totalQuestions = 10;
        usedQuestions = [];
        // בחירת 10 שאלות אקראיות
        allQuestions = getRandomQuestions(questions, 10);
    } else {
        totalQuestions = questions.length;
        // כל השאלות ברצף אקראי
        allQuestions = shuffleArray([...questions]);
    }
    
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    
    welcomeScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    loadQuestion();
    updateProgress();
}

function getRandomQuestions(questionArray, count) {
    const shuffled = shuffleArray([...questionArray]);
    return shuffled.slice(0, count);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function loadQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        showResults();
        return;
    }
    
    const question = allQuestions[currentQuestionIndex];
    answered = false;
    
    // הסתרת הסבר מהשאלה הקודמת
    explanationContainer.style.display = 'none';
    
    questionElement.textContent = question.question;
    
    answersElement.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        
        const answerLetter = document.createElement('div');
        answerLetter.className = 'answer-letter';
        answerLetter.textContent = String.fromCharCode(65 + index); // A, B, C, D
        
        const answerText = document.createElement('span');
        answerText.textContent = answer;
        
        answerDiv.appendChild(answerLetter);
        answerDiv.appendChild(answerText);
        
        answerDiv.addEventListener('click', () => selectAnswer(index, question.correct, question.explanation));
        answersElement.appendChild(answerDiv);
    });
    
    nextBtn.style.display = 'none';
    updateProgress();
}

function selectAnswer(selectedIndex, correctIndex, explanation) {
    if (answered) return;
    answered = true;
    
    const answerOptions = document.querySelectorAll('.answer-option');
    
    answerOptions.forEach((option, index) => {
        option.style.pointerEvents = 'none';
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === correctIndex) {
        score++;
        updateScore();
    }
    
    // הצגת הסבר
    setTimeout(() => {
        showExplanation(explanation, selectedIndex === correctIndex);
    }, 800);
    
    nextBtn.style.display = 'block';
}

function showExplanation(explanation, isCorrect) {
    explanationText.textContent = explanation;
    explanationContainer.style.display = 'block';
    
    // הוספת צבע רקע בהתאם לתשובה
    if (isCorrect) {
        explanationContainer.style.borderColor = '#10b981';
        explanationContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    } else {
        explanationContainer.style.borderColor = '#ef4444';
        explanationContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    }
    
    // אנימציה
    explanationContainer.style.opacity = '0';
    explanationContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        explanationContainer.style.transition = 'all 0.3s ease';
        explanationContainer.style.opacity = '1';
        explanationContainer.style.transform = 'translateY(0)';
    }, 50);
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function updateProgress() {
    const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressFill.style.width = `${Math.min(progressPercent, 100)}%`;
    
    if (gameMode === 'endless') {
        progressText.textContent = `שאלה ${currentQuestionIndex + 1} מתוך ${totalQuestions}`;
    } else {
        progressText.textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
    }
}

function updateScore() {
    scoreElement.textContent = score;
}

function showResults() {
    gameScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    finalScoreElement.textContent = `${score}/${totalQuestions}`;
    percentageElement.textContent = `${percentage}%`;
    
    // הודעת תוצאה בהתאם למוד המשחק
    const resultMessage = document.getElementById('result-message');
    if (gameMode === 'endless') {
        if (percentage >= 90) {
            resultMessage.textContent = '🏆 מעולה! אתה מוכן למבחן!';
        } else if (percentage >= 80) {
            resultMessage.textContent = '🎯 כל הכבוד! ביצועים טובים מאוד!';
        } else if (percentage >= 70) {
            resultMessage.textContent = '👍 לא רע! עוד קצת תרגול ותהיה מושלם!';
        } else {
            resultMessage.textContent = '📚 כדאי לחזור על החומר ולנסות שוב!';
        }
    } else {
        if (percentage >= 80) {
            resultMessage.textContent = '🎉 כל הכבוד! ביצועים מעולים!';
        } else if (percentage >= 60) {
            resultMessage.textContent = '👏 לא רע! תמשיך להתאמן!';
        } else {
            resultMessage.textContent = '💪 עוד קצת תרגול ותשתפר!';
        }
    }
    
    // שמירת תוצאה
    saveScore(score, totalQuestions, gameMode);
}

function restartGame() {
    resultsScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
}

function shareResults() {
    const percentage = Math.round((score / totalQuestions) * 100);
    const modeText = gameMode === 'endless' ? 'במוד אין סוף' : 'במוד רגיל';
    const text = `השגתי ${score}/${totalQuestions} (${percentage}%) בחידון תמחור ביטוח פנסיוני ${modeText}! 🎓📊`;
    
    if (navigator.share) {
        navigator.share({
            title: 'חידון תמחור ביטוח פנסיוני',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('התוצאה הועתקה ללוח!');
        });
    }
}

function saveScore(currentScore, total, mode) {
    const scores = JSON.parse(localStorage.getItem('pensionQuizScores') || '[]');
    scores.push({
        score: currentScore,
        total: total,
        percentage: Math.round((currentScore / total) * 100),
        mode: mode,
        date: new Date().toLocaleDateString('he-IL')
    });
    
    // שמירת רק 10 התוצאות האחרונות
    if (scores.length > 10) {
        scores.splice(0, scores.length - 10);
    }
    
    localStorage.setItem('pensionQuizScores', JSON.stringify(scores));
} 