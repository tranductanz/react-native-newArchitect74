import {
    View,
    Text,
    StyleSheet,
    Image,
    Linking,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { MyText } from '@mwg-kits/components';
import { images, textStyle } from '@assets';
import * as Progress from 'react-native-progress';
import { database, date, helper, storage } from '@common';
import { Mixins } from '@mwg-sdk/styles';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import * as actionUser from '../Login/action';
import * as actionSplash from './action';
import { ENUM, ENUM_STORAGE } from '@constants';
import { Button, BaseView } from '@components';
import { goLogout, showPopUpInvalidToken } from '../Profile/utils';
import { checkNotificationsPermission } from '../DashBoard/utils';
import Config from 'react-native-config';
export default function SlashScreen(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [txtUpdateCP, setTxtUpdateCP] = useState('');
    const [percentComplete, setPercentComplete] = useState(0);

    const [opaque, setOpaque] = useState(null);

    const version = helper.getVersion();

    const [isFirst, setIsFirst] = useState(false);
    const [versionCodepush, setVersionCodepush] = useState(null);

    useEffect(() => {
        initDatabase();
        initDeepLink();
        checkUpdateApp();
        checkNotificationsPermission();
        getVersionCodepush();
    }, []);

    useEffect(() => {
        const linkingEvent = Linking.addEventListener('url', handleDeepLink);
    }, [handleDeepLink]);

    const initDeepLink = async () => {
        const url = await Linking.getInitialURL();
        console.log('URL LOGIN SSH WHEN getInitialURL', url);
        setTimeout(() => {
            handleDeepLink({ url });
        }, 1500);
    };

    const getVersionCodepush = async () => {
        const versionCodepush = await helper.getVersionCodePush();
        if (versionCodepush) {
            setVersionCodepush(versionCodepush);
        }
    };

    const handleDeepLink = async (event) => {
        try {
            if (!event || !event?.url) return;
            const urlSSO = 'xfone://xfone/login';
            const url = event?.url;

            if (url.split('?')[0] == urlSSO || url == 'xfone://xfone/') {
                return;
            }

            // LOGIN SSO TO XFONE
            if (url === 'xfone://mwg.tgdd.xfone/') {
                return;
            }

            const token = await storage.getItem(ENUM_STORAGE.TOKEN_ACCESS);

            const userInfo = JSON.parse(
                await storage.getItem(ENUM_STORAGE.USER_INFO)
            );

            if (
                !helper.IsValidateObject(token) ||
                !helper.IsValidateObject(userInfo)
            ) {
                return global.props.alert({
                    show: true,
                    message: 'Vui lòng đăng nhập trước khi thực hiện cuộc gọi',
                    type: 'error',
                    onCancelPressed: () => {
                        global.props.alert({ show: false });
                    }
                });
            }

            if (url.length <= 18) {
                let numberPhone = '';
                if (url.includes('tel:')) {
                    numberPhone = url.replace('tel:', '');
                } else {
                    numberPhone = url.replace('xfone://', '');
                }

                const params = {
                    packageId: '',
                    fullname: '',
                    numberPhone,
                    username: '',
                    shipmentOrderID: ''
                };

                dispatch(actionSplash.setDeeplink(params));
                navigation.navigate('Home', {
                    screen: 'KeyboardScreen'
                });
            } else if (url.includes('xfone://xwork??video_call')) {
                const data = url.split('://').slice(1).join('://');
                const linkingUrlDestructoring = data.split('??');
                const videoCallData = {
                    from: linkingUrlDestructoring[0],
                    module: linkingUrlDestructoring[1],
                    callerID: linkingUrlDestructoring[2],
                    callerFullname: decodeURIComponent(
                        linkingUrlDestructoring[3]
                    ),
                    calleeID: linkingUrlDestructoring[4],
                    calleeFullname: decodeURIComponent(
                        linkingUrlDestructoring[5]
                    ),
                    timestamp: linkingUrlDestructoring[6],
                    isStartCall: true,
                    callerAvatar: linkingUrlDestructoring[7],
                    calleeAvatar: linkingUrlDestructoring[8],
                    ticketID: linkingUrlDestructoring[9]
                };

                navigation.navigate('Home', {
                    screen: 'CallScreen',
                    videoCallData: videoCallData
                });
            } else {
                // tách lấy thông tin packageID,số dt,tên
                const link = decodeURIComponent(url.replace('xfone://', ''));
                const info = link.split('_');
                if (userInfo?.userName !== info[3]) {
                    return global.props.alert({
                        show: true,
                        message:
                            'Tài khoản thực hiện gọi không trùng khớp với tài khoản xfone.',
                        type: 'error',
                        onConfirmPressed: () => {
                            global.props.alert({ show: false });
                        }
                    });
                }
                const params = {
                    packageId: info[2], //packegeId vị trí cuối cùng
                    fullname: info[1],
                    numberPhone: info[0],
                    username: info[3],
                    shipmentOrderID: info.length >= 5 ? info[4] : '' //shipmentOrderID vị trí cuối cùng
                };
                dispatch(actionSplash.setDeeplink(params));
                navigation.navigate('Home', {
                    screen: 'KeyboardScreen'
                });
            }
        } catch (error) {
            console.log('ERROR CHECK DEEPLINK', error);
            global.props.alert({
                show: true,
                message: `Đã có lỗi xảy ra. Vui lòng thử lại sau`,
                type: 'error',
                onConfirmPressed: () => {
                    global.props.alert({ show: false });
                }
            });
        }
    };

    const initDatabase = () => {
        try {
            database.setActiveDB();
        } catch (error) {
            console.log('ERROR DB: ', error);
        }
    };

    const checkUpdateApp = async () => {
        try {
            await helper.updateAppWithCodepush((percentComplete) => {
                setPercentComplete(percentComplete);
            });
            const check = await storage.getItem(ENUM_STORAGE.FIRST_LOGIN);
            if (!check || check === 'FIRST_LOGIN') {
                setIsFirst(true);
            } else {
                _authen();
            }
        } catch (error) {
            _authen();
        }
    };

    const authenDev = async () => {
        try {
            const token = await storage.getItem(ENUM_STORAGE.TOKEN_ACCESS);
            if (helper.IsValidateObject(token)) {
                global.props.showLoader();
                await dispatch(actionUser.authToken());
                return;
            }
            navigation.navigate('LoginScreen');
        } catch (error) {
            if (error && error?.errorReason === 'invalid_token') {
                setTimeout(() => {
                    return showPopUpInvalidToken(error);
                }, 300);
            }
        }
    };

    const _authen = async () => {
        try {
            if (__DEV__ || Config.ENV === 'dev') {
                return authenDev();
            }
            const token = await storage.getItem(ENUM_STORAGE.TOKEN_ACCESS);
            if (helper.IsValidateObject(token)) {
                await dispatch(actionUser.authToken());
            } else {
                onStart();
            }
        } catch (error) {
            if (error && error?.errorReason === 'invalid_token') {
                setTimeout(() => {
                    return showPopUpInvalidToken(error);
                }, 300);
            }
        }
    };

    const onStart = async () => {
        if (__DEV__ || Config.ENV === 'dev') {
            navigation.navigate('LoginScreen');
        } else {
            navigation.navigate('LoginSSOScreen');
        }
    };

    const _renderProcessing = () => {
        if (percentComplete === 0) {
            return null;
        }
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: Mixins.scale(220),
                    alignItems: 'center'
                }}>
                <Progress.Bar
                    progress={percentComplete}
                    width={helper.width / 2}
                    color={'#2DCCA7'}
                    useNativeDriver
                />
                <Text
                    style={styles.txtProgress}>{`Đang cập nhật phiên bản mới: ${
                    percentComplete * 100
                }%`}</Text>
            </View>
        );
    };

    return (
        <BaseView containerStyle={{ backgroundColor: '#F6FDFC' }}>
            <View style={styles.container}>
                <View
                    style={{
                        height: Mixins.scale(475),
                        width: Mixins.scale(476),
                        borderRadius: Mixins.scale(250),
                        backgroundColor: 'rgba(95, 227, 192, 0.50)',
                        opacity: 0.12,
                        position: 'absolute'
                    }}
                />
                <View
                    style={{
                        alignItems: 'center',
                        top: Mixins.scale(190),
                        position: 'absolute'
                    }}>
                    <Image
                        source={images.ic_logo_spash}
                        style={{
                            height: Mixins.scale(60),
                            width: Mixins.scale(60)
                        }}
                    />
                    <Text style={styles.txtLogo}>XFone</Text>
                </View>
                <View
                    style={{
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        marginTop: Mixins.scale(110)
                    }}>
                    <View
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: Mixins.scale(32),
                            paddingTop: Mixins.scale(15),
                            paddingBottom: Mixins.scale(17),
                            paddingHorizontal: Mixins.scale(25),
                            height: Mixins.scale(182),
                            flex: 1,
                            marginTop: Mixins.scale(44),
                            marginBottom: Mixins.scale(80),
                            marginHorizontal: Mixins.scale(16)
                        }}>
                        <Image
                            source={images.ic_ring}
                            style={{
                                width: Mixins.scale(38),
                                height: Mixins.scale(40),
                                position: 'absolute',
                                left: Mixins.scale(-10),
                                top: Mixins.scale(-10)
                            }}
                        />
                        <Image
                            source={images.ic_call_right_spash}
                            style={{
                                width: Mixins.scale(68),
                                height: Mixins.scale(58),
                                position: 'absolute',
                                right: Mixins.scale(-20),
                                top: Mixins.scale(-20)
                            }}
                        />
                        <Image
                            source={images.ic_call_spash}
                            style={{
                                width: Mixins.scale(84),
                                height: Mixins.scale(72),
                                position: 'absolute',
                                left: Mixins.scale(-20),
                                bottom: Mixins.scale(-25)
                            }}
                        />
                        <Image
                            source={images.ic_cloud_splash}
                            style={{
                                width: Mixins.scale(69),
                                height: Mixins.scale(74),
                                position: 'absolute',
                                right: Mixins.scale(-15),
                                bottom: Mixins.scale(-25)
                            }}
                        />
                        <Text style={styles.txtHeader}>
                            Chào mừng đến với ứng dụng XFone
                        </Text>
                        <View style={{ marginTop: Mixins.scale(12) }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start'
                                }}>
                                <Text style={[styles.txtDes, { fontSize: 6 }]}>
                                    {'●  '}
                                </Text>
                                <Text style={styles.txtDes}>
                                    {`XFone chỉ sử dụng gọi ra để phục vụ \nKhách hàng.`}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start'
                                }}>
                                <Text style={[styles.txtDes, { fontSize: 6 }]}>
                                    {'●  '}
                                </Text>
                                <Text style={styles.txtDes}>
                                    {`Vui lòng không sử dụng cho mục đích \nCá nhân. Xin cảm ơn!`}
                                </Text>
                            </View>
                            <View
                                style={{
                                    alignItems: 'center'
                                }}>
                                <Text style={styles.txtVersion}>
                                    {`Phiên bản ứng dụng: ${version}${
                                        versionCodepush
                                            ? `.${versionCodepush}`
                                            : ''
                                    }`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                {_renderProcessing()}
            </View>

            {isFirst && (
                <View style={{ marginHorizontal: Mixins.scale(16) }}>
                    <TouchableOpacity
                        style={styles.btnLoginSSO}
                        onPress={onStart}>
                        <Text style={styles.txtLoginSSO}>Bắt đầu</Text>
                    </TouchableOpacity>
                </View>
            )}
        </BaseView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6FDFC',
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtLogo: {
        ...textStyle.boldLargeTitle,
        color: '#016457',
        marginTop: Mixins.scale(12)
    },
    txtVersion: {
        ...textStyle.regularCaption1,
        color: '#B1B1B1',
        marginTop: Mixins.scale(12)
    },
    btnLoginSSO: {
        height: Mixins.scale(56),
        backgroundColor: '#2DCCA7',
        borderRadius: Mixins.scale(16),
        width: '100%',
        position: 'absolute',
        bottom: Mixins.scale(20),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    txtLoginSSO: {
        ...textStyle.boldBody,
        color: '#F0FCF9',
        marginLeft: Mixins.scale(8)
    },
    txtHeader: {
        ...textStyle.boldBody,
        color: '#079A82'
    },
    txtDes: {
        ...textStyle.regularBody,
        color: '#626262',
        lineHeight: Mixins.scale(22)
    },
    txtProgress: {
        ...textStyle.regularCaption1,
        color: '#626262',
        marginTop: Mixins.scale(12)
    }
});
