import { helper, storage } from '@common';
import { ENUM } from '@constants';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { enableScreens } from 'react-native-screens';
import { useSelector } from 'react-redux';
import AuthenNavigator from './authenNavigator';
import MainAppNavigator, {
    VideoCallStack,
    AudioCallStack
} from './mainNavigator';
import { ENUM_STORAGE, modules } from '@constants';
import { useDispatch } from 'react-redux';
import * as ActionAuthen from '../container/Splash/action';

import Config from 'react-native-config';
import { RepackMWG } from '@mwg-kits/core';
import * as amplitude from '@mwg-sdk/analytics';
import { GlobalStore } from 'redux-micro-frontend';
import { globalXfoneStore } from '@globalStore';

enableScreens();

export const AppContainer = (props) => {
    const routeNameRef = useRef(null);
    const navigationRef = useRef(null);
    const dispatch = useDispatch();

    const stackApp = useSelector((state) => state.authenReducer.stackApp);
    const isReceivedIncomingVideoCall = useSelector(
        (state) => state.videoCallReducer.isReceivedIncomingVideoCall
    );
    const isReceivedIncomingAudioCall = useSelector(
        (state) => state.audioCallReducer.isReceivedIncomingAudioCall
    );

    const isSignIn = useSelector((state) => state.authenReducer.isSignIn);

    const initRepack = async () => {
        // authen success
        if (!isSignIn) {
            return;
        }

        const access_token = await storage.getItem(ENUM_STORAGE.TOKEN_ACCESS);
        console.log('token_access', access_token);
        if (!access_token) return;

        const deviceToken = await storage.getItem(ENUM_STORAGE.DEVICE_TOKEN);

        const repack = new RepackMWG({
            // URL FOR DEV OR PROD
            urlRemote: `${Config.ERPHOST}mwg-app-microapp-service/api/micro/main/version/latest`,
            infoApp: {
                appName: 'XFONE',
                platform: 'IOS',
                versionApp: helper.getVersion(),
                environment: helper.getENVUppercase(),
                idToken: access_token,
                deviceToken: deviceToken
            },
            ports: modules.portsModule,
            modules: modules.ModulesApp,
            isDev: __DEV__,
            cache: !__DEV__
        });
        repack.setStorage();
        repack.initScriptManager();
        initGlobalStore();
    };

    useEffect(() => {
        initRepack();
        if (!__DEV__) {
            initAnalytics();
        }
    }, [isSignIn]);

    const initAnalytics = async () => {
        const userInfo = await storage.getItem(ENUM_STORAGE.USER_INFO);
        const info = JSON.parse(userInfo);
        const userName = info?.userName ? info.userName : 'GUEST';
        amplitude.init(userName, {
            app_name: 'XFONE',
            logLevel: 3,
            tracking_session_events: true,
            session_id: new Date().getTime()
        });
    };

    const initGlobalStore = () => {
        globalStore = GlobalStore.Get();
        globalStore.RegisterStore('XfoneStore', globalXfoneStore, [
            GlobalStore.AllowAll
        ]);
    };

    const onChangeScreen = async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
        if (currentRouteName && previousRouteName !== currentRouteName) {
            global.props.logScreenView(currentRouteName);
        }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
    };
    const onReadyScreen = () => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
    };

    if (isSignIn) {
        if (isReceivedIncomingVideoCall) {
            setTimeout(() => {
                dispatch(ActionAuthen.goVideoCall());
            }, 100);
        } else if (isReceivedIncomingAudioCall) {
            setTimeout(() => {
                dispatch(ActionAuthen.goAudioCall());
            }, 100);
        } else {
            dispatch(ActionAuthen.go_home());
        }
    }

    const getStack = () => {
        switch (stackApp) {
            case ENUM.ENUM_STACK.HOME_STACK:
                return (
                    <NavigationContainer
                        ref={navigationRef}
                        // linking={linking}
                        onReady={onReadyScreen}
                        onStateChange={onChangeScreen}>
                        <MainAppNavigator />
                    </NavigationContainer>
                );

            case ENUM.ENUM_STACK.CALL_STACK:
                return (
                    <NavigationContainer
                        ref={navigationRef}
                        // linking={linking}
                        onReady={onReadyScreen}
                        onStateChange={onChangeScreen}>
                        <VideoCallStack />
                    </NavigationContainer>
                );

            case ENUM.ENUM_STACK.AUDIO_CALL_STACK:
                return (
                    <NavigationContainer
                        ref={navigationRef}
                        onReady={onReadyScreen}
                        onStateChange={onChangeScreen}>
                        <AudioCallStack />
                    </NavigationContainer>
                );

            default:
                return (
                    <NavigationContainer
                        ref={navigationRef}
                        // linking={linking}
                        onReady={onReadyScreen}
                        onStateChange={onChangeScreen}>
                        <AuthenNavigator />
                    </NavigationContainer>
                );
        }
    };
    return getStack();
};
