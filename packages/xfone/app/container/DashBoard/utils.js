import { Platform, NativeModules } from 'react-native';
import RNPermissions, {
    check,
    PERMISSIONS,
    request,
    RESULTS,
    checkNotifications,
    openSettings
} from 'react-native-permissions';
import { helper } from '@common';
const { PermissionModule } = NativeModules;

const { ...PERMISSIONS_IOS } = PERMISSIONS.IOS;
const PERMISSION_CAMERA_MIC = Platform.select({
    android: [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO],
    ios: [PERMISSIONS_IOS.CAMERA, PERMISSIONS_IOS.MICROPHONE]
});

export const requestPermissionCameraAndMicIOS = async () => {
    if (Platform.OS === 'ios') {
        try {
            const statuses = await RNPermissions.requestMultiple(
                PERMISSION_CAMERA_MIC
            );
            if (
                helper.IsValidateObject(statuses) &&
                statuses[PERMISSIONS_IOS.CAMERA] &&
                (statuses[PERMISSIONS_IOS.CAMERA] === RESULTS.GRANTED ||
                    statuses[PERMISSIONS_IOS.CAMERA] === RESULTS.LIMITED) &&
                statuses[PERMISSIONS_IOS.MICROPHONE] &&
                (statuses[PERMISSIONS_IOS.MICROPHONE] === RESULTS.GRANTED ||
                    statuses[PERMISSIONS_IOS.MICROPHONE] === RESULTS.LIMITED)
            ) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
};

export const checkPermissionCameraAndMicIOS = async () => {
    if (Platform.OS === 'ios') {
        try {
            const statuses = await RNPermissions.checkMultiple(
                PERMISSION_CAMERA_MIC
            );

            if (
                helper.IsValidateObject(statuses) &&
                statuses[PERMISSIONS_IOS.CAMERA] &&
                (statuses[PERMISSIONS_IOS.CAMERA] === RESULTS.GRANTED ||
                    statuses[PERMISSIONS_IOS.CAMERA] === RESULTS.LIMITED) &&
                statuses[PERMISSIONS_IOS.MICROPHONE] &&
                (statuses[PERMISSIONS_IOS.MICROPHONE] === RESULTS.GRANTED ||
                    statuses[PERMISSIONS_IOS.MICROPHONE] === RESULTS.LIMITED)
            ) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
};

export const checkNotificationsPermission = () => {
    RNPermissions.checkNotifications()
        .then((notifications) => {
            console.log('notification:', notifications);
            if (notifications.status === RESULTS.DENIED) {
                request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
                    .then((res) => console.log('resNotifi', res))
                    .catch((error) => console.log('errorNotifi ', error));
            }
        })
        .catch((error) => console.warn(error));
};

export const displayRequestOverlayPermissionPopup = async () => {
    const res = await PermissionModule.checkOverlayPermission();
    console.log('response:===', res);
    if (!res) {
        global.props.alert({
            show: true,
            message:
                'Vui lòng cấp quyền hiển thị cửa sổ pop-up và hiển thị trên màn hình khoá để nhận được thông báo cuộc gọi đến',
            type: 'info',
            onConfirmPressed: () => {
                global.props.alert({ show: false, title: '' });
                PermissionModule.requestOverlayPermission()
                    .then(() => {
                        console.log('Permission request succeeded');
                    })
                    .catch((error) => {
                        console.error('Permission request failed', error);
                    });
            },
            confirmText: 'Cài đặt'
        });
    }
};
