import { gameColors, globals} from './Globals.js';
import { Coin } from './Coin.js';
import { Slot } from './Slot.js';
import { playCoinSound } from './Sounds.js';

export class GameBoard {
    
    constructor(ctx) {

        this.MAX_ROWS = globals.num_Of_Rows;
        this.MAX_COLS = globals.num_Of_Cols;
        
        this.pad;

        this.firstTime = true;

        this.winnerFound = false;
        this.playerColor;
        this.COINS_TO_WIN = 4;

        /**
         * @type {Array<Slot>}
         */
        this.winningSlots = new Array();
        

        this.slotCounters = new Array(this.MAX_COLS);
        this.columns = new Array(this.MAX_COLS);

        for(var i= 0; i<this.slotCounters.length; i++){
            this.slotCounters[i] = this.MAX_ROWS;
        }    

        this.currPlayer = 1;

    }

    checkIfWinnerFound() {
        return(this.winnerFound);
    }

    calculateSlotDimensions() {

        this.sqSize = this.height / this.MAX_ROWS;
        this.pad = (this.width - (this.MAX_COLS * this.sqSize))/2; 
        
    }
    resize(ctx, width, height, top, left) {

        this.width = width;
        this.height = height;

        this.calculateSlotDimensions();

        this.top = top;
        this.left = left;

        this.distBetweenRows = this.height/this.MAX_ROWS;

        if (this.firstTime) {
            this.createSlotsFirstTime(ctx);
            this.firstTime = false;
        }
        else {
            this.resizeSlots();
        }



    }

    createSlotsFirstTime(ctx) {

        for(var col=0; col < this.MAX_COLS; col++){

            var slotLeft = this.left + this.pad + (this.sqSize * col);

            this.columns[col] = new Array(this.MAX_ROWS);

            for(var row=0; row < this.MAX_ROWS; row++){

                var slotTop = this.top + (this.sqSize * row);

                this.columns[col][row] = new Slot(slotTop,slotLeft,this.sqSize,'#000000');

                this.columns[col][row].draw(ctx);

            }
        }

    }

    /**
     * Given a Column, this function will find the last slot, and fill it
     * If an open slot is not found, it will return False, else True
     * 
     * @param {Coin} coin The coin that needs to be dropped in this Column
     * @param {*} ctx The Game Context
     * @param {number} col The column in which the coin needs to be dropped
     * @returns {boolean} slotFound Boolean that tells whether an Empty Slot is found or not
     */
    dropCoin(coin,ctx,col){

        
        const backgroundColor = gameColors.gameBackgroundColor;
        let slotFound = false;
        // /**
        //  * @type {Object}
        //  */
    
        var lastSlot = this.getLastSlot(ctx,col);
        let lastSlotInThisColumn=lastSlot.emptySlot;
               

    
        if (lastSlotInThisColumn==null) {
            // this means this column has no slots available
    
        }
        else {
            playCoinSound();
            lastSlotInThisColumn.fill(ctx, coin, backgroundColor);
            slotFound=true;
            if(this.detectWinner(lastSlot.physicalCol,lastSlot.physicalRow)){}
    

        }
        return(slotFound);

    }

    /**
     * Highlights the Slots that are contributing to the win
     * @param {} ctx 
     */
    highlightWin(ctx) {
        this.winningSlots.forEach(slot => slot.highlight(ctx,globals.winningSlotLineWidth,gameColors.highlightColor));
        
    }

    /**
     * Checks and returns if there are enough coins for a win
     * @param {*} sideASlots 
     * @param {*} sideBSlots 
     * @param {*} actuallyPlayed 
     * @returns {boolean}
     */
    checkCoinsCondition(sideASlots,sideBSlots,actuallyPlayed=true){
        let conditionMet=false;
        if (this.checkIfEnoughCoins(sideASlots.length,sideBSlots.length)) {

            conditionMet=true;

            if(actuallyPlayed){

                this.winnerFound=true;
                this.winningSlots=this.winningSlots.concat(sideASlots.concat(sideBSlots));
            }
        }

        return (conditionMet);
    }
    
