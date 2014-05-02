/**
 Created by Shvil Amit on 05/04/2014.
 */
define(["model/vo/Point","utils/Util"],function(Point,Util) {
    function Biomorph(parent) {
        this.color = null;
        this.point = null;
        this.thickness = null;
        this.commitHash = null;
        this.predecessor = null;
        this.parent = parent;
        this.legs = [];


    }

// create a deep copy of the Biomorph
    Biomorph.prototype.clone = function () {
        var newBiomorph = new Biomorph();
        newBiomorph.color = this.color;
        newBiomorph.point = this.point;
        newBiomorph.thickness = this.thickness;
        if (this.parent == null)
            newBiomorph.predecessor = this.commitHash;
        newBiomorph.commitHash = this.commitHash;
        newBiomorph.legs = [];
        for (var i = 0; i < this.legs.length; i++) {
            newBiomorph.legs[i] = this.legs[i].clone();
            newBiomorph.legs[i].parent = newBiomorph;
        }
        return  newBiomorph;

    };
    Biomorph.prototype.toString = function () {
        var str = JSON.stringify(this, Biomorph.censor); // to avoid cycle reference when serialize the object
        return str;
    };
// deserializer of data from json
    Biomorph.prototype.fromJson = function (obj) {
        for (var prop in obj) {
            if (prop == "legs") {
                //this.legs = [];
                for (var i = 0; i < obj[prop].length; i++) {
                    this.legs[i] = new Biomorph(this);
                    this.legs[i].fromJson(obj[prop][i]);
                }
            }
            //else if(prop == "point"){}

            else {
                this[prop] = obj[prop];
            }
        }

    };
// this function will be call for each prop that will get serialize
    Biomorph.censor = function (key, value) {
        if (key == "parent") { // if this point to the parent that mean it is cycle reference so return undefined
            return undefined;
        }
        return value;
    };
// helper function to create the first generation
    Biomorph.createGenerationA = function () {
        var generationA = Biomorph.getRandomBiomorphLeg(null);
        generationA.legs[0] = Biomorph.getRandomBiomorphLeg(generationA);
        generationA.legs[1] = Biomorph.getRandomBiomorphLeg(generationA);
        return generationA;
    };
    Biomorph.getRandomBiomorphLeg = function (parent) {
        var leg = new Biomorph(parent);
        leg.color = getRandomColor();
        leg.point = Biomorph.getRandPoint();
        leg.thickness = Biomorph.getRandomThickness();
        return leg;
    };
    Biomorph.prototype.mutation = function () {
        var isMutationOnThisLevel = (rand(1, 2) == 1);  // is the mutation will be on that level or not
        console.log("isMutationOnThisLevel", isMutationOnThisLevel);
        if (isMutationOnThisLevel || this.legs.length == 0) // random if this is not the last level it will be if this is the last level
        {
            var gene = Biomorph.getRandomGene(); // get a random gene to do the mutation
            var newGeneVal = Biomorph.getRandomValByGene(gene); // get a random value for that mutation
            if (newGeneVal == undefined) {
                console.log("Error")
            }

            //console.log("mutation in gene:" + gene + " new Value: " + newGeneVal.toString() + " current gene: " + this[gene] + "   Legs: " + this.legs.length);
            if (gene != "legs") // simple gene not a leg mutation
            {

                this[gene] = newGeneVal;
            }
            else // a leg mutation add or remove legs
            {
                console.log(" New number of legs");
                // the mutation is in the number of legs
                if (newGeneVal < this.legs.length) {  // removing legs
                    console.log(" Removing legs current Legs:" + this.legs.length);
                    this.legs = this.legs.splice(newGeneVal, 1);
                    console.log(" New numbers of legs: " + this.legs.length);
                }
                else {// create new legs
                    for (var i = this.legs.length; i < newGeneVal; i++) {
                        console.log(" Adding legs :" + i);
                        this.legs[i] = Biomorph.getRandomBiomorphLeg(this);
                    }
                }
            }
        }
        else // the mutation will be in the one of the branches
        {
            var legIndex = rand(0, this.legs.length - 1);
            this.legs[legIndex].mutation();
        }

    };


// static helper function to create random Biomorph
    Biomorph.getRandomThickness = function () {
        return rand(Biomorph.THICKNESS.MIN, Biomorph.THICKNESS.MAX);
    };
    Biomorph.getRandPoint = function () {
        var x = rand(Biomorph.LOC.MIN_X, Biomorph.LOC.MAX_X);
        var y = rand(Biomorph.LOC.MIN_Y, Biomorph.LOC.MAX_Y);
        return new Point(x, y);

    };
    Biomorph.getRandomGene = function () {
        return Biomorph.GENES[rand(0, Biomorph.GENES.length - 1)];
    };

    Biomorph.getRandomValByGene = function (gene) {
        switch (gene) {
            case "color":
                return getRandomColor();
                break;
            case "point":
                return Biomorph.getRandPoint();
                break;
            case "thickness":
                return Biomorph.getRandomThickness();
                break;
            case "legs":
                return Biomorph.getRandomLegsNumber();
                break;
        }
    };

    Biomorph.getRandomLegsNumber = function () {
        return rand(Biomorph.LEGS.MIN, Biomorph.LEGS.MAX);
    };
// Const that will be use for creating random Biomorph
    Biomorph.GENES = ["color", "point", "thickness", "legs"];

// Const that will define the range of validate value of Biomorph
    Biomorph.SIBLINGS = { // numbers of SIBLINGS that could will be created each generation
        MIN: 1,
        MAX: 9
    };
    Biomorph.THICKNESS = { // the THICKNESS of the line
        MIN: 2,
        MAX: 10
    };


    Biomorph.LEGS = { // number of legs
        MIN: 0,
        MAX: 10

    };
    Biomorph.LOC = { // the end point location
        MIN_X: 0,
        MIN_Y: 0,
        MAX_X: 200,
        MAX_Y: 200

    };
    return Biomorph;
});