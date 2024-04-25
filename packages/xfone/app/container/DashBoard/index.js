import {
    View,
    Text,
    StyleSheet,
    FlatList,
    NativeModules,
    Platform
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
    MyText,
    WrapperContainerBase,
    WrapperContainerTitle
} from '@mwg-kits/components';
import { ButtonDashboard } from '@components';
import { Mixins } from '@mwg-sdk/styles';
import { images } from '@assets';
import RNCallKeep from 'react-native-callkeep';
import {
    answerIncomingVideoCall,
    declineIncomingVideoCall,
    helper,
    storage,
    answerIncomingAudioCall,
    declineIncomingAudioCall
} from '@common';
const { GetPayloadDataModule, CustomCallKeepModule } = NativeModules;
import {
    requestPermissionCameraAndMicIOS,
    checkPermissionCameraAndMicIOS,
    displayRequestOverlayPermissionPopup
} from './utils';
import NotifService from '../../common/notification/NotifService';
import { ENUM_STORAGE } from '@constants';
import { useSelector, useDispatch } from 'react-redux';
import * as LoginAction from '../Login/action';
import { requestPermission, openSetting } from '@mwg-kits/core';

export default function DashBoardScreen() {
    const notif = new NotifService(onRegister, onNotif);
    const linkingUrlData = useSelector(
        (state) => state.videoCallReducer?.incomingCallData
    );
    const audioData = useSelector(
        (state) => state.audioCallReducer?.incomingAudioCallData
    );
    const dispatch = useDispatch();

    useEffect(() => {
        askPermission();
        displayRequestOverlayPermissionPopup();
        check_version();
    }, []);

    const askPermission = async () => {
        try {
            await requestPermission('microphone');
        } catch (e) {
            global.props.alert({
                show: true,
                message: 'Vui lòng cấp quyền micro để sử dụng ứng dụng',
                type: 'info',
                confirmText: 'Đóng',
                cancelText: 'Cài đặt',
                onCancelPressed: () => {
                    global.props.alert({
                        show: false,
                        title: ''
                    });
                    openSetting();
                },
                onConfirmPressed: () => {
                    global.props.alert({
                        show: false,
                        title: ''
                    });
                }
            });
        }
    };

    useEffect(() => {
        if (Platform.OS === 'ios') {
            RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
                GetPayloadDataModule.getStoredPayloadData()
                    .then(async (payloadData) => {
                        if (helper.IsValidateObject(payloadData)) {
                            if (
                                helper.hasProperty(
                                    payloadData,
                                    'CALLER_USERNAME'
                                )
                            ) {
                                CustomCallKeepModule.removeEndCallTimer();
                                answerIncomingAudioCall(payloadData);
                            } else if (
                                helper.hasProperty(payloadData, 'callerId')
                            ) {
                                answerIncomingVideoCall(payloadData, false);
                            }
                        }
                    })
                    .catch((error) => {
                        // Handle error
                        RNCallKeep.endCall(callUUID);
                        global.props.alert({
                            show: true,
                            message: `Có lỗi xảy ra, vui lòng gọi lại ${error}`,
                            type: 'info',
                            onConfirmPressed: () => {
                                global.props.alert({ show: false });
                            }
                        });
                    });
            });
            RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
                GetPayloadDataModule.getStoredPayloadData()
                    .then((payloadData) => {
                        if (
                            helper.IsValidateObject(payloadData) &&
                            helper.hasProperty(payloadData, 'USERNAME_DES')
                        ) {
                            if (
                                helper.hasProperty(
                                    payloadData,
                                    'CALLER_USERNAME'
                                ) &&
                                !helper.IsValidateObject(audioData?.uuid)
                            ) {
                                declineIncomingAudioCall(payloadData);
                            } else if (
                                !helper.IsValidateObject(linkingUrlData?.uuid)
                            ) {
                                declineIncomingVideoCall(payloadData);
                            }
                        }
                    })
                    .catch((error) => {
                        // Handle error
                    });
            });
        }

        return () => {
            RNCallKeep.removeEventListener('answerCall');
            RNCallKeep.removeEventListener('endCall');
        };
    }, []);

    const check_version = async () => {
        try {
            const res = await dispatch(LoginAction.checkVersionApp());
            const crV = helper.getVersion();
            const versionApp = res.settingValue;
            if (!helper.isNewerVersion(versionApp, crV)) {
                const isInstalled = await helper.isAppInstalled('xmanager');
                const notice = isInstalled
                    ? 'Vui lòng cài Xfone bản mới nhất'
                    : 'Vui lòng tải app SSO để nâng cấp phiên bản Xfone mới nhất';
                global.props.alert({
                    show: true,
                    message: notice,
                    type: 'info',
                    confirmText: 'Cập nhật',
                    onFixedPressed: () => {
                        if (isInstalled) {
                            const url =
                                'xmanager://xmanager?action=update&bundleID=mwg.tgdd.xfone';
                            helper.openURL(url);
                        } else helper.openURL('https://appsso.tgdd.vn/');
                    }
                });
            }
        } catch (error) {}
    };

    const sendNotification = () => {
        notif.localNotif({
            title: 'Thông báo',
            message: 'Vui lòng cấp quyền camera và micro để nghe máy',
            data: {
                ACTION: 'PERMISSION',
                id: new Date().getTime()
            }
        });
    };

    const onRegister = (token) => {
        console.log('onRegister:::::', token);
    };

    const _switchCaseNoitifi = async (data) => {
        // this.props.navigation.navigate('CreateRoom', {
        //     roomId: data.ROOM_ID,
        //     roomPin: data.PIN,
        //     janusHostVideo: data.JANUS_HOST
        // });
        // this.props.nottifyActions.SeenNotify(data.id, data.ROOM_ID);
        if (data?.ACTION === 'PERMISSION') {
            await requestPermissionCameraAndMicIOS();
        }
    };

    const onNotif = (notif) => {
        try {
            const { foreground, userInteraction } = notif;
            // if (foreground && userInteraction) {
            //     const { alertAction, data } = notif;
            //     if (Platform.OS === 'android') {
            //         if (alertAction && alertAction === 'view') {
            //             switchCaseNoitifi(data);
            //         }
            //     }
            // }
            if (!foreground && userInteraction) {
                if (Platform.OS === 'ios') {
                    if (data) {
                        _switchCaseNoitifi(data);
                    }
                }
            }
        } catch (error) {
            console.log('error exception: ', error);
        }
    };
    const dataType = [
        // {
        //     id: 1,
        //     label: 'Tạo phòng',
        //     uri: images.ic_create_room,
        //     code: 'taophong'
        // },
        // {
        //     id: 2,
        //     label: 'Liên kết nhóm',
        //     uri: images.ic_link_group,
        //     code: 'lienketnhom'
        // },
        // {
        //     id: 3,
        //     label: 'Chat tư vấn',
        //     uri: images.ic_chat,
        //     code: 'chattuvan'
        // },

        {
            id: 1,
            label: 'Livestream',
            uri: images.ic_livestream,
            code: 'livestream'
        }
        // {
        //     id: 2,
        //     label: `Gọi từ Tận Tâm`,
        //     uri: images.ic_call,
        //     code: 'goitutantam'
        // }
    ];

    const _renderItem = ({ item, index }) => {
        return <ButtonDashboard data={item} />;
    };

    const componentsLeft = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MyText
                    text="Tiện ích"
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

    return (
        <View style={styles.container}>
            <WrapperContainerBase componentsLeft={componentsLeft}>
                <FlatList
                    bounces={false}
                    style={{
                        paddingHorizontal: Mixins.scale(16),
                        paddingTop: Mixins.scale(24)
                    }}
                    data={dataType}
                    renderItem={_renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                />
            </WrapperContainerBase>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
});
