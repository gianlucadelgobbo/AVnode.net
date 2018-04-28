import {h} from 'preact';
import Textarea from 'react-textarea-autosize';
import {Tab, Tabs, Nav, NavItem, Button, ButtonGroup} from 'react-bootstrap';
import {Field} from "redux-form";
import PlacesAutocomplete from "react-places-autocomplete";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import StrongPassword from 'react-strongpassword';
import Dropzone from 'react-dropzone';
import {MODAL_REMOVE, MODAL_ADD_USER_PERFORMANCE, MODAL_SAVED} from "../../modal/constants";
import TimePicker from 'react-times';
import 'react-times/css/classic/default.css';
import ReactTooltip from 'react-tooltip';
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';
import Phone from 'react-phone-number-input';
import Reorder from '../../reorder';

export const googleAutocompleteSelect = ({input, meta, placeholder, options, isChild}) => {
    const field = <div className="form-group">
        <PlacesAutocomplete className="form-control" inputProps={input} options={options}/>
        {meta.error && meta.touched &&
        <span className="error-message">{isChild ? meta.error._error : meta.error}</span>}
    </div>;

    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};

const inputField = ({input, type, meta, placeholder, title, isChild}) => {
    const field = <div className="form-group">
        <input type={type} className="form-control" {...input} placeholder={placeholder}/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;
    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};

export const inputText = ({input, meta, placeholder, isChild}) => {
    return inputField({input, type: "text", meta, placeholder, isChild})
};

export const inputPassword = ({input, meta, placeholder, isChild}) => {
    return inputField({input, type: "password", meta, placeholder, isChild})
};

export const inputPasswordMeter = ({input, meta, placeholder, isChild}) => {
    const field = <div className="form-group">
        <StrongPassword {...input} placeholder={placeholder} className="form-control"/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;
    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};

export const inputUrl = ({input, meta, placeholder, isChild}) => {
    return inputField({input, type: "url", meta, placeholder, isChild})
};

export const inputTel = ({input, meta, placeholder, isChild}) => {
    const field = <div className="form-group">
        <Phone {...input} placeholder={placeholder} className="form-control"/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;
    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};

export const inputEmail = ({input, meta, placeholder, isChild}) => {
    return inputField({input, type: "email", meta, placeholder, isChild})
};

export const inputCheckbox = ({input, meta, placeholder, isChild}) => {
    return inputField({input, type: "checkbox", meta, placeholder, isChild})
};

export const textarea = ({input, id, meta, placeholder, isChild}) => {
    const field = <div className="form-group">
        {placeholder && <label htmlFor="first_name">{placeholder}</label>}
        <Textarea id={id} className="form-control" {...input} placeholder={placeholder}/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;
    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};
export const textareaMultiTab = ({tabs = [], name, labels = {}, placeholder, fields, errors}) => {

    const id = `tabs-${Math.random()}`;
    const hasValue = (fields, index) => !!fields.get(index).value;
    const hasError = (errors = {}, index, name) => errors[name] && errors[name][index] && !!errors[name][index].value;
    const label = <div className="labelField">{placeholder}</div>;

    return <div className="card">
        <div className="card-header">
            <h4>{label}</h4>
        </div>
        <div className="card-body">
            <br/>

            <ul className="nav nav-pills justify-content-center">
                {tabs.map((k, index) => (
                    <li className="nav-item" key={index}>
                        <a
                            className={"nav-link " + (index === 0 ? "active" : "")}
                            data-toggle="pill"
                            href={`#${id}${index}`}>
                            {hasError(errors, index, fields.name) ? "! " : ""}{labels[k]}{hasValue(fields, index) ? "" : "*"}
                        </a>
                    </li>
                ))}
            </ul>

            <div className="tab-content">
                {fields.map((member, index) => {
                    return <div
                        key={index}
                        className={"tab-pane container " + (index === 0 ? "active" : "")}
                        id={`${id}${index}`}>
                        <Field
                            name={`${member}.value`}
                            component={textarea}
                            isChild={true}
                        />
                    </div>

                })}
            </div>
        </div>
    </div>

};

export const multiInputUrl = ({fields, title, showModal, placeholder, meta: {error}}) => {
    return multiInput({
        fields,
        title,
        meta: {error},
        showModal,
        placeholder,
        render: inputUrl,
        key: "url",
        isChild: true
    })
};

