import {h} from 'preact';
import Textarea from 'react-textarea-autosize';
import {Tab, Tabs, Row, Col, Nav, NavItem, Button} from 'react-bootstrap';
import {Field} from "redux-form";
import PlacesAutocomplete from "react-places-autocomplete";

export const inputAddress = ({input, meta, placeholder}) => {
    const options = {
        types: []
    };
    return <div className="form-group">
        {placeholder && <label htmlFor="first_name">{placeholder}</label>}
        <PlacesAutocomplete inputProps={input} options={options}/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;

};

export const inputText = ({input, meta, placeholder}) => {
    return <div className="form-group">
        {placeholder && <label htmlFor="first_name">{placeholder}</label>}
        <input className="form-control" {...input} placeholder={placeholder}/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;

};

export const inputPassword = ({input, meta, placeholder}) =>
    <div className="form-group">
        {placeholder && <label htmlFor="first_name">{placeholder}</label>}
        <input type="password" className="form-control" {...input} placeholder={placeholder}/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;

export const inputUrl = ({input, meta, placeholder}) => {
    return (<div className="form-group">
        {placeholder && <label htmlFor="first_name">{placeholder}</label>}
        <input type="url" className="form-control" {...input} placeholder={placeholder}/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>);
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

export const multiAddress = ({fields, title, meta: {error}}) => {
    return multiInput({fields, title, meta: {error}, render: inputAddress, key: "text"})
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