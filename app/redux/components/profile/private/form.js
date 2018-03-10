import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {renderDatePicker, renderList, multiInputTel} from "../../common/form/components";
import validate from './validate'
import asyncValidate from './asyncValidate'

class ProfileEmailForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>

                <Field
                    name="data"
                    component={renderDatePicker}
                    placeholder="Date"
                />


                <Field
                    name="list"
                    component={renderList}
                    placeholder="List"
                    options={[
                        {value: 'one', label: 'One'},
                        {value: 'two', label: 'Two'}
                    ]}
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary">
                    Save
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
    asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(ProfileEmailForm);
