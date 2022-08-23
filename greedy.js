
// array of dice images
const diceImgs = ["images/dice1.png", "images/dice2.png", "images/dice3.png", "images/dice4.png", "images/dice5.png", "images/dice6.png", "images/blank.png"];
const diceText = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "⚫️", "🦨"];

// buttons
const rollButton = document.querySelector('.roll-button');
rollButton.onclick = function() {roll();};
const scoreboard = document.querySelector('.score');

const helpButton = document.querySelector('.info');
const helpModal = document.querySelector('#help-modal-container');
helpButton.onclick = function () {helpModal.style.display = "block";};
const closeHelpModal = document.querySelector('#close-info');
closeHelpModal.onclick = function() {helpModal.style.display = "none";};

let finalScoreMsg = '';

const midnight = new Date();
midnight.setHours(23, 59, 59, 0);

window.onclick = function(event) {
    if (event.target == helpModal) {
      helpModal.style.display = "none";
    }
}

const flipDice = (container, state, diceImg) => {
    container.classList.add('flip-in');

    setTimeout(() => {
        container.classList.add(state);
    }, 250);

    setTimeout(() => {
        container.classList.remove('flip-in');
        container.classList.add('flip-out');
        container.appendChild(diceImg);
    }, 250);
}

// every dice element
const diceContainers = document.querySelectorAll('.dice');

// global variables
let diceNumber = 0;
let dice = 6;
let points = 0;
let passButtonCreated = false;


// check if cookies exist
if (Cookies.get('points') != null){
    points = parseInt(Cookies.get('points'));
    dice = parseInt((Cookies.get('dice')));
    let diceImages = Cookies.get('diceImage');
    diceImages = diceImages.split(' ');
    let greenDice = Cookies.get('greenDice');
    greenDice = greenDice.split(' ');
    for (let i = 0; i < diceImages.length - 1; i++){
        const diceImage = document.createElement('img');
        diceImage.src = diceImages[i + 1];
        flipDice(diceContainers[diceNumber], greenDice[i + 1], diceImage);
        diceNumber++;
    }

    createPassButton();

    const pBoard = document.querySelector('.score');
    pBoard.textContent = points;
    finalScoreMsg = Cookies.get('finalScoreMsg');

    if (Cookies.get('gameover') != null){
        if (Cookies.get('points') == -1){
            scoreboard.textContent = 'Skunked 😂';
        }
        endGame(750);
    }
}

function roll(){
    createPassButton();

    let greedyResult = greedy(dice);

    if (greedyResult[0] == 0){
        points = -1;
        Cookies.set('points', points, { expires: midnight});
        endGame(2000);
        return;
    }
    
    points += greedyResult[0];
    dice -= greedyResult[1];
    Cookies.set('points', points, { expires: midnight});
    Cookies.set('dice', dice, { expires: midnight});
    setTimeout(() => {
        updateScore(points);
    }, 1000);

    if (dice == 0)
        dice = 6;
}


function greedy(dice){
    // blank array to store each dice roll
    let rolls = [];

    // fills roll array based on active dice number
    for (let i = 0; i < dice; i++){
        rolls[i] = Math.floor((Math.random() * 6) + 1);
        console.log(rolls[i]);
    }

    // loops through each resulting roll and assigns an image
    for (let i = 0; i < 6; i++){
        if (Cookies.get('diceImage') == null)
        {
            Cookies.set('diceImage', '', { expires: midnight});
            Cookies.set('greenDice', '', { expires: midnight});
        }

        const diceImage = document.createElement('img');
        // creates correct dice images based off roll
        if (i > rolls.length - 1){
            diceImage.src = diceImgs[6];
            Cookies.set('diceImage', Cookies.get('diceImage') + ' ' + diceImage.src);
        }
        else {
            diceImage.src = diceImgs[rolls[i] - 1];
            Cookies.set('diceImage', Cookies.get('diceImage') + ' ' + diceImage.src);
        }

        // assigns colors and animations to dice tiles
        if (rolls[i] == 1 || rolls[i] == 5 || findTriple(rolls[i], rolls, i)){
            Cookies.set('greenDice', Cookies.get('greenDice') + ' ' + 'true');
            setTimeout(() => {
                flipDice(diceContainers[diceNumber], 'true', diceImage);
                diceNumber++;
            }, i * 300);
        }
        else if (i > rolls.length - 1){
            Cookies.set('greenDice', Cookies.get('greenDice') + ' ' + 'blank');
            setTimeout(() => {
                flipDice(diceContainers[diceNumber], 'blank', diceImage);
                diceNumber++;
            }, i * 300);
        }
        else {
            Cookies.set('greenDice', Cookies.get('greenDice') + ' ' + 'false');
            setTimeout(() => {
                flipDice(diceContainers[diceNumber], 'false', diceImage);
                diceNumber++;
            }, i * 300);
        }

        // resets all dice
        if (diceNumber >= 36){
            diceContainers.forEach(clearDiceContainer);
            diceNumber = 0;
            Cookies.set('diceImage', '');
            Cookies.set('dice', 0);
        }
    }

    while (diceNumber % 6 != 0){
        diceNumber++;
    }
    Cookies.set('diceNumber', diceNumber, { expires: midnight});
    let game = score(rolls);

    if (game[0] == 0){
        finalScoreMsg += '🦨💨🦨💨🦨💨';
    }
    else {
        for (let i = 0; i < 6; i++){
            if (i > rolls.length - 1){
                finalScoreMsg += diceText[6];
            }
            else {
                finalScoreMsg += diceText[rolls[i] - 1];
            }
        }
        finalScoreMsg += '\r\n';
    }

    Cookies.set('finalScoreMsg', finalScoreMsg, { expires: midnight});
    return game;
}

