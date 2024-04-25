import messaging from '@react-native-firebase/messaging';
import { apiBase, METHOD } from '@mwg-kits/core';
import { database, helper, storage } from '@common';
import RNRestart from 'react-native-restart';
import { ENUM_STORAGE, API_CONST } from '@constants';

export const goLogout = async () => {
    try {
        global.props.showLoader();
        let userInfo = await storage.getItem(ENUM_STORAGE.USER_INFO);
        await storage.deleteAllKeys();
        database.active.write(async () => {
            await database.active.unsafeResetDatabase();
        });

        await messaging().unregisterDeviceForRemoteMessages();
        await messaging().deleteToken();

        if (helper.IsValidateObject(userInfo)) {
            userInfo = JSON.parse(userInfo);
        }
        //unsubcribe
        let bodyApi = {
            userToken: userInfo?.userName ?? '',
            session: await helper.getUniqueId()
        };

        let res = await apiBase(
            API_CONST.API_UNSUBSCRIBE_NOTIFI,
            // 'https://erpapp.tgdd.vn/mwg-app-callcenter-service-beta/api/notification/token/unsubscribe', // đợi build prod
            'POST',
            bodyApi,
            {}
        );
        console.log('UNSUBCRIBE TOKENNNN RES', res);
        global.props.hideLoader();
        RNRestart.restart();
    } catch (e) {
        console.log('UNSUBCRIBE TOKENNNN ERROR', e);
        global.props.hideLoader();
        RNRestart.restart();
    }
};

export const showPopUpInvalidToken = (error) => {
    if (
        helper.IsValidateObject(error) &&
        helper.hasProperty(error, 'errorReason') &&
        error.errorReason === 'invalid_token'
    ) {
        return global.props.alert({
            show: true,
            message:
                'Tài khoản của bạn đã đăng nhập trên thiết bị khác. Vui lòng đăng nhập lại',
            type: 'error',
            onConfirmPressed: () => {
                global.props.alert({ show: false });
                goLogout();
            }
        });
    }
};
