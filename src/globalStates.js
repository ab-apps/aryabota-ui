import React from 'react';

/**
 * Global context / state to shared by all the components
 * @exports
 */
export const MazeState = React.createContext([{}, () => {}]);
export const Constants = {
    informationMessage: 'Welcome! We hope you enjoyed learning with AryaBota. To join our discord server, go to https://discord.gg/nEHKaXBn!',
    clientId: '214753177186-nt5lqnh5nggo5l11ur0qeb3onqibmst7.apps.googleusercontent.com',
    disclaimer: 'The data collected as a part of this project will be anonymised and used for research purposes. No personal information will be disclosed.'
};