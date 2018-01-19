import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import About from '../about/About';
import Languages from '../language/Languages';
import { Tab, Tabs } from 'react-bootstrap';

const ProfileAboutTabs = injectIntl(({
    user,
    intl,
    userAboutDelete
  }) => {

    const onAboutDelete = (about) => (e) => {
        return userAboutDelete(user._id, about.lang);
    };

    return (
        <Tabs className="tabparent">
        {user && user.abouts && user.abouts.map((a, index) => (
        <Tab eventKey={index} title={a.lang}>
            <span className="deleteicon">
                <i
                    className="fa fa-times"
                    data-toggle="tooltip"
                    onClick={onAboutDelete(a)}
                    data-placement="top"
                    title={intl.formatMessage({
                    id: "delete",
                    defaultMessage: "Delete"
                    })}
                >
                </i> 
            </span>
            <br/>
            {a.abouttext}
        </Tab>
        ))}
        </Tabs>
    )


});

export default ProfileAboutTabs;