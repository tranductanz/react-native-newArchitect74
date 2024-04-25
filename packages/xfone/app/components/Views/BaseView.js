import React, { PureComponent } from 'react';
import { Platform, StatusBar } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import PropTypes from 'prop-types';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export default class BaseView extends PureComponent {
    render() {
        const { style, containerStyle, forceInset } = this.props;
        return (
            <SafeAreaView
                {...this.props}
                forceInset={forceInset}
                style={[style, containerStyle]}>
                {this.props.children}
            </SafeAreaView>
        );
    }
}

BaseView.defaultProps = {
    style: {
        flex: 1,
        height: '100%',
        width: '100%',
        paddingTop: STATUSBAR_HEIGHT
    }
};
