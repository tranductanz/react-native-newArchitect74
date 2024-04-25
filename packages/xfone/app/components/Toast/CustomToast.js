import { View, StyleSheet, Image } from 'react-native';
import { BaseToast } from 'react-native-toast-message';
import { Mixins } from '@mwg-sdk/styles';
export const CustomToast = {
    success: (props) => {
        return props.isVisible ? (
            <View style={style.toastSuccess}>
                <Image
                    source={{ uri: 'ic_success' }}
                    style={Mixins.scaleImage(20, 20)}
                    resizeMode="contain"
                />
                <BaseToast
                    {...props}
                    style={style.baseToastSuccess}
                    contentContainerStyle={{
                        paddingLeft: Mixins.scale(6)
                    }}
                    text1Style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#FFFFFF'
                    }}
                    text2Style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: '#FFFFFF'
                    }}
                    text2NumberOfLines={2}
                />
            </View>
        ) : null;
    },
    error: (props) => {
        return props.isVisible ? (
            <View style={style.toastSuccess}>
                <Image
                    source={{ uri: 'ic_check_error' }}
                    style={Mixins.scaleImage(20, 20)}
                    resizeMode="contain"
                />
                <BaseToast
                    {...props}
                    style={style.baseToastSuccess}
                    contentContainerStyle={{
                        paddingLeft: Mixins.scale(6)
                    }}
                    text1Style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#FFFFFF'
                    }}
                    text2Style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: '#FFFFFF'
                    }}
                    text2NumberOfLines={2}
                />
            </View>
        ) : null;
    },
    warning: (props) => {
        return props.isVisible ? (
            <View style={style.toastSuccess}>
                <Image
                    source={{ uri: 'ic_check_warning' }}
                    style={Mixins.scaleImage(20, 20)}
                    resizeMode="contain"
                />
                <BaseToast
                    {...props}
                    text1NumberOfLines={3}
                    style={style.baseToastSuccess}
                    contentContainerStyle={{
                        paddingLeft: Mixins.scale(6)
                    }}
                    text1Style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#FFFFFF'
                    }}
                />
            </View>
        ) : null;
    }
};

const style = StyleSheet.create({
    baseToastSuccess: {
        backgroundColor: '#9D9D9D',
        borderLeftWidth: 0,
        elevation: 3,
        flex: 1,
        height: Mixins.scale(42),
        shadowColor: 'rgba(0,0,0,0)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0,
        shadowRadius: 0
    },
    toastSuccess: {
        alignItems: 'center',
        backgroundColor: '#9D9D9D',
        borderColor: '#9AA5B1',
        borderRadius: Mixins.scale(12),
        borderWidth: 1,
        flexDirection: 'row',
        marginHorizontal: Mixins.scale(16),
        paddingHorizontal: Mixins.scale(12),
        paddingVertical: Mixins.scale(4)
    }
});
