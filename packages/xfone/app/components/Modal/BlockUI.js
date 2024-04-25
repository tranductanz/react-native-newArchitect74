import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import { MyText } from '@mwg-kits/components';
import { Mixins } from '@mwg-sdk/styles';
import { helper } from '@common';

import { BaseAnimatedView } from '@components';
import { images } from '@assets';

export default class BlockUI extends Component {
    render() {
        const { show, textLoading, callBackActionFinish } = this.props;

        return (
            <BaseAnimatedView
                show={show}
                overlayStyle={{
                    backgroundColor: 'rgba(0,0,0,0.65)'
                }}
                contentContainerStyle={{
                    borderRadius: 10,
                    maxWidth: '100%',
                    padding: Mixins.scale(15)
                }}
                callBackActionFinish={callBackActionFinish}
                closeOnHardwareBackPress>
                <LottieView
                    autoPlay
                    source={images.animation_loading}
                    style={{
                        height: 66,
                        width: 24
                    }}
                />
                {helper.IsValidateObject(textLoading) &&
                    textLoading.length > 0 && (
                        <MyText
                            text={textLoading}
                            style={styles.msgLoadingStyle}
                            addSize={2}
                        />
                    )}
            </BaseAnimatedView>
        );
    }
}

BlockUI.propTypes = {
    show: PropTypes.bool,
    useNativeDriver: PropTypes.bool,
    showProgress: PropTypes.bool,
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

BlockUI.defaultProps = {
    show: false,
    useNativeDriver: false,
    showProgress: false,
    closeOnTouchOutside: false,
    closeOnHardwareBackPress: true,
    showCancelButton: false,
    showConfirmButton: false,
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    cancelButtonColor: 'rgba(208,208,208,1.0)',
    confirmButtonColor: '#AEDEF4',
    customView: null
};
const styles = StyleSheet.create({
    msgLoadingStyle: {
        paddingTop: 5,
        textAlign: 'center'
    }
});
