import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import * as utils from './utils';

class NotificationHandler {
    async onNotification(notification) {
        console.log(
            'result save message background from firebase:',
            notification
        );
        const result = await utils.saveMessageinStorage(notification);
        console.log('result save message background from firebase:', result);

        if (typeof this._onNotification === 'function') {
            // (required) Called when a remote is received or opened, or local notification is opened
            this._onNotification(notification);
        }
        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    }

    onRegister(token) {
        console.log('onRegister ABC', token);
        if (typeof this._onRegister === 'function') {
            this._onRegister(token);
        }
    }

    onAction(notification) {
        console.log('Notification action received:');
        console.log(notification.action);
        console.log(notification);

        if (notification.action === 'Yes') {
            PushNotification.invokeApp(notification);
        }
    }

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError(err) {
        console.log('onRegistrationError', err);
    }

    attachRegister(handler) {
        this._onRegister = handler;
    }

    async attachNotification(handler) {
        console.log('handldlladlsad', handler);
        this._onNotification = await handler;
    }
}

const handler = new NotificationHandler();

PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: handler.onRegister.bind(handler),

    // (required) Called when a remote or local notification is opened or received
    onNotification: handler.onNotification.bind(handler),

    // (optional) Called when Action is pressed (Android)
    onAction: handler.onAction.bind(handler),

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: handler.onRegistrationError.bind(handler),

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     */
    requestPermissions: true
});

export default handler;
