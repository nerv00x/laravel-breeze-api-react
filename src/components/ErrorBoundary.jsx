import { Component } from 'react';
import Generic from './errors/Generic';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (<Generic message="Something went wrong. Please try again later."/>);
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
