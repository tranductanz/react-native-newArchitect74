import React from 'react';
// import { Federated } from '@callstack-mwg/repack/client';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
import { ENUM_STORAGE, constants } from '@constants';
import { Dimensions, Linking } from 'react-native';
import 'react-native-get-random-values';
import * as uuid from 'uuid';
import CodePush from 'react-native-code-push';
import AsyncStorage from '@react-native-async-storage/async-storage';

// export const downloadModule = (featureName, container) => {
//     return React.lazy(() => Federated.importModule(featureName, container));
// };

export function isArray(obj) {
    return obj !== undefined && obj !== null && obj.constructor === Array;
}

export const isEmpty = (obj) => {
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
};
export const IsEmptyString = (str) => isString(str) && str.length === 0;
export const IsEmptyObject = (obj) => isEmpty(obj);
export const IsEmptyArray = (arr) => isArray(arr) && arr.length === 0;

// Return Boolean
export function IsValidateObject(object) {
    return object !== undefined && object !== null;
}

// Return Boolean
export const hasProperty = (object, property) => {
    return (
        IsValidateObject(object) &&
        Object.hasOwnProperty.call(object, property) &&
        IsValidateObject(object[property])
    );
};

export function getVersion() {
    const version = DeviceInfo.getVersion();
    if (constants.ISDEV) {
        return '1.0.0';
    }
    return version;
}

export const getENVUppercase = () => {
    let ENV = '';
    switch (Config.ENV) {
        case 'staging':
            ENV = 'STAGING';
            break;

        case 'production':
            ENV = 'PROD';
            break;

        case 'live':
            ENV = 'LIVE';
            break;

        default:
            ENV = 'DEV';
            break;
    }
    return ENV;
};

export const { width, height } = Dimensions.get('window');

export const isAppInstalled = async (scheme) => {
    let result = false;
    try {
        result = await Linking.canOpenURL(`${scheme}://`);
    } catch (err) {
        console.log('isAppInstalled', err);
    }
    return result;
};

export const getUniqueId = () => DeviceInfo.getUniqueId();

export function isString(obj) {
    return obj !== undefined && obj !== null && obj.constructor === String;
}

export function getDeviceName() {
    const deviceName = DeviceInfo.getModel(); // Get device name
    return deviceName.length > 0 ? deviceName : 'anonymously';
}

export function isFunction(obj) {
    return obj !== undefined && obj !== null && obj.constructor === Function;
}

export function isJSON(str) {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
}

export const uuidv4 = () => uuid.v4();

export const openURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
        if (supported) {
            Linking.openURL(url);
        }
    });
};

export const getQueryString = (params) => {
    const esc = encodeURIComponent;
    return Object.keys(params)
        .map((k) => `${esc(k)}=${esc(params[k])}`)
        .join('&');
};

export const getParamsURL = (url) => {
    let params = {};
    `${url}?`
        .split('?')[1]
        .split('&')
        .forEach(function (pair) {
            pair = `${pair}=`.split('=').map(decodeURIComponent);
            if (pair[0].length) {
                params[pair[0]] = pair[1];
            }
        });
    return params;
};

const syncUpdateApp = (downloadProgress) => {
    return new Promise((resolve, reject) => {
        CodePush.sync(
            {
                installMode: CodePush.InstallMode.IMMEDIATE
            },
            (syncStatus) => {
                if (
                    syncStatus === CodePush.SyncStatus.UPDATE_INSTALLED ||
                    syncStatus === CodePush.SyncStatus.UP_TO_DATE
                ) {
                    CodePush.notifyAppReady();
                    resolve();
                }
                if (syncStatus === CodePush.SyncStatus.UNKNOWN_ERROR) {
                    reject();
                }
            },
            (progress) => {
                const { receivedBytes, totalBytes } = progress;
                const temp = receivedBytes / totalBytes;
                downloadProgress(temp.toFixed(1));
            }
        );
    });
};

export const updateAppWithCodepush = (downloadProgress = () => {}) => {
    return new Promise(async (resolve) => {
        try {
            CodePush.checkForUpdate()
                .then(async (update) => {
                    console.log('KIEM TRA UPDATE CODEPUSH', update);
                    if (update) {
                        if (update?.failedInstall) {
                            CodePush.clearUpdates();
                        }
                        AsyncStorage.setItem(
                            ENUM_STORAGE.CODE_PUSH_VERSION,
                            update.label
                        );
                        await syncUpdateApp(downloadProgress);
                        return;
                    }
                    resolve();
                })
                .catch(() => {
                    resolve();
                });
        } catch (error) {
            resolve();
        }
    });
};

export function isNewerVersion(oldVer, newVer) {
    const oldParts = oldVer.split('.');
    const newParts = newVer.split('.');
    for (let i = 0; i < newParts.length; i++) {
        // eslint-disable-next-line no-bitwise
        const a = ~~newParts[i]; // parse int
        const b = ~~oldParts[i]; // parse int
        if (a > b) {
            return true;
        }
        if (a < b) {
            return false;
        }
    }
    return true;
}

export const getVersionCodePush = async () => {
    try {
        const metaUpdate = await CodePush.getUpdateMetadata();
        if (metaUpdate) {
            return metaUpdate.label;
        }
    } catch (error) {
        return '';
    }
};
