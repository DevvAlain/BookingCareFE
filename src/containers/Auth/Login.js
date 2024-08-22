import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";


import './Login.scss';
import { FormattedMessage } from 'react-intl';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { handleLoginApi } from '../../services/userService';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { //cac bien muon co trong state
            username: '',
            password: '',
            errMsg: '',
        }
    }

    handleOnChangeUsername = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    handleOnChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    handleLogin = async () => {
        this.setState({
            errMsg: ''
        })
        try {
           let data = await handleLoginApi(this.state.username, this.state.password);
           if (data && data.errCode !==0) {
                this.setState({
                    errMsg: data.message
                })
           } 
           if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
                console.log('loging success');
                this.props.history.push('/');
           }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMsg: e.response.data.message
                    });
                };
            };
            console.error(e.response ? e.response.data : e.message); // Log error response data
        }
    }




    render() {
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Username: </label>
                            <input type='text'
                                className='form-control'
                                placeholder='Enter your username'
                                onChange={(e) => this.handleOnChangeUsername(e)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password:</label>
                            <input type='password'
                                className='form-control'
                                placeholder='Enter your password'
                                onChange={(e) => { this.handleOnChangePassword(e) }}
                            />
                        </div>
                        <div>
                            <button className='btn-login' onClick={(e) => { this.handleLogin(e) }}>Login</button>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMsg}
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot your password</span>
                        </div>
                        <div className='col-12 text-center mt-3'>
                            <span className='text-other-login'>Or Login with:</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fa-brands fa-google-plus-g google"></i>
                            <i className="fa-brands fa-facebook facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
