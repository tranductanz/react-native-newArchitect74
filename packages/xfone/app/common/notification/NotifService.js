import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import NotificationHandler from './NotificationHandler';

export default class NotifService {
    constructor(onRegister, onNotification) {
        this.lastId = 0;
        this.lastChannelCounter = 0;

        this.createDefaultChannels();

        NotificationHandler.attachRegister(onRegister);
        NotificationHandler.attachNotification(onNotification);

        PushNotification.getChannels(function (channels) {
            console.log('channels::::', channels);
        });
    }

    createDefaultChannels() {
        PushNotification.createChannel(
            {
                channelId: 'xfone-channel-id', // (required)
                channelName: 'Xfone channel', // (required)
                channelDescription: 'A Xwork channel', // (optional) default: undefined.
                // soundName: "", // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) =>
                console.log(
                    `createChannel 'xwork-channel-id' returned '${created}'`
                ) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.createChannel(
            {
                channelId: 'sound-channel-id', // (required)
                channelName: 'Sound channel', // (required)
                channelDescription: 'A sound channel', // (optional) default: undefined.
                // soundName: '', // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) =>
                console.log(
                    `createChannel 'sound-channel-id' returned '${created}'`
                ) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    }

    createOrUpdateChannel() {
        this.lastChannelCounter += 1;
        PushNotification.createChannel(
            {
                channelId: 'custom-channel-id', // (required)
                channelName: `Custom channel - Counter: ${this.lastChannelCounter}`, // (required)
                channelDescription: `A custom channel to categorise your custom notifications. Updated at: ${Date.now()}`, // (optional) default: undefined.
                // soundName: "", // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    }

    popInitialNotification(callback) {
        PushNotification.popInitialNotification((notification) => {
            console.log('InitialNotication:', notification);
            callback(notification);
        });
    }

    localNotif(notification) {
        this.lastId += 1;
        console.log('localNotif', notification);
        PushNotification.localNotification({
            /* Android Only Properties */
            channelId: 'Xfone-channel-id',
            // ticker: 'My Notification Ticker', // (optional)
            autoCancel: true, // (optional) default: true
            // largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
            // smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
            // bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
            // subText: 'This is a subText', // (optional) default: none
            color: 'blue', // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: notification.tag ?? '', // (optional) add tag to message
            largeIconUrl: notification.data?.image ?? '',
            bigPictureUrl: notification.data?.image ?? '',
            group: 'Xfone', // (optional) add group to message
            groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            // actions: ['Bỏ qua', 'Xem'], // (Android only) See the doc for notification actions to know more
            invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

            when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
            usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
            // timeoutAfter: 5000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

            /* iOS only properties */
            alertAction: 'view', // (optional) default: view
            category: '', // (optional) default: empty string

            /* iOS and Android properties */
            id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            title: notification.title, // (optional)
            message: notification.message, // (required)
            // userInfo: notification.data, // (optional) default: {} (using null throws a JSON value '<null>' error)
            userInfo: {
                id: '1',
                ...notification.data
            }, // for iOS
            playSound: true, // (optional) default: true
            number: notification.badge ?? 0 // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        });
    }

    scheduleNotif(soundName) {
        this.lastId += 1;
        PushNotification.localNotificationSchedule({
            date: new Date(Date.now() + 30 * 1000), // in 30 secs

            /* Android Only Properties */
            channelId: soundName ? 'sound-channel-id' : 'default-channel-id',
            ticker: 'My Notification Ticker', // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
            smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText:
                'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
            subText: 'This is a subText', // (optional) default: none
            color: 'blue', // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            group: 'group', // (optional) add group to message
            groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
            invokeApp: false, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

            when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
            usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
            timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

            /* iOS only properties */
            alertAction: 'view', // (optional) default: view
            category: '', // (optional) default: empty string

            /* iOS and Android properties */
            id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            title: 'Scheduled Notification', // (optional)
            message: 'My Notification Message', // (required)
            userInfo: { sceen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
            playSound: !!soundName, // (optional) default: true
            soundName: soundName || 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10 // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        });
    }

    checkPermission(cbk) {
        return PushNotification.checkPermissions(cbk);
    }

    requestPermissions() {
        return PushNotification.requestPermissions();
    }

    cancelNotif() {
        PushNotification.cancelLocalNotifications({ id: `${this.lastId}` });
    }

    cancelAll() {
        PushNotification.cancelAllLocalNotifications();
    }

    abandonPermissions() {
        PushNotification.abandonPermissions();
    }

    getScheduledLocalNotifications(callback) {
        PushNotification.getScheduledLocalNotifications(callback);
    }
}