    /**
     * Check if the player who just played this column, row, has won or not
     * @param {*} col 
     * @param {*} row 
     * @returns {boolean} winnerFound
     */
    detectWinner(physicalCol,physicalRow){
        
        // convert to array index (base 0 arrays)

        let rowIndex=physicalRow-1;
        let colIndex=physicalCol-1;

        var currSlot = this.columns[colIndex][rowIndex];
        let currColor = currSlot.coin.color;

        this.winnerLogic(colIndex,rowIndex,currColor,true);

        // var sideASlots,sideBSlots;

        // /* check left right winner */
        // sideASlots = this.scanLeft(colIndex,rowIndex,currColor);
        // sideBSlots = this.scanRight(colIndex,rowIndex,currColor);
        // this.checkCoinsCondition(sideASlots,sideBSlots);

        // /* check above below winner */  
        // sideASlots = this.scanBelow(colIndex,rowIndex,currColor);
        // sideBSlots = this.scanAbove(colIndex,rowIndex,currColor);
        // this.checkCoinsCondition(sideASlots,sideBSlots);
        
        // /* Diagonal 1 */  
        // sideASlots = this.scanAboveRight(colIndex,rowIndex,currColor);
        // sideBSlots = this.scanBelowLeft(colIndex,rowIndex,currColor);
        // this.checkCoinsCondition(sideASlots,sideBSlots);

        // /* Diagonal 2 */  
        // sideASlots = this.scanAboveLeft(colIndex,rowIndex,currColor);
        // sideBSlots = this.scanBelowRight(colIndex,rowIndex,currColor);
        // this.checkCoinsCondition(sideASlots,sideBSlots);
        
        if (this.winnerFound) {
            this.winningSlots.push(currSlot)
        }
        return (this.winnerFound);

    }

    checkIfEnoughCoins(sideACount, sideBCount) {
        
        return((sideACount + sideBCount) >= this.COINS_TO_WIN - 1);
    }

    /**
     * Checks and returns for a winning combination
     * @param {*} colIndex 
     * @param {*} rowIndex 
     * @param {*} color 
     * @param {*} actuallyPlayed 
     * @returns {boolean}
     */
    winnerLogic(colIndex,rowIndex,color, actuallyPlayed){
        
        var sideASlots,sideBSlots;
        // var currSlot = this.columns[colIndex][rowIndex];

        /* check left right winner */
        sideASlots = this.scanLeft(colIndex,rowIndex,color);
        sideBSlots = this.scanRight(colIndex,rowIndex,color);
        let a=this.checkCoinsCondition(sideASlots,sideBSlots,actuallyPlayed);

        /* check above below winner */  
        sideASlots = this.scanBelow(colIndex,rowIndex,color);
        sideBSlots = this.scanAbove(colIndex,rowIndex,color);
        let b=this.checkCoinsCondition(sideASlots,sideBSlots,actuallyPlayed);
        
        /* Diagonal 1 */  
        sideASlots = this.scanAboveRight(colIndex,rowIndex,color);
        sideBSlots = this.scanBelowLeft(colIndex,rowIndex,color);
        let c=this.checkCoinsCondition(sideASlots,sideBSlots,actuallyPlayed);

        /* Diagonal 2 */  
        sideASlots = this.scanAboveLeft(colIndex,rowIndex,color);
        sideBSlots = this.scanBelowRight(colIndex,rowIndex,color);
        let d=this.checkCoinsCondition(sideASlots,sideBSlots,actuallyPlayed);
        
        return (a||b||c||d)
        // if (this.winnerFound) {
        //     this.winningSlots.push(currSlot)
        // }
        // return (this.winnerFound);
    }

    /**
     * 
     * Scans for matching winning slots to the left
     * 
     * @param {number} col 
     * @param {number} row 
     * @param {string} currColor 
     * @returns {Array<Slot>}
     */
    scanLeft(col, row, currColor) {

        let matchCounter=0;
        let keepScanning=true;        
        let winningSlots=new Array();


        while(keepScanning && col>0) {

            col--;
            let leftSlot = this.columns[col][row];

            if (leftSlot.isEmpty()) {
                keepScanning=false;
            }
            else { // left slot is not empty
                if (leftSlot.coin.color == currColor) {
                    matchCounter++;
                    this.playerColor = currColor;
                    winningSlots.push(leftSlot);
    
                }
                else { // a different color was found, so stop scanning
                    keepScanning=false;
    
                }
            }
        }
        
        return(winningSlots);

    }

