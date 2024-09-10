import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from '../../../store/actions';


import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { getDetailInfoDoctor } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //save to Markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: '',
            hasOldData: false,

            //save to doctor_info table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',

            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',
        };
    };

    componentDidMount() {
        this.props.fetchAllDoctor();
        this.props.getRequireDoctorInfo();
    };

    buildDataInputSelect = (data, type) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            if (type === 'USERS') {
                data.map((doctor, index) => {
                    let object = {};
                    let labelVi = `${doctor.lastName} ${doctor.firstName}`;
                    let labelEn = `${doctor.firstName} ${doctor.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = doctor.id;
                    result.push(object);
                })
            }
            if (type === 'PRICE') {
                data.map((doctor, index) => {
                    let object = {};
                    let labelVi = `${doctor.valueVi}`;
                    let labelEn = `${doctor.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = doctor.keyMap;
                    result.push(object);
                })
            }
            if (type === "PAYMENT" || type === 'PROVINCE') {
                data.map((doctor, index) => {
                    let object = {};
                    let labelVi = `${doctor.valueVi}`;
                    let labelEn = `${doctor.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = doctor.keyMap;
                    result.push(object);
                })
            }
            if (type === 'SPECIALTY') {
                data.map((doctor, index) => {
                    let object = {};
                    object.label = doctor.name;
                    object.value = doctor.id;
                    result.push(object);
                })
            }
        }
        return result;
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect
            });
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfo;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            });
        }
        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resPayment, resPrice, resProvince, resSpecialty } = this.props.allRequiredDoctorInfo;

            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty
            })
        }
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
    };

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpecialty.value,

        })
    };

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPayment, listPrice, listProvince, listSpecialty } = this.state;
        let res = await getDetailInfoDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let addressClinic = '', nameClinic = '', note = '',
                paymentId = '', priceId = '', provinceId = '', specialtyId = '',
                selectedPayment = '', selectedPrice = '', selectedProvince = '',
                selectedSpecialty = ''
                ;

            if (res.data.Doctor_Info) {
                addressClinic = res.data.Doctor_Info.addressClinic;
                nameClinic = res.data.Doctor_Info.nameClinic;
                note = res.data.Doctor_Info.note;
                paymentId = res.data.Doctor_Info.paymentId;
                priceId = res.data.Doctor_Info.priceId;
                provinceId = res.data.Doctor_Info.provinceId;
                specialtyId = res.data.Doctor_Info.specialtyId;

                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectedProvince = listProvince.find(item => {
                    return item && item.value === provinceId
                })
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })


            }
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPayment: selectedPayment,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
            });
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPayment: '',
                selectedPrice: '',
                selectedProvince: '',
                selectedSpecialty: '',
            });
        }
    };


    handleChangeSelectDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        });
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        });
    };
    render() {
        let { hasOldData, listSpecialty } = this.state;
        return (
            <div className='doctor-management'>
                <header className='header'>
                    <h1><FormattedMessage id='admin.manage-doctor.title' /></h1>
                </header>
                <section className='doctor-selection'>
                    <div className='form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.select-doctor' /></label>
                        <Select
                            value={this.state.selectedOption}
                            options={this.state.listDoctors}
                            onChange={this.handleChangeSelect}
                            className='doctor-select'
                            placeholder={<FormattedMessage id='admin.manage-doctor.select-doctor' />}
                        />
                    </div>
                    <div className='form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.intro' /></label>
                        <textarea
                            className='intro-textarea'
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        />
                    </div>
                </section>
                <div className='more-info-extra row'>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id='admin.manage-doctor.price' /></label>
                        <Select
                            value={this.state.selectedPrice}
                            options={this.state.listPrice}
                            onChange={this.handleChangeSelectDoctorInfo}
                            className='doctor-select'
                            placeholder={<FormattedMessage id='admin.manage-doctor.price' />}
                            name="selectedPrice"
                        />
                    </div>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id='admin.manage-doctor.payment' /></label>
                        <Select
                            value={this.state.selectedPayment}
                            options={this.state.listPayment}
                            onChange={this.handleChangeSelectDoctorInfo}
                            className='doctor-select'
                            placeholder={<FormattedMessage id='admin.manage-doctor.payment' />}
                            name="selectedPayment"
                        />
                    </div>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id='admin.manage-doctor.province' /></label>
                        <Select
                            value={this.state.selectedProvince}
                            options={this.state.listProvince}
                            onChange={this.handleChangeSelectDoctorInfo}
                            className='doctor-select'
                            placeholder={<FormattedMessage id='admin.manage-doctor.province' />}
                            name="selectedProvince"
                        />
                    </div>

                    <div className='col-4 form group'>
                        <label><FormattedMessage id='admin.manage-doctor.name-clinic' /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id='admin.manage-doctor.address-clinic' /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                            value={this.state.addressClinic}
                        />
                    </div>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id='admin.manage-doctor.note' /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.specialty' /></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            options={this.state.listSpecialty}
                            onChange={this.handleChangeSelectDoctorInfo}
                            className='doctor-select'
                            placeholder={<FormattedMessage id='admin.manage-doctor.specialty' />}
                            name="selectedSpecialty"
                        />
                    </div>

                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.select-clinic' /></label>
                        <Select
                            value={this.state.selectedClinic}
                            options={this.state.listClinic}
                            onChange={this.handleChangeSelectDoctorInfo}
                            className='doctor-select'
                            placeholder={<FormattedMessage id='admin.manage-doctor.select-clinic' />}
                            name="selectedClinic"
                        />
                    </div>
                </div>
                <section className='editor-section'>
                    <MdEditor
                        style={{ height: '400px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </section>
                <footer className='footer'>
                    <button
                        className={hasOldData === true ? 'save-button' : 'create-content-doctor'}
                        onClick={() => this.handleSaveContentMarkdown()}
                    >
                        {
                            hasOldData === true ?
                                <span>
                                    <FormattedMessage id='admin.manage-doctor.save' />
                                </span>
                                :
                                <span>
                                    <FormattedMessage id='admin.manage-doctor.create' />
                                </span>
                        }
                    </button>
                </footer>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        getRequireDoctorInfo: () => dispatch(actions.getRequireDoctorInfo()),
        saveDoctor: (data) => dispatch(actions.saveDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
