import React from 'react';
import '../styles/signUpForm.css';
import { TOP_LEVEL_PATHS } from '../constants/routeConstants';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Constants } from '../globalStates';

const SignupForm = () => {
	// Pass the useFormik() hook initial form values and a submit function that will
	// be called when the form is submitted
	const history = useHistory();
	const userEmail = useSelector((state) => state.user.email)
	const userName = useSelector((state) => state.user.fullName)

	const registerUser = values => {
		// event.preventDefault();
		console.log('!! values', values);
		// var formData = new FormData(document.getElementById('sign-up-form'))
        fetch('https://aryabota.herokuapp.com/api/user', {
			crossDomain: true,
			method: 'POST',
			body: JSON.stringify({ email: userEmail, ...values }),
			headers: {
                'Content-type': 'application/json',
                'Content-Security-Policy': 'upgrade-insecure-requests'
			}
		})
			.then(response => response.json())
			.then(response => {
				console.log('!! response form', response);
				// if(response) {
				let path = TOP_LEVEL_PATHS.HOME;
				history.push(path);
				console.log('pushed history: ', history);
				// }
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

	return (
		<>
			<div className="sign-up-form">
				<div className="intro-text">
				<span>Welcome {userName}!</span>
				<div className="disclaimer">{Constants.disclaimer}</div>
				</div>
				<form onSubmit={formik.handleSubmit}>
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
							<label>If you are a student, please tell us which course you are enrolled in</label>
							{/* <select name="field4" class="field-select"> */}
							<input type="radio" name="stream" value="CS" onChange={formik.handleChange} />B.Tech - Computer Science <br />
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
							<label>How would you rate your programming skills? (between 0 and 5) <span className="required">*</span></label>
							<input required type="number" min={0} max={5} name="skills" onChange={formik.handleChange} className="field-divided" />
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