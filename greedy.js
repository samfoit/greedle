
// array of dice images
const diceImgs = ["images/dice1.png", "images/dice2.png", "images/dice3.png", "images/dice4.png", "images/dice5.png", "images/dice6.png"];
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

window.onclick = function(event) {
    if (event.target == helpModal) {
      helpModal.style.display = "none";
    }
}

// every dice element
const diceContainers = document.querySelectorAll('.dice');

// global variables
let diceNumber = 0;
let dice = 6;
let points = 0;
let passButtonCreated = false;

// TODO: Learn how to open imessage for phones in javascript
// TODO: Add saving of game state and your done
function roll(){
    createPassButton();

    let greedyResult = greedy(dice);

    if (greedyResult[0] == 0){
        points = -1;
        endGame();
        return;
    }
    
    points += greedyResult[0];
    dice -= greedyResult[1];
    updateScore(points);

    if (dice == 0)
        dice = 6;
}


function greedy(dice){
    let rolls = [];
    for (let i = 0; i < dice; i++){
        rolls[i] = Math.floor((Math.random() * 6) + 1);
        console.log(rolls[i]);
    }

    for (let i = 0; i < dice; i++){
        const diceImage = document.createElement('img');
        diceImage.src = diceImgs[rolls[i] - 1];
        if (rolls[i] == 1 || rolls[i] == 5 || findCount(rolls[i], rolls) >= 3){
            diceImage.style.backgroundColor = "#538d4e";
        }

        if (diceNumber >= 36){
            // reset all the dice
            diceContainers.forEach(clearDiceContainer);
            diceNumber = 0;
        }

        diceContainers[diceNumber].appendChild(diceImage);
        diceNumber++;
    }

    while (diceNumber % 6 != 0){
        diceNumber++;
    }
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

function endGame(){
    if (points == -1){
        updateScore('Skunked 😂');
    }
    rollButton.remove();
    passButton.remove();
    // Show result popup screen
    scoreModal();
}

function createPassButton(){
    if (!passButtonCreated) {
        let pButton = document.createElement('button');
        pButton.classList.add("pass-button");
        pButton.textContent = "Pass";
        pButton.onclick = function() { endGame() };
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
        pointsDisplay.textContent = '🦨';
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
}

function shareMsg(){
    navigator.clipboard.writeText(finalScoreMsg);
    if (navigator.userAgent.match(/iPhone/i)){
        let formattedMsg = finalScoreMsg.replace(/\r\n/g, '%0a');
        window.open(`sms:?&body=${formattedMsg}`, '_self');
    }
}