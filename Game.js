title = "";

description = `
`;

characters = [];

options = {};

class MyBlock
{
    constructor(struct, color)
    {
        this.struct = struct;
        this.color = color;
    } 

    
}



/** @type {Vector[]} */
let pins;
const cordLength = 20;
goRight = false;
inputFired = false;
DistanceToAdd = 0.5;
angleShooted = 0;
blockCreated = false;
rnd = rndi(45, 70);
var pin;
var Etages = [[],[],[],[],[]];
var descente = 0.02;
var tabColor = ["red","blue","green"];
var tailleBlock = 24;

x = 0;
y = 0;

function update() 
{
    if (!ticks) 
    {
      pins = [vec(50,95)];
      cord = { angle: 0, length: cordLength, pin: pins[0] };
    }

    cord.angle += goRight ? -0.01 : 0.01;

    if (cord.angle > PI)
    {
        goRight = true;
    }
    else if (cord.angle < 0)
    {
        goRight = false;
    }

    line(cord.pin, vec(cord.pin).addWithAngle( -cord.angle , cord.length));

    pins.forEach((p) => 
    {
      box(p, 3);
    });

    if (input.isJustPressed && !inputFired)
    {
        inputFired = true;
        angleShooted = cord.angle;
    }

    if ( inputFired )
    {
        // create a new pin
        pin = vec(pins[pins.length - 1]).addWithAngle( -angleShooted , 1);

        
        if( pins.length > 1)
        {
            pins.pop();
        }

        // Add new pin
        pins.push(pin);

        // if the pin is out of the screen, stop shooting
        if ( pin.x < 0 || pin.x > 99 || pin.y < 0 || pin.y > 99 )
        {
            inputFired = false;
            pins.pop();
        }
    }


    CreateEtage(1);
    CreateEtage(2);
    CreateEtage(3);
    CreateEtage(4);
}

function CreateEtage(numEtage)
{
    var Block;
    if( Etages[numEtage].length == 0 )
    {
        var x = 0;
        var y = numEtage * 6 + 10; 

        var Block = new MyBlock(vec( x, y ), tabColor[rndi(0, 3)]);

        Etages[numEtage].push(Block);

        color(Block.color);
        box(Etages[numEtage][0].struct, tailleBlock,5);
        color("black");

        for ( i = 1; i < 4; i++ )
        {
            x = Etages[numEtage][i-1].struct.x + 25;
            Block = new MyBlock(vec( x, y ), tabColor[rndi(0, 2)]);
            Etages[numEtage].push(Block);
            color(Block.color);
            box(Etages[numEtage][i].struct, tailleBlock,5);
            color("black");
        }

        x =  Etages[numEtage][0].struct.x - tailleBlock - 1;
        Block = new MyBlock(vec( x, y ), tabColor[rndi(0, 2)]);
        Etages[numEtage].push(Block);
        color(Block.color);
        box(Etages[numEtage][4].struct, tailleBlock,5);
        color("black");
    }
    else
    {
        for ( i = 0; i < 5; i++ )
        {
            Etages[numEtage][i].struct.x += DistanceToAdd;
            Etages[numEtage][i].struct.y += descente;

            if ( Etages[numEtage][i].struct.y > 98 )
            {
                end();
            }

            if( Etages[numEtage][i].struct.x > 99 + tailleBlock )
            {
                Etages[numEtage][i].struct.x = -1;   
            }

            color( Etages[numEtage][i].color);
            box(Etages[numEtage][i].struct, tailleBlock,5);

            color("black");
        }
    }
}

addEventListener("load", onLoad);