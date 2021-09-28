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
import React from 'react';
import About from './pages/about';
import { Game } from './pages/grid';
import bot_img from './assets/aryabota-icon.jpeg';
import SignupForm from './pages/signUpForm';
// Constants
import { Constants } from './globalStates';
import { TOP_LEVEL_PATHS } from './constants/routeConstants';
import { Provider } from 'react-redux';
import store from './reducers';
import { useDispatch } from 'react-redux';
import {addEmail, addName, setSpace} from './reducers/actions';
import { BASE_URL, environment } from './constants/routeConstants';
import { Button } from '@material-ui/core';

const failed = (response) => {
	console.log("failed:", response);
}

const LoginButton = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const routeChangeSecret = () => {
		dispatch(setSpace('IPS'));
		let path = TOP_LEVEL_PATHS.HOME;
		history.push(path);
	}

	const routeChange = (response) => {
		console.log(`${BASE_URL[environment]}/api/user?email=${response.profileObj.email}`)
		fetch(`${BASE_URL[environment]}/api/user?email=${response.profileObj.email}`, {
			crossDomain: true,
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				'Content-Security-Policy': 'upgrade-insecure-requests'
			  }
		}).then(response => response.json())
		.then(userExists => {
			let path = TOP_LEVEL_PATHS.HOME;
			if(!userExists) {
				path = TOP_LEVEL_PATHS.SIGNUP;
			}
			dispatch(addEmail(response.profileObj.email));
			dispatch(addName(response.profileObj.givenName, response.profileObj.familyName));
			history.push(path);
		});
	}

	return (
		<>
		<GoogleLogin
			clientId={Constants.clientId}
			buttonText="Sign In With Google"
			onSuccess={routeChange}
			onFailure={failed}
		/>
		<br/><br/>
		<Button
			variant="contained"
			onClick={routeChangeSecret}
		> Secret Route! </Button>
		</>
	)
}

const Content = () => {
	return (
		<div className="login-content">
			<div style={{ display: "flex", flexDirection: "row" }}>
			<img style = {{borderRadius: '100px'}} height="100px" src={bot_img} alt="X"/>
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
				<LoginButton />
			</div>
		</div>
	)
}

ReactDOM.render(
	<Provider store={store}>
		<Router className="router">
			<Switch>
				<Route path={`/${TOP_LEVEL_PATHS.HOME}`}>
					<Link className="router" to={`/${TOP_LEVEL_PATHS.GRID}`} style={{color: 'white'}}>Game</Link>
					<About />
				</Route>
				<Route path={`/${TOP_LEVEL_PATHS.GRID}`}>
					<Link className="router" to={`/${TOP_LEVEL_PATHS.HOME}`}>Home</Link>
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
	</Provider>
	, document.getElementById('root')
);
