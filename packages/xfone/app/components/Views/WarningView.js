import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Mixins } from '@mwg-sdk/styles';
import { MyText } from '@mwg-kits/components';

export default function WarningView(props) {
    const { showWarning, txtWarning } = props;

    if (!showWarning) return null;
    return (
        <View style={styles.container}>
            <MyText
                text={`${txtWarning}`}
                style={{
                    color: '#FFFFFF'
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#FF5B5B',
        height: Mixins.scale(40),
        justifyContent: 'center',
        width: '100%'
    }
});
