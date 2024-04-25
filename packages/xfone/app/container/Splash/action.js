import { API_CONST, ENUM, ENUM_STORAGE } from '@constants';
import { METHOD, apiBase } from '@mwg-kits/core';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SHOW_SPLASH = 'SHOW_SPLASH';
const IS_FIRST_TIME = 'IS_FIRST_TIME';
const START_GET_TOKEN = 'START_GET_TOKEN';
const STOP_GET_TOKEN = 'STOP_GET_TOKEN';
const RESTORE_TOKEN = 'RESTORE_TOKEN';
const IS_SIGNIN = 'IS_SIGNIN';
const STACK_APP = 'STACK_APP';
const SET_DEEPLINK = 'SET_DEEPLINK';

export const authenAction = {
    STACK_APP,
    SHOW_SPLASH,
    IS_FIRST_TIME,
    START_GET_TOKEN,
    STOP_GET_TOKEN,
    IS_SIGNIN,
    RESTORE_TOKEN
};

export const show_splash = function (isShowSplash = true) {
    return (dispatch) => {
        dispatch({
            type: authenAction.SHOW_SPLASH,
            isShowSplash
        });
    };
};

export const go_splash = function () {
    return (dispatch) => {
        dispatch({
            type: authenAction.STACK_APP,
            stack: ENUM.ENUM_STACK.SPLASH_STACK
        });
    };
};

export const go_home = function () {
    return (dispatch) => {
        dispatch({
            type: authenAction.STACK_APP,
            stack: ENUM.ENUM_STACK.HOME_STACK
        });
    };
};

export const goVideoCall = function () {
    return (dispatch) => {
        dispatch({
            type: authenAction.STACK_APP,
            stack: ENUM.ENUM_STACK.CALL_STACK
        });
    };
};

export const goAudioCall = function () {
    return (dispatch) => {
        dispatch({
            type: authenAction.STACK_APP,
            stack: ENUM.ENUM_STACK.AUDIO_CALL_STACK
        });
    };
};

// export const goChatPlugin = function () {
//     return (dispatch) => {
//         dispatch({
//             type: authenAction.STACK_APP,
//             stack: ENUM.ENUM_STACK.CHAT_STACK
//         });
//     };
// };

export const isSignIn = function (isSignIn) {
    return (dispatch) => {
        dispatch({
            type: authenAction.IS_SIGNIN,
            isSignIn
        });
    };
};

export const showOnBoarding = function () {
    return (dispatch) => {
        dispatch({
            type: authenAction.STACK_APP,
            stack: ENUM.ENUM_STACK.FISRT_LOGIN_SHOW_ON_BOARDING
        });
    };
};

export const set_token = function (token = null) {
    return (dispatch) => {
        dispatch(() => {
            return {
                type: RESTORE_TOKEN,
                token
            };
        });
    };
};

export const setDeeplink = function (params) {
    return (dispatch) => {
        dispatch({
            type: SET_DEEPLINK,
            data: params
        });
    };
};