export const multiInputText = ({fields, title, showModal, placeholder, meta: {error}}) => {
    return multiInput({
        fields,
        title,
        meta: {error},
        showModal,
        placeholder,
        render: inputText,
        key: "text",
        isChild: true
    })
};

export const multiInputEmail = ({fields, title, showModal, placeholder, meta: {error}}) => {
    return multiInput({
        fields,
        title,
        meta: {error},
        showModal,
        placeholder,
        render: inputEmail,
        key: "text",
        isChild: true
    })
};

export const multiInputCheckbox = ({fields, title, showModal, placeholder, meta: {error}}) => {
    return multiInput({
        fields,
        title,
        meta: {error},
        showModal,
        placeholder,
        render: checkboxField,
        key: "checkbox",
        isChild: true
    })
};

// multiInputCheckboxes // Refactoring // Users in Performances

export const multiCheckboxWithLabel = ({fields, title, showModal, placeholder, meta: {error}}) => {
    const renderSubField = (member, index, fields, showModal) => {
        return <div className="row" key={index}>
            <div className="col-md-10">
                <Field
                    name={`${member}.stagename`}
                    component={checkboxFieldInColumn}
                    placeholder={placeholder}
                    isChild={true}
                />
            </div>
            <div className="col-md-2">
                <Button bsStyle="danger"
                        onClick={() =>
                            showModal({
                                type: MODAL_REMOVE,
                                props: {
                                    onRemove: () => fields.remove(index)
                                }
                            })}
                >
                    <i className="fa fa-trash" data-toggle="tooltip" data-placement="top"/>
                </Button>
            </div>
        </div>
    }
    const label = <div className="labelField">{placeholder}</div>;
    return <div className="card">
        <div className="card-header">
            <h4>{label}</h4>
            <Button bsStyle="success" className="pull-right"
                //onClick={() => fields.unshift({})}
                    onClick={() =>
                        showModal({
                            type: MODAL_ADD_USER_PERFORMANCE
                        })}
            >
                <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
            </Button>
        </div>
        <div className="card-body">
            <br/>
            {error && <span className="error-message">{error}</span>}
            {fields.map((member, index, fields) => renderSubField(member, index, fields, showModal))}

        </div>
    </div>;
}

export const multiInputEmailWithDetails = ({fields, title, showModal, placeholder, meta: {error}}) => {
    const renderSubField = (member, index, fields, showModal) => {
        const {is_confirmed} = fields.get(index);
        return <div className="row" key={index}>
            <div className="col-md-5 offset-1">
                <Field
                    name={`${member}.email`}
                    component={inputEmail}
                    isChild={true}
                />
            </div>
            <div className="col-md-4">

                <div className="row">
                    <div className="col-md-4">
                        <Field
                            name={`${member}.is_public`}
                            component={checkboxField}
                            placeholder={<p>Is public</p>}
                            isChild={true}
                        />
                    </div>
                    <div className="col-md-4">
                        <Field
                            disabled={!is_confirmed}
                            name={`${member}.is_primary`}
                            component={checkboxField}
                            placeholder={<p data-tip="To set as primary, confirm the email first">Is
                                primary<ReactTooltip/></p>}
                            isChild={true}
                        />
                    </div>
                    <div className="col-md-4">
                        {is_confirmed ? "Is confirmed" : "Not yet confirmed"}
                    </div>

                </div>

            </div>
            <div className="col-md-1">
                <Button bsStyle="danger"
                        onClick={() =>
                            showModal({
                                type: MODAL_REMOVE,
                                props: {
                                    onRemove: () => fields.remove(index)
                                }
                            })}
                >
                    <i className="fa fa-trash" data-toggle="tooltip" data-placement="top"/>
                </Button>
            </div>
        </div>

    };
    const label = <div className="labelField">{placeholder}</div>;
    return <div className="card">
        <div className="card-header">
            <h4>{label}</h4>
            <Button bsStyle="success" className="pull-right"
                    onClick={() => fields.unshift({})}>
                <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
            </Button>
        </div>
        <div className="card-body">
            <br/>
            {error && <span className="error-message">{error}</span>}
            {fields.map((member, index, fields) => renderSubField(member, index, fields, showModal))}

        </div>
    </div>;
};

export const multiInputTel = ({fields, title, showModal, placeholder, meta: {error}}) => {
    return multiInput({
        fields,
        title,
        meta: {error},
        showModal,
        placeholder,
        render: inputTel,
        key: "tel",
        isChild: true
    })
};

