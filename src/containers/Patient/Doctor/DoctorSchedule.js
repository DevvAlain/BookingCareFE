import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {}
        };
    };

    async componentDidMount() {
        let language = this.props.language;
        let allDays = this.getArrDays(language);
        this.setState({
            allDays: allDays,
        });
    };


    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                } else {
                    let labeVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = this.capitalizeFirstLetter(labeVi)
                }
            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM')
                }
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }
        return allDays;
    };


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays
            });
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language);
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })
        }
    };
    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;// dung de lay id cua html
            let date = event.target.value;
            try {
                let res = await getScheduleDoctorByDate(doctorId, date);
                if (res && res.errCode === 0) {
                    this.setState({
                        allAvailableTime: res.data ? res.data : []
                    })
                }
            } catch (error) {
                console.error('Error fetching doctor schedule:', error);
            }
        }
    };

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        });
    };

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false,
        });
    };


    render() {
        let { allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {
                                allDays && allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option
                                            key={index}
                                            value={item.value}>
                                            {item.label}
                                        </option>
                                    )
                                })
                            }

                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <i className="fa-solid fa-calendar-days"><span><FormattedMessage id='patient.detail-doctor.schedule' /></span></i>
                        </div>
                        <div className='time-content'>
                            {
                                allAvailableTime && allAvailableTime.length > 0 ?
                                    <>
                                        <div className='time-content-btns'>
                                            {allAvailableTime.map((item, index) => {
                                                let timeDisplay = language === LANGUAGES.VI ?
                                                    item.timeTypeData.valueVi : item.timeTypeData.valueEn;
                                                return (
                                                    <button
                                                        key={index}
                                                        className={language === LANGUAGES.VI ? 'btn-vie' : 'btn-en'}
                                                        onClick={() => this.handleClickScheduleTime(item)}
                                                    >
                                                        {timeDisplay}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <div className='book-free'>
                                            <span>
                                                <FormattedMessage id='patient.detail-doctor.choose' />
                                                <i className="fa-regular fa-hand-point-up"></i>
                                                <FormattedMessage id='patient.detail-doctor.book-free' />
                                            </span>
                                        </div>
                                    </>
                                    :
                                    <div className='notification'>
                                        <FormattedMessage id='patient.detail-doctor.notification' />
                                    </div>
                            }
                        </div>
                    </div>
                </div>

                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    dataTime={dataScheduleTimeModal}
                />
            </>
        )
    }
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(DoctorSchedule);
