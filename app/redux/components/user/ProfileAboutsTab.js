import { h } from 'preact';
import { Field, textarea } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import About from '../about/About';
import Languages from '../language/Languages';
import { Tab, Tabs, Row, Col, Nav, NavItem  } from 'react-bootstrap';

const ProfileAboutTabs = injectIntl(({
    user,
    intl,
    userAboutDelete
  }) => {

    const onAboutDelete = (about) => (e) => {
        return userAboutDelete(user._id, about.lang);
    };

    const renderTextArea = ({input, meta: { touched, error, warning }}) => (
        <div>
            <label>Content</label>
            <div>
                <textarea {...input} placeholder="Content" rows="10" cols="40"/>
                {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
            </div>
        </div>
    );

    return (


        <Tab.Container id="left-tabs-example" defaultActiveKey="en">
        <Row className="clearfix">
            <Col sm={2} className="navabout">
                <Nav bsStyle="pills" stacked>
                {Languages.map((lang,index) => (
                    <NavItem eventKey={lang.code}>{lang.language}</NavItem>
                ))}
                </Nav>
            </Col>
            <Col sm={10}>
                <Tab.Content animation>
                {user && user.abouts && user.abouts.map((a,j) => (
                    <Tab.Pane eventKey={a.lang}>
                    <label htmlFor="about">
                        <FormattedMessage
                        id="addabout"
                        defaultMessage="About you"
                        />
                    </label>
                    {user.abouts===undefined||""?
                    <div className="input-group">
                    <Field
                        className="form-control"
                        name="about"
                        component="textarea"
                        rows="8"
                        placeholder={intl.formatMessage({
                        id: 'about.placeholder',
                        defaultMessage: 'Tell me something about you.'
                        })}
                    />
                    </div>:
                    <div className="input-group">
                    <textarea name="styled-textarea" id="styled">{a.abouttext}</textarea>
                    </div>
                    }
                    </Tab.Pane>
                ))}
                </Tab.Content>
            </Col>
        </Row>
        </Tab.Container>


    )

});

export default ProfileAboutTabs;