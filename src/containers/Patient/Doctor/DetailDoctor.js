import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import { getDetailInfoDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfo from './DoctorExtraInfo';
import Comment from '../SocialPlugin/Comment';
import LikeAndShare from '../SocialPlugin/LikeAndShare';
class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
        };
    }

    async componentDidMount() {
        if (this.props.match?.params?.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id,
            });
            let res = await getDetailInfoDoctor(id);
            if (res?.errCode === 0) {
                this.setState({
                    detailDoctor: res.data,
                });
            }
        }
    }

    render() {
        let { detailDoctor } = this.state;
        let { language } = this.props;
        let nameVi = '', nameEn = '';
        if (detailDoctor?.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        let currentURL = process.env.REACT_APP_IS_LOCALHOST === 1 ?
            "https://eric-restaurant-bot-tv.herokuapp.com/" : window.location.href;
        return (
            <Fragment>
                <HomeHeader isShowBanner={false} />
                <div className='doctor-detail-wrapper'>
                    <div className='doctor-detail-container'>
                        <div className='doctor-intro'>
                            <div className='doctor-image' style={{ backgroundImage: `url(${detailDoctor?.image || ''})` }} />
                            <div className='doctor-info'>
                                <h2 className='doctor-name'>
                                    {language === LANGUAGES.VI ? nameVi : nameEn}
                                </h2>
                                <p className='doctor-description'>
                                    {detailDoctor?.Markdown?.description || 'No description available'}
                                    <div className='like-share-plugin'>
                                        <LikeAndShare
                                            dataHref={currentURL}
                                        />
                                    </div>
                                </p>
                            </div>

                        </div>
                        <div className='doctor-schedule'>
                            <div className='content-left'>
                                <DoctorSchedule
                                    doctorIdFromParent={this.state.currentDoctorId}
                                />
                            </div>
                            <div className='content-right'>
                                <DoctorExtraInfo
                                    doctorIdFromParent={this.state.currentDoctorId}
                                />
                            </div>
                        </div>
                        <div className='doctor-detail-info'>
                            {detailDoctor?.Markdown?.contentHTML &&
                                <div dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }} />
                            }
                        </div>
                        <div className='doctor-comments'>
                            <div class="fb-comments"
                                data-href="https://developers.facebook.com/docs/plugins/comments#configurator"
                                data-width=""
                                data-numposts="5">

                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(DetailDoctor);
