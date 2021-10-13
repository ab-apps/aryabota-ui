import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import '../styles/about.css';
import notion_logo from '../assets/Notion_app_logo.png';

function About() {
    return (
        <div style={{ width: '100%', height: '100%' }} className="about-page">
            {/* <br />
            <div>We are working on updating this page. <br />
                Meanwhile, you can take a look at our documentation <a className='hrefs' href='https://aryabota-docs.notion.site/aryabota-docs/AryaBota-316098bf36fc4cef9aeb8ef884a8c2d3' rel="noopener noreferrer" target="_blank">here</a>
            </div> */}
            <Grid sx={{ flexGrow: 1 }} container spacing={2}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={8}>
                        <Grid item container className="left-grids" justifyContent="center" spacing={3} sx={{ height: '70vh', width: '54vw'}}>
                            <Grid item>
                                <Paper className="about-item" sx={{ height: '30vh', width: '50vw', backgroundColor: 'hsl(240deg 7% 97% / 70%)' }}>
                                    Game
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper className="about-item" sx={{ height: '30vh', width: '50vw', backgroundColor: 'hsl(240deg 7% 97% / 70%)' }}>
                                    Game
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid item className="welcome-grid">
                            <Paper className="about-item" sx={{ height: '70vh', width: '20vw', backgroundColor: 'hsl(240deg 7% 97% / 70%)' }}>
                                Welcome
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default About;
