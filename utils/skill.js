class Dice{
    constructor(sides){
        this.sides = sides;
    }

    roll(rolls){
        const array = new Array(this.sides);
        for(let i = 0; i < array.length; i++){
            array[i] = i + 1;
        };
        
        let times = 0;
        let sum = 0;
        let throws = new Array(rolls);
        while(times < rolls){
            const index = Math.floor(Math.random() * Math.floor(array.length - 1));
            throws[times] = array[index];

            sum += throws[times];
            times += 1;
        }
        console.log(throws, sum)
        return {throws, sum}
    }   
}

const defaultDice = new Dice(6);

module.exports = {
    Dice,
    defaultDice,
}