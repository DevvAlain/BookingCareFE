import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfo.scss';

import { LANGUAGES } from '../../../utils';
import { getExtraInfoDoctorById } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfo: false,
            extraInfo: {},
        };
    };

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    };
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    };

    showHideDetailInfo = (status) => {
        this.setState({
            isShowDetailInfo: status
        })
    }
    render() {
        let { isShowDetailInfo } = this.state;
        let { extraInfo } = this.state;
        let { language } = this.props;
        return (
            <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-address'>
                        <FormattedMessage id='patient.extra-info-doctor.text-address' />
                    </div>
                    <div className='name-clinic'>
                        {extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic : ''}
                    </div>
                    <div className='detail-address'>
                        {extraInfo && extraInfo.addressClinic ? extraInfo.addressClinic : ''}
                    </div>
                </div>
                <div className='content-down'>
                    {
                        isShowDetailInfo === false &&
                        <div>
                            <FormattedMessage id='patient.extra-info-doctor.price' />
                            {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.VI &&
                                <NumberFormat
                                    className='currency'
                                    value={extraInfo.priceTypeData.valueVi}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'VND'}
                                />
                            }
                            {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.EN &&
                                <NumberFormat
                                    className='currency'
                                    value={extraInfo.priceTypeData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'USD'}
                                />
                            }
                            <span className='detail' onClick={() => this.showHideDetailInfo(true)}>
                                <FormattedMessage id='patient.extra-info-doctor.detail' />
                            </span>
                        </div>
                    }
                    {
                        isShowDetailInfo === true &&
                        <>
                            <div className='title-price'>
                                <FormattedMessage id='patient.extra-info-doctor.price' />
                            </div>
                            <div className='detail-info'>
                                <div className='price'>
                                    <span className='left'>
                                        <FormattedMessage id='patient.extra-info-doctor.price' />
                                    </span>
                                    <span className='right'>
                                        {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.VI &&
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfo.priceTypeData.valueVi}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'VND'}
                                            />
                                        }
                                        {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.EN &&
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfo.priceTypeData.valueEn}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'USD'}
                                            />
                                        }
                                    </span>
                                </div>
                                <div className='note'>
                                    {extraInfo && extraInfo.note ? extraInfo.note : ''}
                                </div>
                            </div>
                            <div className='payment'>
                                <FormattedMessage id='patient.extra-info-doctor.payment' />
                                {
                                    extraInfo && extraInfo.paymentTypeData && language === LANGUAGES.VI ?
                                        extraInfo.paymentTypeData.valueVi : ''
                                }
                                {
                                    extraInfo && extraInfo.paymentTypeData && language === LANGUAGES.EN ?
                                        extraInfo.paymentTypeData.valueEn : ''
                                }
                            </div>
                            <div>
                                <span className='hide-price' onClick={() => this.showHideDetailInfo(false)}>
                                    <FormattedMessage id='patient.extra-info-doctor.hide-price' />
                                </span>
                            </div>

                        </>
                    }


                </div>

            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(DoctorExtraInfo);
