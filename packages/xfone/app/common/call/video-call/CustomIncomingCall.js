import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    Image,
    Linking,
    PermissionsAndroid,
    Platform,
    Text,
    ToastAndroid,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import _BackgroundTimer from 'react-native-background-timer';
import { styles } from './customIncomingCallStyles';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import InCallManager from 'react-native-incall-manager';
import { MyText } from '@mwg-kits/components';
import { useSelector } from 'react-redux';
import { store } from '../../../store';
import { API_CONST } from '@constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNExitApp from 'react-native-exit-app';
import Sound from 'react-native-sound';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import { declineCall } from '.';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { Mixins } from '@mwg-sdk/styles';

Sound.setCategory('Playback');
const START_DEFAULT = { x: 0.5, y: 0 };
const END_DEFAULT = { x: 0.5, y: 1 };
const GRADIENT_COLORS = ['#1f1f29', '#1f1f29'];
const GRADIENT_LOCATIONS = [0, 0.2];

let isBackgroundIncomingCall = false;
let mySound = null;

const DISPLAY_INCOMING_CALL_DURATION = 30000000;
const DISPLAY_INCOMING_AUDIO_CALL_DURATION = 20000;

const CustomIncomingVideoCall = (props) => {
    const callData = JSON.parse(props.payload);
    console.log('tien xem====', props);
    const PATTERN = [1000, 1000];

    let timer = null;
    const y1 = new Animated.Value(0);
    const y2 = new Animated.Value(0);
    const animatedCircles = [
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1)
    ];

    const startCircleAnimation = () => {
        Animated.loop(
            Animated.timing(animatedCircles[0], {
                toValue: 3,
                duration: 2400,
                useNativeDriver: false,
                easing: Easing.linear
            })
        ).start();

        setTimeout(() => {
            Animated.loop(
                Animated.timing(animatedCircles[1], {
                    toValue: 3,
                    duration: 2400,
                    useNativeDriver: false,
                    easing: Easing.linear
                })
            ).start();
        }, (2400 / 3) * 1);

        setTimeout(() => {
            Animated.loop(
                Animated.timing(animatedCircles[2], {
                    toValue: 3,
                    duration: 2400,
                    useNativeDriver: false,
                    easing: Easing.linear
                })
            ).start();
        }, (2400 / 3) * 2);
    };

    const startMultimedia = async () => {
        try {
            // playAudio();
            Vibration.vibrate(PATTERN, true);
        } catch (e) {
            console.log('Error when get sound ', e);
        }
    };

    useEffect(() => {
        const videoDuration =
            (DISPLAY_INCOMING_CALL_DURATION -
                (new Date().valueOf() * 1000 - callData.TIMESTAMP_REGISTER)) /
            1000;

        const custom_notification = JSON.parse(callData.custom_notification);
        const audioDuration =
            DISPLAY_INCOMING_AUDIO_CALL_DURATION -
            (new Date().valueOf() - custom_notification?.timeSend);

        const duration =
            callData?.TYPE_CALL !== 'AUDIO_CALL'
                ? videoDuration
                : audioDuration;
        if (duration > 0) {
            timer = _BackgroundTimer.setTimeout(() => {
                ToastAndroid.show('Cuộc gọi đã kết thúc', ToastAndroid.SHORT);
                RNNotificationCall.hideNotification();
            }, duration);
        }

        startMultimedia();
        Animated.loop(
            Animated.sequence([
                Animated.timing(y1, {
                    toValue: -12,
                    duration: 200,
                    easing: Easing.quad,
                    useNativeDriver: false
                }),
                Animated.timing(y1, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.quad,
                    useNativeDriver: false
                }),
                Animated.timing(y1, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.quad,
                    useNativeDriver: false
                })
            ])
        ).start();
        setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(y2, {
                        toValue: -12,
                        duration: 200,
                        easing: Easing.quad,
                        useNativeDriver: false
                    }),
                    Animated.timing(y2, {
                        toValue: 0,
                        duration: 200,
                        easing: Easing.quad,
                        useNativeDriver: false
                    }),
                    Animated.timing(y2, {
                        toValue: 0,
                        duration: 1500,
                        easing: Easing.quad,
                        useNativeDriver: false
                    })
                ])
            ).start();
        }, 500);

        return () => {
            _BackgroundTimer.clearTimeout(timer);
            Vibration.cancel();
            InCallManager.stopRingtone();
        };
    }, []);

    const playAudio = async () => {
        try {
            mySound = new Sound(
                'incoming_call.mp3',
                Sound.MAIN_BUNDLE,
                (error) => {
                    if (error) {
                        console.log('Error loading sound:', error);
                        return;
                    }
                    mySound.setNumberOfLoops(-1);
                    mySound.play((success) => {
                        if (!success) {
                            console.log('Sound playback failed');
                        }
                    });
                }
            );
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const a = new Animated.Value(1);
    const b = new Animated.Value(1);

    useEffect(() => {
        startAnimatedCircles();
        handleBackgroundIncomingCallFlag();
    }, []);

    handleBackgroundIncomingCallFlag = async () => {
        const isFromBackground = await AsyncStorage.getItem(
            'BACKGROUND_INCOMINGCALL'
        );
        if (isFromBackground) {
            _BackgroundTimer.setTimeout(() => {
                isBackgroundIncomingCall = true;
                AsyncStorage.removeItem('BACKGROUND_INCOMINGCALL', null);
            }, 1000);
        }
    };

    const startAnimatedCircles = () => {
        Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(a, {
                        duration: 1000,
                        toValue: 1.5,
                        useNativeDriver: false,
                        easing: Easing.bezier(0.18, 0.6, 0.64, 0.88)
                    }),
                    Animated.timing(a, {
                        duration: 500,
                        toValue: 1.5,
                        useNativeDriver: false
                    }),
                    Animated.timing(a, {
                        duration: 500,
                        toValue: 1,
                        useNativeDriver: false,
                        easing: Easing.bezier(1, 0.36, 0.83, 0.6)
                    }),
                    Animated.timing(a, {
                        duration: 1000,
                        toValue: 1,
                        useNativeDriver: false
                    })
                ]),
                Animated.sequence([
                    Animated.timing(b, {
                        duration: 1000,
                        toValue: 0.8,
                        useNativeDriver: false,
                        easing: Easing.bezier(0.18, 0.6, 0.64, 0.88)
                    }),
                    Animated.timing(b, {
                        duration: 500,
                        toValue: 0.8,
                        useNativeDriver: false
                    }),
                    Animated.timing(b, {
                        duration: 500,
                        toValue: 1.2,
                        useNativeDriver: false,
                        easing: Easing.bezier(0.18, 0.6, 0.64, 0.88)
                    }),
                    Animated.timing(b, {
                        duration: 1000,
                        toValue: 1,
                        useNativeDriver: false
                    })
                ])
            ])
        ).start();
    };

    const renderAnimatedCircle = () => {
        return (
            <Animated.View
                style={{
                    width: 160,
                    height: 160,
                    position: 'absolute',
                    borderRadius: 500,
                    transform: [{ scale: a }],
                    borderWidth: 3,
                    borderColor: '#3B75A9'
                }}
            />
        );
    };

    const beforeHandle = () => {
        Vibration.cancel();
        if (mySound) mySound.stop();
        _BackgroundTimer.clearTimeout(timer);
        InCallManager.stopRingtone();
    };

    const handleAccept = async () => {
        console.log('accept audio call====', props.uuid);
        beforeHandle();
        RNNotificationCall.answerCall(props.uuid, callData);
    };

    const handleDecline = async () => {
        console.log('decline audio call====', callData.uuid);
        beforeHandle();
        RNNotificationCall.declineCall(callData.uuid, callData);
        ToastAndroid.show('Từ chối cuộc gọi', ToastAndroid.SHORT);
    };

    const requestPermission = async (option = 'CAMERA') => {
        if (Platform.OS === 'android') {
            const displayText = option === 'CAMERA' ? 'Camera' : 'Microphone';
            const permissionStatus = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS[option]
            );
            if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS[option],
                    {
                        title: 'Thông báo',
                        message: `Bạn cần cấp quyền ${displayText} để thực hiện cuộc gọi`,
                        buttonPositive: 'Đồng ý'
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true;
                } else {
                    Alert.alert(
                        `Cho phép Xwork truy cập vào ${displayText}?`,
                        `Để thực hiện cuộc gọi, vui lòng cấp quyền ${displayText} bằng cách vào cài đặt của Xwork, chọn quyền ứng dụng và cho phép truy cập camera`,
                        [
                            {
                                text: 'Đóng',
                                onPress: () => {},
                                style: 'cancel'
                            },
                            {
                                text: 'Vào cài đặt',
                                onPress: () => {
                                    Linking.openSettings();
                                },
                                style: 'destructive'
                            }
                        ],
                        {
                            cancelable: true
                        }
                    );
                    return false;
                }
            }
        } else return true;
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                style={styles.headerBg}
                colors={GRADIENT_COLORS}
                locations={GRADIENT_LOCATIONS}
                start={START_DEFAULT}
                end={END_DEFAULT}>
                <View style={styles.header}>
                    {callData?.TYPE_CALL !== 'AUDIO_CALL' ? (
                        <View style={{ alignItems: 'center' }}>
                            <MyText
                                text={`${callData.APP_ID_RECEIVER} - Cuộc gọi đến`}
                                addSize={4}
                                style={styles.userID}
                            />
                            <MyText
                                text={`${callData.USERNAME_SENDER} - ${callData.FULL_NAME}`}
                                addSize={10}
                                style={styles.userName}
                            />
                            <View style={styles.avatarBorder}>
                                {renderAnimatedCircle()}
                                <Animated.View
                                    style={{
                                        transform: [{ scale: b }]
                                    }}>
                                    <Image
                                        style={styles.avatar}
                                        source={{
                                            uri: `${API_CONST.PATH_USER_AVATAR}${callData.AVATAR_SENDER}`
                                        }}
                                    />
                                </Animated.View>
                            </View>
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            <MyText
                                text={`Cuộc gọi đến`}
                                addSize={4}
                                style={styles.userID}
                            />
                            <MyText
                                text={`${callData.CALLER_USERNAME} - ${callData.CALLER_FULLNAME}`}
                                addSize={10}
                                style={styles.userName}
                            />
                            <View style={styles.avatarBorder}>
                                {renderAnimatedCircle()}
                                <Animated.View
                                    style={{
                                        transform: [{ scale: b }]
                                    }}>
                                    <Image
                                        style={styles.avatar}
                                        source={{
                                            uri: `${API_CONST.PATH_USER_AVATAR}${callData.CALLER_AVATAR}`
                                        }}
                                    />
                                </Animated.View>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.body}>
                    <View style={styles.controlWrapper}>
                        <View style={{ alignItems: 'center' }}>
                            <Animated.View
                                style={{
                                    transform: [{ translateY: y2 }]
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleDecline();
                                    }}
                                    style={[
                                        styles.controlBtn,
                                        {
                                            backgroundColor: 'red',
                                            transform: [{ rotate: '45deg' }]
                                        }
                                    ]}>
                                    <SimpleLineIcons
                                        name="call-end"
                                        size={28}
                                        color={'white'}
                                    />
                                </TouchableOpacity>
                            </Animated.View>
                            <MyText
                                text="Từ chối"
                                addSize={-1}
                                style={styles.controlBtnText}
                            />
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Animated.View
                                style={{
                                    transform: [{ translateY: y1 }]
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleAccept();
                                    }}
                                    style={styles.controlBtn}>
                                    {callData?.TYPE_CALL !== 'AUDIO_CALL' ? (
                                        <Feather
                                            name="video"
                                            size={28}
                                            color={'#fff'}
                                        />
                                    ) : (
                                        <Image
                                            source={{ uri: 'ic_call' }}
                                            style={Mixins.scaleImage(34, 34)}
                                            resizeMode="contain"
                                        />
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
                            <MyText
                                text="Chấp nhận"
                                addSize={-1}
                                style={styles.controlBtnText}
                            />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

export default CustomIncomingVideoCall;
