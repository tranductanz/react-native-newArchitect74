import { helper, storage } from '@common';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import { endAudioCall, goToAudioScreen } from './actions';
import { store } from '../../../store';
import * as ActionAuthen from '../../../container/Splash/action';
import { Platform } from 'react-native';
import { API_CONST, ENUM_STORAGE } from '@constants';
import { JanusAudioPlugin } from './JanusAudioPlugin';
import _BackgroundTimer from 'react-native-background-timer';

export const handleReceiveIncomingAudioCall = (data) => {
    console.log('get notify call====', data);
    const DISPLAY_INCOMING_CALL_DURATION = 20000;
    const custom_notification = JSON.parse(data.custom_notification);
    const duration =
        DISPLAY_INCOMING_CALL_DURATION -
        (new Date().valueOf() - custom_notification.timeSend);
    if (duration < 0) return;
    RNNotificationCall.displayNotification(
        helper.uuidv4(),
        `${API_CONST.PATH_USER_AVATAR}${data.CALLER_AVATAR}`,
        duration,
        {
            channelId: 'call-channel-id',
            channelName: 'Incoming audio call',
            notificationIcon: 'ic_launcher', //mipmap
            notificationTitle: `${data.CALLER_USERNAME} - ${data.CALLER_FULLNAME}`,
            notificationBody: 'Cuộc gọi đến',
            answerText: 'Chấp nhận',
            declineText: 'Từ chối',
            notificationColor: 'colorAccent',
            notificationSound: 'incomming_call',
            mainComponent: 'INCOMING_AUDIO_CALL',
            payload: data
        }
    );
};

export const answerIncomingAudioCall = (data) => {
    console.log('TIEN ANSWER AUDIO CALL ', data);
    try {
        store.dispatch(goToAudioScreen(data));
    } catch (error) {
        console.log('error answerIncomingAudioCall ', error);
    }
};

export const handleEndAudioCall = (data) => {
    console.log('TIEN DECLINE AUDIO CALL ', data);
    try {
        store.dispatch(endAudioCall());
    } catch (error) {
        console.log('error endVideoCall ', error);
    }
};

export const declineIncomingAudioCall = async (callData) => {
    const userInfo = await storage.getItem(ENUM_STORAGE.FULL_USER_INFO);
    const sipIP = await storage.getItem(ENUM_STORAGE.SIP_IP);
    const info = JSON.parse(userInfo);
    const ip = JSON.parse(sipIP);
    const subscriber = info?.subscriber;
    const temp = new JanusAudioPlugin({
        uriJanus: 'wss://instant1.tgdd.vn/janus-ws',
        profile: {
            authuser: subscriber?.username,
            proxy: `sip:${ip?.settingValue}`,
            secret: `${subscriber?.password}`,
            username: `sip:${subscriber?.username}@${ip?.settingValue}`,
            remoteUserID: `sip:+84${callData.USERNAME_DES}_hangup@${ip?.settingValue}`
        },
        janusListener: (mes) => {
            if (mes.event === 'calling') {
                temp.declinedIncomingCall();
            }
        }
    });
    temp.registerJanus();
};
