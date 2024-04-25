import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { MyText, WrapperContainerBase } from '@mwg-kits/components';
import { Mixins } from '@mwg-sdk/styles';
import { API_CONST, ENUM_STORAGE } from '@constants';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { database, helper, storage } from '@common';
import { CommonActions, useNavigation } from '@react-navigation/native';
import RNRestart from 'react-native-restart';
import { images } from '@assets';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as actionSplash from '../Splash/action';
import messaging from '@react-native-firebase/messaging';
import { apiBase, METHOD } from '@mwg-kits/core';
import { goLogout } from './utils';
export default function ProfileScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const userProfile = useSelector(
        (state) => state?.profileReducer?.userProfile
    );
    console.log('userProfile==', userProfile);
    const version = helper.getVersion();
    const [versionCodepush, setVersionCodepush] = useState(null);

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

    const onLogout = () => {
        global.props.alert({
            show: true,
            message: 'Bạn có muốn đăng xuất không?',
            type: 'info',
            onConfirmPressed: () => {
                // global.props.alert({ show: false });
                goLogout();
            },
            onCancelPressed: () => {
                global.props.alert({ show: false });
            }
        });
    };

    const componentsLeft = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MyText
                    text="Cá nhân"
                    addSize={12}
                    typeFont="bold"
                    numberOfLines={1}
                    style={{
                        color: '#323F4B',
                        maxWidth: Mixins.scale(300)
                    }}
                />
            </View>
        );
    };

    const _renderHeader = () => {
        return (
            <View
                style={{
                    marginTop: Mixins.scale(24),
                    marginHorizontal: Mixins.scale(16)
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <Image
                        style={{
                            width: Mixins.scale(60),
                            height: Mixins.scale(60),
                            borderRadius: Mixins.scale(30),
                            marginRight: Mixins.scale(16)
                        }}
                        source={{
                            uri: `${API_CONST.PATH_USER_AVATAR}${userProfile?.image}`
                        }}
                    />
                    <View>
                        <MyText
                            style={{ color: '#323F4B' }}
                            addSize={3}
                            text={`${userProfile?.fullName}`}
                            typeFont="bold"
                        />
                        <MyText
                            style={{
                                color: '#616E7C',
                                marginTop: Mixins.scale(8)
                            }}
                            addSize={3}
                            text={`${userProfile?.userName}`}
                        />
                    </View>
                </View>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <WrapperContainerBase componentsLeft={componentsLeft}>
                {_renderHeader()}
                <TouchableOpacity
                    onPress={() => this.RBSheet.open()}
                    style={{
                        flexDirection: 'row',
                        marginTop: Mixins.scale(32),
                        marginHorizontal: Mixins.scale(16)
                    }}>
                    <Image
                        style={{
                            width: Mixins.scale(24),
                            height: Mixins.scale(24)
                        }}
                        source={images.ic_help}
                    />
                    <MyText
                        style={{
                            color: '#3B3B3B',
                            marginLeft: Mixins.scale(8),
                            flex: 1
                        }}
                        addSize={2}
                        text={'Hỗ trợ ứng dụng'}
                    />
                    <Image
                        style={{
                            width: Mixins.scale(24),
                            height: Mixins.scale(24)
                        }}
                        source={images.ic_right}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        marginVertical: Mixins.scale(24),
                        marginHorizontal: Mixins.scale(16),
                        flexDirection: 'row'
                    }}>
                    <View
                        style={{
                            height: Mixins.scale(1),
                            flex: 1,
                            backgroundColor: '#F5F7FA'
                        }}
                    />
                </View>
                <TouchableOpacity
                    onPress={onLogout}
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: Mixins.scale(16)
                    }}>
                    <Image
                        style={{
                            width: Mixins.scale(24),
                            height: Mixins.scale(24)
                        }}
                        source={images.ic_logout}
                    />
                    <MyText
                        style={{
                            color: '#3B3B3B',
                            marginLeft: Mixins.scale(8),
                            flex: 1
                        }}
                        addSize={2}
                        text={'Đăng xuất'}
                    />
                </TouchableOpacity>

                <View
                    style={{
                        marginTop: Mixins.scale(44),
                        alignItems: 'center'
                    }}>
                    <MyText
                        addSize={1}
                        text={`Phiên bản ứng dụng: ${version}${
                            versionCodepush ? `.${versionCodepush}` : ''
                        }`}
                        style={{ color: '#7B8794' }}
                    />
                </View>

                <RBSheet
                    ref={(ref) => {
                        this.RBSheet = ref;
                    }}
                    // height={300}
                    closeOnDragDown
                    openDuration={250}
                    customStyles={{
                        container: {
                            borderRadius: Mixins.scale(16),
                            paddingBottom: Mixins.scale(19.5)
                        }
                    }}>
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderBottomWidth: Mixins.scale(1),
                                borderColor: '#F6F6F6',
                                paddingBottom: Mixins.scale(16),
                                marginTop: Mixins.scale(5)
                            }}>
                            <MyText
                                addSize={6}
                                text={`Hỗ trợ ứng dụng`}
                                style={{
                                    color: '#3B3B3B',
                                    flex: 1,
                                    textAlign: 'center',
                                    marginLeft: Mixins.scale(16)
                                }}
                                typeFont="bold"
                            />
                            <TouchableOpacity
                                style={{ marginRight: Mixins.scale(16) }}
                                onPress={() => this.RBSheet.close()}>
                                <Image
                                    style={{
                                        width: Mixins.scale(24),
                                        height: Mixins.scale(24)
                                    }}
                                    source={images.ic_x}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                marginTop: Mixins.scale(19.5),
                                marginHorizontal: Mixins.scale(16)
                            }}>
                            <TouchableOpacity
                                style={{
                                    borderBottomWidth: Mixins.scale(1),
                                    borderColor: '#F6F6F6',
                                    paddingBottom: Mixins.scale(16)
                                }}
                                onPress={() => callDeepLink('0916210375')}>
                                <MyText
                                    style={{
                                        color: '#3B3B3B'
                                    }}
                                    addSize={2}
                                    text="52549 - Nguyễn Ngọc Sơn"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    borderBottomWidth: Mixins.scale(1),
                                    borderColor: '#F6F6F6',
                                    paddingBottom: Mixins.scale(16),
                                    marginTop: Mixins.scale(16)
                                }}
                                onPress={() => callDeepLink('0905452588')}>
                                <MyText
                                    style={{
                                        color: '#3B3B3B'
                                    }}
                                    addSize={2}
                                    text="27124 - Bùi Thái Hòa"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    marginTop: Mixins.scale(16)
                                }}
                                onPress={() => callDeepLink('0706755753')}>
                                <MyText
                                    style={{
                                        color: '#3B3B3B'
                                    }}
                                    addSize={2}
                                    text="55862 - Nguyễn Đình Duy"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </RBSheet>
            </WrapperContainerBase>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    line: {
        alignItems: 'center',
        borderBottomColor: 'rgba(138,138,138,1.0)',
        borderBottomWidth: 0.2,
        borderTopColor: 'rgba(138,138,138,1.0)',
        borderTopWidth: 0.2,
        flexDirection: 'row',
        height: 40,
        paddingHorizontal: 20
    },
    title: {
        alignItems: 'flex-start',
        flex: 1,
        justifyContent: 'center'
    }
});
