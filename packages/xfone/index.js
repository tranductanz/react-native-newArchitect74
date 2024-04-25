import {
    CustomIncomingCall,
    handleAnswerCall,
    handleDeclineCall,
    handleReceiveIncomingCall,
    helper
} from '@common';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import { startNetworkLogging } from 'react-native-network-logger';
import { name as appName } from './app.json';
import App from './app/index';
import './polyfills';

handleAnswerCall();
handleDeclineCall();

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    handleReceiveIncomingCall(remoteMessage);
});

startNetworkLogging();
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('INCOMING_VIDEO_CALL', () => CustomIncomingCall);

AppRegistry.registerComponent('INCOMING_AUDIO_CALL', () => CustomIncomingCall);
