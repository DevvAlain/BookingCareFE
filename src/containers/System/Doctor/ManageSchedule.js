import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { createScheduleDoctor } from '../../../services/userService';


class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
        };
    };

    componentDidMount() {
        this.props.fetchAllDoctor();
        this.props.fetchAllScheduleTime();
    };

    buildDataInputSelect = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map((doctor, index) => {
                let object = {};
                let labelVi = `${doctor.lastName} ${doctor.firstName}`;
                let labelEn = `${doctor.firstName} ${doctor.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = doctor.id;
                result.push(object);
            })
        }
        return result;
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            });
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            });
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                // data = data.map(time => {
                //     time.isSelected = false; mac dinh cac time se la false
                //     return time;             khi onclick vo thi se chuyen sang true
                // }) code nhu nay cung dc

                data = data.map(time => ({ ...time, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }
    };

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    };

    handleAddTime = (timeClick) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(time => {
                if (time.id === timeClick.id) time.isSelected = !time.isSelected;
                return time;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    };

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if (!currentDate) {
            toast.error('Please select date');
            return;
        }
        if (!selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error('Please select doctor');
            return;
        }
        // let formattedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        // let formattedDate = moment(currentDate).unix();
        let formattedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(time => time.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let object = {};
                    object.doctorId = selectedDoctor.value; // gom value va label
                    object.date = formattedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                })
            } else {
                toast.error('Please select time');
                return;
            }
        }
        let res = await createScheduleDoctor({
            arrSchedule: result,
            date: formattedDate,
            doctorId: selectedDoctor.value,
        })
        if (res && res.errCode === 0) {
            toast.success('Create schedule successfully');
        } else {
            toast.error('Create schedule failed');
        }
    };
    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (
            <div className='manage-schedule-container'>
                <div className='manage-schedule-title'>
                    <FormattedMessage id='manage-schedule.title' />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='manage-schedule.select-doctor' /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                options={this.state.listDoctors}
                                onChange={this.handleChangeSelect}
                                className='doctor-select'
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.select-date' /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {
                                rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((time, index) => {
                                    return (
                                        <button className={time.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                            key={index}
                                            onClick={() => this.handleAddTime(time)}
                                        >
                                            {language === LANGUAGES.VI ? time.valueVi : time.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary btn-save-schedule'
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id='manage-schedule.save' />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        fetchAllScheduleTime: (type) => dispatch(actions.fetchAllScheduleTime(type))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
