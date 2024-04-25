import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import HistoryScreen from '../container/History';
import CallScreen from '../container/Call';
import ProfileScreen from '../container/Profile';
import DashBoardScreen from '../container/DashBoard';
import CallcenterScreen from './callCenterNavigator';
import CallCenterKeyboardScreen from './callCenterKeyboardNavigator';

import { images } from '@assets';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
const HomeTab = ({ navigation, route }) => {
    const getTabBarVisibility = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (['Calling', 'VideoCall'].includes(routeName)) {
            return 'none';
        }
        return 'flex';
    };

    const CustomTabButton = (props) => (
        <TouchableOpacity
            {...props}
            style={
                props.accessibilityState.selected
                    ? [
                          props.style,
                          { borderTopColor: '#17B897', borderTopWidth: 2 }
                      ]
                    : props.style
            }
        />
    );

    return (
        <Tab.Navigator
            screenOptions={{
                keyboardHidesTabBar: true,
                headerShown: false,
                tabBarActiveTintColor: '#17B897',
                tabBarInactiveTintColor: '#626262'
            }}
            initialRouteName="DashBoardScreen">
            <Tab.Screen
                name="CallScreen"
                component={CallcenterScreen}
                initialParams={route?.params ? { ...route.params } : {}}
                options={({ route }) => {
                    return {
                        tabBarLabel: 'Lịch sử',
                        tabBarIcon: ({ focused, color }) => (
                            <Image
                                source={
                                    focused
                                        ? images.ic_home_call_act
                                        : images.ic_home_call
                                }
                                style={styles.icon}
                            />
                        ),
                        tabBarStyle: {
                            display: getTabBarVisibility(route)
                        },

                        tabBarLabelStyle: {
                            fontSize: 13
                        },
                        tabBarButton: CustomTabButton
                    };
                }}
            />
            <Tab.Screen
                name="KeyboardScreen"
                component={CallCenterKeyboardScreen}
                options={({ route }) => {
                    return {
                        tabBarLabel: 'Bàn phím',
                        tabBarIcon: ({ focused, color }) => (
                            <Image
                                source={
                                    focused
                                        ? images.ic_keyboard_act
                                        : images.ic_keyboard
                                }
                                style={styles.icon}
                            />
                        ),
                        tabBarStyle: {
                            display: getTabBarVisibility(route)
                        },
                        tabBarLabelStyle: {
                            fontSize: 13
                        },
                        tabBarButton: CustomTabButton
                    };
                }}
            />
            <Tab.Screen
                name="DashBoardScreen"
                component={DashBoardScreen}
                options={{
                    tabBarLabel: 'Tiện ích',
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={
                                focused
                                    ? images.ic_tab_dashboard_act
                                    : images.ic_tab_dashboard
                            }
                            style={[styles.icon, { tintColor: color }]}
                        />
                    ),
                    tabBarLabelStyle: {
                        fontSize: 13
                    },
                    tabBarButton: CustomTabButton
                }}
            />

            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Cá nhân',
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={
                                focused
                                    ? images.ic_home_profile_act
                                    : images.ic_home_profile
                            }
                            style={[styles.icon]}
                        />
                    ),
                    tabBarLabelStyle: {
                        fontSize: 13
                    },
                    tabBarButton: CustomTabButton
                }}
            />
        </Tab.Navigator>
    );
};

export default HomeTab;

const styles = StyleSheet.create({
    icon: {
        height: 25,
        width: 25
    }
});
