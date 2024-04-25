import { Text, View } from 'react-native';
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { WrapperRepack } from '@mwg-kits/core';
import { enableScreens } from 'react-native-screens';
import { useSelector } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
    SafeAreaProvider,
    SafeAreaInsetsContext
} from 'react-native-safe-area-context';
import { images } from '@assets';
import database from '../common/database/index';
import { handleEndAudioCall, handleEndVideoCall } from '@common';
import { showPopUpInvalidToken } from '../container/Profile/utils';
import { Mixins } from '@mwg-sdk/styles';
enableScreens();
const CallcenterStack = (props) => {
    const { isReceivedIncomingVideoCall, incomingCallData } = useSelector(
        (state) => state.videoCallReducer
    );
    const { isReceivedIncomingAudioCall, incomingAudioCallData } = useSelector(
        (state) => state.audioCallReducer
    );
    const CallcenterStackNavigator = createStackNavigator();
    const navigation = useNavigation();
    const profileState = useSelector((state) => state?.profileReducer);
    const components = {
        TabBar: TabBar,
        images: images
    };
    const videoCallData = props?.videoCallData;
    const sipIP = useSelector((state) => state?.auth?.sipIP);

    return (
        <WrapperRepack
            infoModule={{
                namePlugin: 'CallCenter',
                container: './XfoneApp'
            }}
            style={{
                color: '#17B897'
            }}
            source={require('../assets/images/icon_app.png')}
            icError={require('../assets/images/ic_error.png')}
            name="Callcenter"
            showPopUpInvalidToken={showPopUpInvalidToken}
            navigation={navigation}
            CallcenterStack={CallcenterStackNavigator}
            screenName={
                isReceivedIncomingVideoCall
                    ? 'ReceiveVideoCall'
                    : videoCallData
                    ? 'VideoCall'
                    : 'Call'
            }
            profileState={profileState}
            TabView={TabView}
            SceneMap={SceneMap}
            SafeAreaProvider={SafeAreaProvider}
            SafeAreaInsetsContext={SafeAreaInsetsContext}
            components={components}
            database={database}
            incomingCallData={
                isReceivedIncomingVideoCall
                    ? incomingCallData
                    : incomingAudioCallData
            }
            videoCallData={videoCallData ? videoCallData : null}
            onEndVideoCall={handleEndVideoCall}
            onEndCall={handleEndAudioCall}
            sipIP={sipIP}
        />
    );
};

class CallcenterScreen extends Component {
    render() {
        return <CallcenterStack {...this.props?.route?.params} />;
    }
}

export default CallcenterScreen;
