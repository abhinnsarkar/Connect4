import { gameColors, globals } from './Globals.js';
import { Coin } from "./Coin.js";
/**
 * CoinTray class which encapsulates a physical tray of coins to store during the game
 */
export class CoinTray {

    /**
     * 
     * @param {number} x The Left most Coordinate of the Tray
     * @param {number} y The Top most Coordinate of the Tray
     * @param {number} width The Width of the Tray
     * @param {number} height The Height of the Tray
     * @param {string} coinColor Color of the coins that will be stored in this tray
     * @param {string} gridColor Color of the Tray outline
     * @param {string} bgColor Color of the background of the Tray
     * @param {number} totalRows Total Number of Rows that the tray will have
     * @param {number} totalCols Total Number of Columns within each row of the Tray
     */
    constructor(topLeft,top,width,height,coinColor, gridColor, bgColor, totalRows, totalCols){

        this.topLeft = topLeft; //top left x
        this.top = top; // top left y

        this.width = width; 
        this.height = height;

        this.coinColor = coinColor;
        this.gridColor = gridColor;

        this.totalRows = totalRows;
        this.totalCols = totalCols;

        this.squareSize;
        let totalCoins = this.totalRows * this.totalCols;
        this.bgColor = bgColor;

        this.coins = new Array(totalCoins);

        this.counter;

        this.coinsPlayed = 0;


    }

    draw(ctx){
        // ctx.strokeStyle = this.gridColor;
        // ctx.strokeRect(this.topLeft, this.top, this.width, this.width);



    }

    fillAllCoins(ctx) {
        // need to determine the size of each this.coins
        // for that, you need to determine the size of each square
        // for that, you need to divide the coin tray into a rows x cols grid

        let sqSizeBasedOnWidth = this.width / this.totalCols;
        let sqSizeBasedOnHeight = this.height / this.totalRows;



        if (sqSizeBasedOnWidth > sqSizeBasedOnHeight) { // this means we need to base our square on Height (smaller of the two)

            this.squareSize = sqSizeBasedOnHeight;
        }
        else {
            this.squareSize = sqSizeBasedOnWidth;
        }


        // draw the tray squares,  and coins
        for (var row=0;row<this.totalRows;row++) {

            for (var col=0;col<this.totalCols;col++) {

                let topLeft = this.topLeft+col*this.squareSize;
                let top = this.top+row*this.squareSize;

                this.coins[col+row*this.totalCols] = new Coin(topLeft+this.squareSize/2, top+this.squareSize/2, 0.8*this.squareSize/2, this.coinColor);
                this.coins[col+row*this.totalCols].draw(ctx);

            }
        }


    }

    removeCoin(ctx){

        /**
         * @typedef {Coin}
         */
        let lastCoin=this.coins.pop();
        lastCoin.erase(ctx,this.bgColor);
        this.coinsPlayed++;
    }

    /**
     * Returns True if the Tray is empty, else False
     */
    isEmpty() {
        
        return(this.coins.length==0);
    }
    
    highlight(ctx){

        this.drawLineAroundTray(ctx,gameColors.trayHighlightColor,globals.trayHighlightLineWidth);
        
    }

    unhighlight(ctx){
        this.drawLineAroundTray(ctx,gameColors.gameBackgroundColor,globals.trayUnhighlightLineWidth);
        
    }
    
    drawLineAroundTray(ctx,lineColor,lineWidth){
        let origStrokeStyle=ctx.strokeStyle;
        let origLineWidth=ctx.lineWidth;

        // set the properties for the hightlight
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;

        ctx.strokeRect(this.topLeft, this.top, this.width, (this.squareSize*this.totalRows));


        // rever to the original properties
        ctx.strokeStyle = origStrokeStyle;
        ctx.lineWidth = origLineWidth;

        
    }
}
