import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu'
import {showModal} from "../../modal/actions";
import {getDefaultModel, getDefaultModelErrorMessage, getDefaultModelIsFetching} from "../selectors";
import {fetchModel, saveModel} from "./actions";
import ImageForm from '../../image';
import {FormattedMessage} from 'react-intl';
import properties from "../../../../../config/default.json";

import TitleComponent from "../../titleComponent";
import { PROFILE_NAME } from "./constants";
import { SHOW } from "./constants";

class ProfileImage extends Component {

    render() {

        const {model = {}, isFetching, errorMessage, fetchModel, saveModel} = this.props;

        const {components} = properties.cpanel.profile.forms.image;

        return (

            <div className="row">
                <div className="col-md-2">
                    <LateralMenu/>
                </div>
                <div className="col-md-10">

                    <TitleComponent title={model.stagename} type={PROFILE_NAME} link={"/"+model.slug} show={SHOW} />

                    <ImageForm
                        model={model}
                        isFetching={isFetching}
                        errorMessage={errorMessage}
                        fetchModel={fetchModel}
                        saveModel={saveModel}
                        properties={components}
                        multiple={false}
                    />

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    model: getDefaultModel(state),
    isFetching: getDefaultModelIsFetching(state),
    errorMessage: getDefaultModelErrorMessage(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    showModal,
}, dispatch);

ProfileImage = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileImage);

export default ProfileImage;
