import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import { useDispatch } from 'react-redux';
import './styles/uiConfigurations.css';
//BUTTON and DROPDOWN COMPONENTS
import Select from 'react-select';
import Button from '@material-ui/core/Button';
//COLOUR PICKER
import { GithubPicker } from 'react-color';
//MATERIAL UI ICONS FOR CONFIG BUTTONS
import PaletteTwoTone from '@material-ui/icons/PaletteTwoTone';
import FormatSize from '@material-ui/icons/FormatSize';
import CodeIcon from '@material-ui/icons/Code';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { clearData } from './reducers/actions';
//MAZE STATE
import { Constants } from './globalStates';
//UTILS
import aryabota_logo from './assets/aryabota_icon.jpg';

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
function UiConfigs(props) {
    const dispatch = useDispatch();
    /**
     * color sets the base color of the webpage
     * @var
     */
    let [color, setColor] = useState("");

    /**
     * sizes sets the size range of the text
     * @var
     */
    let [sizes, setSizes] = useState("Medium");

    /**
     * Updates color
     * @param {*} e 
     */
    var colorChange = e => {
        setColor(e.hex);
    }

    /**
     * Updates sizes
     * @param {*} e 
     */
    var sizeChange = e => {
        setSizes(e.label);
        props.onSizeChange(e.editor);
    }

    /**
     * Contains option values for fontSize dropdown
     * @var 
     */
    var sizeValues = [
        {
            value: 1,
            label: "Small",
            editor: 12
        },
        {
            value: 2,
            label: "Medium",
            editor: 14
        },
        {
            value: 3,
            label: "Large",
            editor: 16
        }
    ];

    /**
     * calculates colour values for highlights based on the base colour
     * @param {*} col 
     * @param {*} amt 
     * @returns lightened or darkened colour
     */
    function LightenDarkenColor(col, amt) {

        var colorValue = false;

        if (col[0] === "#") {
            col = col.slice(1);
            colorValue = true;
        }

        var num = parseInt(col, 16);

        var r = (num >> 16) + amt;

        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        var b = ((num >> 8) & 0x00FF) + amt;

        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        var g = (num & 0x0000FF) + amt;

        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        return (colorValue ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);

    }

    /**
     * This component displays a button on the toolbar
     * @returns ToggleColor component
     * @example
     * <ToggleColor />
     */
    const ToggleColor = () => {
        var [tc, setTc] = useState(false);
        const onClick = () => {
            if (tc === false) setTc(true);
            else setTc(false);
        }

        return (
            <div className="colorSelector">
                <Button
                    onClick={onClick}
                    variant="contained"

                    startIcon={<PaletteTwoTone />}
                >
                    Color
                </Button>
                {tc ?
                    <GithubPicker
                        onChange={colorChange}
                    ></GithubPicker>
                    : null}
            </div>
        )
    }

    /**
     * This component displays a button on the toolbar
     * @returns ToggleSize component
     * @example
     * <ToggleSize />
     */
    const ToggleSize = () => {
        var [ts, setTs] = useState(false);
        const onClick = () => {
            if (ts === false) setTs(true);
            else setTs(false);
        }

        return (
            <div className="sizeSelector">
                <Button
                    onClick={onClick}
                    variant="contained"

                    startIcon={<FormatSize />}
                >
                    Font Size
                </Button>
                {ts ?
                    <Select
                        id="sizeSelector"
                        placeholder={sizes}
                        options={sizeValues}
                        onChange={sizeChange}
                    />
                    : null}
            </div>
        )
    }

    /**
     * This component displays a button on the toolbar
     * @returns TogglePane component
     * @example
     * <TogglePane />
     */
    const TogglePane = () => {
        var [tp, setTp] = useState(true);
        const onClick = () => {

            if (tp === false) {
                setTp(true);
                document.getElementById("python-pane").style.display = "block";
                document.getElementById("separator-2").style.display = "block";
            }
            else {
                setTp(false);
                document.getElementById("python-pane").style.display = "none";
                document.getElementById("separator-2").style.display = "none";
            }
        }

        return (
            <div className="pythonViewer">
                <Button
                    onClick={onClick}
                    variant="contained"
                    startIcon={<CodeIcon />}
                >
                    Show Python
                </Button>
            </div>
        )
    }

    const InfoButton = () => {
        const history = useHistory();
        const onClick = () => {
            let path = 'home';
            history.push(path);
        }

        return (
            <div className="infoButton">
                <InfoOutlinedIcon
                    onClick={onClick}
                />
            </div>
        )
    }

    const LogoutButton = () => {
        const history = useHistory();

        const logout = (_response) => {
            dispatch(clearData());
            let path = '/';
            history.push(path);
        }

        return (
            <div className="googleLogout">
                <GoogleLogout
                    render={renderProps => (
                        <Button variant="contained" startIcon={<ExitToAppIcon />} onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</Button>
                    )}
                    clientId={Constants.clientId}
                    buttonText="Logout"
                    onLogoutSuccess={logout}
                />
            </div>
        )
    }

    return (
        <div>
            <style>
                {
                    'body { background-color: ' + color + '; color: ' + LightenDarkenColor(color, -85) + ';}'
                    + '.toolbar { background-color: ' + LightenDarkenColor(color, -35) + ';}'
                    + '.output-title {background-color: ' + color + ';}'
                    + (sizes === "Small" ? 'p { font-size: small;} h3 { font-size: large; } .status { font-size: 22px; } textarea { font-size: 13px;}' :
                        sizes === "Medium" ? 'p { font-size: medium;} h3 { font-size: larger; } .status { font-size: 25px; } textarea { font-size: 15px;}' :
                            sizes === "Large" ? 'p { font-size: larger;} h3 { font-size: x-large; } .status { font-size: 30px; } textarea { font-size: 17px;}' :
                                null)

                }
            </style>
            <div className="toolbar" id="toolbar-div">
                <div className="configs">
                    <img className="logo" alt="AryaBota Logo" src={aryabota_logo} height="45px" />
                    <ToggleSize />
                    <ToggleColor />
                    <TogglePane />
                    <InfoButton />
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}

export default UiConfigs;
