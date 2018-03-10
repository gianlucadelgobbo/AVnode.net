import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText, renderDatePicker, renderList, multiInputTel} from "../../common/form/components";
import validate from './validate'
import asyncValidate from './asyncValidate'

class ProfilePrivateForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>

                <Field
                    name="name"
                    component={inputText}
                    placeholder="Name"
                />

                 <Field
                    name="surname"
                    component={inputText}
                    placeholder="Surname"
                />

                <Field
                    name="gender"
                    component={renderList}
                    placeholder="Gender"
                    options={[
                        {value: 'male', label: 'Male'},
                        {value: 'female', label: 'Female'},
                        {value: 'others', label: 'Others'}
                    ]}
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

                <Field
                    name="data"
                    component={renderDatePicker}
                    placeholder="Date"
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
})(ProfilePrivateForm);