    /**
     * Scans for matching winning slots to the right
     * 
     * @param {number} col 
     * @param {number} row 
     * @param {string} currColor 
     * @returns {Array<Slot>}
     */
    scanRight(col, row, currColor) {

        let matchCounter=0;
        let keepScanning=true;
        let winningSlots=new Array();
        
        

        while(keepScanning && col<this.MAX_COLS-1) {

            col++;
            let rightSlot = this.columns[col][row];

            if (rightSlot.isEmpty()) {
                keepScanning=false;
            }
            else { // right slot is not empty
                if (rightSlot.coin.color == currColor) {
                    matchCounter++;
                    this.playerColor = currColor;
                    winningSlots.push(rightSlot);
                }
                else { // a different color was found, so stop scanning
                    keepScanning=false;
                    this.playerColor = rightSlot.coin.color;
                }
            }
        }
        
        return(winningSlots);

    }
    
    /**
     * Scans for matching winning slots to the right
     * 
     * @param {number} col 
     * @param {number} row 
     * @param {string} currColor 
     * @returns {Array<Slot>}
     */
    scanAbove(col, row, currColor) {

        let matchCounter=0;
        let keepScanning=true;
        let winningSlots=new Array();
        

        while(keepScanning && row>0) {

            row--;
            let aboveSlot = this.columns[col][row];

            if (aboveSlot.isEmpty()) {
                keepScanning=false;
            }
            else { // above slot is not empty
                if (aboveSlot.coin.color == currColor) {
                    matchCounter++;
                    this.playerColor = currColor;
                    winningSlots.push(aboveSlot);
                }
                else { // a different color was found, so stop scanning
                    keepScanning=false;
                    this.playerColor = aboveSlot.coin.color;
                }
            }
        }
        
        return(winningSlots);

    }

    /**
     * Scans for matching winning slots to the right
     * 
     * @param {number} col 
     * @param {number} row 
     * @param {string} currColor 
     * @returns {Array<Slot>}
     */
    scanBelow(col, row, currColor) {
        

        let matchCounter=0;
        let keepScanning=true;
        let winningSlots=new Array();
        

        while(keepScanning && row<this.MAX_ROWS-1) {

            row++;
            let belowSlot = this.columns[col][row];

            if(row < this.MAX_ROWS){
                if (belowSlot.isEmpty()) {
                    keepScanning=false;
                }
                else { // below slot is not empty
                    if (belowSlot.coin.color == currColor) {
                        matchCounter++;
                        this.playerColor = currColor;
                        winningSlots.push(belowSlot);
                    }
                    else { // a different color was found, so stop scanning
                        keepScanning=false;
                        this.playerColor = belowSlot.coin.color;
                    }
                }
            }
            
        }
        
        return(winningSlots);

    }

    /**
     * Scans for matching winning slots to the right
     * 
     * @param {number} col 
     * @param {number} row 
     * @param {string} currColor 
     * @returns {Array<Slot>}
     */
    scanAboveLeft(col, row, currColor) {

        let matchCounter=0;
        let keepScanning=true;
        let winningSlots=new Array();
        

        while(keepScanning && row>0 && col>0) {

            row--;
            col--;
            let aboveSlotDiagonal = this.columns[col][row];

            if (aboveSlotDiagonal.isEmpty()) {
                keepScanning=false;
            }
            else { // above left slot is not empty
                if (aboveSlotDiagonal.coin.color == currColor) {
                    matchCounter++;
                    this.playerColor = currColor;
                    winningSlots.push(aboveSlotDiagonal);
                }
                else { // a different color was found, so stop scanning
                    keepScanning=false;
                    this.playerColor = aboveSlotDiagonal.coin.color;
                }
            }
        }
        
        return(winningSlots);

    }

    /**
     * Scans for matching winning slots to the right
     * 
     * @param {number} col 
     * @param {number} row 
     * @param {string} currColor 
     * @returns {Array<Slot>}
     */
    scanAboveRight(col, row, currColor) {

        let matchCounter=0;
        let keepScanning=true;
        let winningSlots=new Array();
        

        while(keepScanning && row>0 && col<this.MAX_COLS-1) {

            row--;
            col++;
            let aboveSlotDiagonal = this.columns[col][row];

            if (aboveSlotDiagonal.isEmpty()) {
                keepScanning=false;
            }
            else { // above right slot is not empty
                if (aboveSlotDiagonal.coin.color == currColor) {
                    matchCounter++;
                    this.playerColor = currColor;
                    winningSlots.push(aboveSlotDiagonal);
                }
                else { // a different color was found, so stop scanning
                    keepScanning=false;
                    this.playerColor = aboveSlotDiagonal.coin.color;
                }
            }
        }
        
        return(winningSlots);

    }
    
