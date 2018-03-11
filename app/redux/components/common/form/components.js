import {h} from 'preact';
import Textarea from 'react-textarea-autosize';
import {Tab, Tabs, Row, Col, Nav, NavItem, Button} from 'react-bootstrap';
import {Field} from "redux-form";
import PlacesAutocomplete from "react-places-autocomplete";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

export const googleAutocompleteSelect = ({input, meta, placeholder, options}) => {
    return <div className="form-group">
        {placeholder && <label htmlFor="first_name">{placeholder}</label>}
        <PlacesAutocomplete inputProps={input} options={options}/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;

};

const inputField = ({input, type, meta, placeholder}) => {
    return <div className="form-group">
        {placeholder && <label htmlFor="first_name">{placeholder}</label>}
        <input type={type} className="form-control" {...input} placeholder={placeholder}/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;

};

export const inputText = ({input, meta, placeholder}) => {
    return inputField({input, type: "text", meta, placeholder})
};

export const inputPassword = ({input, meta, placeholder}) => {
    return inputField({input, type: "password", meta, placeholder})
};

export const inputUrl = ({input, meta, placeholder}) => {
    return inputField({input, type: "url", meta, placeholder})
};

export const inputTel = ({input, meta, placeholder}) => {
    return inputField({input, type: "tel", meta, placeholder})
};

export const inputEmail = ({input, meta, placeholder}) => {
    return inputField({input, type: "email", meta, placeholder})
};

export const textarea = ({input, id, meta, placeholder, options}) =>
    <div className="form-group">
        {placeholder && <label htmlFor="first_name">{placeholder}</label>}
        <Textarea id={id} className="form-control" {...input} placeholder={placeholder}/>
        {meta.error && meta.touched && <span>{meta.error}</span>}
    </div>;

export const textareaMultiTab = ({tabs = [], name, labels = {}, fields}) => {
    return <Tab.Container id="left-tab-languages" defaultActiveKey={0}>
        <Row className="clearfix">
            <Col sm={2} className="navabout">
                <Nav bsStyle="pills" stacked>
                    {tabs.map((k, index) => (
                        <NavItem eventKey={index}>{labels[k]}</NavItem>
                    ))}
                </Nav>
            </Col>
            <Col sm={10}>
                <Tab.Content animation>
                    {fields.map((member, index) => (
                        <Tab.Pane eventKey={index}>
                            <Field
                                name={`${member}.value`}
                                component={textarea}
                            />
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>;
};

export const multiInputUrl = ({fields, title, meta: {error}}) => {
    return multiInput({fields, title, meta: {error}, render: inputUrl, key: "url"})
};

export const multiInputText = ({fields, title, meta: {error}}) => {
    return multiInput({fields, title, meta: {error}, render: inputText, key: "text"})
};

//Email [inputEmail], private[checkbox], primary[checkbox], confirmed[solo testo]
export const multiInputEmail = ({fields, title, meta: {error}}) => {
    const renderSubField = (member, index, fields) => {
        const {is_confirmed} = fields.get(index);
        return <li key={index}>
            <Row>
                <Col sx={3}>
                    <Field
                        name={`${member}.email`}
                        component={inputEmail}
                    />
                </Col>
                <Col sx={3}>

                    <Field
                        name={`${member}.is_public`}
                        component={checkboxField}
                        placeholder="Is public"
                    />

                </Col>
                <Col sx={3}>
                    <Field
                        disabled={!is_confirmed}
                        name={`${member}.is_primary`}
                        component={checkboxField}
                        placeholder="Is primary"
                    />
                </Col>
                <Col sx={3}>
                    {is_confirmed ? "Is confirmed" : "Not yet confirmed"}
                    <Button bsStyle="danger"
                            onClick={() => fields.remove(index)}>
                        -
                    </Button>
                </Col>
            </Row>
        </li>
    };
    return <div>
        <label>{title}</label>
        {error && <span className="error-message">{error}</span>}
        <Row>
            <ul className="list-unstyled">
                {fields.map(renderSubField)}
                <Button bsStyle="success" onClick={() => fields.push({})}>+</Button>
            </ul>
        </Row>
    </div>
};

export const multiInputTel = ({fields, title, meta: {error}}) => {
    return multiInput({fields, title, meta: {error}, render: inputTel, key: "tel"})
};

export const multiGoogleCityCountry = ({fields, title, meta: {error}}) => {
    return multiInput({
        fields,
        title,
        meta: {error},
        render: googleAutocompleteSelect,
        key: "text",
        options: {
            types: ['(city)']
        }
    })
};

export const multiGoogleAddress = ({fields, title, meta: {error}}) => {
    return multiInput({
        fields,
        title,
        meta: {error},
        render: googleAutocompleteSelect,
        key: "text",
        options: {
            types: ['address']
        }
    })
};

const multiInput = ({fields, title, meta: {error}, render, key}) => {
    const renderSubField = (member, index, fields, render, key = "text") => (<li key={index}>
        <Row>
            <Col sx={9}>
                <Field
                    name={`${member}.${key}`}
                    component={render}
                />
            </Col>
            <Col sx={3}>
                <Button bsStyle="danger"
                        onClick={() => fields.remove(index)}>
                    -
                </Button>
            </Col>
        </Row>
    </li>);
    return <div>
        <label>{title}</label>
        {error && <span className="error-message">{error}</span>}
        <Row>
            <ul className="list-unstyled">
                {fields.map((member, index, fields) => renderSubField(member, index, fields, render, key))}
                <Button bsStyle="success" onClick={() => fields.push({})}>+</Button>
            </ul>
        </Row>
    </div>
};


export const renderList = ({input, meta, placeholder, hideResetButton, options, classNames, disabled, defaultValue}) => {
    return <div className="form-group">
        {placeholder && <label htmlFor={input.name}>{placeholder}</label>}
        <Select            
            name={input.name}
            value={input.value} 
            options={options}
            onChange={input.onChange}          
        />
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;
};

export const renderDatePicker = ({input, meta, placeholder, disabled}) =>
    <div className="form-group">
        <label htmlFor="first_name">{placeholder}</label>
        <br/>
        <DatePicker
        {...input} 
        dateForm="MM/DD/YYYY" 
        selected={input.value ? moment(input.value) : null}
        />
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;

export const checkboxField = ({input, meta, id, placeholder, disabled, classNames, options}) =>
    <div className={"form-group " + classNames}>
        <input
            id={id}
            defaultChecked={input.value}
            className="form-control"
            type="checkbox"
            {...input}
            placeholder={placeholder}
            disabled={disabled}
        />
        {placeholder && <label htmlFor={id}>{placeholder}</label>}
    </div>;