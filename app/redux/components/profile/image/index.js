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
import { PROFILE_NAME, SHOW } from "./constants";

class ProfileImage extends Component {

    render() {

        const {model = {}, isFetching, errorMessage, fetchModel, saveModel} = this.props;

        const {components} = properties.cpanel.profile.forms.image;

        return (

            <div>

                <TitleComponent title={model.stagename} link={"/"+model.slug} show={SHOW} />
                <LateralMenu />
                <hr />
                <h3 className="labelField mb-3">{PROFILE_NAME}</h3>

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