    /**
     * Scans for matching winning slots to the right
     * 
     * @param {number} col 
     * @param {number} row 
     * @param {string} currColor 
     * @returns {Array<Slot>}
     */
    scanBelowLeft(col, row, currColor) {

        let matchCounter=0;
        let keepScanning=true;
        let winningSlots=new Array();

        while(keepScanning && col>0 && row<this.MAX_ROWS-1) {

            row++;
            col--;
            let belowSlotDiagonal = this.columns[col][row];

            if (belowSlotDiagonal.isEmpty()) {
                keepScanning=false;
            }
            else { // below left slot is not empty
                if (belowSlotDiagonal.coin.color == currColor) {
                    matchCounter++;
                    this.playerColor = currColor;
                    winningSlots.push(belowSlotDiagonal);
                }
                else { // a different color was found, so stop scanning
                    keepScanning=false;
                    this.playerColor = belowSlotDiagonal.coin.color;
                }
            }
        }
        
        return(winningSlots);

    }

    /**
     * Scans for matching winning slots to the right
     * 
     * @param {number} col 
     * @param {number} row 
     * @param {string} currColor 
     * @returns {Array<Slot>}
     */
    scanBelowRight(col, row, currColor) {

        let matchCounter=0;
        let keepScanning=true;
        let winningSlots=new Array();

        
        while(keepScanning && row<this.MAX_ROWS-1 && col<this.MAX_COLS-1) {
            
            row++;
            col++;
            let belowSlotDiagonal = this.columns[col][row];

            if (belowSlotDiagonal.isEmpty()) {
                keepScanning=false;
            }
            else { // below right slot is not empty
                if (belowSlotDiagonal.coin.color == currColor) {
                    matchCounter++;
                    this.playerColor = currColor;
                    winningSlots.push(belowSlotDiagonal);
                }
                else { // a different color was found, so stop scanning
                    keepScanning=false;
                    this.playerColor = belowSlotDiagonal.coin.color;
                }
            }
        }
        
        return(winningSlots);

    }

    highlightPlayerCol(ctx,col){

        col--;
        /**
         * @type {Array<Slot>}
         */
        let currColumnSlots = this.columns[col];
        currColumnSlots.forEach(slot => slot.highlight(ctx,globals.slotLineWidth,gameColors.colHighlightColor));

    }

    unHighlightPlayerCol(ctx,col){
        col--;
        /**
         * @type {Array<Slot>}
         */
        let currColumnSlots = this.columns[col];
        currColumnSlots.forEach(slot => slot.unhighlight(ctx));
        
    }


    /**
     * Highlights which slots the player can play in
     * @param {*} ctx 
     * @param {*} highlightColor 
     */
    hints(ctx,currPlayerColor){
        
        // for each column, get the last available slot in that column
        // if there is no last available slot, don't do anything

        // if there is a last available slot, then 
        //     check if the row above this is a winner for the other color
        //     if yes, then highlight this last available slot with danger color
        //     if no, then highlight with ordinary color


        var lastSlot;
        
        this.columns.forEach((column, indx) => {
            
            lastSlot = this.getLastSlot(ctx,indx+1);
            let emptySlot = lastSlot.emptySlot;
            if (emptySlot==null) {
                // do nothing
                //its full
            }
            else {

                let hlColor = gameColors.safeToPlayColor;
                
                let otherPlayerWinPotential=this.rowAboveIsPotentialWinnerForOtherPlayer(ctx,lastSlot.physicalRow,lastSlot.physicalCol,currPlayerColor);    
                let selfWinPotential=this.selfWinPotential(ctx,lastSlot.physicalRow,lastSlot.physicalCol,currPlayerColor);
                let blockPotential = this.blockOtherPlayerWin(ctx,lastSlot.physicalRow,lastSlot.physicalCol,currPlayerColor);
                
                if (selfWinPotential) {
                    hlColor=gameColors.winningColor;
                }
                if (otherPlayerWinPotential) {
                    hlColor=gameColors.dangerColor;
                }

                if(blockPotential){
                    hlColor = gameColors.blockColor;
                }
                
                if(selfWinPotential && blockPotential){
                    hlColor = gameColors.winningColor;
                }

                emptySlot.highlight(ctx,globals.slotLineWidth,hlColor);
            }

        })
    }

