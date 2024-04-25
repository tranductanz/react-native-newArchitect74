import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MyText } from '@mwg-kits/components';
import { constants } from '@constants';
import { BaseModal } from '@components';
import NetworkLogger from 'react-native-network-logger';
export default function ModalLogger(props) {
    const { visible, onPressCloseLogger } = props;
    if (constants.ISLIVE) {
        return null;
    }

    return (
        <BaseModal
            transparent
            visible={visible}
            useNativeDriver
            hideModalContentWhileAnimating
            backdropOpacity={0.5}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={200}
            backdropTransitionOutTiming={200}
            style={{
                justifyContent: 'flex-end',
                paddingVertical: global.props.insets.bottom
            }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,194,38,1)' }}>
                <View
                    style={{
                        width: constants.width,
                        height: 80,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'
                    }}>
                    <MyText category={'h5'} text={'XEM LOG API TRÊN APP'} />
                </View>
                <NetworkLogger />
                <TouchableOpacity
                    onPress={onPressCloseLogger}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: global.props.insets.props,
                        paddingVertical: 30
                    }}>
                    <MyText text={'ĐÓNG'} addSize={4} />
                </TouchableOpacity>
            </View>
        </BaseModal>
    );
}
