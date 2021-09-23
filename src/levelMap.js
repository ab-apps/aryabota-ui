import React from 'react';
import './styles/levelMap.css';

/**
 * UI Configuration Toolbar Component
 * This component provides support for:
 * 1. Adjusting font size (s/m/l) ranges
 * 2. Changing webpage base colour
 * 3. Toggling levels
 * @component
 * @example
 * <UiConfigs />
 */
function LevelMap(props) {

    return (
        <>
            <div className="levelMap">
                <p>LEVELS</p>
                <a href="/a">1</a>
                <a href="/b">2</a>
                <a href="/c">3</a>
                <a href="/d">4</a>
            </div>
        </>
    );
}

export default LevelMap;