export const multiGoogleCityCountry = ({fields, title, showModal, placeholder, meta: {error}}) => {
    return multiInput({
        showModal,
        fields,
        title,
        placeholder,
        meta: {error},
        render: googleAutocompleteSelect,
        key: "text",
        options: {
            types: ['(city)']
        },
        isChild: true
    })
};

export const multiGoogleAddress = ({fields, title, placeholder, meta: {error}, showModal}) => {
    return multiInput({
        showModal,
        fields,
        placeholder,
        title,
        meta: {error},
        render: googleAutocompleteSelect,
        key: "text",
        options: {
            types: ['address']
        }, isChild: true
    })
};

const multiInput = ({fields, title, meta: {error}, render, placeholder, key, showModal}) => {
    const label = <div className="labelField">{placeholder}</div>;
    const renderSubField = ({member, index, fields, render, key = "text"}) => (
        <div className="row" key={index}>
            <div className="col-md-9 offset-1">
                <Field
                    name={`${member}.${key}`}
                    component={render}
                    isChild={true}
                />
            </div>
            <div className="col-md-2">>
                <Button
                    bsStyle="danger"
                    onClick={() =>
                        showModal({
                            type: MODAL_REMOVE,
                            props: {
                                onRemove: () => fields.remove(index)
                            }

                        })}
                >
                    <i className="fa fa-trash" data-toggle="tooltip" data-placement="top"/>
                </Button>
            </div>
        </div>
    );

    return <div className="card">
        <div className="card-header">
            <h4>{label}</h4>
            <Button bsStyle="success"
                    className="pull-right"
                    onClick={() => fields.unshift({})}>
                <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
            </Button>
        </div>
        <div className="card-body">
            <br/>
            {error && <span className="error-message">{error}</span>}
            {fields.map((member, index, fields) => renderSubField({member, index, fields, render, key, showModal}))}

        </div>
    </div>
};

export const renderList = ({input, meta, placeholder, hideResetButton, options, isChild, multiple}) => {
    const field = <div className="form-group">
        <Select
            name={input.name}
            value={input.value}
            options={options}
            multi={multiple}
            onChange={input.onChange}
        />
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;
    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};

export const renderListRadio = ({input, meta, placeholder, hideResetButton, options, isChild, multiple}) => {
    const field = <div className="form-group">
        <ButtonGroup>
            {options.map(option =>
                <Button
                    key={option[0]}
                    bsStyle={option[0] === input.value ? 'primary' : 'default'}
                    children={option[1]}
                    name={input.name}
                    onClick={input.onChange}
                    value={option[0]}
                />
            )}
        </ButtonGroup>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;
    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};

export const renderDatePicker = ({input, meta, placeholder, isChild}) => {
    const field = <div className="form-group">
        <DatePicker
            {...input}
            value={null}
            dateForm="MM/DD/YYYY"
            className="form-control"
            selected={input.value ? moment(input.value) : null}
        />
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;
    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};

export const renderTimePicker = ({input, meta, timeMode = "24", className, placeholder, isChild}) => {
    const field = <div className="form-group">
        <TimePicker
            className={className}
            onTimeChange={input.onChange}
            time={input.value}
            timeMode={timeMode}
            theme="classic"
        />,
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;
    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};

export const checkboxField = ({input, meta, id, placeholder, disabled, classNames, isChild}) => {
    const field = <div className={"form-group " + classNames}>
        {placeholder && <label htmlFor={id}>{placeholder}</label>}
        <input
            id={id}
            defaultChecked={input.value}
            className="form-control"
            type="checkbox"
            {...input}
            disabled={disabled}
        />
    </div>;
    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};

//Refactoring//
export const checkboxFieldInColumn = ({input, meta, id, placeholder, disabled, classNames, isChild}) => {
    const field = <div className="form-group checkbox-list">
        <input
            id={id}
            defaultChecked={input.value}
            className=""
            type="checkbox"
            {...input}
            disabled={disabled}
        />
        <label className="checkbox-inline" htmlFor={id}>{input.value}</label>
    </div>;
    const label = <div className="labelField">{placeholder}</div>;
    return !!isChild ? field :
        <dl className="row">
            <dt className="col-sm-2">{label}</dt>
            <dd className="col-sm-10"> {field} </dd>
        </dl>
};

