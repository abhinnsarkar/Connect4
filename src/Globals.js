/**
 * Object capturing various colors
 * @const
 */
 export const colors = {

  Red : '#FF0000',
  Green : '#228D38',
  Black : '#000000',
  White : '#fff',
  Grey : '#7F7F7F',
  Yellow : '#FFF550',
  Purple : '#67097A',
  Orange : '#FF9100',
  Blue : "#2C15A2",
  Pink : "#FF00C4"

}

/**
 * Object capturing the various colors to be used in the game
 * @const
 *
 */
export const gameColors = {

  player1Color : colors.Red,
  player2Color : colors.Blue,
  gameBackgroundColor : colors.Black,
  gameTrayBgColor1 : colors.Black,
  gameTrayBgColor2 : colors.Black,
  gridColor : colors.Black,
  highlightColor : colors.Yellow,
  slotColor : colors.Grey,
  colHighlightColor : colors.White,
  trayHighlightColor : colors.White,
  safeToPlayColor : colors.Green,
  dangerColor : colors.Purple,
  winningColor : colors.Yellow,
  blockColor : colors.Pink

}

export const globals = {
  num_Of_Cols : 7,
  num_Of_Rows : 6,
  // slotLineWidth : 10,
  slotLineWidth : window.innerWidth/250,
  trayHighlightLineWidth : 5,
  trayUnhighlightLineWidth : 7,
  // winningSlotLineWidth : 20
  winningSlotLineWidth : window.innerWidth/125
}
