import ReactDOM from 'react-dom';
import '../styles/grid.css';
import React, { useState, useLayoutEffect } from 'react';
//UTILITY FUNCTIONS SCRIPT
import { convertToContinuousNumbering } from '../utils';
//CHARACTER CONTROLLER COMPONENT
import Controller from '../characterController';
import MessageModal from '../modals/MessageModal';
//GLOBAL CONTEXT / STATE
import { MazeState } from '../globalStates';
import { BASE_URL, environment } from '../constants/routeConstants';

/**
 * Main Game Component
 * This component:
 * 1. initialize global state
 * 2. wrap that global state on maze and controller
 * 3. serve main page html
 * @component
 * @example
 * <Game />
 */
export function Game() {
  /**
   * mazeData contains the entire state of the maze
   * @const
   */
  const [mazeData, setMazeData] = useState({});

  /**
   * Game's useEffect:
   * this initializes mazeData
   * @public
   */
  useLayoutEffect(() => {
    /**
     * making request to get initial state of the grid and CoinSweeper robot 
     */
    fetch(`${BASE_URL[environment]}/api/problem?level=0.1`, {
      crossDomain: true,
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Content-Security-Policy': 'upgrade-insecure-requests'
      }
    })
      .then(response => response.json())
      .then(response => {
        setMazeData(mazeData => ({
          ...mazeData,
          rows: response?.rows,
          columns: response?.columns,
          coinSweeper: convertToContinuousNumbering(response?.row, response?.column, response?.columns),
          coinLoc: response?.coins?.map(obj => convertToContinuousNumbering(obj?.position?.row, obj?.position?.column, response?.columns)),
          obstacleLoc: response?.obstacles?.map(obj => convertToContinuousNumbering(obj?.position?.row, obj?.position?.column, response?.columns)),
          positionsSeen: response?.coloured?.map(trailObj => convertToContinuousNumbering(trailObj.position.row, trailObj.position.column, response?.columns)),
          currentDirection: response?.dir,
          levelType: response?.type,
          home: response?.homes?.map(obj => convertToContinuousNumbering(obj?.position?.row, obj?.position?.column, response?.columns)),
          statement: response?.statement,
          problemSpec: response?.problem_spec
        }))
      });
  }, []);

  //check if player location is generated
  let maze;
  let messageModal = null;
  if (mazeData.error_message || mazeData.message) {
    const modalMessage = mazeData.error_message
      ? mazeData.error_message
      : mazeData.message;
    messageModal = <MessageModal error_message={modalMessage} />;
  }
  if (mazeData.coinSweeper) {
    //set maze and controller component with required props
    maze = (
      <>
        <div className="game">
          <MazeState.Provider value={[mazeData, setMazeData]}>
            {messageModal}
            <Controller />
          </MazeState.Provider>
        </div>
      </>
    );
  } else {
    maze = <p>Loading...</p>
  }

  return (
    <>
      {maze}
    </>
  );
}
ReactDOM.render(
  <>
  <div className="mobile-disclaimer">eee</div>
    <Game />
  </>,
  document.getElementById('root')
);
