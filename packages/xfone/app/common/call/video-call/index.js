import { helper } from '@common';
import { API_CONST } from '@constants';
import _BackgroundTimer from 'react-native-background-timer';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import { store } from '../../../store';
import CustomIncomingCall from './CustomIncomingCall';
import { JanusVideoPlugin } from './JanusVideoPlugin';
import { endVideoCall, goToVideoCallScreen } from './actions';

export const answerIncomingVideoCall = async (data, isForeground = false) => {
    try {
        store.dispatch(goToVideoCallScreen(data));
    } catch (error) {
        console.log('error answerIncomingVideoCall ', error);
    }
};

export const declineIncomingVideoCall = (callData) => {
    let isDeclined = false;
    const temp = new JanusVideoPlugin({
        uriJanus: 'wss://instant2.tgdd.vn/janus-ws',
        localUser: callData.USERNAME_DES,
        janusListener: (mes) => {
            if (mes.event === 'registered') {
                // Trong 5 giay ma chua nhan duoc incoming call thi tu dong hangup, neu khong user se bi ket trong room
                _BackgroundTimer.setTimeout(() => {
                    if (!isDeclined) temp.declinedIncomingCall();
                }, 5000);
            }
            if (mes.event === 'incomingcall') {
                temp.declinedIncomingCall();
                isDeclined = true;
            }
        }
    });
    temp.registerJanus();
};

const DISPLAY_INCOMING_CALL_DURATION = 30000000;
export const handleReceiveIncomingVideoCall = (data) => {
    const duration =
        (DISPLAY_INCOMING_CALL_DURATION -
            (new Date().valueOf() * 1000 - data.TIMESTAMP_REGISTER)) /
        1000;
    if (duration < 0) return;
    if (data?.VIDEO_CALL_STATUS === 'INCOMING_CALL') {
        console.log('====>>>>>>> INCOMING CALL');
        RNNotificationCall.displayNotification(
            helper.uuidv4(),
            `${API_CONST.PATH_USER_AVATAR}${data.AVATAR_SENDER}`,
            duration,
            {
                channelId: 'call-channel-id',
                channelName: 'Incoming video call',
                notificationIcon: 'ic_launcher', //mipmap
                notificationTitle: `${data.USERNAME_SENDER} - ${data.FULL_NAME}`,
                notificationBody: 'Cuộc gọi đến Xfone',
                answerText: 'Chấp nhận',
                declineText: 'Từ chối',
                notificationColor: 'colorAccent',
                notificationSound: 'incomming_call',
                mainComponent: 'INCOMING_VIDEO_CALL',
                payload: data
            }
        );
    }
    if (
        data?.VIDEO_CALL_STATUS === 'MISSED_CALL' ||
        data?.ACTION === 'TURN_OFF_POPUP'
    ) {
        console.log('HIDE INCOMING CALL');
        RNNotificationCall.hideNotification();
    }
};

export const handleEndVideoCall = () => {
    try {
        store.dispatch(endVideoCall());
    } catch (error) {
        console.log('error endVideoCall ', error);
    }
};

export { CustomIncomingCall };
