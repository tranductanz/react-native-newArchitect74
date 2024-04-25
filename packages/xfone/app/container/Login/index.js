import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    TextInput,
    Keyboard,
    Linking,
    Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MyText } from '@mwg-kits/components';
import { Mixins } from '@mwg-sdk/styles';
import { useDispatch, useSelector } from 'react-redux';
import { BaseView, TextInputCustom, Button } from '@components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { images, textStyle } from '@assets';
import { date, helper } from '@common';

import Icon from 'react-native-vector-icons/FontAwesome';

import { requestPermission } from '@mwg-kits/core';

import Geolocation from '@react-native-community/geolocation';

import * as actionUser from './action';
import * as actionSplash from '../Splash/action';
export default function LoginScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [isError, setIsError] = useState('');
    const [versionCodepush, setVersionCodepush] = useState(null);

    const version = helper.getVersion();

    const userProfile = useSelector(
        (state) => state?.profileReducer?.userProfile
    );

    useEffect(() => {
        getVersionCodepush();
    }, []);

    const getVersionCodepush = async () => {
        const versionCodepush = await helper.getVersionCodePush();
        if (versionCodepush) {
            setVersionCodepush(versionCodepush);
        }
    };

    const callDeepLink = (numberPhone) => {
        const phoneNumber = numberPhone;
        Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
            if (!supported) {
                // handle the error
            } else {
                return Linking.openURL(`tel:${phoneNumber}`);
            }
        });
    };

    const loginApi = async (position) => {
        try {
            const location = position
                ? {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                  }
                : null;
            const response = await dispatch(
                actionUser.authAccountWithLogin(
                    username.trim(),
                    password.trim(),
                    location
                )
            );
        } catch (error) {
            if (error?.errorReason === 'invalid_grant') {
                setTimeout(() => {
                    return global.props.alert({
                        show: true,
                        message: 'Tài khoản BCNB hoặc mật khẩu không chính xác',
                        type: 'error',
                        onCancelPressed: () => {
                            global.props.alert({ show: false });
                        }
                    });
                }, 300);
            } else {
                setTimeout(() => {
                    return global.props.alert({
                        show: true,
                        message: error?.errorReason,
                        type: 'error',
                        onCancelPressed: () => {
                            global.props.alert({ show: false });
                        }
                    });
                }, 300);
            }
        }
    };

    const onLogin = async () => {
        Keyboard.dismiss();
        if (username.trim().length === 0) {
            return global.props.alert({
                show: true,
                message: 'Điền đầy đủ tài khoản BCNB',
                type: 'info',
                onCancelPressed: () => {
                    global.props.alert({ show: false });
                }
            });
        } else if (password.trim().length === 0) {
            return global.props.alert({
                show: true,
                message: 'Vui lòng điền mật khẩu',
                type: 'info',
                onCancelPressed: () => {
                    global.props.alert({ show: false });
                }
            });
        } else {
            try {
                const result = await requestPermission('location');
                if (result) {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            loginApi(position);
                        },
                        (e) => {
                            loginApi(null);
                        },
                        { enableHighAccuracy: false }
                    );
                }
            } catch (error) {
                console.log('ERROR PERMISSION LOCATION', error);
                if (error === 'denied') {
                    loginApi(null);
                }
            }
        }
    };
    return (
        <BaseView containerStyle={{ backgroundColor: '#FFFFFF', flex: 1 }}>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
                bounces={false}
                overScrollMode="always"
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1
                }}>
                <View style={styles.container}>
                    <View
                        style={{
                            alignItems: 'center',
                            top: Mixins.scale(64),
                            position: 'absolute',
                            width: '100%'
                        }}>
                        <Text style={styles.txtTitle}>Đăng nhập</Text>
                        <Text style={styles.txtLogo}>XFone</Text>
                    </View>
                    <View style={{ paddingHorizontal: Mixins.scale(16) }}>
                        <TextInputCustom
                            value={username}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                setUsername(text);
                            }}
                            placeholder="Tài khoản"
                        />
                        <TextInputCustom
                            containerInput={{
                                marginTop: Mixins.scale(24)
                            }}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                            }}
                            placeholder="Mã định danh SSO"
                            leftIcon={images.ic_input_password}
                            secureTextEntry
                        />
                        <Button
                            textStyle={{
                                textAlign: 'center',
                                color: '#F0FCF9',
                                fontSize: Mixins.scale(17),
                                fontWeight: '700'
                            }}
                            style={{
                                backgroundColor: '#2DCCA7',
                                height: Mixins.scale(56),
                                width: '100%',
                                marginTop: Mixins.scale(32),
                                borderRadius: Mixins.scale(16)
                            }}
                            textTypeFont="inter"
                            isLoading={false}
                            onPress={onLogin}>
                            Đăng nhập
                        </Button>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            bottom: Mixins.scale(15),
                            alignItems: 'center',
                            width: '100%'
                        }}>
                        <Text style={styles.txtVersion}>
                            {`Phiên bản ứng dụng: ${version}${
                                versionCodepush ? `.${versionCodepush}` : ''
                            }`}
                        </Text>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </BaseView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center'
    },
    accout: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E8E8E8',
        borderRadius: 6,
        borderWidth: 1,
        color: '#4A5568',
        fontFamily: 'GoogleSans-Bold',
        height: Mixins.scale(50),
        marginTop: 15,
        paddingHorizontal: 15
    },
    txtTitle: {
        ...textStyle.boldLargeTitle,
        color: '#3B3B3B'
    },
    txtLogo: {
        ...textStyle.boldLargeTitle,
        color: '#2DCCA7',
        marginTop: Mixins.scale(7)
    },
    txtVersion: {
        ...textStyle.regularFootnote,
        color: '#7B8794'
    }
});
