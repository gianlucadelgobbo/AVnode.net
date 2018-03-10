import {h} from 'preact';
import Textarea from 'react-textarea-autosize';
import {Tab, Tabs, Row, Col, Nav, NavItem, Button} from 'react-bootstrap';
import {Field} from "redux-form";

export const inputText = ({input, meta, placeholder}) => {
    return <div className="form-group">
        <label htmlFor="first_name">{placeholder}</label>
        <input className="form-control" {...input} placeholder={placeholder}/>
        {meta.error && meta.touched && <span className="error-message">{meta.error}</span>}
    </div>;

};

export const inputPassword = ({input, meta, placeholder}) =>
    <div className="form-group">
        <label htmlFor="first_name">{placeholder}</label>
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

export const multiInputUrl = ({fields, title}) => {
    const renderSubField = (member, index, fields) => (<li key={index}>
        <Row>
            <Col sx={9}>
                <Field
                    name={`${member}.url`}
                    component={inputUrl}
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
        <Row>
            <ul className="list-unstyled">
                {fields.map(renderSubField)}
                <Button bsStyle="success" onClick={() => fields.push({})}>+</Button>
            </ul>
        </Row>
    </div>
};