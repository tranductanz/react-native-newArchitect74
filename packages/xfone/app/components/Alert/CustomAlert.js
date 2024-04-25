import React from 'react';
import PropTypes from 'prop-types';
import { MyAlert } from '@components';

import { constants } from '@constants';
import { helper } from '@common';
import ParsedText from 'react-native-parsed-text';
import { StyleSheet } from 'react-native';
import { Colors } from '@styles';
import { Mixins, Typography } from '@mwg-sdk/styles';

class CustomAlert extends React.Component {
    constructor(props) {
        super(props);
        this.renderText = this.renderText.bind(this);
    }

    render() {
        const { show, onDismiss } = this.props;
        const {
            confirmText,
            onCancelPressed,
            onConfirmPressed,
            confirmButtonStyle,
            confirmButtonTextStyle,
            cancelButtonStyle,
            cancelButtonTextStyle,
            showImage,
            titleColor,
            onFixedPressed
        } = this.props;
        const { cancelText } = this.props;
        const { title } = this.props;

        return (
            <MyAlert
                show={show}
                onDismiss={onDismiss}
                showImage={showImage ? true : false}
                renderText={this.renderText()}
                title={title}
                titleColor={titleColor}
                textContainerStyle={{
                    marginTop: Mixins.verticalScale(4)
                }}
                showConfirmButton={helper.isFunction(
                    onFixedPressed ? onFixedPressed : onConfirmPressed
                )}
                showCancelButton={helper.isFunction(onCancelPressed)}
                confirmButtonStyle={[
                    confirmButtonStyle || {
                        backgroundColor: Colors.WHITE,
                        minWidth: constants.width / 3,
                        maxWidth: constants.width / 2.5
                    }
                ]}
                cancelButtonTextStyle={[
                    cancelButtonTextStyle || {
                        color: Colors.BLUE_FF
                    }
                ]}
                confirmButtonTextStyle={[
                    confirmButtonTextStyle || {
                        color: Colors.BLUE_FF
                    }
                ]}
                cancelButtonStyle={[
                    cancelButtonStyle || {
                        backgroundColor: Colors.WHITE,
                        minWidth: constants.width / 3,
                        maxWidth: constants.width / 2.5
                    }
                ]}
                confirmText={confirmText}
                cancelText={cancelText}
                onConfirmPressed={
                    onFixedPressed ? onFixedPressed : onConfirmPressed
                }
                onCancelPressed={onCancelPressed}
            />
        );
    }
    _renderText(matchingString) {
        let pattern = /@bold:{(.*?)}/i;
        let match = matchingString.match(pattern);
        return `${match[1]}`;
    }

    renderText = () => {
        const { message, messageStyle } = this.props;
        return (
            <ParsedText
                onLayout={this.props.onLayout}
                parse={[
                    {
                        pattern: /@bold:{(.*?)}/i,
                        style: styles.boldStyle,
                        renderText: this._renderText
                    }
                ]}
                includeFontPadding={false}
                numberOfLines={this.props.numberOfLines}
                ellipsizeMode={this.props.ellipsizeMode}
                allowFontScaling={false}
                selectable={this.props.selectable}
                style={StyleSheet.flatten([
                    {
                        color: Colors.BLACK_30,
                        fontSize: 14,
                        typeFont: 'semiBold',
                        lineHeight:
                            14 *
                            (Typography.LINE_HEIGHT_20 /
                                Typography.FONT_SIZE_14)
                    },
                    { color: Colors.BLACK, textAlign: 'center' },
                    messageStyle?.style ?? null
                ])}>
                {message}
            </ParsedText>
        );
    };
}

const styles = StyleSheet.create({
    boldStyle: {
        color: Colors.BLACK,
        fontWeight: 'bold'
    }
});

CustomAlert.propTypes = {
    show: PropTypes.bool,
    onDismiss: PropTypes.func,
    onConfirmPressed: PropTypes.func,
    onCancelPressed: PropTypes.func,
    type: PropTypes.string,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    title: PropTypes.string,
    titleColor: PropTypes.object,
    message: PropTypes.string,
    messageStyle: PropTypes.object
};
CustomAlert.defaultProps = {
    show: false,
    type: 'info',
    title: 'Thông báo',
    message: '',
    cancelText: 'Huỷ',
    confirmText: 'Đồng ý',
    messageStyle: {}
};
export default CustomAlert;
