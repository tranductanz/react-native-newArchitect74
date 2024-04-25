import { helper, storage, getTokenNotification } from '@common';
import { apiBase, METHOD } from '@mwg-kits/core';
import { API_CONST, ENUM, ENUM_STORAGE } from '@constants';
import { Platform } from 'react-native';

import * as actionSplash from '../Splash/action';

export const DEVICE = Platform.OS === 'android' ? 'XFONE_ANDROID' : 'XFONE_IOS';

export const AUTH_FETCHING = 'AUTH_FETCHING';
export const AUTH_COMPLETED = 'AUTH_COMPLETED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTHEN_LOGOUT = 'AUTHEN_LOGOUT';
export const INITIAL_USER_PROFILE = 'INITIAL_USER_PROFILE';
export const SIP_IP = 'SIP_IP';
export const SET_LIVESTREAM_PERMISSION_LIST = 'SET_LIVESTREAM_PERMISSION_LIST';

import CryptoJS from 'rn-crypto-js';
import Config from 'react-native-config';

const ModulesApp = [
    {
        moduleName: 'SUPERXFONE',
        featureName: 'LiveStream'
    },
    {
        moduleName: 'SUPERXFONE',
        featureName: 'CallCenter'
    }
];

export const authAccountWithLogin =
    (username, password, corrds) => (dispatch) => {
        return new Promise(async (resolve, reject) => {
            try {
                const deviceID = await helper.getUniqueId();
                const body = {
                    username,
                    totp: password,
                    grant_type: 'password',
                    device_id: deviceID,
                    device_info: corrds
                        ? `latitude=${corrds.latitude}&longitude=${corrds.longitude}`
                        : ''
                };

                const customHeader = new Headers();
                const AUTHEN_KEY = __DEV__
                    ? 'Basic bXdnLWF1dGhvci1hcHA6bmN4aDQxYzIzbGNtMzE='
                    : `Basic ${API_CONST.TOKEN_DEFAULT}`;
                customHeader.append('authorization', AUTHEN_KEY);

                customHeader.append('accept', 'application/json');
                customHeader.append(
                    'content-type',
                    'application/x-www-form-urlencoded'
                );

                global.props.showLoader();
                const response = await apiBase(
                    API_CONST.API_AUTH_TOKEN,
                    METHOD.POST,
                    body,
                    {
                        isCustomToken: true,
                        customHeader
                    }
                );

                if (
                    helper.hasProperty(response, 'access_token') &&
                    helper.IsValidateObject(response.access_token) &&
                    !helper.IsEmptyString(response.access_token)
                ) {
                    const data = [
                        [ENUM_STORAGE.TOKEN_ACCESS, response.access_token]
                    ];
                    await storage.multiSet(data);
                    dispatch(authToken());
                    return;
                }
            } catch (error) {
                console.log('error', error);
                global.props.hideLoader();
                reject(error);
                dispatch({
                    type: AUTH_ERROR,
                    error
                });
            }
        });
    };

