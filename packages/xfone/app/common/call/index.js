import { helper } from '@common';
import {
    handleReceiveIncomingAudioCall,
    answerIncomingAudioCall,
    declineIncomingAudioCall
} from './audio-call';
import {
    answerIncomingVideoCall,
    declineIncomingVideoCall,
    handleReceiveIncomingVideoCall
} from './video-call';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';

export const handleReceiveIncomingCall = (remoteMessage) => {
    const { data } = remoteMessage;
    console.log('get remote message====', remoteMessage);
    if (!data) return;
    if (data?.TYPE_NOTIFY === 'VIDEO_CALLING')
        return handleReceiveIncomingVideoCall(data);
    else if (data.TYPE_CALL === 'AUDIO_CALL')
        return handleReceiveIncomingAudioCall(data);
};

export const handleAnswerCall = () => {
    RNNotificationCall.addEventListener('answer', (data) => {
        RNNotificationCall.backToApp();
        const payload = helper.isJSON(data.payload)
            ? JSON.parse(data.payload)
            : data.payload;
        console.log('tien xem payload ', payload.TYPE_CALL);
        if (payload.TYPE_NOTIFY === 'VIDEO_CALLING')
            answerIncomingVideoCall(payload);
        else if (payload.TYPE_CALL === 'AUDIO_CALL')
            answerIncomingAudioCall(payload);
    });
};

export const handleDeclineCall = () => {
    RNNotificationCall.addEventListener('endCall', (data) => {
        const payload = helper.isJSON(data.payload)
            ? JSON.parse(data.payload)
            : data.payload;
        if (data.endAction === 'ACTION_REJECTED_CALL') {
            if (payload.TYPE_NOTIFY === 'VIDEO_CALLING')
                declineIncomingVideoCall(payload);
            else if (payload.TYPE_CALL === 'AUDIO_CALL')
                declineIncomingAudioCall(payload);
        }
    });
};

export * from './audio-call';
export * from './video-call';
