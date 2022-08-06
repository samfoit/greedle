
// array of dice images
const diceImgs = ["images/dice1.png", "images/dice2.png", "images/dice3.png", "images/dice4.png", "images/dice5.png", "images/dice6.png"];

// buttons
const rollButton = document.querySelector('.roll-button');
rollButton.onclick = function() {roll();}

// every dice element
const diceContainers = document.querySelectorAll('.dice');

// global variables
let diceNumber = 0;
let dice = 6;
let points = 0;


// TODO: Add score
// TODO: Add and remove buttons when necessary
// TODO: Add explanation popup
// TODO: Add sharing
// TODO: Add saving of game state and your done
// TODO: Flip animation
// TODO: Have the container reset on all dice scored
function roll(){
    let greed = greedy(dice);

    if (greed[0] == 0){
        console.log("you skunked!");
        return;
    }
    
    points += greed[0];
    dice -= greed[1];

    if (dice == 0)
        dice = 6;
}

function passButton(){
    console.log("you take " + score + " points!");
    dice = 0;
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
        diceContainers[diceNumber].appendChild(diceImage);
        diceNumber++;
    }

    while (diceNumber % 6 != 0){
        diceNumber++;
    }
    let game = score(rolls);

    return game;
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