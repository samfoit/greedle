const container = document.querySelector('.dice-container');


function game(){
    let dice = 6;
    let score = 0;

    while (dice > 0){
        let answer = prompt("Current Score: " + score +
        "\nNumber of dice: " + dice + "\nRoll? yes or no: ");
        answer = answer.toLowerCase();

        if (answer == 'yes'){
            let greedy = roll(dice);
    
            if (greedy[0] == 0){
                console.log("you skunked!");
                return;
            }
    
            score += greedy[0];
            dice -= greedy[1];
    
            if (dice == 0)
                dice = 6;
        }
        else {
            console.log("you take " + score + " points!");
            dice = 0;
        }
    }
}

function roll(dice){
    let rolls = [];
    for (let i = 0; i < dice; i++){
        rolls[i] = Math.floor((Math.random() * 6) + 1);
        console.log(rolls[i]);
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

        if (triple > 0 && i != 1 || i != 5){
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