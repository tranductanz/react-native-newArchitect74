import React, { Component } from 'react';
// import { Colors } from '../styles';
// import { BlockUI, analytics, Feedback } from '../common';
// import FeedbackScreen from '../container/Feedback';
// import { ModalSynch, CustomAlert, CustomToast } from '@components';

import { BlockUI, CustomAlert, CustomToast } from '@components';
import { Colors } from '@styles';
import Toast from 'react-native-toast-message';
import { Keyboard } from 'react-native';
import { track } from '@mwg-sdk/analytics';

const AppContext = React.createContext({});

export const AppConsumer = AppContext.Consumer;
export class AppProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            textLoading: '',
            contentAlert: {},
            isShowConfirmLogout: false,
            objCustomAlert: {
                show: false,
                title: '',
                message: '',
                type: '',
                showImage: true,
                onConfirmPressed: this.onConfirmPressed,
                onCancelPressed: this.onCancelPressed
            },
            isLoadingAlert: false,
            isTakeScreenshot: false,
            isShowFeedback: false,
            screenshotTimeout: null,
            imagePath: ''
        };
        this.showProgress = this.showProgress.bind(this);
        this.hideProgress = this.hideProgress.bind(this);
        this.actionFinish = null;
        this.onConfirmPressed = null;
        this.onCancelPressed = null;
    }

    // _openModalSynch = (children) => {
    //     return this.ModalSynch.showModal(children);
    // };

    // _hideModalSynch = (response = null) => {
    //     return this.ModalSynch.closeModal(response);
    // };

    hideProgress = (actionFinish = () => {}) => {
        if (this.state.loading) {
            this.setState({ loading: false, textLoading: '' }, () => {
                this.actionFinish = actionFinish;
            });
        }
    };

    analytics = () => {
        return { track };
    };

    showProgress = (textLoading) =>
        this.setState({
            loading: true,
            textLoading: textLoading || this.state.textLoading
        });

    actionFinishProgress = () => {
        if (this.actionFinish) {
            this.actionFinish();
            this.actionFinish = null;
        }
    };

    showAlert = (opts = {}) => {
        Keyboard.dismiss();
        this.setState({
            loading: false,
            textLoading: '',
            isLoadingPopUp: false,
            isLoadingAlert: true,
            objCustomAlert: { ...opts }
        });
    };

    hideAlert = () => {
        if (this.state.isLoadingAlert) {
            this.setState({
                loading: false,
                isLoadingPopUp: false,
                isLoadingAlert: false,
                objCustomAlert: {
                    ...this.state.objCustomAlert,
                    show: false
                }
            });
        }
    };

    render() {
        const {
            loading,
            textLoading,
            objCustomAlert,
            isTakeScreenshot,
            isShowFeedback
        } = this.state;

        const funcs = {
            // openModalSynch: this._openModalSynch,
            // hideModalSynch: this._hideModalSynch,
            showLoader: this.showProgress,
            hideLoader: this.hideProgress,
            alert: this.showAlert,
            hideAlert: this.hideAlert,
            analytics: this.analytics
            // logScreenView: analytics.logScreenView,
            // logEvent: analytics.logEventGA,
            // logCampaign: analytics.logEventCampaign,
        };
        return (
            <AppContext.Provider value={{ ...funcs }}>
                {this.props.children}
                <BlockUI
                    show={loading}
                    progressSize={24}
                    progressColor={Colors.PRIMARY}
                    textLoading={textLoading}
                    callBackActionFinish={this.actionFinishProgress}
                />
                {/* <ModalSynch
                    styleModal={this.props.styleModal}
                    ref={(refs) => (this.ModalSynch = refs)}
                /> */}
                <CustomAlert
                    {...objCustomAlert}
                    showImage={objCustomAlert.showImage}
                    show={objCustomAlert.show}
                    type={objCustomAlert.type}
                    title={objCustomAlert.title}
                    message={objCustomAlert.message}
                    onConfirmPressed={
                        objCustomAlert.onConfirmPressed
                            ? () => {
                                  if (objCustomAlert.show) {
                                      this.setState((preState) => ({
                                          objCustomAlert: {
                                              ...preState.objCustomAlert,
                                              show: false
                                          }
                                      }));
                                  }
                                  return objCustomAlert.onConfirmPressed();
                              }
                            : null
                    }
                    onCancelPressed={
                        objCustomAlert.onCancelPressed
                            ? () => {
                                  if (objCustomAlert.show) {
                                      if (objCustomAlert.show) {
                                          this.setState((preState) => ({
                                              objCustomAlert: {
                                                  ...preState.objCustomAlert,
                                                  show: false
                                              }
                                          }));
                                      }
                                  }
                                  return objCustomAlert.onCancelPressed();
                              }
                            : null
                    }
                    onFixedPressed={
                        objCustomAlert.onFixedPressed
                            ? () => objCustomAlert.onFixedPressed()
                            : null
                    }
                />
                <Toast config={CustomToast} />
            </AppContext.Provider>
        );
    }
}
