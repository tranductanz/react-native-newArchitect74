import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { WrapperContainerBase, MyText } from '@mwg-kits/components';
import { Mixins } from '@mwg-sdk/styles';
import { images } from '@assets';
import Lottie from 'lottie-react-native';
import { Easing } from 'react-native-reanimated';

function ErrorView({
    navigation,
    reloadModule,
    errorInfo,
    customTextError = null,
    isHomeScreen = false
}) {
    const [hasInternet, setHasInternet] = useState(false);
    const [showDetailError, setShowDetailError] = useState(false);

    const [animation] = useState(new Animated.Value(0));
    const animatedStyles = {
        transform: [
            {
                translateX: animation.interpolate({
                    inputRange: [
                        0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
                    ],
                    outputRange: [0, 10, -10, 10, -10, 0, 0, 0, 0, 0, 0]
                })
            }
        ]
    };

    const useCheckNetwork = async () => {
        await NetInfo.refresh().then((state) => {
            if (state.isConnected) {
                setHasInternet(true);
            } else {
                setHasInternet(false);
            }
        });
    };

    useEffect(() => {
        useCheckNetwork();
    }, []);

    const startAnimation = () => {
        try {
            animation.setValue(0);
            Animated.timing(animation, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            }).start(() => {
                animation.setValue(0);
            });
        } catch (error) {
            console.log('ERROR ANIMATION', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <WrapperContainerBase
                componentsLeft={() => {
                    if (isHomeScreen) {
                        return null;
                    }
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}>
                            <Image
                                source={images.ic_blue_back}
                                style={Mixins.scaleImage(32, 32)}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    );
                }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Lottie
                        style={{
                            width: Mixins.scale(296),
                            height: Mixins.scale(296)
                        }}
                        source={images.animation_not_found}
                        autoPlay
                        loop
                    />

                    <MyText
                        style={{
                            marginBottom: Mixins.scale(4),
                            color: '#E12D39'
                        }}
                        addSize={1}
                        typeFont="light"
                        text={'Tải dữ liệu không thành công'}
                    />
                    <Animated.View style={animatedStyles}>
                        <MyText
                            addSize={-1}
                            numberOfLines={2}
                            style={{
                                textAlign: 'center',
                                marginHorizontal: Mixins.scale(40)
                            }}
                            text={
                                customTextError
                                    ? customTextError
                                    : hasInternet
                                    ? 'Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại'
                                    : 'Lỗi kết nối mạng. Vui lòng kiểm tra lại'
                            }
                        />
                    </Animated.View>
                    {__DEV__ && (
                        <TouchableOpacity
                            onPress={() => {
                                setShowDetailError(!showDetailError);
                            }}
                            style={styles.txt_show_error}>
                            <MyText
                                text={showDetailError ? 'Rút gọn' : 'Xem thêm'}
                                style={{
                                    color: 'rgba(53,56,138,1)'
                                }}
                            />
                        </TouchableOpacity>
                    )}
                    {showDetailError && (
                        <MyText
                            text={errorInfo}
                            style={{
                                marginTop: 10,
                                marginHorizontal: Mixins.scale(40),
                                textAlign: 'center'
                            }}
                            addSize={-2}
                            numberOfLines={3}
                        />
                    )}
                    <TouchableOpacity
                        onPress={async () => {
                            await useCheckNetwork();
                            startAnimation();
                            reloadModule();
                        }}
                        style={styles.btn_retry}>
                        <View
                            style={{
                                flexDirection: 'row'
                            }}>
                            <Image
                                style={{
                                    height: Mixins.scale(20),
                                    width: Mixins.scale(16),
                                    marginRight: Mixins.scale(14)
                                }}
                                source={images.ic_retryic}
                            />
                            <MyText
                                typeFont="medium"
                                addSize={2}
                                style={{
                                    color: '#0967D2'
                                }}
                                text={'Thử lại'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </WrapperContainerBase>
        </View>
    );
}

export default ErrorView;

const styles = StyleSheet.create({
    btn_retry: {
        alignItems: 'center',
        borderColor: '#0967D2',
        borderRadius: 12,
        borderWidth: 1,
        height: Mixins.scale(56),
        justifyContent: 'center',
        marginTop: Mixins.scale(32),
        // width: Mixins.scale(140),
        paddingHorizontal: Mixins.scale(20)
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    }
});
