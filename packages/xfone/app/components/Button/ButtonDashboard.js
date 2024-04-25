import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import { images } from '@assets';
import { Mixins } from '@mwg-sdk/styles';

import { TEXT_STYLE } from '@styles';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { constants } from '@constants';

export default function ButtonDashboard(props) {
    const { data } = props;
    const navigation = useNavigation();
    const onScreen = () => {
        if (data.code === 'livestream') {
            return navigation.navigate('LiveStreamNavigator');
        }
    };
    return (
        <TouchableOpacity style={styles.container} onPress={onScreen}>
            <View style={{ alignItems: 'center' }}>
                <View
                    style={{
                        height: Mixins.scale(32),
                        width: Mixins.scale(41)
                    }}>
                    <Image
                        source={data?.uri}
                        style={
                            data?.code === 'livestream'
                                ? styles.iconLiveStream
                                : styles.icon
                        }
                    />
                </View>

                <Text style={styles.txtTitle}>{data?.label}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Mixins.scale(24),
        alignItems: 'flex-start',
        flex: 1 / 3
    },
    icon: {
        height: Mixins.scale(32),
        width: Mixins.scale(32)
    },
    iconLiveStream: {
        height: Mixins.scale(22),
        width: Mixins.scale(41)
    },
    txtTitle: {
        marginTop: Mixins.scale(8),
        textAlign: 'center',
        ...TEXT_STYLE.subHeadlineRegular,
        width: Mixins.scale(88),
        color: '#222222'
    }
});
