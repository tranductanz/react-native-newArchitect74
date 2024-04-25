import React, { Component, ErrorInfo } from 'react';
import { ErrorView } from '@components';
type Props = {
    children: React.ReactNode;
    name: string;
    lostConnection: boolean;
    reloadModule: () => {};
    navigation: () => {};
};

type State = {
    hasError: boolean;
    errorInfo: string | null;
    showDetailError: boolean;
};

class MyErrorBoundary extends Component<Props, State> {
    name: string;
    constructor(props: Props) {
        super(props);
        this.name = props.name;
        this.state = {
            hasError: false,
            errorInfo: null,
            showDetailError: false
        };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        try {
            const err = JSON.stringify(errorInfo);
            this.setState({
                errorInfo: err
            });
        } catch (error: any) {
            this.setState({
                errorInfo: `Đã xảy ra lỗi trong quá trình chạy ứng dụng ${error.message}`
            });
        }
    }

    showDetailError = () => {
        this.setState({
            showDetailError: true
        });
    };

    reloadModule = () => {
        this.setState({
            hasError: false,
            showDetailError: false
        });
        this.props.reloadModule();
    };

    render() {
        const { hasError } = this.state;
        if (hasError) {
            return (
                <ErrorView
                    errorInfo={this.state.errorInfo}
                    reloadModule={this.reloadModule}
                    navigation={this.props.navigation}
                />
            );
        }
        return this.props.children;
    }
}

export default MyErrorBoundary;
