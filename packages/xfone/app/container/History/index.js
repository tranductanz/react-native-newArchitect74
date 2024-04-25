import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { WrapperContainerBase } from '@mwg-kits/components';
import { Colors } from '@styles';
import { WarningView } from '@components';
import { images } from '@assets';
import { Mixins } from '@mwg-sdk/styles';
import { useNavigation } from '@react-navigation/native';

export default function HistoryScreen() {
    const navigation = useNavigation();
    const [showWarning, setShowWaning] = useState(false);
    const [textWarning, setTextWarning] = useState('');

    // useEffect(() => {
    //     console.log('vao day ko ne');
    // }, []);

    const onNotification = () => {
        //navigation.navigate('Notification');
    };

    const _renderHeaderRight = () => {
        return (
            <TouchableOpacity onPress={onNotification}>
                <Image
                    source={images.ic_bell}
                    style={{
                        height: Mixins.scale(32),
                        width: Mixins.scale(32)
                    }}
                />
            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.container}>
            <WrapperContainerBase
                nameTitle="Nhắn tin"
                componentsRight={_renderHeaderRight}>
                <WarningView
                    showWarning={showWarning}
                    txtWarning={textWarning}
                />
            </WrapperContainerBase>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.CFFFFFF
    }
});
