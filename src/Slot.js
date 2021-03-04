import { gameColors,globals } from "./Globals.js";

export class Slot{

  constructor(top,left,size,bgColor){

    this.top = Math.floor(top);
    this.left = Math.floor(left);
    this.size = Math.floor(size);
    this.bgColor = bgColor;
    this.margin;

    this.empty = true;

  }

  isEmpty() {
    return (this.empty);
  }

  resize() {
    // do something
  }

  createInStyle(ctx,slotLineWidth,highlightColor) {
    
    let originalWidth = ctx.lineWidth;
    ctx.lineWidth = slotLineWidth;
    if (this.margin==null) {
      this.margin = Math.floor(0.1 * this.size);
    }
    

    ctx.strokeStyle = highlightColor;
    ctx.strokeRect(this.left+this.margin, this.top+this.margin, this.size-2*this.margin, this.size-2*this.margin);
    ctx.lineWidth = originalWidth;

  }

  draw(ctx){

    // ctx.strokeStyle = '#000000';
    // ctx.strokeRect(this.left,this.top,this.size,this.size);
    this.createInStyle(ctx,globals.slotLineWidth,gameColors.slotColor); // line added to make the slot beautiful

  }
  fill(ctx, coin, backgroundColor){

    this.empty = false;
    this.coin = coin;

    let newCenterX = this.left + (this.size/2);
    let newCenterY = this.top + (this.size/2);

    this.coin.reposition(ctx, newCenterX, newCenterY, backgroundColor);

  }

  highlight(ctx,slotLineWidth,highlightColor){

    this.createInStyle(ctx,slotLineWidth,highlightColor);

  }

  unhighlight(ctx){
    this.createInStyle(ctx,globals.slotLineWidth,gameColors.slotColor);
  }

} 