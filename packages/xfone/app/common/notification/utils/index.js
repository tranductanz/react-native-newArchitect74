import { helper, storage } from '@common';
import { ENUM_STORAGE } from '@constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { store } from '../../../store';

// import {
//     setNotifi,
//     actionSeenNotifi
// } from '../../../container/Notification/action';
export const saveMessageinStorage = async (message, isFromWS = false) => {
    try {
        console.log('message to save:', message);
        const currentMessages = await storage.getItem('messages');
        const messageArray = JSON.parse(currentMessages) || [];
        if (isFromWS) {
            // HANDLE MESSAGE FROM WS....
            console.log('mssArr: ', messageArray, message.id.toString());
            const indexExits = messageArray.findIndex(
                (i) => i.id === message.id.toString()
            );
            if (indexExits !== -1) {
                return 'exits';
            }
            messageArray.push({
                id: message.id.toString()
            });
            await storage.setItem('messages', JSON.stringify(messageArray));
            return 'success';
        }

        // HANDLE MESSAGE FROM FIREBASE

        console.log('message to save:', message);
        const { data, userInteraction } = message;
        if (!helper.IsValidateObject(data)) {
            return 'failed';
        }
        console.log('mssArr: ', messageArray, data.NOTIFICATION_ID);
        const indexExits = messageArray.findIndex(
            (i) => i.id === data.NOTIFICATION_ID.toString()
        );
        if (indexExits !== -1) {
            return 'exits';
        }
        if (
            userInteraction === null ||
            userInteraction === undefined ||
            !userInteraction
        ) {
            messageArray.push({
                id: data.NOTIFICATION_ID.toString()
            });
        } else {
            messageArray.push({
                id: data.NOTIFICATION_ID.toString()
            });
        }
        console.log('new mssArr: ', messageArray);
        await storage.setItem('messages', JSON.stringify(messageArray));
        return 'success';
    } catch (error) {
        console.log('saveMessageinStorage error:', message);
        return 'failed';
    }
};

export const getTokenNotification = async () => {
    return new Promise(async (resolve) => {
        try {
            const statusAuthorizationStatus =
                await messaging().requestPermission();
            console.log('getTokenNotification', statusAuthorizationStatus);

            if (statusAuthorizationStatus !== 1) {
                resolve('');
            }

            let tokenNotification = await AsyncStorage.getItem(
                ENUM_STORAGE.TOKEN_NOTIFICATION
            );

            if (!tokenNotification) {
                if (!messaging().isDeviceRegisteredForRemoteMessages) {
                    await messaging().registerDeviceForRemoteMessages();
                }
                tokenNotification = await messaging().getToken();
                if (tokenNotification) {
                    await AsyncStorage.setItem(
                        ENUM_STORAGE.TOKEN_NOTIFICATION,
                        tokenNotification
                    );
                }
            }
            resolve(tokenNotification ? tokenNotification : '');
        } catch (error) {
            console.log('getTokenNotification error', error);
            resolve('');
        }
    });
};

export const setBadgeApp = (number = 0) => {
    try {
        if (number === undefined || number === null || Number.isNaN(number)) {
            return;
        }
        const badgeNumber = parseInt(number);
        if (Number.isInteger(badgeNumber)) {
            PushNotification.setApplicationIconBadgeNumber(badgeNumber);
            // store.dispatch(setNotifi(badgeNumber));
        }
    } catch (error) {
        console.log('Error setBadgeApp:', error);
    }
};
