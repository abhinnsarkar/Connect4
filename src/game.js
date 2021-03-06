
import { GameBoard } from './GameBoard.js';
import { gameColors, globals, colors} from './Globals.js';
import { Coin } from './Coin.js';
import { CoinTray } from './CoinTray.js';
import { playVictoryTone , playErrorTone , playCoinSound } from './Sounds.js';
var onlyHintsAreEnabled = false;
let canvas=document.getElementById("gameScreen");
let ctx=canvas.getContext("2d");

let gameBoard = new GameBoard(ctx);
const gameTopMarginPct = 12.5;
const gameLeftMarginPct = 20;
const gameRightMarginPct = gameLeftMarginPct;
const gameBottomMarginPct = 0;
var gameTopMarginPx, gameBottomMarginPx, gameLeftMarginPx, gameRightMarginPx, gameBoardWidth, gameBoardHeight;

var playerCoin , playerCoinCol;
let firstColor = gameColors.player1Color;
var previousColor , color;
/**
 * @type {Array<string>}
 */
const arrows = ["leftArrow","rightArrow","playArrow"];
var arrowsAreDisabled = false;
var controlsEnabled=true;

/**
 * The mapping between the Keys, the Event, and the Function
 */
let key_function_map = new Map();
key_function_map["ARROWLEFT" + "PRESSED"]=leftClicked;
key_function_map["ARROWRIGHT" + "PRESSED"]=rightClicked;
key_function_map["ARROWDOWN" + "PRESSED"]=playClicked;
key_function_map["H" + "PRESSED"]=hintPressed;
key_function_map["H" + "RELEASED"]=hintReleased;

var leftArrow,rightArrow,playArrow;

const directions = {
    left : "left",
    right : "right"
}


var hintBtn;

const INIT_PHYSICAL_COL=4;

/**
 * @type {CoinTray}
 */
var tray1,tray2;

var winnerBox,winnerBoxMessage,showWinnerMessage;

var errorBox,errorBoxMessage;
var popUp;
var isKeyDisabled = false;

const popups={
    errorBox:"errorBox",
    hintBox : "hintBox"
}

const messages = {

    colError : "Try another column, this one's already full",
    tooFarLeft : "Can't go left anymore, there's no more space",
    tooFarRight : "Can't go right anymore, there's no more space",
    player1HasWon : " Congrats! Player 1 has won!!!",
    player2HasWon : " Congrats! Player 2 has won!!!",
    gameBoardFull : "Sorry! Game Over! You're out of coins...",
    whatDoesPurpleMean : "Purple Box around slot means you can play here",
    whatDoesYellowMean : "Play In Yellow Box To Win",
    whatDoesGreenMean : "Green Box Means -->> DANGER ZONE DO NOT PLAY!!!",
    hintBoxMessage : "Hints"
 
}

// styling canvas with color and position
function canvasStyling(){
    
    canvas.style.background = gameColors.gameBackgroundColor;

}

function gameBoardResizing() {

    //calculate the new margins and sizes

    gameTopMarginPx = ctx.canvas.height * gameTopMarginPct / 85;
    gameLeftMarginPx = ctx.canvas.width * gameLeftMarginPct / 85;
    gameRightMarginPx = gameLeftMarginPx;
    gameBottomMarginPx = ctx.canvas.height * gameBottomMarginPct / 85;

    gameBoardWidth = canvas.width - gameLeftMarginPx - gameRightMarginPx;
    gameBoardHeight = canvas.height - gameTopMarginPx - gameBottomMarginPx;


    //  this will resize the game board and re-draw
    gameBoard.resize(ctx, gameBoardWidth, gameBoardHeight, gameTopMarginPx, gameLeftMarginPx);

}


/**
 * Creates and draws two cointrays and then fills both with coins 
 */
function coinTrays(){
    let coinTrayWidth = gameLeftMarginPx;
    let coinTrayHeight = canvas.height/3;

    tray1 = new CoinTray(gameLeftMarginPx+(gameBoard.sqSize*7)+gameBoard.pad,gameTopMarginPx,coinTrayWidth,coinTrayHeight,gameColors.player1Color, gameColors.gridColor, gameColors.gameTrayBgColor1,3,7);
    tray1.draw(ctx);
    tray1.fillAllCoins(ctx);

    tray2 = new CoinTray(gameLeftMarginPx+(gameBoard.sqSize*7)+gameBoard.pad,gameTopMarginPx+(coinTrayHeight*1.825)-10,coinTrayWidth,canvas.height,gameColors.player2Color, gameColors.gridColor, gameColors.gameTrayBgColor2,3,7);
    tray2.draw(ctx);
    tray2.fillAllCoins(ctx);
    
}

/**
 * Sets up the event handlers
 */
