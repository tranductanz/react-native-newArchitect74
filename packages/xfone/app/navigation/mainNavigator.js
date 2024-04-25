import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { enableScreens } from 'react-native-screens';
import LiveStreamNavigator from '../navigation/livestreamNavigator';

import HomeTab from './homeNavigator';
import CallcenterScreen from './callCenterNavigator';
import CallcenterOutboundCallScreen from './callCenterOutboundCall';
enableScreens();
const MainStack = createStackNavigator();
const MainAppNavigator = () => {
    return (
        <MainStack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName="Home">
            <MainStack.Screen name="Home" component={HomeTab} />
            <MainStack.Screen
                name="LiveStreamNavigator"
                component={LiveStreamNavigator}
                options={{ gestureEnabled: false }}
            />
        </MainStack.Navigator>
    );
};

export const VideoCallStack = () => {
    return (
        <MainStack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <MainStack.Screen
                name="VideoCallScreen"
                component={CallcenterScreen}
            />
        </MainStack.Navigator>
    );
};

export const AudioCallStack = () => {
    return (
        <MainStack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <MainStack.Screen
                name="AudioCallScreen"
                component={CallcenterOutboundCallScreen}
            />
        </MainStack.Navigator>
    );
};

export default MainAppNavigator;
