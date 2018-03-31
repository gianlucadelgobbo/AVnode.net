import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {renderList} from "../common/form/components";
import {FORM_NAME} from "./constants";
import {locales, locales_labels} from '../../../../config/default.json';

class PreferencesForm extends Component {
    
    render() {
        const {onSubmit,handleSubmit,submitting} = this.props;
        return(
            <form onSubmit={handleSubmit(onSubmit)}>
             <Field
                    name="preferences"
                    component={renderList}
                    placeholder="Preferences"
                    options={locales.map(l => ({
                        value: l,
                        label: locales_labels[l]
                    }))}
                />
            <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg btn-block">
                {submitting ? "Saving..." : "Save"}
                </button>
            </form>
        )
    }
}

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
})(PreferencesForm);