function setupEventHandlers() {

    leftArrow = document.getElementById("leftArrow");
    leftArrow.addEventListener("click",leftClicked);

    rightArrow = document.getElementById("rightArrow");
    rightArrow.addEventListener("click",rightClicked);

    playArrow = document.getElementById("playArrow");
    playArrow.addEventListener("click",playClicked);
    
    // errorBox = document.getElementsByClassName("closeErrorBox")[0];
    // errorBox.addEventListener("click", closeErrorBox);
    popUp = document.getElementsByClassName("closeErrorBox")[0];
    popUp.addEventListener("click", function() {
        closePopup(popups.errorBox);
    }
    );

    hintBtn = document.getElementById("hintBtn");
    hintBtn.addEventListener("mousedown", hintPressed);
    hintBtn.addEventListener("mouseup", hintReleased);
    
}


////////////////////// M A I N --- F U N C T I O N A L I T Y //////////////////////
////////////////////// M A I N --- F U N C T I O N A L I T Y //////////////////////
////////////////////// M A I N --- F U N C T I O N A L I T Y //////////////////////

main(); // call the main functionality

/**
 * Does all the initial setup
 */
function main() {
    
    setupEventHandlers(); 
    
    
    canvasStyling(); // sets the canvas color

    gameBoardResizing(); // this calculates the various margins and block sizes
    coinTrays();
    
    //playerCoinCol = INIT_PHYSICAL_COL;
    
    createNewPlayerCoin();
    // showHowToPlay();
}
/**
 * switches to a new player coin
 */
function createNewPlayerCoin() {
    
    playerCoinCol = INIT_PHYSICAL_COL;
    playerCoin = {}; //nullifying the object

    // first time
    if (previousColor == null) {
        
        color = firstColor;
        tray1.highlight(ctx);
        

    }
    else if(previousColor == gameColors.player1Color){ // means it is second players turn

        removeFromTray(ctx, tray1);
        color = gameColors.player2Color;
        tray2.highlight(ctx);
    }

    else{
        
        removeFromTray(ctx, tray2);
        color = gameColors.player1Color;
        tray1.highlight(ctx);
    }

    gameBoard.highlightPlayerCol(ctx,playerCoinCol);
    
    previousColor = color;

    let playerCoinInitX = canvas.width/2;
    let playerCoinInitY = gameTopMarginPx/2;

    playerCoin = new Coin(playerCoinInitX,playerCoinInitY,20,color);

    playerCoin.draw(ctx);
    

    if (tray1.isEmpty() && tray2.isEmpty()) { // game is over since both the trays are empty
        tray1.unhighlight(ctx);
        tray2.unhighlight(ctx);
        // showErrorBox(messages.gameBoardFull);
        showPopup(popups.errorBox,messages.gameBoardFull);
        
    }
}


/**
 * Removes one coin from the tray, and removes focus
 * @param {Context} ctx
 * @param {CoinTray} tray 
 */
function removeFromTray(ctx, tray) {
    tray.unhighlight(ctx);
    tray.removeCoin(ctx);
}

//helps figure out which key has been pressed
document.addEventListener("keydown",function(event) {
    onkey(event, "PRESSED");
})

//helps figure out which key has been pressed
document.addEventListener("keyup",function(event) {
    onkey(event, "RELEASED");
})

/**
 * depending on which key has been pressed it does something
 * @param {event} event 
 */
function onkey(event, typeOfEvent) {

    if(controlsEnabled){
        /**
         * @type {string}
         */
        let keyPressed = event.key.toUpperCase();
        let func=key_function_map[keyPressed + typeOfEvent];
        if(!(func==null)) {
            func();
        }
    }
}


// /**
//  * shows a box with an error message
//  * @param {string} message 
//  */
// function showErrorBox(message){

//     disableMoving();
    
//     errorBox = document.getElementById("errorBox");
//     errorBoxMessage = document.getElementById("errorBoxMessage");
//     errorBoxMessage.innerHTML=message;
//     errorBox.style.display = "block";    

// }

// function closeErrorBox(){

//     errorBox.style.display = "none";
    
//     enableMoving();

// }

function showWinner(winner){

    //gameBoard.unHighlightPlayerCol(ctx,INIT_PHYSICAL_COL);
    gameBoard.unHighlightPlayerCol(ctx,playerCoinCol);
    
    tray1.unhighlight(ctx);
    tray2.unhighlight(ctx);

    // disableMovingForGameOver();
    disableMoving();
    playVictoryTone();
    
    // if(winner == "player1")  {
    //     winnerBox = document.getElementById("player1HasWon");     
    // }
    // else{
    //     winnerBox = document.getElementById("player2HasWon"); 
    // }

    if(winner == "player1")  {

        showPopup("player1HasWon");     
    }
    else{
        // tray2.removeCoin(ctx);
        showPopup("player2HasWon"); 
    }
    
    removeControls();
    
}   
/**
 * Common functionality for moving left or right, will take a direcvtion and act 
 * @param {string} direction 
 */
