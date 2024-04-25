import {
    View,
    ViewStyle,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardTypeOptions
} from 'react-native';
import React, { useState } from 'react';
import { Mixins } from '@mwg-sdk/styles';
import { images } from '@assets';

type Props = {
    value: string;
    onChangeText: () => void;
    style: ViewStyle;
    keyboardType?: KeyboardTypeOptions;
    containerInput?: ViewStyle;
    placeholder?: string;
    leftIcon?: any;
    secureTextEntry?: boolean;
};
export default function TextInputCustom(props: Props) {
    const {
        containerInput,
        placeholder,
        leftIcon,
        secureTextEntry,
        onChangeText,
        keyboardType
    } = props;
    const [showPassword, setShowPassword] = useState(secureTextEntry);
    return (
        <View style={[styles.vInput, { ...containerInput }]}>
            <Image
                source={leftIcon ? leftIcon : images.ic_input_user}
                style={{
                    height: Mixins.scale(24),
                    width: Mixins.scale(24),
                    marginRight: Mixins.scale(8)
                }}
            />
            <TextInput
                keyboardType={keyboardType ? keyboardType : 'default'}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={styles.input}
                secureTextEntry={showPassword}
                placeholderTextColor={'#9E9E9E'}
            />
            {secureTextEntry && (
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}>
                    <Image
                        source={
                            showPassword
                                ? images.ic_hide_password
                                : images.ic_show_password
                        }
                        style={{
                            height: Mixins.scale(24),
                            width: Mixins.scale(24),
                            marginLeft: Mixins.scale(16),
                            tintColor: '#9E9E9E'
                        }}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    vInput: {
        height: Mixins.scale(56),
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: Mixins.scale(16),
        borderColor: '#E1E1E1',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Mixins.scale(16)
    },
    input: {
        flex: 1,
        height: Mixins.scale(56),
        color: '#3B3B3B'
    }
});
