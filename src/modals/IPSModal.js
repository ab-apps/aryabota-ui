import React from 'react';
import '../styles/IPSModal.css';
import Button from '@material-ui/core/Button';

function IPSModal(props) {

    const submitForm = () => {
        const password = document.getElementById('pwd').value;
        const roll_number = document.getElementById('rollno').value;
        props.onClick(password, roll_number);
    }
    return (
        <div className="modal">
            <div className="modal-content">
                <div>
                    <label style={{display: 'flex'}}>Roll No:</label>
                    <input style={{height: '25px'}} type="text" name="rollno" id="rollno"></input>
                    <br /><br />
                    <label style={{display: 'flex'}}>Password:</label>
                    <input style={{height: '25px'}} type="password" name="pwd" id="pwd"></input>
                    <br /><br />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={(e) => submitForm(e)}
                        >
                        OK
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default IPSModal;
