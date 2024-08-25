import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();

        // call API theo react
        // try {
        //     let res = await getAllCodeService('gender');
        //     if (res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data
        //         });
        //         // TODO: Implement other codeList for other fields, such as country, role, etc.
        //     } else {
        //         console.log(res.errMsg);
        //     }
        // } catch (e) {
        //     console.log(e);
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : ''
            });
        };
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].key : ''
            });
        };
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : ''
            });
        };
    };

    handleOnChangeImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: file
            });
        }
    };

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return
        this.setState({
            isOpen: true
        })
    };

    handleSaveUser = () => {
        if (!this.checkValidateInput()) return;
        //fire redux action
        this.props.createNewUser({
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            address: this.state.address,
            gender: this.state.gender,
            roleId: this.state.roleId,
            positionId: this.state.positionId,
        })
    };

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Please enter fields: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }
    render() {
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;

        let { email, password, firstName, lastName, phoneNumber,
            address, gender, position, role, avatar } = this.state;

        return (
            <div className='user-redux-container'>
                <div className='title text-center mb-4'>
                    <h2>Redux with Dylan</h2>
                </div>
                <div className="user-redux-body p-4 rounded shadow-sm">
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 mb-4 text-center'>
                                <FormattedMessage id="manage-user.add" />
                            </div>

                            {/* Loading Indicator */}
                            <div className='col-12 text-center mb-3'>
                                {isGetGenders && <div className='spinner-border text-primary' role='status'><span className='sr-only'>Loading...</span></div>}
                            </div>

                            {/* Email Input */}
                            <div className='col-md-6 col-lg-4 mb-3'>
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input className='form-control' type='email' placeholder='Enter your email'
                                    value={email}
                                    onChange={(event) => this.onChangeInput(event, 'email')}
                                />
                            </div>

                            {/* Password Input */}
                            <div className='col-md-6 col-lg-4 mb-3'>
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input className='form-control' type='password' placeholder='Enter your password'
                                    value={password}
                                    onChange={(event) => this.onChangeInput(event, 'password')}
                                />
                            </div>

                            {/* First Name Input */}
                            <div className='col-md-6 col-lg-4 mb-3'>
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input className='form-control' type='text' placeholder='First Name'
                                    value={firstName}
                                    onChange={(event) => this.onChangeInput(event, 'firstName')}
                                />
                            </div>

                            {/* Last Name Input */}
                            <div className='col-md-6 col-lg-4 mb-3'>
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input className='form-control' type='text' placeholder='Last Name'
                                    value={lastName}
                                    onChange={(event) => this.onChangeInput(event, 'lastName')}
                                />
                            </div>

                            {/* Phone Number Input */}
                            <div className='col-md-6 col-lg-4 mb-3'>
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input className='form-control' type='text' placeholder='Phone Number'
                                    value={phoneNumber}
                                    onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                                />
                            </div>

                            {/* Address Input */}
                            <div className='col-md-12 col-lg-8 mb-3'>
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input className='form-control' type='text' placeholder='Address'
                                    value={address}
                                    onChange={(event) => this.onChangeInput(event, 'address')}
                                />
                            </div>

                            {/* Gender Dropdown */}
                            <div className='col-md-6 col-lg-4 mb-3'>
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select className='form-control'
                                    onChange={(event) => this.onChangeInput(event, 'gender')}
                                >
                                    {genders?.length > 0 && genders.map((gender, index) => (
                                        <option key={index} value={gender.key}>
                                            {language === LANGUAGES.VI ? gender.valueVi : gender.valueEn}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Position Dropdown */}
                            <div className='col-md-6 col-lg-4 mb-3'>
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select className='form-control'
                                    onChange={(event) => this.onChangeInput(event, 'position')}
                                >
                                    {positions?.length > 0 && positions.map((position, index) => (
                                        <option key={index} value={position.key}>
                                            {language === LANGUAGES.VI ? position.valueVi : position.valueEn}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Role Dropdown */}
                            <div className='col-md-6 col-lg-4 mb-3'>
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select className='form-control'
                                    onChange={(event) => this.onChangeInput(event, 'role')}
                                >
                                    {roles?.length > 0 && roles.map((role, index) => (
                                        <option key={index} value={role.key}>
                                            {language === LANGUAGES.VI ? role.valueVi : role.valueEn}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div className='col-md-6 col-lg-4 mb-3'>
                                <label><FormattedMessage id="manage-user.image" /></label>
                                <div className='preview-img-container'>
                                    <input
                                        id='previewImg'
                                        type='file'
                                        hidden
                                        onChange={this.handleOnChangeImage}
                                    />
                                    <label className='label-upload' htmlFor='previewImg'>
                                        Upload Image <i className="fa-solid fa-upload"></i>
                                    </label>
                                    <div
                                        className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                        onClick={this.openPreviewImage}
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className='col-12 mt-4 text-center'>
                                <button className='btn btn-primary btn-lg px-5'
                                    onClick={() => this.handleSaveUser()}
                                >
                                    <FormattedMessage id="manage-user.save" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lightbox Preview */}
                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>


        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
