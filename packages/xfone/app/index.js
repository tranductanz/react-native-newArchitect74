import { Component } from 'react';
import { LogBox, StatusBar, StyleSheet, View, Alert } from 'react-native';
import CodePush from 'react-native-code-push';
import {
    SafeAreaProvider,
    SafeAreaInsetsContext
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { AppConsumer, AppProvider } from './AppProvider/index';
import { AppContainer } from './navigation/index';
import { store } from './store';

import { ENUM_STORAGE, constants } from '@constants';

import { Mixins } from '@mwg-sdk/styles';
import Draggable from 'react-native-draggable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ModalLogger } from '@components';
import { MyText } from '@mwg-kits/components';
import { firebase } from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import { storage, helper, handleReceiveIncomingCall } from '@common';
import RNCallKeep from 'react-native-callkeep';

import {
    setJSExceptionHandler,
    setNativeExceptionHandler,
    initExceptionHandler
} from 'react-native-exception-handler';

import crashlytics from '@react-native-firebase/crashlytics';

import VoipPushNotification from 'react-native-voip-push-notification';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: 'light',
            isShowLogger: false,
            isTakeScreenshot: false,
            isShowFeedback: false,
            screenshotTimeout: null,
            imagePath: ''
        };
    }

    async componentDidMount() {
        this._handeRemoteDataFromFirebase();
        LogBox.ignoreLogs([
            'VirtualizedLists should never be nested',
            'Failed prop type: Invalid prop `text` of type `number` supplied to `MyText`, expected `string`'
        ]);

        const options = {
            ios: {
                appName: 'XFONE'
            }
        };
        RNCallKeep.setup(options).then((accepted) => {});
        await firebase.analytics().setAnalyticsCollectionEnabled(true);
        this.requestUserPermission();
        this.initExceptionHandlerForApp();
        this.setVoipPushNotification();
    }

    requestUserPermission = async () => {
        try {
            const authorizationStatus = await messaging().requestPermission();
            if (authorizationStatus) {
                console.log('Permission status:', authorizationStatus);
                const APNSToken = await messaging().getAPNSToken();
                const token = await messaging().getToken();
            }
        } catch (error) {
            console.log('requestUserPermission', error);
        }
    };

    _handeRemoteDataFromFirebase = () => {
        messaging().onMessage(async (remoteMessage) => {
            handleReceiveIncomingCall(remoteMessage);
        });
    };

    initExceptionHandlerForApp = async () => {
        try {
            const userinfo = JSON.parse(
                await storage.getItem(ENUM_STORAGE.USER_INFO)
            );
            const { userName } = userinfo ?? 'GUEST';
            const user = userName ?? 'GUEST';
            const deviceName = await helper.getDeviceName();
            const appName = constants.APPNAME;
            const deviceID = await helper.getUniqueId();
            const versionApp = await helper.getVersion();
            const cp = await storage.getItem(ENUM_STORAGE.VERSION_CODEPUSH);
            const versionCP = cp ?? 'unknown';
            const language = 'vn';
            await initExceptionHandler(
                'appmobie',
                user,
                appName,
                deviceID,
                deviceName,
                versionApp,
                versionCP,
                language
            );
            await firebase.analytics().setUserId(user.toString());
            await Promise.all([
                crashlytics().setUserId(user.toString()),
                crashlytics().setAttributes({
                    deviceName: deviceName,
                    versionApp: versionApp
                })
            ]);
        } catch (initError) {
            console.log('error initExceptionHandlerForApp:', initError);
        }
    };

    componentWillUnmount() {
        // if (this.unsubscribeNetwork !== null) {
        //     this.unsubscribeNetwork();
        // }
        VoipPushNotification.removeEventListener('didLoadWithEvents');
        VoipPushNotification.removeEventListener('register');
        VoipPushNotification.removeEventListener('notification');
    }

    setVoipPushNotification = () => {
        VoipPushNotification.addEventListener('register', (token) => {
            storage.setItem(ENUM_STORAGE.APN_TOKEN, token);
        });

        // ===== Step 2: subscribe `notification` event =====
        // --- this.onVoipPushNotificationiReceived
        VoipPushNotification.addEventListener(
            'notification',
            (notification) => {
                VoipPushNotification.onVoipNotificationCompleted(
                    notification.uuid
                );
            }
        );

        VoipPushNotification.addEventListener('didLoadWithEvents', (events) => {
            if (!events || !Array.isArray(events) || events.length < 1) {
                return;
            }
            for (let voipPushEvent of events) {
                let { name, data } = voipPushEvent;
                if (
                    name ===
                    VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent
                ) {
                } else if (
                    name ===
                    VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
                ) {
                }
            }
        });

        VoipPushNotification.registerVoipToken(); // --- register token
    };

    onPressCloseLogger = () => {
        this.setState({ isShowLogger: !this.state.isShowLogger });
    };

    render() {
        const { isShowLogger } = this.state;
        return (
            // <I18nextProvider i18n={i18n}>
            <GestureHandlerRootView style={styles.container}>
                <SafeAreaProvider>
                    <View style={styles.container}>
                        <StatusBar
                            barStyle="dark-content"
                            translucent
                            backgroundColor="transparent"
                        />

                        <Provider store={store}>
                            <AppProvider {...this.props}>
                                <AppConsumer>
                                    {(funcs) => {
                                        return (
                                            <SafeAreaInsetsContext.Consumer>
                                                {(insets) => {
                                                    global.props = {
                                                        ...funcs,
                                                        insets
                                                    };
                                                    return (
                                                        <AppContainer
                                                            {...funcs}
                                                        />
                                                    );
                                                }}
                                            </SafeAreaInsetsContext.Consumer>
                                        );
                                    }}
                                </AppConsumer>
                                <LoggerButton
                                    onPressCloseLogger={this.onPressCloseLogger}
                                />
                                <ModalLogger
                                    visible={isShowLogger}
                                    onPressCloseLogger={this.onPressCloseLogger}
                                />
                            </AppProvider>
                        </Provider>
                    </View>
                </SafeAreaProvider>
            </GestureHandlerRootView>
            // </I18nextProvider>
        );
    }
}

const LoggerButton = (props) => {
    if (constants.ISLIVE) {
        return null;
    }

    const { onPressCloseLogger } = props;

    return (
        <Draggable
            x={Mixins.scale(20)}
            y={44}
            onShortPressRelease={onPressCloseLogger}>
            <View
                style={{
                    borderRadius: 10,
                    backgroundColor: 'rgba(27,103,168,1.0)',
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowOpacity: 0.35,
                    shadowOffset: {
                        width: 0,
                        height: 5
                    },
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowRadius: 3,
                    paddingHorizontal: 10,
                    paddingVertical: 5
                }}>
                <MyText text={'LOGGER API'} style={{ color: '#FFFFFF' }} />
            </View>
        </Draggable>
    );
};

export default CodePush({
    checkFrequency: CodePush.CheckFrequency.MANUAL
})(App);

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
