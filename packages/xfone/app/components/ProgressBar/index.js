import { AppState, Image, TouchableOpacity, View } from 'react-native';
import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { Colors, scale } from '@styles';
import { WrapperContainerBase, MyText } from '@mwg-kits/components';
import { images } from '@assets';
import LottieView from 'lottie-react-native';
import { Mixins } from '@mwg-sdk/styles';
import * as Progress from 'react-native-progress';
import { helper } from '@common';

export default class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // progress: 0,
            appState: AppState.currentState
        };
    }
    render() {
        const { navigation, isError, progress } = this.props;
        if (isError) {
            navigation.goBack();
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'LOGIN_SCREEN' }]
                })
            );
        }
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.CFFFFFF
                }}>
                <WrapperContainerBase
                    componentsLeft={() => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack();
                                }}>
                                <Image
                                    source={images.ic_blue_back}
                                    style={Mixins.scaleImage(20, 20)}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        );
                    }}
                    colorTitle>
                    <View
                        style={{
                            flex: 1,
                            marginTop: scale(50)
                        }}>
                        <View
                            style={{
                                flex: 3,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <LottieView
                                    autoPlay
                                    source={images.animation_loading}
                                    style={{
                                        height: 66,
                                        width: 24
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: scale(15)
                            }}>
                            {/* <MyText
                                text={`${translate('xwork.please_wait')}...`}
                            /> */}
                            <Progress.Bar
                                progress={progress}
                                width={helper.width / 2}
                                color={'#2DCCA7'}
                                useNativeDriver
                            />
                        </View>
                    </View>
                </WrapperContainerBase>
            </View>
        );
    }
}
