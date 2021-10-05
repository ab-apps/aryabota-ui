import React from 'react';
import './styles/footer.css';
import '@fortawesome/fontawesome-free/css/all.css';
import PESLogo from './assets/pes_logo.png'



function Footer() {
    return (
        <>
            <div className="footer">
                <div className="icons-container">
                    Contact Us:
                    <a className='icons' href='https://discord.gg/BCCga2Qh' target="_blank" rel="noreferrer noopener">
                        <i className="fab fa-discord"></i>
                    </a>
                    <a className='icons' href='mailto:aryabota.info@gmail.com' target="_blank" rel="noreferrer noopener">
                        <i className="fas fa-envelope"></i>
                    </a>
                    <a className='icons' href='https://github.com/ab-apps' target="_blank" rel="noreferrer noopener">
                        <i className="fab fa-github"></i>
                    </a>
                    <a className='icons' href='https://aryabota-docs.notion.site/aryabota-docs/AryaBota-316098bf36fc4cef9aeb8ef884a8c2d3' target="_blank" rel="noreferrer noopener">
                        <i className="fas fa-book"></i>
                    </a>



                </div>
                <div className="collab-container">
                    In Collaboration With <img src={PESLogo} height='25px' alt="PES Logo"></img>
                </div>
            </div>

        </>
    )
}

export default Footer;