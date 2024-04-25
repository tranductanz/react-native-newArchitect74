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
import { Mixins } from '@mwg-sdk/styles';
import { helper } from '@common';
import { images, textStyle } from '@assets';
import { Button, BaseView } from '@components';
import { MyText } from '@mwg-kits/components';

import * as actionUser from '../Login/action';
import * as actionSplash from './action';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { constants } from '@constants';

export default function LoginSSO() {
    const version = helper.getVersion();
    const [opaque, setOpaque] = useState(null);
    const [url, setURL] = useState(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [versionCodepush, setVersionCodepush] = useState(null);
    useEffect(() => {
        const linkingEvent = Linking.addEventListener('url', handleDeepLink);
    }, [handleDeepLink]);

    useEffect(() => {
        if (url) {
            handleLoginSSO(url);
        }
        getVersionCodepush();
    }, [url]);

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
                // LOGIN SSO
                setURL(url);
                return;
            }
        } catch (error) {
            console.log('ERROR DEEPLINK LOGIN SSO', error);
        }
    };

    const handleLoginSSO = async (url) => {
        try {
            global.props.showLoader();
            const params = helper.getParamsURL(url);
            // if (opaque == params.opaque) {
            //     const response = await dispatch(actionUser.authAccount(params));
            // } else {
            //     return global.props.alert({
            //         show: true,
            //         message: 'Phiên xác thực không hợp lệ. Vui lòng thử lại',
            //         type: 'error',
            //         onCancelPressed: () => {
            //             global.props.alert({ show: false });
            //         }
            //     });
            // }
            await dispatch(actionUser.authAccount(params));
        } catch (error) {
            return global.props.alert({
                show: true,
                message: 'Phiên xác thực không hợp lệ. Vui lòng thử lại',
                type: 'error',
                onCancelPressed: () => {
                    global.props.alert({ show: false });
                }
            });
        }
    };

    const onLoginSSO = async () => {
        const isInstalled = await helper.isAppInstalled('xmanager');
        if (!isInstalled) {
            return global.props.alert({
                show: true,
                message: 'Vui lòng cài đặt app MWG SSO để đăng nhập ứng dụng.',
                type: 'error',
                onConfirmPressed: () => {
                    helper.openURL('https://appsso.tgdd.vn/');
                }
            });
        }

        const newOpaque = await helper.uuidv4();
        setOpaque(newOpaque);
        const params = {
            action: 'login',
            bundleID: 'mwg.tgdd.xfone',
            device: await helper.getUniqueId(),
            opaque: newOpaque
        };
        const query = helper.getQueryString(params);
        const url = `xmanager://xmanager/?${query}`;
        helper.openURL(url);
    };

    return (
        <BaseView containerStyle={{ backgroundColor: '#FFFFFF' }}>
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

                <Image source={images.ic_splash} style={styles.imgLogo} />

                <Text style={styles.txtVersion}>
                    {`Phiên bản ứng dụng: ${version}${
                        versionCodepush ? `.${versionCodepush}` : ''
                    }`}
                </Text>
                {!constants.ISLIVE && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LoginScreen')}
                        style={{
                            marginTop: Mixins.scale(36)
                        }}>
                        <MyText
                            text="Đổi qua Login Account"
                            addSize={3}
                            style={{ color: 'red', textAlign: 'center' }}
                        />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.btnLoginSSO}
                    onPress={onLoginSSO}>
                    <Image
                        source={images.ic_sso}
                        style={{
                            height: Mixins.scale(24),
                            width: Mixins.scale(24)
                        }}
                    />
                    <Text style={styles.txtLoginSSO}>Đăng nhập qua SSO</Text>
                </TouchableOpacity>
            </View>
        </BaseView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: Mixins.scale(16)
    },
    header: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        paddingBottom: 50,
        paddingTop: 45,
        width: '100%'
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
        color: '#7B8794',
        marginTop: Mixins.scale(25)
    },
    imgLogo: { width: Mixins.scale(325), height: Mixins.scale(311) },
    btnLoginSSO: {
        height: Mixins.scale(56),
        backgroundColor: '#AE1D76',
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
    }
});