export const renderDropzoneInput = (field) => {
    let files = field.input.value;

    const getExtensionIcon = (name) => {
        let extension = name.replace(/\s/g, '').slice((name.lastIndexOf(".") - 1 >>> 0) + 2) || 'Unknown';
        extension = extension.toLocaleLowerCase();
        switch (extension) {
            case 'pdf':
                return <span key={name} className="label label-default">PDF</span>;
            case 'png':
                return <span key={name} className="label label-default">PNG</span>;
            default :
                return <span key={name} className="label label-default">{extension}</span>;

        }
    };

    function formatBytes(bytes, decimals) {
        if (bytes === 0) return '0 Bytes';
        let k = 1000,
            dm = decimals + 1 || 3,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    return (
        <div className="form-group">
            {field.placeholder && <h4 className="labelField">{field.placeholder}</h4>}

            <Dropzone
                className="attachment-dropzone"
                name={field.name}
                maxSize={10485760}
                multiple={field.multiple || false}
                onDropRejected={() => alert("Unable to upload the file: allowed file size exceeded (max 10 MB)")}
                onDrop={(filesToUpload) => {
                    let files = [...field.input.value, ...filesToUpload];
                    files = files.filter((item, pos) => files.indexOf(item) === pos);
                    files = files.filter(item => item !== "");
                    field.input.onChange(files)
                }}
            >
                <div className="labelField">Drop files here, or click to select files to upload.</div>
            </Dropzone>

            {field.meta.touched && field.meta.error && <span className="error">{field.meta.error}</span>}

            {files && Array.isArray(files) && (
                <ul className="list-unstyled attached-file">

                    {files.map((file, i) => <li key={i}>
                        {getExtensionIcon(file.name)} {file.name}
                        <span
                            className="file-size">({formatBytes(file.size)})
                        </span>
                        <button type="button" className="btn btn-default clear-attachment" onClick={() => {

                            field.showModal({
                                type: MODAL_REMOVE,
                                props: {
                                    onRemove: () => {
                                        let result = [...files];
                                        result.splice(i, 1);
                                        field.input.onChange(result)
                                    }
                                }
                            })

                        }}>
                            <i className="fa fa-trash" data-toggle="tooltip" data-placement="top"/>
                        </button>

                    </li>)}
                </ul>
            )}
        </div>
    );
};

export const multiSchedule = ({fields, title, meta: {error}, placeholder, showModal}) => {
    const label = <div className="labelField">{placeholder}</div>;
    const renderSubField = ({member, index, fields}) => {
        return <div className="row" key={index}>
            <div className="col-md-9 offset-1">

                <div className="row">
                    <div className="col-md-4">
                        <Field
                            name={`${member}.date`}
                            component={renderDatePicker}
                            placeholder="Date"
                            isChild={true}
                        />
                    </div>
                    <div className="col-md-4">
                        <Field
                            name={`${member}.starttime`}
                            component={renderTimePicker}
                            placeholder="Start time"
                            isChild={true}
                        />
                    </div>
                    <div className="col-md-4">
                        <Field
                            name={`${member}.endtime`}
                            component={renderTimePicker}
                            placeholder="End time"
                            isChild={true}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <Field
                            name={`${member}.venue`}
                            component={googleAutocompleteSelect}
                            placeholder="Venue"
                            options={{
                                types: ['establishment']
                            }}
                            isChild={true}
                        />
                    </div>
                    <div className="col-md-6">
                        <Field
                            name="room"
                            component={inputText}
                            placeholder="Room"
                            isChild={true}
                        />
                    </div>
                </div>

            </div>

            <div className="col-md-2">>
                <Button
                    bsStyle="danger"
                    onClick={() =>
                        showModal({
                            type: MODAL_REMOVE,
                            props: {
                                onRemove: () => fields.remove(index)
                            }

                        })}
                >
                    <i className="fa fa-trash" data-toggle="tooltip" data-placement="top"/>
                </Button>
            </div>

            <div className="col-md-12">
                <hr/>
            </div>
        </div>
    }

    return <div className="card">
        <div className="card-header">
            <h4>{label}</h4>
            <Button bsStyle="success"
                    className="pull-right"
                    onClick={() => fields.unshift({})}>
                <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
            </Button>
        </div>
        <div className="card-body">
            <br/>
            {error && <span className="error-message">{error}</span>}
            {fields.map((member, index, fields) => renderSubField({member, index, fields, showModal}))}

        </div>
    </div>
};

export const sort = ({input, meta, placeholder, isChild}) => {
    const {onChange, value} = input;
    const items = value || [];

    return <Reorder
        onChange={onChange}
        items={items}
    />
};