export const authToken = () => (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await getTokenNotification();
            const notificationToken = await storage.getItem(
                ENUM_STORAGE.TOKEN_NOTIFICATION
            );
            const apnToken = await storage.getItem(ENUM_STORAGE.APN_TOKEN);
            const deviceID = await helper.getUniqueId();

            let bodyApi = {
                deviceId: deviceID,
                requestPassword: true,
                device: DEVICE,
                apnToken
            };

            if (notificationToken) {
                bodyApi = {
                    ...bodyApi,
                    notificationToken,
                    notificationType: 'SUB_FB'
                };
            } else {
                bodyApi = {
                    ...bodyApi,
                    notificationToken: `notifiToken_${deviceID}`,
                    notificationType: 'SUB_SOCK'
                };
            }

            const token = await storage.getItem(ENUM_STORAGE.TOKEN_ACCESS);

            const deviceToken = await storage.getItem(
                ENUM_STORAGE.DEVICE_TOKEN
            );

            const arrPro = [
                apiBase(
                    API_CONST.API_AUTH_TOKEN_VALIDATE,
                    METHOD.POST,
                    bodyApi,
                    {
                        access_token: token,
                        deviceToken: deviceToken
                    }
                ),
                apiBase(
                    API_CONST.API_AUTH_USER,
                    METHOD.POST,
                    {},
                    {
                        access_token: token,
                        deviceToken: deviceToken
                    }
                ),
                apiBase(
                    API_CONST.GET_LIST_PERMISSION_BY_USERNAME,
                    METHOD.POST,
                    {},
                    {
                        access_token: token,
                        deviceToken: deviceToken
                    }
                )
            ];
            const response = await Promise.all(arrPro);
            global.props.hideLoader();
            if (response[2].object && response[2].object.permission_list) {
                dispatch({
                    type: SET_LIVESTREAM_PERMISSION_LIST,
                    data: response[2].object.permission_list
                });
            }
            if (
                !response[0].error &&
                helper.hasProperty(response[0], 'object') &&
                !response[1].error &&
                helper.hasProperty(response[1], 'object')
            ) {
                const data = {
                    subToken: response[0].object.subToken,
                    image: response[0].object.image,
                    subscriber: response[0].object.subscriber,
                    ...response[1].object.userInfo
                };
                dispatch({
                    type: INITIAL_USER_PROFILE,
                    data
                });

                // Lưu subtoken cho notifi ws
                storage.multiSet([
                    [
                        ENUM_STORAGE.SUBTOKEN_NOTIFICATION,
                        helper.IsValidateObject(data.subToken)
                            ? data.subToken
                            : ''
                    ],
                    [
                        ENUM_STORAGE.USER_INFO,
                        JSON.stringify(response[1].object.userInfo)
                    ],
                    [ENUM_STORAGE.FIRST_LOGIN, '1'],
                    [ENUM_STORAGE.FULL_USER_INFO, JSON.stringify(data)]
                ]);

                dispatch({
                    type: AUTH_COMPLETED
                });
                dispatch(actionSplash.isSignIn(true));
                return resolve();
            }
            throw setCustomError(
                -1,
                'Không xác định được dữ liệu từ hệ thống',
                'Không xác định được dữ liệu từ hệ thống'
            );
        } catch (error) {
            console.log('ERROR AUTH TOKEN', error);
            global.props.hideLoader();
            reject(error);
        }
    });
};

export const authAccount = (response) => (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                helper.hasProperty(response, 'access_token') &&
                helper.IsValidateObject(response.access_token) &&
                !helper.IsEmptyString(response.access_token)
            ) {
                const deviceID = await helper.getUniqueId();
                const deviceToken = CryptoJS.MD5(
                    `${deviceID}:${response.DEVICE_TOKEN}`
                ).toString();
                const data = [
                    [ENUM_STORAGE.TOKEN_ACCESS, response.access_token],
                    [ENUM_STORAGE.DEVICE_TOKEN, deviceToken]
                ];
                await storage.multiSet(data);
                dispatch(authToken());

                resolve();
            }
        } catch (error) {
            console.log('ERROR authAccount', error);
            reject(error);
        }
    });
};

export function checkVersionApp() {
    return (dispatch, getState) => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await storage.getItem(ENUM_STORAGE.TOKEN_ACCESS);

                const deviceToken = await storage.getItem(
                    ENUM_STORAGE.DEVICE_TOKEN
                );

                const body = {
                    appName: 'XFONE'
                };
                const response = await apiBase(
                    API_CONST.VERSION_APP_BY_NAME,
                    METHOD.POST,
                    body,
                    {
                        access_token: token,
                        deviceToken: deviceToken
                    }
                );

                if (
                    helper.hasProperty(response, 'object') &&
                    helper.IsValidateObject(response.object)
                ) {
                    const platformName =
                        Platform.OS === 'android'
                            ? 'android-version'
                            : 'ios-version';
                    const res = response.object.find(
                        (x) => x.settingKey === platformName
                    );
                    const sipIP = response.object.find(
                        (x) => x.settingKey === 'SIP-IP'
                    );
                    storage.setItem(ENUM_STORAGE.SIP_IP, JSON.stringify(sipIP));
                    dispatch({
                        type: SIP_IP,
                        data: sipIP
                    });
                    return resolve(res);
                }
                reject();
            } catch (error) {
                reject(error);
            }
        });
    };
}