function clearDiceContainer(item){
    let dice = item.lastElementChild;
    if (dice != null){
        item.removeChild(dice);
    }
}

function score(rolls){
    let newScore = 0;
    let diceUsed = 0;

    for (let i = 1; i < 7; i++){
        let count = findCount(i, rolls);
        let triple = Math.floor(count / 3);

        if (triple > 0 && i != 1 && i != 5){
            newScore += triple * (i * 100);
            diceUsed += triple * 3;
        }
        else {
            if (i == 1) {
                diceUsed += count;
                newScore += triple * 1000;
                count -= triple * 3;
                newScore += count * 100;
            }
            else if (i == 5) {
                diceUsed += count;
                newScore += triple * 500;
                count -= triple * 3;
                newScore += count * 50;
            }
        }
    }

    return [newScore, diceUsed];
}

function findCount(num, rolls){
    let count = 0;

    for (let i = 0; i < rolls.length; i++){
        if (rolls[i] == num){
            count++;
        }
    }

    return count;
}

function findTriple(num, rolls, index){
    let count = 0;

    for (let i = 0; i < rolls.length; i++){
        if (rolls[i] == num){
            count++;
        }
    }

    if (count >= 3 && count < 6){
        if (count > 3){
            for (let i = 0; i < rolls.length; i++){
                if (rolls[i] == num){
                    index++;
                }
            }
            if (index > 3){
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    else if (count == 6){
        return true;
    }
    else {
        return false;
    }
}

function updateScore(score){
    if (typeof score === 'string'){
        scoreboard.textContent = score;
    } else {
       const id = setInterval(incrementScoreboard, 10);

       function incrementScoreboard(){
        let score = parseInt(scoreboard.textContent);
        if (score == points){
            clearInterval(id);
        }
        else {
            score += 1;
            scoreboard.textContent = score;
        }
      }
    }
}

function endGame(delay){
    Cookies.set('gameover', 'true',{ expires: midnight});
    if (points == -1){
        updateScore('Skunked 😂');
    }
    rollButton.remove();
    if (passButtonCreated)
        passButton.remove();
    // Show result popup screen
    setTimeout(() => {
        scoreModal();
    }, delay);
}

function createPassButton(){
    if (!passButtonCreated) {
        let pButton = document.createElement('button');
        pButton.classList.add("pass-button");
        pButton.textContent = "Pass";
        pButton.onclick = function() { endGame(0) };
        const buttonContainer = document.querySelector('.buttons');
        buttonContainer.appendChild(pButton);
        passButton = document.querySelector('.pass-button');
        passButtonCreated = true;
    }
}

function scoreModal(){
    const scoreModalContainer = document.querySelector('#score-modal-container');
    const finalScore = document.querySelector('#final-score-msg');
    const closeScoreModal = document.querySelector('#close-score');
    const pointsDisplay = document.querySelector('#modal-points');
    const shareButton = document.querySelector('.share-button');

    shareButton.onclick = function() {shareMsg(); };
    scoreModalContainer.style.display = 'block';
    closeScoreModal.onclick = function() {scoreModalContainer.style.display = 'none';};
    if (points == -1){
        pointsDisplay.textContent = '0';
    }
    else {
        const id = setInterval(increment, 7);

       function increment(){
        let score = parseInt(pointsDisplay.textContent);
        if (score == points){
            clearInterval(id);
        }
        else {
            score += 1;
            pointsDisplay.textContent = score;
        }
      }
    }
    finalScore.textContent = finalScoreMsg;
    if (points != -1){
        finalScoreMsg += '%0aGreedle score: ' + points;
    }

    countdownMidnight();
}

function shareMsg(){
    navigator.clipboard.writeText(finalScoreMsg);
    if (navigator.userAgent.match(/iPhone/i)){
        let formattedMsg = finalScoreMsg.replace(/\r\n/g, '%0a');
        window.open(`sms:?&body=${formattedMsg}`, '_self');
    }
    else {
        alert('Sharing currently only works on iphone');
    }
}

function countdownMidnight(){
    const timer = document.querySelector('#timer');

    const interval = setInterval(countdown, 1);

    function countdown(){
        let now = new Date().getTime();
        let timeleft = midnight - now;

        let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        timer.textContent = `${hours}:${minutes}:${seconds}`;

        if (timer.style.display == 'block'){
            clearInterval(interval);
        }
    }
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}