import {h, render, Component} from 'preact';
import {Formio} from 'react-formio';

class ProfilePublicForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            aboutsTabs,
            aboutsLabels,
            showModal,
            onSubmit
        } = this.props;

        return (
            <Formio
                src="https://nunmrgggtwvviog.form.io/profilepublic"
            />
        );
    }

}

export default ProfilePublicForm;