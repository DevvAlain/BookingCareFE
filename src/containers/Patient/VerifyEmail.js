import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { postVerifyBookAppointment } from '../../services/userService';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmail.scss';

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0,
            doctorName: '',
            appointmentTime: '',
        };
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            let res = await postVerifyBookAppointment({
                token: token,
                doctorId: doctorId
            });
            if (res?.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode,
                    doctorName: res.doctorName,
                    appointmentTime: res.appointmentTime
                });
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode || -1
                });
            }
        }
    }

    render() {
        let { statusVerify, errCode, doctorName, appointmentTime } = this.state;

        return (
            <>
                <HomeHeader />
                <div className="verify-email-container">
                    {statusVerify === false ? (
                        <div className="loading">
                            <i className="fas fa-spinner fa-spin"></i> Loading data...
                        </div>
                    ) : (
                        <div className="result">
                            {errCode === 0 ? (
                                <div className="success">
                                    <h1>Appointment Confirmed</h1>
                                    <p>Your appointment with Dr. {doctorName} is confirmed.</p>
                                    <p>Time: {appointmentTime}</p>
                                    <div className="actions">
                                        <button className="btn-primary">View Appointment</button>
                                        <button className="btn-secondary">Go to Homepage</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="error">
                                    <h1>Appointment Not Found</h1>
                                    <p>We couldn't verify your appointment. Please contact support for further assistance.</p>
                                    <div className="actions">
                                        <button className="btn-secondary">Go to Homepage</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
