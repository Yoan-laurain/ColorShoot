title = "";
description = ``;
characters = [];
options = {};

class MyBlock
{
    constructor(struct, color,width)
    {
        this.struct = struct;
        this.color = color;
        this.width = width;
    }   
}

/** @type {Vector[]} */
let pins;
const cordLength = 20;

// Shoot
var goRight = false;
var inputFired = false;
var angleShooted = 0;

// Blocks structure
var pin;
var Etages = [[],[],[],[],[]];
var tabColor = ["red","blue","green"];
var widthBlock = 24;
var heightBlock = 5;

//Block movements
var DistanceToAdd = 0.5;
var descente = 0.02;

function update() 
{
    if (!ticks) 
    {
      pins = [vec(50,95)];
      cord = { angle: 0, length: cordLength, pin: pins[0] };
    }

    RotationTir();

    pins.forEach((p) => 
    {
      box(p, 3);
    });

    onKeyPress();

    CreateEtage(1);
    CreateEtage(2);
    CreateEtage(3);
    CreateEtage(4);
}

function CreateEtage(numEtage)
{
    // if we just started, create the first block
    if( Etages[numEtage].length == 0 )
    {
        //Position
        var x = widthBlock / 2;
        var y = numEtage * 6 + 10; 

        // Spawn the block
        for ( i = 0; i < 5; i++ )
        {
            if ( i != 0 )
                x = Etages[numEtage][i-1].struct.x + widthBlock + 1;
            if ( i == 4)
                x =  -  widthBlock / 2 - 1;
          
            SpawnBlock(i,numEtage,x,y);
        }
    }
    else
    {
        // Move all 5 blocks
        for ( i = 0; i < 5; i++ )
        {
            // Movements
            Etages[numEtage][i].struct.x += DistanceToAdd;
            Etages[numEtage][i].struct.y += descente;

            // if a block toutch the bottom, stop the game
            if ( Etages[numEtage][i].struct.y > 98 )
            {
                end();
            }

            // if a block is out of the screen, replace it at the beginning
            if( Etages[numEtage][i].struct.x >= 99 + widthBlock / 2 )
            {
                //diff =  ElementCloseToLeftSide(numEtage);
                Etages[numEtage][i].struct.x = -widthBlock /2 - 2 ;
            }

            // Place the block
            MoveBlock(Etages[numEtage][i]);
        }
    }
}

function SpawnBlock(indice,numEtage,x,y)
{
    block = new MyBlock(vec( x, y ), tabColor[rndi(0, 3)],widthBlock);
    MoveBlock(block);
    Etages[numEtage][indice] = block;
}

function MoveBlock(block)
{
    color(block.color);
    box(block.struct, widthBlock,heightBlock);
    color("black");
}

function RotationTir()
{
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
}

function onKeyPress()
{
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
}

function ElementCloseToLeftSide(numEtage)
{
    x = 99;
    var block = Etages[numEtage][0];
    for ( i = 0; i < 5; i++ )
    {
        if ( Etages[numEtage][i].struct.x < x )
        {
            x = Etages[numEtage][i].struct.x;
            block = Etages[numEtage][i];
        }
    }
    return block.width /2 ;
}

addEventListener("load", onLoad);