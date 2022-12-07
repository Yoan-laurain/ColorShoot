title = "Color shoot";
description = `Play`;
characters = [];
options = {
    isReplayEnabled: false,
    isDrawingScoreFront: true,
    theme: "dark",
    isPlayingBgm: true,
    seed: 9,
};

class MyBlock
{
    constructor(id,struct, color,width,etage,height)
    {
        this.struct = struct;
        this.color = color;
        this.width = width;
        this.id = id;
        this.etage = etage;
        this.height = height;
    }   
}

/** @type {Vector[]} */
let pins;

// Shoot
var goRight = false;
var inputFired = false;
var angleShooted = 0;
var currentAngle = 0;

// Blocks structure
var pin;
var Etages = [];
var tabColor = ["red","blue","green"];
var heightBlock = 5;

//Block movements
var descente = 0.02;
var spaceBetweenBlocks = 0.5;
var totalSpaceToFill = 98;

var speeds = [];
var nbEtage = 4;
var nbBlockPerEtage = 5;
var gameOver = false;
var hitColor = null;

var id =0;

var shootFailed;
var linesPop = 0;
var multiplier = 1;
var penalty = 1;


function update() 
{
    if (!ticks) 
    {
      pins = [vec(50,95)];
      for ( i = 0; i < nbEtage; i++ )
      {
        Etages[i] = [];
        speeds[i] = 0;
      }
    }

    if ( gameOver ) return;

    RotationTir();

    pins.forEach((p) => 
    {
      box(p, 3);
    });

    // if(nbEtage < 5)
    // {
    //     nbEtage += rndi(1,3);
        
    //     for (var i = Etages.length ; i <= nbEtage; i++)
    //     {
    //         Etages[i] = [];
    //         speeds[i] = 0;
    //     }
    // }

    for ( p = 0; p < nbEtage; p++ )
    {
        CreateEtage(p);
    }

    onKeyPress();
}

function CreateEtage(numEtage)
{
    // if we just started, create the first block
    if( Etages[numEtage].length == 0 )
    {
        //Position
        var x;
        var y =  numEtage * (heightBlock+1) + 10; 

        var spaceLeftTofill = totalSpaceToFill;

        // Spawn the block
        for ( i = 0; i < nbBlockPerEtage; i++ )
        {
            var potentialWidth = setupWidthForBlocks(i,spaceLeftTofill,numEtage);
            spaceLeftTofill -= potentialWidth;
    
            if ( i != 0 )
                x = Etages[numEtage][i-1].struct.x +  Etages[numEtage][i-1].width /2 + potentialWidth / 2 + spaceBetweenBlocks;
            if ( i == nbBlockPerEtage - 1)
                x =  -potentialWidth / 2 - spaceBetweenBlocks;
            if ( i == 0)
                x = potentialWidth / 2 ;
          
            SpawnBlock(i,numEtage,x,y,potentialWidth);
        }

        if( speeds[numEtage] == 0 )
        {
            speeds[numEtage] = rnd(0.4,0.6);
        }
    }
    else
    {
        // Move all blocks
        for ( i = 0; i < nbBlockPerEtage; i++ )
        {
            // Movements
            Etages[numEtage][i].struct.x += speeds[numEtage];
            Etages[numEtage][i].struct.y += descente * penalty;

            // if a block toutch the bottom, stop the game
            if ( Etages[numEtage][i].struct.y > 80 )
            {
                play("explosion");
                end();
            }

            // if a block is out of the screen, replace it at the beginning
            if( Etages[numEtage][i].struct.x >= 99 + Etages[numEtage][i].width / 2 )
            {
                var width = Etages[numEtage][( i+1 == nbBlockPerEtage ? 0 : i+1 )].struct.x - Etages[numEtage][( i+1 == nbBlockPerEtage ? 0 : i+1 )].width / 2;
                Etages[numEtage][i].struct.x = -abs(width)  - spaceBetweenBlocks - Etages[numEtage][i].width / 2;
            }

            // Place the block
            MoveBlock(Etages[numEtage][i]);
        }
    }
}

