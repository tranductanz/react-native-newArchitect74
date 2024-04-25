import { Text, View, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';

export default class Dashboard extends Component {
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('Livestream');
                    }}
                    style={{
                        width: 150,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        backgroundColor: 'green'
                    }}>
                    <Text>LiveStream</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
