import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { Animated, Dimensions, Platform } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
    Platform.OS === 'ios'
        ? Dimensions.get('window').height
        : require('react-native-extra-dimensions-android').get(
              'REAL_WINDOW_HEIGHT'
          ) +
          require('react-native-extra-dimensions-android').get(
              'STATUS_BAR_HEIGHT'
          ) +
          require('react-native-extra-dimensions-android').get(
              'SOFT_MENU_BAR_HEIGHT'
          );

class BaseModal extends Component {
    render() {
        return (
            <Animated.View>
                <Modal
                    {...this.props}
                    useNativeDriver={true}
                    useNativeDriverForBackdrop={true}
                    onBackdropPress={this.props.onBackdropPress}
                    backdropOpacity={this.props.backdropOpacity || 0.8}
                    animationIn={this.props.animationIn}
                    animationOut={this.props.animationOut}
                    deviceWidth={deviceWidth}
                    deviceHeight={deviceHeight}
                    statusBarTranslucent
                    supportedOrientations={['portrait']}
                    style={[{ margin: 0 }, this.props.style]}
                    propagateSwipe // Enable propagateSwipe to allow your child components to receive swipe events
                    onRequestClose={this.props.onBackButtonPress}>
                    {this.props.children}
                </Modal>
            </Animated.View>
        );
    }
}

export default BaseModal;
