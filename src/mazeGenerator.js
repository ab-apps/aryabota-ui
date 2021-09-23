import React from 'react';
//IMPORT SPRITES
import coinsweeper_img from './assets/bot3.png';
import obstacle_img from './assets/obstacle.png'
import coin_stack from './assets/coin_stack.png'
import home from './assets/home.png'

/**
 * Component to draw dynamic maze, food and 
 * character based on input
 * This component:
 * 1. take maze size input
 * 2. generate a 2 array of blocks
 * 3. each blocks is returned by Block component
 * @component
 */
export default function Maze(props) {
  /**
   * status/title for maze game
   * @const
   */
  // const status = 'CoinSweeper';

  /**
   * addRows function to generate a array of row 
   * each containing blocks column in it
   * NOTE: COLUMN REQUIRE ROW ID TO NUMBER EACH BLOCK 
   * @public 
   */
  const addRows = () =>{
    let rows = [];
    for(let i=0; i<props.x; i++){
      rows.push(<div className="maze-row">{addColumn(i)}</div>);
    }
    return rows;
  }

  /**
   * addColumn function to generate a array of column 
   * each containing single block in it
   * NOTE: BLOCK REQUIRE ID (1,2,3...) WE GENERATE ID 
   * FOR EACH BLOCK, SO THAT 10*10 MAZE HAVE 1 TO 100 
   * NUMBERING/ID FOR EACH BLOCK. 
   * @public 
   */
  const addColumn = (row) => {
    let column = [];
    for(let i=0; i<props.y; i++ ){
      //generate id with row number, current column number and a constant
      column.push(renderBlock(props.y*row + (i + 1)));
    }
    return column;
  }

  /**
   * function to render block and set player and food image
   * accordingly.
   * STEP 1: check if current block id match to food location
   *         if so, then set pass food image
   * STEP 2: check if current block id match to player location
   *         if so, then set pass player image
   * STEP 3: else set none to image parameter
   * @param {number} blockCount unique id for each block
   */
  const renderBlock = (blockCount) => {
    let classnames = "penUp";
    let blockImg = null;
    let rotation = '0';
    if (props?.positionsSeen?.indexOf(blockCount) >= 0
      && props?.positionsSeen?.indexOf(blockCount) !== -1) {
      // classnames = props.penStatus ? "penUp" : "penDown";
    }
    if (props.coinSweeper === blockCount) {
      switch (props.currentDirection) {
        case 'up': rotation = '180'; break;
        case 'down': rotation = '0'; break;
        case 'left': rotation = '90'; break;
        case 'right': rotation = '270'; break;
        default: rotation = '0'; break;
      }
      blockImg = coinsweeper_img;
    } else if (props.obstacleLoc.indexOf(blockCount) !== -1) {
      blockImg = obstacle_img;
    } else if (props.coinLoc.indexOf(blockCount) !== -1) {
      blockImg = coin_stack;
    } else if (props.home.indexOf(blockCount) !== -1) {
      blockImg = home;
    }
    if (props.penLoc.indexOf(blockCount) !== -1) {
      classnames = "penDown";
    }
    return <Block 
      value = {blockCount} 
      rotation = {rotation}
      image = {`url(${blockImg})`}
      className={classnames}
    />;
  }  

  return (
    <div className="grid-container">
      {/* <div className="status">{status}</div> */}
      <h3>AryaBota</h3>
      {addRows()}
    </div>
  );
}


/**
 * Component to draw each block(of maze) with image if any
 * This component:
 * 1. takes image url or none as parameter from mazeGenerator
 * 2. style background image correctly
 * 3. return button with correct and image style
 * @component
 * @example
 * <Block value={blockCount} image={`url(${food_img})`} />
 */
function Block(props) {

  //background image style
  var blockStyle = {
    backgroundSize: "75%",
    backgroundRepeat  : 'no-repeat',
    backgroundPosition: 'center',
    backgroundImage: props.image,
    transform: 'rotate(' + props.rotation + 'deg)'
  };
  
  return <button  style={{
    ...blockStyle,
    ...props.style,
  }}
  className={["block", props.className].join(' ')}
  id={"block_" + props.value}
  >
  </button>;
}
