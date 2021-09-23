import React from 'react';
import '../styles/signUpForm.css';
import { TOP_LEVEL_PATHS } from '../constants/routeConstants';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

const SignupForm = () => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const history = useHistory();
    function enableDisableTextBox(class1, class2) {
        var chkYes = document.getElementById(class1);
        var txtPassportNumber = document.getElementById(class2);
        txtPassportNumber.disabled = chkYes.checked ? false : true;
        if (!txtPassportNumber.disabled) {
            txtPassportNumber.focus();
        }
    }
    const userEmail = useSelector((state) => state.user.email)

    const registerUser = event => {
        event.preventDefault();
        var formData = new FormData(document.getElementById('sign-up-form'))
        fetch('http://localhost:5000/api/user', {
            crossDomain: true,
            method: 'POST',
            body: JSON.stringify({email: userEmail}),
            headers: {
                'Content-type': 'application/json'
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
    return (
        <form class="sign-up-form" id = "sign-up-form" onSubmit = {registerUser}>
            <ul class="form-style-1">
                <li><label>Full Name <span class="required">*</span></label><input type="text" name="field1" class="field-divided" placeholder="First" /> <input type="text" name="field2" class="field-divided" placeholder="Last" /></li>
                <li>
                    <label>Age <span class="required">*</span></label>
                    <input type="number" min={10} max={75} name="field3" class="field-long" />
                </li>
                <li>
                    <label>Gender</label>
                    {/* <select name="field4" class="field-select"> */}
                    <input type="radio" name="gender" value="Male" />Male <br />
                    <input type="radio" name="gender" value="Female" />Female <br />
                    <input type="radio" name="gender" value="Prefer not to say" />Prefer not to say <br />
                    <div class="other-gender" style={{display: 'flex', alignItems: 'baseline'}}>
                        <input type="radio" name="gender" id="other" onClick = {() => enableDisableTextBox('other', 'other-text')} value="Other"/>Other
                        <input type="text" disabled="disabled" name="field3" id="other-text" style={{marginLeft: '10px'}}class="field-small" />
                    </div>
                </li>
                <li>
                    <label>If you are a student, please tell us which course you are enrolled in</label>
                    {/* <select name="field4" class="field-select"> */}
                    <input type="radio" name="btech" value="CS" />B.Tech - Computer Science <br />
                    <input type="radio" name="btech" value="IS" />B.Tech - Information Science <br />
                    <input type="radio" name="btech" value="ECE" />B.Tech - Electronics & Communication <br />
                    <input type="radio" name="btech" value="EEE" />B.Tech - Electrical & Electronics <br />
                    <input type="radio" name="btech" value="Mech" />B.Tech - Mechanical <br />
                    <input type="radio" name="btech" value="BioTech" />B.Tech - Biotechnology <br />
                    <div class="other-gender" style={{display: 'flex', alignItems: 'baseline'}}>
                        <input type="radio" name="btech" id="other-branch" onClick = {() => enableDisableTextBox('other-branch', 'other-branch-text')} value="Other"/>Other
                        <input type="text" id="other-branch-text" style={{marginLeft: '10px', height: '20px'}} disabled="disabled" name="field-divided" />
                    </div>
                </li>
                <li>
                    <label>How much programming would you say you know?</label>
                    {/* <select name="field4" class="field-select"> */}
                    <input type="radio" name="prog" value="none" />No experience <br />
                    <input type="radio" name="prog" value="school" />Exposure to programming in school <br />
                    <input type="radio" name="prog" value="outside-school" />Exposure to programming outside school (Hackathons, online coding contests, etc.) <br />
                    <input type="radio" name="prog" value="both" />Exposure to programming both in and outside school <br />
                </li>
                <li>
                    <label>How would you rate your programming skills? (between 0 and 5) <span class="required">*</span></label>
                    <input type="number" min={0} max={5} name="field3" class="field-small" />
                </li>
                <li>
                    <label>If you know programming, which language(s) do you know?</label>
                    {/* <select name="field4" class="field-select"> */}
                    <input type="checkbox" name="language" value="python" />Python <br />
                    <input type="checkbox" name="language" value="java" />Java <br />
                    <input type="checkbox" name="language" value="cpp" />C++ <br />
                    <input type="checkbox" name="language" value="c" />C <br />
                    <input type="checkbox" name="language" value="scratch" />Scratch <br />
                    <div class="other-gender" style={{display: 'flex', alignItems: 'baseline'}}>
                        <input type="checkbox" name="language" id="other-language" onClick = {() => enableDisableTextBox('other-language', 'other-language-text')} value="Other"/>Other
                        <input type="text" id="other-language-text" style={{marginLeft: '10px', height: '20px'}} disabled="disabled" name="field-divided" />
                    </div>
                </li>
                <li>
                    <input type="submit" value="Submit" />
                </li>
            </ul>
        </form>
    );
};

export default SignupForm;