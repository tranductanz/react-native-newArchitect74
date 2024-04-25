import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { enableScreens } from 'react-native-screens';
import Dashboard from '../container/Livestream/index';
import LivestreamProvider from '../container/Livestream/livestreamProvider';
import LiveStreamStack from '../container/Livestream/livestreamProvider';

enableScreens();
const StreamStack = createStackNavigator();
const LiveStreamNavigator = () => {
    return (
        <StreamStack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <StreamStack.Screen name="Livestream" component={LiveStreamStack} />
        </StreamStack.Navigator>
    );
};

export default LiveStreamNavigator;
