import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import SInfo from 'react-native-sensitive-info';
import * as helper from '../helper';
import { ENUM_STORAGE } from '@constants';

const RNFS = require('react-native-fs');

const keyApp = 'loyaltyApp';
export const dirHome = Platform.select({
    ios: `${RNFS.DocumentDirectoryPath}/Loyalty`,
    android: `${RNFS.DocumentDirectoryPath}/Loyalty`
});

export const dirPicutures = `${dirHome}/Pictures`;
export const dirAudio = `${dirHome}/Audio`;

export const saveImage = (filePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            const date = new Date();
            // set new image name and filepath
            const newImageName = `${date.getMilliseconds()}.jpg`;
            const newFilepath = `${dirPicutures}/${newImageName}`;
            // move and save image to new filepath
            await RNFS.mkdir(dirPicutures);
            await RNFS.moveFile(filePath, newFilepath);
            resolve(newFilepath);
        } catch (error) {
            reject(error);
        }
    });
};

export const setSItem = (key, value) => {
    SInfo.setItem(key, value, {
        sharedPreferencesName: keyApp,
        keychainService: keyApp
    });
};

export const getSItem = (key) => {
    return new Promise(async (resolve) => {
        try {
            const data = await SInfo.getItem(key, {
                sharedPreferencesName: keyApp,
                keychainService: keyApp
            });
            if (!helper.IsValidateObject(data)) {
                return resolve(data);
            }
            console.log(`GET ITEM WITH KEY ${key} AND VALUE ${data}`);
            resolve(data);
        } catch (error) {
            console.log('error:', error);
            resolve();
        }
    });
};

export const getItem = (key) => {
    return new Promise((resolve) => {
        AsyncStorage.getItem(key, (error, result) => {
            if (!helper.IsValidateObject(result)) {
                return resolve(result);
            }
            resolve(result);
        });
    });
};
export const setItem = (key, value) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(key, value, (error, result) => {
            if (helper.IsValidateObject(error)) {
                return reject(error);
            }
            resolve(result);
        });
    });
};
export const multiSet = (arrKeyValue) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.multiSet(arrKeyValue, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};

export const deleteAllKeys = () => {
    return new Promise((resolve) => {
        AsyncStorage.getAllKeys((err, keys) => {
            const arr = keys.filter((key) => {
                return (
                    key !== ENUM_STORAGE.FIRST_LOGIN &&
                    key !== ENUM_STORAGE.CODE_PUSH_VERSION &&
                    key !== ENUM_STORAGE.LANGUAGE &&
                    key !== ENUM_STORAGE.APN_TOKEN
                );
            });
            if (err) {
                console.log('error : ', err);
                resolve(null);
            }
            AsyncStorage.multiRemove(arr, (_err) => {
                if (_err) {
                    console.log('error : ', _err);
                    resolve(null);
                }
                resolve(arr);
            });
        });
    });
};