function SpawnBlock(indice,numEtage,x,y,width)
{
    block = new MyBlock(id,vec( x, y ), tabColor[rndi(0, 3)],width,numEtage,heightBlock);
    id++;
    MoveBlock(block);
    Etages[numEtage][indice] = block;
}

function MoveBlockFired(block)
{
    var blocksInWay = GetAllBlockInWay(block);


    if ( blocksInWay.length > 0 && !shootFailed )
    {
        if ( hitColor == null)
        {
            hitColor = blocksInWay[0].color;
        }

        play("coin");
      
        for ( var s = 0; s < blocksInWay.length; s++ )
        {
            if( blocksInWay[s].color == hitColor )
            {
                Etages.pop();
                nbEtage--;   
                linesPop++;     
                multiplier += 1;  
            }
            else
            {
                addScore(linesPop * 100 * multiplier, 50,50);
                hitColor = null;
                shootFailed = true;
                linesPopAtOnce = 0;
                multiplier = 0;
                penalty = 1;        
                console      
                break;
            }

        }
        penalty = clamp(penalty * (3 / multiplier), 1, 4);
    }
    else
    {
        penalty = 1;      
        color(block.color);
        block.struct.y -= 0.5;
        box(block.struct, block.width,block.height);
        color("black");
    }

}

function RotationTir()
{
    currentAngle += goRight ? -0.02 : 0.02;

    if (currentAngle > PI)
    {
        goRight = true;
    }
    else if (currentAngle < 0)
    {
        goRight = false;
    }
    
    pos = vec(50, 95);
    const np = vec(pos).addWithAngle(-currentAngle, 15);
    color("red");
    line(pos, np, 3);
    color("black");    
}

function onKeyPress()
{
    if ( inputFired )
    {
        var block = new MyBlock();
        block.struct =  vec( pins[pins.length - 1].struct.x,pins[pins.length - 1].struct.y ).addWithAngle( -angleShooted , 1);
        block.color = pins[pins.length - 1].color;
        block.width = 2;
        block.id = -1;
        block.etage = -1;
        block.height = 2;

        MoveBlockFired(block);

        if( pins.length > 1)
        {
            pins.pop();
        }

        // Add new pin
        pins.push(block);

        // if the pin is out of the screen, stop shooting
        if ( block.struct.x < 0 || block.struct.x > 99 || block.struct.y < 0 || block.struct.y > 99 )
        {
            inputFired = false;
            shootFailed = false;
            pins.pop();
        }        
    }

    if (input.isJustPressed && !inputFired)
    {
        play("laser");
        inputFired = true;
        angleShooted = currentAngle;
        block = new MyBlock(-1,vec( 50,95 ).addWithAngle( -angleShooted , 0.05), "yellow",2,-1,2);
        MoveBlock(block);
        pins.push(block);
    }    
}

function setupWidthForBlocks(i,spaceLeftTofill,numEtage)
{
    basicWidth = totalSpaceToFill / nbBlockPerEtage;
    var potentialWidth = rndi(basicWidth-5,basicWidth+5);

    if(potentialWidth % 2 != 0 )
    {
        potentialWidth++;
    }

    if ( i == nbBlockPerEtage-2 ) 
    {
        potentialWidth = spaceLeftTofill;
    }
    else if ( i == nbBlockPerEtage-1 )
    {
        potentialWidth = Etages[numEtage][i-1].width;
    }
    else 
    {
        while(spaceLeftTofill - potentialWidth < 0)
        {
            potentialWidth = rndi(basicWidth-5,basicWidth+5);
        }
    }
    return potentialWidth;
}

function MoveBlock(block)
{
    color(block.color);
    box(block.struct, block.width,block.height);
    color("black");
}

function GetAllBlockInWay(block)
{
    var blocksInWay = [];

    for ( i = nbEtage - 1 ; i >= 0; i-- )
    {
        Etages[i].forEach(element => {
            if(  block.struct.y < element.struct.y + element.height /2 && block.struct.y > element.struct.y - element.height /2 )
            {
                if ( block.struct.x > element.struct.x - element.width /2 && block.struct.x < element.struct.x + element.width /2 )
                {
                    blocksInWay.push(element);
                }
            }
        });
    }


    return blocksInWay;
}


addEventListener("load", onLoad);