function moveCoin(direction){
    playCoinSound();
    enableMoving();
    gameBoard.unHighlightPlayerCol(ctx,playerCoinCol);
    if(direction ==  directions.left){
        playerCoin.moveLeft(ctx,gameBoard.sqSize,gameColors.gameBackgroundColor);
        playerCoinCol--;
    }
    else{
        playerCoin.moveRight(ctx,gameBoard.sqSize,gameColors.gameBackgroundColor);
        playerCoinCol++;
    }
    gameBoard.highlightPlayerCol(ctx,playerCoinCol);
}

// function leftArrowClicked(){
//       leftClicked();
// }

function leftClicked(){

    if(!onlyHintsAreEnabled){
        if (controlsEnabled) {
        
            if(playerCoinCol == 1){
                showPopup(popups.errorBox,messages.tooFarLeft);
            }
            else{
                moveCoin(directions.left);
            }
        }   
    }
    
}

// function rightArrowClicked(){
//     rightClicked();
// }
function rightClicked(){

    // if(arrowsAreDisabled){
    //     //do nothing
    // }

    if(!onlyHintsAreEnabled){
        if (controlsEnabled) {
            if(playerCoinCol == globals.num_Of_Cols){
                showPopup(popups.errorBox,messages.tooFarRight);
            }
            else{
                
                moveCoin(directions.right);
            }
     
        }
    }    
}

// function playArrowClicked(){
//     playClicked();
// }

function playClicked(){

    if(!onlyHintsAreEnabled){
        if (gameBoard.dropCoin(playerCoin, ctx, playerCoinCol)) {
        
            gameBoard.unHighlightPlayerCol(ctx,playerCoinCol);
            //enableMoving();
            
            if(gameBoard.checkIfWinnerFound()){
        
                // disableMovingForGameOver();
                disableMoving();
                
                var winner;
    
                if (color == gameColors.player1Color){ // that means player 1 just played
    
                    
                    winner="player1";
                    // showWinnerMessage = messages.player1HasWon;
                    tray1.removeCoin(ctx)
                    
                }
                else{ // that means player 2 just played
                    winner="player2";
                    // showWinnerMessage = messages.player2HasWon;
                    tray2.removeCoin(ctx)
                    //tray2.highlight(ctx);
                }
    
                showWinner(winner);
                gameBoard.highlightWin(ctx);
        
            }
            else {
                createNewPlayerCoin();
            }
    
        }
        else {
            playErrorTone();
            // showErrorBox(messages.colError);
            showPopup(popups.errorBox,messages.colError);
        }
    }

}


function enableMoving() {
    controlsEnabled=true;
    // isKeyDisabled = false;
    // arrowsAreDisabled = false;
    // arrows.forEach(value => document.getElementById(value).disabled=false);
}

function disableMoving(){
    playErrorTone();
    controlsEnabled=false;
 
}

function hintPressed(){
    
    showHintLegend();
    onlyHintsAreEnabled = true;
    // disableMoving();
    gameBoard.unHighlightPlayerCol(ctx,playerCoinCol);
    gameBoard.showHint(ctx,color);

    
}

function hintReleased(){
    
    closeHintLegend();
    // closePopup("hintBox");
    onlyHintsAreEnabled = false;
    gameBoard.hideHint(ctx);
    gameBoard.highlightPlayerCol(ctx,playerCoinCol);

}
function removeControls(){
    
    let elementsToRemove=['hintBtn', 'leftArrow', 'rightArrow', 'playArrow', 'newGame'];

    elementsToRemove.forEach(value => {
        let btn = document.getElementById(value);
        btn.parentNode.removeChild(btn);
    });
       
   
}



/**
 * Given a popup id, this function will take care of showing that popup , and hiding all other controls
 * @param {string} popupId 
 */
function showPopup(popupId, message=null) {

    // disable all other controls
    disableMoving();

    // show the popup

    let popup=document.getElementById(popupId);


    if (message==null) {
        // do nothing
    }
    else {
        let popupMessageId=popupId+"Message";
        let popupMessage=document.getElementById(popupMessageId);
        popupMessage.innerHTML=message;
    }

    

    popup.style.display="block";

}



function closePopup(popupId) {

    // close the popup
    let popup=document.getElementById(popupId);
    popup.style.display="none";

    // enable all other controls
    enableMoving();
}

function showHintLegend(){
    
    let popupId = popups.hintBox;

    let popup=document.getElementById(popupId);
    let hintMessage=document.getElementById("hintBoxMessage");
    hintMessage.innerHTML=messages.hintBoxMessage;

    popup.style.display="block";

    // showPopup("hintBox","Hints");

}

function closeHintLegend(){
    
    let popupId = popups.hintBox;
    let popup=document.getElementById(popupId);
    popup.style.display="none";
    // closePopup(popups.hintBox);

}