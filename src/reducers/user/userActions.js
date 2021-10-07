export const USER_TYPES = {
    SET_EMAIL: 'user/set_email',
    UNSET_EMAIL: 'user/unset_email',
    SET_LEVEL: 'user/set_level',
    SET_NAME: 'user/set_name',
    SET_SPACE: 'user/set_space',
    SET_LEVELS: 'user/set_levels',
    UNSET_ALL: 'user/unset_all',
    SET_BOT_STATUS: 'user/set_bot_status'
};

export const addEmail = (email) => {
    return {
        type: USER_TYPES.SET_EMAIL,
        payload: {email: email},
    };
}

export const removeEmail = () => {
    return {
        type: USER_TYPES.UNSET_EMAIL,
    };
}

export const setLevel = (level) => {
    return {
        type: USER_TYPES.SET_LEVEL,
        payload: {level: level}
    };
}

export const setSpace = (space) => {
    return {
        type: USER_TYPES.SET_SPACE,
        payload: {space: space}
    };
}

export const setLevels = (levels) => {
    return {
        type: USER_TYPES.SET_LEVELS,
        payload: {levels: levels}
    };
}

export const addName = (firstName, lastName) => {
    return {
        type: USER_TYPES.SET_NAME,
        payload: {fullName: firstName.concat(' ', lastName)},
    };
}

export const clearData = () => {
    return {
        type: USER_TYPES.UNSET_ALL,
    };
}

export const setBotStatus = (botStatus) => {
    return {
        type: USER_TYPES.SET_BOT_STATUS,
        payload: {botStatus: botStatus}
    };
}