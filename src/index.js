import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useHistory
} from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import './styles/index.css';
import React, { useState, useRef, useEffect } from 'react';
import About from './pages/about';
import Game from './pages/grid';
import bot_img from './assets/aryabota-icon.jpeg';
import SignupForm from './pages/signUpForm';
import Footer from './footer';
import IPSModal from './modals/IPSModal';
// Constants
import { Constants } from './globalStates';
import { TOP_LEVEL_PATHS } from './constants/routeConstants';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './reducers';
import { addEmail, addName, setSpace } from './reducers/user/userActions';
import { BASE_URL, environment } from './constants/routeConstants';
import { clearData } from './reducers/user/userActions';
import { Button } from '@material-ui/core';

const failed = (response) => {
	console.log("failed:", response);
}

const Content = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(clearData());
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);
	const [modal, showModal] = useState(false);
	const space = useRef('');

	const IpsFormValidator = (password, roll_number) => {
		if (password === "ips1234") {
			dispatch(addEmail(roll_number));
			dispatch(setSpace('IPS'));
			space.current = 'IPS';
			routeChange(roll_number);
		}
		else if (password === "stressbots:)7") {
			dispatch(addEmail(roll_number));
			dispatch(setSpace('Test'));
			space.current = 'Test';
			routeChange(roll_number);
		}
		else {
			alert('Incorrect Password! Please try again.');
		}
		showModal(false);
	}

	let messageModal = null;
	messageModal = <IPSModal id='IPS_Modal' className="IPS_Modal" onClick={IpsFormValidator} />;

	const history = useHistory();

	const routeChangeSecret = () => {
		showModal(true);
	}

	const routeChangePES = (response) => {
		dispatch(setSpace('PES'));
		space.current = 'PES';
		dispatch(addEmail(response.profileObj.email));
		dispatch(addName(response.profileObj.givenName, response.profileObj.familyName));

		routeChange(response.profileObj.email);
	}

	const routeChange = (response) => {
		fetch(`${BASE_URL[environment]}/api/user?email=${response}&space=${space.current}`, {
			crossDomain: true,
			method: 'GET',
			headers: {
				'Content-type': 'application/json'
			}
		}).then(response => response.json())
			.then(userExists => {
				let path = TOP_LEVEL_PATHS.HOME;
				if (!userExists) {
					path = TOP_LEVEL_PATHS.SIGNUP;
				}
				history.push(path);
			});
	}

	return (
		<div className="login-content">
			<div style={{ display: "flex", flexDirection: "row" }}>
				<img style={{ borderRadius: '100px' }} height="100px" src={bot_img} alt="X" />
			</div>
			<div>
				<br />
				Hello, welcome to AryaBota!
			</div>
			<div>
				<br />
				We hope you enjoy the experience, and learn programming.
			</div>
			<div className="google-login">
				<br /><br />
				To use the tool, please sign in here:
				<br /><br />
			</div>
			<div>
				<GoogleLogin
					clientId={Constants.clientId}
					buttonText="Sign In With Google"
					onSuccess={routeChangePES}
					onFailure={failed}
				/>
				<br /><br />
				<Button
					variant="contained"
					onClick={routeChangeSecret}
				> Secret Route! </Button>
			</div>
			{modal && messageModal}
		</div>
	)
}

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<Router className="router">
				<Switch>
					<Route path={`/${TOP_LEVEL_PATHS.HOME}`}>
						Click <Link className="router" to={`/${TOP_LEVEL_PATHS.GRID}`} style={{ color: 'rgb(57, 252, 39)' }}>HERE</Link> to start solving puzzles with AryaBota!
						<About />
					</Route>
					<Route path={`/${TOP_LEVEL_PATHS.GRID}`}>
						<Game />
					</Route>
					<Route path={`/${TOP_LEVEL_PATHS.SIGNUP}`}>
						<SignupForm />
					</Route>
					<Route path="/">
						<Content />
					</Route>
				</Switch>
			</Router>
			<Footer />
		</PersistGate>
	</Provider>
	, document.getElementById('root')
);
