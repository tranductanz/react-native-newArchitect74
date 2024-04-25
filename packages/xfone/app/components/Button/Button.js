import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableNativeFeedback,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { Colors } from '@styles';
import { MyText } from '@mwg-kits/components';

export default class Button extends Component {
    static isAndroid = Platform.OS === 'android';

    shouldComponentUpdate(nextProps) {
        if (!isEqual(nextProps, this.props)) {
            return true;
        }
        return false;
    }

    _renderChildren() {
        const childElements = [];
        React.Children.forEach(this.props.children, (item) => {
            if (typeof item === 'string' || typeof item === 'number') {
                const element = (
                    <MyText
                        typeFont={
                            this.props.textTypeFont
                                ? this.props.textTypeFont
                                : 'medium'
                        }
                        addSize={
                            this.props.textAddSize ? this.props.textAddSize : 4
                        }
                        style={[styles.textButton, this.props.textStyle]}
                        allowFontScaling={this.props.allowFontScaling}
                        key={item}
                        text={item}
                    />
                );
                childElements.push(element);
            } else if (React.isValidElement(item)) {
                childElements.push(item);
            }
        });
        return childElements;
    }

    _renderInnerText() {
        if (this.props.isLoading) {
            return (
                <ActivityIndicator
                    animating
                    size="small"
                    style={styles.spinner}
                    color={this.props.activityIndicatorColor || Colors.BLACK}
                />
            );
        }
        return this._renderChildren();
    }

    render() {
        let touchableProps = {
            testID: this.props.testID,
            accessibilityLabel: this.props.accessibilityLabel,
            onPress: this.props.onPress,
            onPressIn: this.props.onPressIn,
            onPressOut: this.props.onPressOut,
            onLongPress: this.props.onLongPress,
            activeOpacity: this.props.activeOpacity,
            delayLongPress: this.props.delayLongPress,
            delayPressIn: this.props.delayPressIn,
            delayPressOut: this.props.delayPressOut
        };

        if (this.props.isDisabled === true || this.props.isLoading === true) {
            return (
                <View
                    style={[
                        styles.button,
                        this.props.style,
                        this.props.disabledStyle || styles.opacity
                    ]}>
                    {this._renderInnerText()}
                </View>
            );
        }
        if (Button.isAndroid) {
            const ripple = TouchableNativeFeedback.Ripple(
                this.props.background
                    ? this.props.background
                    : TouchableNativeFeedback.SelectableBackground(),
                false
            );

            touchableProps = Object.assign(touchableProps, {
                background: ripple
            });

            return (
                <View style={[styles.button, this.props.style]}>
                    <TouchableNativeFeedback {...touchableProps}>
                        <View
                            style={{
                                height: '100%',
                                width: '100%',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}>
                            {this._renderInnerText()}
                        </View>
                    </TouchableNativeFeedback>
                </View>
            );
        } else {
            return (
                <View style={[styles.button, this.props.style]}>
                    <TouchableOpacity
                        {...touchableProps}
                        style={{
                            height: '100%',
                            width: '100%',
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }}>
                        {this._renderInnerText()}
                    </TouchableOpacity>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: 30,
        flexDirection: 'row',
        height: 59,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    opacity: {
        opacity: 0.5
    },
    spinner: {
        alignSelf: 'center'
    },
    textButton: {
        backgroundColor: Colors.TRANSAPARENT,
        color: Colors.LUCKY_POINT,
        textAlign: 'center'
    }
});
