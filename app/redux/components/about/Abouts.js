import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import renderLabel from '../renderLabel';
import Languages from '../language/Languages';
import { Tab, Tabs, Row, Col, Nav, NavItem  } from 'react-bootstrap';

const Abouts = injectIntl(({
  fields,
  meta: { error, submitFailed },
  intl
}) => {

  return (
    
  <fieldset>
    <div>
      <legend>
        <FormattedMessage
          id="abouts"
          defaultMessage="About you..."
        />
      </legend>
      {submitFailed && error && <span>{error}</span>}

      <Tab.Container id="left-tab-languages" defaultActiveKey={0}>
      <Row className="clearfix">
        <Col sm={2} className="navabout">
            <Nav bsStyle="pills" stacked>
            {Languages.map((lang,index) => (
                <NavItem eventKey={index}>{lang.language}</NavItem>
            ))}
            </Nav>
        </Col>
        <Col sm={10}>
        <Tab.Content animation>
        {fields.map((about, index) => (
        <Tab.Pane eventKey={index}>
        <div key={index}>
          <label htmlFor="aboutlanguage">
            <FormattedMessage
              id="aboutTitle"
              defaultMessage="About section in language:"
            />
          </label>
          <Field
            className="form-control"
            name={`${about}.lang`}
            component={renderLabel}
          />
        </div>
        <Field
          className="form-control"
          name={`${about}.abouttext`}
          component="textarea"      
          rows="12"
          placeholder={intl.formatMessage({
            id: 'about.placeholder',
            defaultMessage: 'Tell me something about you'
          })}
        />
        </Tab.Pane>
      ))}
      </Tab.Content>
      </Col>
      </Row>
  </Tab.Container>
    </div>
    </fieldset>
  );}
);
export default Abouts;
