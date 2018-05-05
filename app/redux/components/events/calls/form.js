import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {
    multiCall,
} from "../../common/form/components";
import validate from './validate';

class EventCallsForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            onSubmit,
            categories,
            showModal,
            tabs,
            labels
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <FieldArray
                    name="calls"
                    component={multiCall}
                    placeholder="Calls"
                    showModal={showModal}
                    categories={categories}
                    tabs={tabs}
                    labels={labels}
                />

                <hr/>

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-lg btn-block">
                    {submitting ? "Saving..." : "Save"}
                </button>

            </form>
        );
    }

}

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
})(EventCallsForm);
