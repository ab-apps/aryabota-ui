import React from 'react';
import '../styles/signUpForm.css';
import { TOP_LEVEL_PATHS } from '../constants/routeConstants';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Constants } from '../globalStates';
import { BASE_URL, environment } from '../constants/routeConstants';
import { clearData } from '../reducers/user/userActions';

const SignupForm = () => {
	// Pass the useFormik() hook initial form values and a submit function that will
	// be called when the form is submitted
	const history = useHistory();
	const dispatch = useDispatch();
	dispatch(clearData());
	const userEmail = useSelector((state) => state.user.email);
	const userName = useSelector((state) => state.user.fullName);
	const space = useSelector((state) => state.user.space);

	const registerUser = values => {
		fetch(`${BASE_URL[environment]}/api/user`, {
			crossDomain: true,
			method: 'POST',
			body: JSON.stringify({ email: userEmail, space: space, ...values }),
			headers: {
				'Content-type': 'application/json',
				'Content-Security-Policy': 'upgrade-insecure-requests'
			}
		})
			.then(response => response.json())
			.then(response => {
				let path = TOP_LEVEL_PATHS.HOME;
				history.push(path);
			});
	}

	function enableDisableTextBox(class1, class2) {
		var chkYes = document.getElementById(class1);
		var txtPassportNumber = document.getElementById(class2);
		txtPassportNumber.disabled = chkYes.checked ? false : true;
		if (!txtPassportNumber.disabled) {
			txtPassportNumber.focus();
		}
		else {
			txtPassportNumber.disabled = true;
		}
	}

	const formik = useFormik({
		initialValues: {
			rollno: '',
			age: '',
			gender: '',
			stream: '',
			progExp: '',
			skills: '',
			language: ''
		},
		onSubmit: values => {
			registerUser(values)
		},
	});

	const showValue = (x) => {
		document.getElementById("skills_div").innerHTML = x.target.value;
	}

	return (
		<>
			<div className="sign-up-form">
				<form onSubmit={formik.handleSubmit}>
					<div className="intro-text">
						<span>Welcome {userName}!</span>
						<div className="disclaimer">{Constants.disclaimer}
							<br />
							<input type="checkbox" required /> I agree to these terms
						</div>

					</div>

					<ul className="form-style-1">
						<li>
							<label>Age <span className="required">*</span></label>
							<input
								id="age"
								type="number"
								min={10}
								max={75}
								name="age"
								onChange={formik.handleChange}
								value={formik.values.age}
								className="field-divided"
								required
							/>
						</li>

						<li>
							<label>Gender<span className="required"> *</span></label>
							<input required type="radio" name="gender" onChange={formik.handleChange} value="Male" />Male <br />
							<input type="radio" name="gender" onChange={formik.handleChange} value="Female" />Female<br />
							<input type="radio" name="gender" onChange={formik.handleChange} value="Prefer not to say" />Prefer not to say <br />
							<div className="other-gender" style={{ display: 'flex', alignItems: 'baseline' }}>
								<input type="radio" name="gender" id="other" onChange={formik.handleChange} onClick={() => enableDisableTextBox('other', 'other-text')} value="Other" />Other
								<input type="text" disabled="disabled" name="gender" onChange={formik.handleChange} id="other-text" style={{ marginLeft: '10px' }} className="field-small" />
							</div>
						</li>
						<li>
							<label>Please tell us which course you are enrolled in<span className="required"> *</span></label>
							<input type="radio" required name="stream" value="CS" onChange={formik.handleChange} />B.Tech - Computer Science <br />
							<input type="radio" name="stream" value="IS" onChange={formik.handleChange} />B.Tech - Information Science <br />
							<input type="radio" name="stream" value="ECE" onChange={formik.handleChange} />B.Tech - Electronics & Communication <br />
							<input type="radio" name="stream" value="EEE" onChange={formik.handleChange} />B.Tech - Electrical & Electronics <br />
							<input type="radio" name="stream" value="Mech" onChange={formik.handleChange} />B.Tech - Mechanical <br />
							<input type="radio" name="stream" value="BioTech" onChange={formik.handleChange} />B.Tech - Biotechnology <br />
							<div className="other-gender" style={{ display: 'flex', alignItems: 'baseline' }}>
								<input type="radio" name="stream" id="other-branch" onClick={() => enableDisableTextBox('other-branch', 'other-branch-text')} value="Other" />Other
								<input type="text" id="other-branch-text" style={{ marginLeft: '10px', height: '20px' }} onChange={formik.handleChange} disabled="disabled" name="field-divided" />
							</div>
						</li>

						<li>
							<label>How much programming would you say you know?<span className="required"> *</span></label>
							<input required type="radio" name="progExp" value="none" onChange={formik.handleChange} />No experience <br />
							<input type="radio" name="progExp" value="school" onChange={formik.handleChange} />Exposure to programming in school <br />
							<input type="radio" name="progExp" value="outside school" onChange={formik.handleChange} />Exposure to programming outside school (Hackathons, online coding contests) <br />
							<input type="radio" name="progExp" value="both" onChange={formik.handleChange} />Exposure to programming both in and outside school <br />
						</li>
						<li>
							<label>How would you rate your programming skills? <span className="required">*</span>
								<br />
								(0 = No Experience, 5 = Proficient)
							</label>
							<div className="field-divided" style={{ textAlign: 'center' }} id="skills_div">3</div>
							0
							<input required type="range" min={0} max={5} step="1" name="skills" id="skills_value" onClick={showValue} onChange={formik.handleChange} className="field-divided" />
							5
						</li>
						<li>
							<label>If you know programming, which language(s) do you know?</label>
							<input type="checkbox" name="language" value="python" onChange={formik.handleChange} />Python <br />
							<input type="checkbox" name="language" value="java" onChange={formik.handleChange} />Java <br />
							<input type="checkbox" name="language" value="cpp" onChange={formik.handleChange} />C++ <br />
							<input type="checkbox" name="language" value="c" onChange={formik.handleChange} />C <br />
							<input type="checkbox" name="language" value="scratch" onChange={formik.handleChange} />Scratch <br />
							<div className="other-gender" style={{ display: 'flex', alignItems: 'baseline' }}>
								<input type="checkbox" name="language" id="other-language" onClick={() => enableDisableTextBox('other-language', 'other-language-text')} value="Other" />Other
								<input type="text" id="other-language-text" style={{ marginLeft: '10px', height: '20px' }} onChange={formik.handleChange} disabled="disabled" name="other-language" />
							</div>
						</li>
					</ul>
					<br />
					<button type="submit" className="submit">Submit</button>
				</form>
			</div>
		</>
	);
};

export default SignupForm;