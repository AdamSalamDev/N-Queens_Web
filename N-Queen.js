function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Solver {

    // Constructor: Runs the Algorithm
    constructor(boardSize){
        this.boardSize = boardSize;
        this.popSize = 2 * (boardSize * boardSize);
        this.gen = 0;
    }

    PrintState(state){
        var s = "";
        for(var i = 0; i < state.length; i++){
            s += state[i];
        }
        console.log(s);
    }

    getGen(){
        return this.gen;
    }
    
    Run()
    {
        var generation = 0;

        var population = [];
        for(var i = 0; i < this.popSize; i++){
            population[i] = new State(this.RandomState());
        }

        
        var goal = this.hasGoal(population);

        if(goal != null){

            //console.log("Goal found at generation: " + generation);
            return goal.genes;
        }

        do{
            population = this.NextGen(this.Survival(population));
            goal = this.hasGoal(population);
            generation++;

        }while(goal === null);

        //console.log("Goal found at generation: " + generation);
        this.gen = generation;

        return goal.genes;
        
    }
    
    
    // Step_1: Generate random state
    RandomState(){
        var state = [];
        var elements = [];

        for (var i = 0; i < this.boardSize; i++){
            elements[i] = i;
        }

        for (var i = 0; i < this.boardSize; i++)
        {
            var randIndex = getRandomInt(elements.length);
            state[i] = elements[randIndex];
            elements.splice(randIndex,1);
        }

        return state;
    }

    // Step_2: Pick the best 2 out of the population to survive as parents.
    Survival(pop){
        var survivers = [];

        for(var i = 0; i < 2; i++){
            var max = i;
            for(var j = i+1; j < pop.length; j++){
                if(pop[j].fitnesScore > pop[max].fitnesScore){
                    max = j;
                }
            }
            var temp = pop[i];
            pop[i] = pop[max];
            pop[max] = temp;
            survivers[i] = pop[i];
        }

        return survivers;
    }

    Crossover(parents){

        var c1 = [];
        var c2 = [];
        var children = [c1,c2];

        for(var i = 0; i < children.length; i++){
            for(var j = 0; j < this.boardSize; j++){
                children[i][j] = -1;
            }
        }

        for(var i = 0; i < children.length; i++){

            var elements = [];
            for(var j = 0; j < this.boardSize; j++){

                if(parents[0].genes[i] === parents[1].genes[i]){
                    children[i][j] = parents[0].genes[j];
                }
                else{
                    elements[j] = parents[0].genes[j];
                }
            }

            for(var j = 0; j < this.boardSize; j++){
                if(children[i][j] === -1){
                    var randIndex = getRandomInt(elements.length);
                    children[i][j] = elements[randIndex];
                    elements.splice(randIndex,1);
                }
            }
        }

        children[0] = this.Mutation(children[0]);
        children[1] = this.Mutation(children[1]);

        return children;
    }

    NextGen(survivalists){

        var newPopulation = [];

        var count = 0;
        for(var i = 0; i < this.popSize / 2; i++){
            var newChildren = this.Crossover(survivalists);
            newPopulation[count++] = new State(newChildren[0]);
            newPopulation[count++] = new State(newChildren[1]);
        }

        return newPopulation;
    }

    Mutation(state){

        var hasMutation = (getRandomInt(2) === 0);

        if(hasMutation){
            var elements = [];
            for (var j = 0; j < this.boardSize; j++){
                elements[j] = j;
            }

            var randIndex = getRandomInt(elements.length);
            var index1 = elements[randIndex];

            elements.splice(randIndex,1);

            randIndex = getRandomInt(elements.length);
            var index2 = elements[randIndex];

            var temp = state[index1]
            state[index1] = state[index2];
            state[index2] = temp;
        }

        return state;
    }

    hasGoal(pop){
        for(var i = 0; i < this.popSize; i++){
            if(pop[i].fitnesScore == 1){
                return pop[i];
            }
        }
        return null;
    }

}


class State {
    constructor(genes) {
      this.genes = genes;
      this.fitnesScore = ( 1 / (1 + this.AttackingPairs()) );
    }

    AttackingPairs(){
        var count = 0;

            for (var i = 0; i < this.genes.length - 1; i++)
            {
                for (var j = i + 1; j < this.genes.length; j++)
                {
                    if (this.genes[i] == this.genes[j])
                    {
                        count++;
                    }
                    else if (this.genes[i] == (this.genes[j] - j + i) || this.genes[i] == (this.genes[j] + j - i))
                    {
                        count++;
                    }
                }
            }

            return count;
    }
}
