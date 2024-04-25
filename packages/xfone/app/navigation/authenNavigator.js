import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { enableScreens } from 'react-native-screens';
import SplashScreen from '../container/Splash';
import LoginScreen from '../container/Login';
import LoginSSO from '../container/Login/LoginSSO';
enableScreens();
const AuthenStack = createStackNavigator();
const AuthenNavigator = () => {
    return (
        <AuthenStack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: false
            }}>
            <AuthenStack.Screen name="SplashScreen" component={SplashScreen} />
            <AuthenStack.Screen name="LoginScreen" component={LoginScreen} />
            <AuthenStack.Screen name="LoginSSOScreen" component={LoginSSO} />
        </AuthenStack.Navigator>
    );
};

export default AuthenNavigator;
