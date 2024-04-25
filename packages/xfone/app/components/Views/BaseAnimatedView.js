import React, { Component } from 'react';
import {
    View,
    TouchableWithoutFeedback,
    BackAndroid,
    BackHandler,
    StyleSheet,
    Animated,
    Keyboard
} from 'react-native';
import PropTypes from 'prop-types';
import { helper } from '@common';
import { Colors } from '@styles';
import { constants } from '@constants';

const HwBackHandler = BackHandler || BackAndroid;
const HW_BACK_EVENT = 'hardwareBackPress';

export default class BaseAnimatedView extends Component {
    constructor(props) {
        super(props);
        const { show, autoHide } = this.props;
        this.springValue = new Animated.Value(0.3);

        this.state = {
            showSelf: false
        };

        if (show) {
            Keyboard.dismiss();
            setTimeout(() => {
                this._springShow(true);
                if (autoHide) {
                    setTimeout(() => {
                        this._springHide();
                    }, 1500);
                }
            }, 200);
        }
    }

    componentDidMount() {
        HwBackHandler.addEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
    }

    _springShow = (fromConstructor) => {
        const { useNativeDriver = true } = this.props;

        this._toggleAlert(fromConstructor);
        Animated.spring(this.springValue, {
            toValue: 1,
            bounciness: 10,
            useNativeDriver
        }).start();
    };

    _springHide = () => {
        const { useNativeDriver = false } = this.props;

        if (this.state.showSelf === true) {
            Animated.spring(this.springValue, {
                toValue: 0,
                tension: 10,
                useNativeDriver
            }).start();

            setTimeout(() => {
                this._toggleAlert();
                this._onDismiss();
            }, 70);
        }
    };

    _toggleAlert = (fromConstructor) => {
        const { callBackActionFinish } = this.props;
        if (fromConstructor) {
            this.setState({ showSelf: true }, () => {
                if (helper.IsValidateObject(callBackActionFinish)) {
                    callBackActionFinish();
                }
            });
        } else {
            this.setState(
                (preState) => ({
                    showSelf: !preState.showSelf
                }),
                () => {
                    if (helper.IsValidateObject(callBackActionFinish)) {
                        callBackActionFinish();
                    }
                }
            );
        }
    };

    _handleHwBackEvent = () => {
        return true;
    };

    _onTapOutside = () => {
        const { closeOnTouchOutside } = this.props;
        if (closeOnTouchOutside) {
            this._springHide();
        }
    };

    _onDismiss = () => {
        const { onDismiss } = this.props;
        onDismiss && onDismiss();
    };

    _renderBaseView = () => {
        const animation = { transform: [{ scale: this.springValue }] };
        const {
            alertContainerStyle,
            overlayStyle,
            contentContainerStyle,
            contentStyle,
            children
        } = this.props;
        const { isFullScreenAlert } = this.props;

        return (
            <View style={[styles.container, alertContainerStyle]}>
                <TouchableWithoutFeedback onPress={this._onTapOutside}>
                    <View style={[styles.overlay, overlayStyle]} />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        !isFullScreenAlert
                            ? styles.contentContainer
                            : styles.contentContainerFullScreen,
                        animation,
                        contentContainerStyle
                    ]}>
                    <View style={[styles.content, contentStyle]}>
                        {children}
                    </View>
                </Animated.View>
            </View>
        );
    };

    render() {
        const { showSelf } = this.state;

        if (showSelf) {
            return this._renderBaseView();
        }

        return null;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { show, autoHide } = nextProps;
        const { showSelf } = this.state;

        if (show && !showSelf) {
            this._springShow();
            if (autoHide) {
                setTimeout(() => {
                    this._springHide();
                }, 3000);
            }
        } else if (show === false && showSelf) {
            this._springHide();
        }
    }

    componentWillUnmount() {
        HwBackHandler.removeEventListener(
            HW_BACK_EVENT,
            this._handleHwBackEvent
        );
    }
}

BaseAnimatedView.propTypes = {
    show: PropTypes.bool,
    useNativeDriver: PropTypes.bool,
    showProgress: PropTypes.bool,
    autoHide: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    closeOnTouchOutside: PropTypes.bool,
    closeOnHardwareBackPress: PropTypes.bool,
    showCancelButton: PropTypes.bool,
    showConfirmButton: PropTypes.bool,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    cancelButtonColor: PropTypes.string,
    confirmButtonColor: PropTypes.string,
    onCancelPressed: PropTypes.func,
    onConfirmPressed: PropTypes.func,
    customView: PropTypes.object
};

BaseAnimatedView.defaultProps = {
    show: false,
    useNativeDriver: false,
    showProgress: false,
    autoHide: false,
    closeOnTouchOutside: false,
    closeOnHardwareBackPress: true,
    showCancelButton: false,
    showConfirmButton: false,
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    cancelButtonColor: Colors.LIGHT_GREY_208,
    confirmButtonColor: '#AEDEF4',
    customView: null
};
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        backgroundColor: Colors.BLACK_05
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center'
        // padding: 10
    },
    contentContainer: {
        backgroundColor: Colors.WHITE,
        borderRadius: 5,
        maxWidth: '80%'
    },
    contentContainerFullScreen: {},
    overlay: {
        backgroundColor: Colors.NIGHT_RIDER525,
        height: constants.height,
        position: 'absolute',
        width: constants.width
    }
});
