import axios from '../axios'

const handleLoginApi = (email, password) => {
    return axios.post('api/login', { email, password });
};

const getAllUsers = (inputId) => {
    //template string
    return axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data);
};

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
};

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
};

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
};

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctor`);
};

const saveDetailDoctor = (data) => {
    return axios.post('/api/save-infor-doctors', data);
};

const getDetailInfoDoctor = (id) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
};

const createScheduleDoctor = (data) => {
    return axios.post('/api/create-schedule', data);
};

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
};

const getExtraInfoDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`);
};

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

const createPatientBookingAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data);
};

const postVerifyBookAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data);
};

const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data);
};

const getAllSpecialty = () => {
    return axios.get(`/api//get-all-specialty`);
};

const getDetailSpecialtyById = (data) => {
    return axios.get(`/api//get-detail-specialty-by-id?id=${data.id}&location=${data.location}`);
};
export {
    handleLoginApi, getAllUsers, createNewUserService,
    deleteUserService, editUserService, getAllCodeService,
    getTopDoctorHomeService, getAllDoctors, saveDetailDoctor,
    getDetailInfoDoctor, createScheduleDoctor, getScheduleDoctorByDate,
    getExtraInfoDoctorById, getProfileDoctorById, createPatientBookingAppointment,
    postVerifyBookAppointment, createNewSpecialty, getAllSpecialty,
    getDetailSpecialtyById
};