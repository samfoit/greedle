let dice = 6;

function roll(dice){
    let rolls = [];
    for (let i = 0; i < dice; i++){
        rolls[i] = Math.floor((Math.random() * 6) + 1);
        console.log("Roll " + (i + 1) + ": " + rolls[i]);
    }

    console.log(score(rolls));
}

function score(rolls){
    let newScore = 0;

    for (let i = 1; i < 7; i++){
        let count = findCount(i, rolls);
        let triple = Math.floor(count / 3);

        if (triple > 0 && i != 1 || i != 5){
            newScore += triple * (i * 100);
        }
        else {
            if (i == 1) {
                newScore += triple * 1000;
                count -= triple * 3;
                newScore += count * 100;
            }
            else {
                newScore += triple * 500;
                count -= triple * 3;
                newScore += count * 50;
            }
        }
    }

    return newScore;
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