    blockOtherPlayerWin(ctx,physicalRow,physicalCol,currPlayerColor){

        let otherPlayerColor;

        if(currPlayerColor == gameColors.player1Color){
            otherPlayerColor = gameColors.player2Color;
        }

        if(currPlayerColor == gameColors.player2Color){
            otherPlayerColor = gameColors.player1Color;
        }

    // using function to find a win for the other color
    var potentialBlock = this.selfWinPotential(ctx,physicalRow,physicalCol,otherPlayerColor);

    return (potentialBlock);

    }

    /**
     * Detects whether the above row is a potential winner for the other player
     * @param {number} physicalRow 
     * @param {number} physicalCol 
     * @param {string} currentPlayer 
     * @returns {boolean}
     */
    rowAboveIsPotentialWinnerForOtherPlayer(ctx,physicalRow,physicalCol,currPlayerColor) {
        let potentialWinner=false;

        if (physicalRow > 1) {
            let abovePhysicalRow=physicalRow-1;

            let colIndex = physicalCol-1;
            let rowIndex = abovePhysicalRow-1;
    
            var currColor = currPlayerColor;
            var aboveRowColor,aboveRowWinnerFound;
    
            if(currColor == gameColors.player1Color){
                // console.log("curr player is player 1");
                aboveRowColor = gameColors.player2Color;
            }
            else{
                // console.log("curr player is player 2");
                aboveRowColor = gameColors.player1Color;
            }
    
            // this.getLastSlot(ctx,physicalCol);
            if(this.winnerLogic(colIndex,rowIndex,aboveRowColor,false)){
    
                potentialWinner = true;
    
            }
        }
        

        return(potentialWinner);

    }

/**
     * Detects whether the current row is a potential winner for the current player
     * @param {number} physicalRow 
     * @param {number} physicalCol 
     * @param {string} currentPlayer 
     * @returns {boolean}
     */
    selfWinPotential(ctx,physicalRow,physicalCol,currPlayerColor) {

        let potentialWinner=false;
        
        let colIndex = physicalCol-1;
        let rowIndex = physicalRow-1;

        if(this.winnerLogic(colIndex,rowIndex,currPlayerColor,false)){
            potentialWinner = true;
        }
        return(potentialWinner);
    }


    /**
     * Shows where player can play
     * @param {} ctx 
     * @param {number} currPlayerColor the color of who has just played
     */
    showHint(ctx,currPlayerColor){


        this.hints(ctx,currPlayerColor);
        // this.hintsDangerSpot(ctx,playerCoinCol);


    }

        
    hideHint(ctx){
        
        this.columns.forEach((column, indx) => {
            let emptySlot=this.getLastSlot(ctx,indx+1).emptySlot;
            if (emptySlot==null) {
                // do nothing
            }
            else {
                emptySlot.unhighlight(ctx,globals.slotLineWidth,gameColors.slotColor);
            }

        })

    }


    /**
     * Gets the last slot avalable to play when called for a given column
     * @param {*} ctx 
     * @param {*} physicalCol 
     * @returns {Slot}
     */
     getLastSlot(ctx,physicalCol){
        
        let col=physicalCol-1; 

        //given the column, start checking from the bottom slot 
        //if bottom slot is full, check the slot above
        //keep doing till an empty slot is found
        //if all slots are full in that column, return false
        //if empty slot is found, fill it with the given coin

        let column = this.columns[col];
        var row,physicalRow;

        var slotFound = false;
        var emptySlot, slot;
        // this.slotFound = false;
        const backgroundColor = gameColors.gameBackgroundColor;



        for(row=this.MAX_ROWS-1; row>=0; row--){
            slot=column[row];
            

            if (slot.isEmpty()) {
                emptySlot=slot;
                slotFound=true;
                physicalRow = row+1;
                break;

            }
            else {
                // empty slot not found, check the one above in the for loop
            }

            
        }

        var getLastSlotIsReturning = {

            emptySlot : emptySlot,
            physicalRow : physicalRow,
            physicalCol : physicalCol
        }

        return (getLastSlotIsReturning);
        
    }














































    
    
}

