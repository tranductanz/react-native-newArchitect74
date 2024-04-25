import { MyBottomSheet } from '@components';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
    SafeAreaProvider,
    SafeAreaInsetsContext
} from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { WrapperRepack } from '@mwg-kits/core';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import { Mixins } from '@mwg-sdk/styles';
import { FlatList } from 'react-native-gesture-handler';

const LiveStreamStack = () => {
    const liveStreamNavigationStack = createStackNavigator();
    const navigation = useNavigation();
    const profileState = useSelector((state) => state?.profileReducer);
    const livestreamPermissionList = useSelector(
        (state) => state?.auth?.livestreamPermissionList
    );
    return (
        <WrapperRepack
            infoModule={{
                namePlugin: 'LiveStream',
                container: './LivestreamProvider'
            }}
            style={{
                color: '#17B897'
            }}
            source={require('../../assets/images/icon_app.png')}
            icGoBack={require('../../assets/images/ic_back.png')}
            icError={require('../../assets/images/ic_error.png')}
            styleIconGoBack={[
                Mixins.scaleImage(42, 42),
                { resizeMode: 'contain' }
            ]}
            name="livestream"
            navigation={navigation}
            liveStreamNavigationStack={liveStreamNavigationStack}
            TabView={TabView}
            SceneMap={SceneMap}
            TabBar={TabBar}
            MyBottomSheet={MyBottomSheet}
            BottomSheetTextInput={BottomSheetTextInput}
            FlatListGH={FlatList}
            SafeAreaProvider={SafeAreaProvider}
            SafeAreaInsetsContext={SafeAreaInsetsContext}
            profileState={profileState}
            livestreamPermissionList={livestreamPermissionList}
        />
    );
};

export default LiveStreamStack;
