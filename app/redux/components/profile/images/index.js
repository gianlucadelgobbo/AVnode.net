import {h, Component} from 'preact';
import {connect} from 'preact-redux';
import {bindActionCreators} from "redux";
import ProfileLateralMenu from '../lateralMenu'
import Form from './form'
import {showModal} from "../../modal/actions";
import Loading from '../../loading'
import {getDefaultModel} from "../selectors";
import {fetchModel, saveModel} from "./actions";

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfileImage extends Component {

    componentDidMount() {
        const {fetchModel} = this.props;
        fetchModel();
    }

    // Convert form values to API model
    createUserModel(values) {

        //clone obj
        let model = Object.assign({}, values);

        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {user} = this.props;

        if (!user) {
            return {};
        }

        let v = {};

        return v;
    }

    onSubmit(values) {
        const {showModal, editUser, user} = this.props;
        const model = this.createUserModel(values);

        // Add auth user _id
        model._id = user._id;

        console.log("model", model)

        return;

        //dispatch the action to save the model here
        return editUser(model)
            .then(() => {
                showModal({
                    type: "SAVED"
                });
            });
    }

    render() {

        const {model, showModal} = this.props;

        if (!model) {
            return <Loading/>
        }

        return (
            <div className="row">
                <div className="col-md-2">
                    <ProfileLateralMenu/>
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">MY IMAGE</h1>

                    <br/>
                    <Form
                        initialValues={this.getInitialValues(this)}
                        onSubmit={this.onSubmit.bind(this)}
                        user={model}
                        showModal={showModal}
                    />
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    model: getDefaultModel(state)
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
