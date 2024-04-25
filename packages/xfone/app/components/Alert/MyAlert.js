import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { constants } from '@constants';
import { BaseAnimatedView } from '@components';
import { MyText } from '@mwg-kits/components';
import { Mixins } from '@mwg-sdk/styles';

import Modal from 'react-native-modal';

export default class MyAlert extends Component {
    render() {
        const { show, onDismiss } = this.props;

        const { textContainerStyle, actionContainerStyle, isFullScreenAlert } =
            this.props;
        const { showButtonClose, onClosePressed } = this.props;
        const {
            showCancelButton,
            cancelText,
            cancelButtonColor,
            cancelButtonStyle,
            cancelButtonTextSize,
            cancelButtonFontType,
            cancelButtonTextStyle,
            onCancelPressed
        } = this.props;

        const {
            showConfirmButton,
            confirmText,
            confirmButtonColor,
            confirmButtonStyle,
            confirmButtonTextSize,
            confirmButtonFontType,
            confirmButtonTextStyle,
            onConfirmPressed
        } = this.props;

        const { title, titleColor } = this.props;

        const cancelButtonData = {
            text: cancelText,
            backgroundColor: cancelButtonColor,
            buttonStyle: cancelButtonStyle,
            buttonTextStyle: cancelButtonTextStyle,
            buttonTextSize: cancelButtonTextSize,
            buttonFontType: cancelButtonFontType,
            onPress: onCancelPressed
        };

        const confirmButtonData = {
            text: confirmText,
            backgroundColor: confirmButtonColor,
            buttonStyle: confirmButtonStyle,
            buttonTextStyle: confirmButtonTextStyle,
            buttonTextSize: confirmButtonTextSize,
            buttonFontType: confirmButtonFontType,
            onPress: onConfirmPressed
        };

        return (
            <Modal isVisible={show} onBackdropPress={onCancelPressed}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        backgroundColor: '#FFFFFF',
                        borderRadius: Mixins.scale(14)
                    }}>
                    {title ? (
                        <MyText
                            addSize={3}
                            typeFont="medium"
                            text={title}
                            style={[
                                {
                                    textAlign: 'center',
                                    marginTop: Mixins.scale(16)
                                },
                                titleColor
                            ]}
                        />
                    ) : null}
                    <View
                        style={[
                            {
                                marginTop: Mixins.scale(2),
                                paddingHorizontal: Mixins.scale(16)
                            },
                            textContainerStyle
                        ]}>
                        {this.props.renderText ? this.props.renderText : null}
                    </View>

                    <View
                        style={[
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: Mixins.verticalScale(16)
                            },
                            actionContainerStyle
                        ]}>
                        {showConfirmButton
                            ? this._renderButton(confirmButtonData)
                            : null}
                        {showCancelButton && this._renderRow()}

                        {showCancelButton &&
                            this._renderButton(cancelButtonData)}
                    </View>
                </View>

                {showButtonClose && (
                    <TouchableOpacity
                        hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
                        activeOpacity={0.8}
                        style={[
                            Mixins.scaleImage(20, 20),
                            {
                                position: 'absolute',
                                right: 0,
                                top: 0
                            }
                        ]}
                        onPress={onClosePressed}>
                        <Image
                            resizeMode="contain"
                            source={{ uri: 'ic_close' }}
                            style={[Mixins.scaleImage(20, 20), {}]}
                        />
                    </TouchableOpacity>
                )}
            </Modal>
        );
    }
    _renderRow = () => {
        return (
            <View
                style={{
                    width: 1,
                    backgroundColor: '#9AA5B1',
                    height: '100%'
                }}></View>
        );
    };

    _renderButton = (data) => {
        const {
            text,
            backgroundColor,
            buttonStyle,
            buttonTextStyle,
            buttonTextSize,
            buttonFontType,
            onPress
        } = data;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopWidth: 0.5,
                    flex: 1,
                    borderColor: '#9AA5B1'
                }}>
                <View style={[styles.button, { backgroundColor }, buttonStyle]}>
                    <MyText
                        addSize={buttonTextSize || 2}
                        typeFont={buttonFontType}
                        style={[styles.buttonText, buttonTextStyle]}
                        text={text}
                    />
                </View>
            </TouchableOpacity>
        );
    };
}

MyAlert.propTypes = {
    show: PropTypes.bool,
    useNativeDriver: PropTypes.bool,
    showCancelButton: PropTypes.bool,
    showConfirmButton: PropTypes.bool,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    cancelButtonColor: PropTypes.string,
    confirmButtonColor: PropTypes.string,
    onCancelPressed: PropTypes.func,
    onConfirmPressed: PropTypes.func,
    onClosePressed: PropTypes.func,
    imageUri: PropTypes.string,
    imageResizeMode: PropTypes.string,
    imageHeight: PropTypes.number,
    imageWidth: PropTypes.number,
    showButtonClose: PropTypes.bool,
    onDismiss: PropTypes.func,
    confirmButtonTextSize: PropTypes.number,
    confirmButtonFontType: PropTypes.string,
    cancelButtonTextSize: PropTypes.number,
    cancelButtonFontType: PropTypes.string
};

MyAlert.defaultProps = {
    show: false,
    showCancelButton: false,
    showConfirmButton: false,
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    cancelButtonColor: 'rgba(208,208,208,1.0)',
    confirmButtonColor: 'rgba(174,222,244,1)',
    imageUri: 'ic_information',
    imageResizeMode: 'contain',
    imageHeight: 46,
    imageWidth: 46,
    showButtonClose: false,
    confirmButtonTextSize: 2,
    cancelButtonTextSize: 2
};

const styles = StyleSheet.create({
    button: {
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: Mixins.scale(43),
        justifyContent: 'center'
    },
    buttonText: {
        color: '#FFFFFF'
    }
});
