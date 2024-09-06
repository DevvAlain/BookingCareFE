import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './ProfileDoctor.scss';
import { getProfileDoctorById } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';


class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        };
    };

    async componentDidMount() {
        let data = await this.getInfoDoctor(this.props.doctorId);
        this.setState({
            dataProfile: data
        });
    };

    getInfoDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await getProfileDoctorById(id);
            if (res?.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.doctorId !== prevProps.doctorId) {
            // this.getInfoDoctor(this.props.doctorId);
        }
    };

    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            let date = language === LANGUAGES.VI ?
                moment(new Date(dataTime.date)).format('dddd - DD/MM/YYYY')
                :
                moment(new Date(dataTime.date)).locale('en').format('ddd - MM/DD/YYYY')

            return (
                <>
                    <div>{time} - {date}</div>
                    <div>
                        <FormattedMessage id='patient.booking-modal.priceBooking' />
                    </div>
                </>
            )
        }
        return <></>

    }

    render() {
        let { dataProfile } = this.state;
        let { language, isShowDescriptionDoctor, dataTime } = this.props;
        let nameVi = '', nameEn = '';
        if (dataProfile?.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <div className='profile-doctor-container'>
                <div className='doctor-intro'>
                    <div className='doctor-image' style={{ backgroundImage: `url(${dataProfile?.image || ''})` }} />
                    <div className='doctor-info'>
                        <h2 className='doctor-name'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </h2>
                        <p className='doctor-description'>
                            {
                                isShowDescriptionDoctor === true ?
                                    <>
                                        {dataProfile?.Markdown?.description || 'No description available'}
                                    </>
                                    :
                                    <>
                                        {this.renderTimeBooking(dataTime)}
                                    </>
                            }
                        </p>
                    </div>

                </div>
                <div className='price'>
                    <FormattedMessage id='patient.booking-modal.price' />
                    {
                        dataProfile && dataProfile.Doctor_Info && language === LANGUAGES.VI &&

                        <NumberFormat
                            className='currency'
                            value={dataProfile.Doctor_Info.priceTypeData.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'VND'}
                        />
                    }
                    {
                        dataProfile && dataProfile.Doctor_Info && language === LANGUAGES.EN &&

                        <NumberFormat
                            className='currency'
                            value={dataProfile.Doctor_Info.priceTypeData.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'USD'}
                        />
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

export default connect(mapStateToProps)(ProfileDoctor);
