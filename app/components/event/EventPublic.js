import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import Abouts from '../about/Abouts';
// import Languages from '../language/Languages';
import Category from '../category/Category';
import Categories from '../category/Event';
import LinksWeb from '../link/LinksWeb';
import LinksSocial from '../link/LinksSocial';
import EventNav from './EventNav';
import Match from 'preact-router/match';

import {
  editEvent,
  eventLinkDelete,
  removeEventCategory,
  eventAboutDelete
} from '../../reducers/actions';

let EventPublicForm = props => {
  const { handleSubmit, editEvent, linkDelete, removeCategory, aboutDelete, event, intl } = props;

  /* const removeCategory = (categoryId) => (e) => {
    e.preventDefault();
    // BL CHECK return dispatch(removeEventCategory(event._id, categoryId));
    return removeEventCategory(event._id, categoryId);
  }; */

  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <EventNav url={url} />}
        </Match>
      </div>
      <Layout>
        <form onSubmit={handleSubmit(editEvent)}>
          <Field
            name="_id"
            component="input"
            type="hidden"
          />
          <div className="form-group">
            <label htmlFor="title">
              <FormattedMessage
                id="name"
                defaultMessage="Name"
              />
            </label>
            <Field
              className="form-control form-control-lg"
              name="title"
              component="input"
              type="text"
              value={props.title}
            />
          </div>

          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="categories"
                defaultMessage="Categories"
              />
            </legend>

            <div className="row">
              <div className="col-md-9 form-group">
                <label htmlFor="category">
                  <FormattedMessage
                    id="addCategory"
                    defaultMessage="Add category"
                  />
                </label>
                {Categories ?
                  <Field
                    className="form-control custom-select"
                    name="category"
                    component="select"
                    value={props.category}
                  >
                    <option value="event">
                      <FormattedMessage
                        id="Please select"
                        defaultMessage="Please select"
                      />
                    </option>
                    {Categories.map((c) => (
                      <option value={c.key.toLowerCase()}>{c.name}</option>
                    ))
                    }
                    { /*  */}
                  </Field> :
                  <p>Loading categories…</p>
                }
              </div>
            </div>

            <label>
              <FormattedMessage
                id="managecategories"
                defaultMessage="Manage your categories"
              />
            </label>
            <ul className="list-group mt-2">
              {
                event && event.categories && event.categories.map((c) => (
                  <Category
                    category={c}
                    onDelete={removeCategory(c._id)}
                  />
                ))
              }
            </ul>
          </fieldset>

          <Abouts
            current={event}
            intl={intl}
            aboutDelete={aboutDelete}
          />
          <LinksWeb
            current={event}
            intl={intl}
            linkDelete={linkDelete}
          />
          <LinksSocial
            current={event}
            intl={intl}
            linkDelete={linkDelete}
          />

          <div className="form-group">
            <button
              className="btn btn-primary"
              type="submit"
            >
              <FormattedMessage
                id="form.save"
                defaultMessage="Save"
              />
            </button>
          </div>
        </form>
      </Layout>
    </div>
  );
};

EventPublicForm = injectIntl(reduxForm({ form: 'EventPublic' })(EventPublicForm));

const EventPublic = props => {
  console.log('EventPublic props');
  const onSubmit = (props, dispatch) => {
    console.log('EventPublic onSubmit');
    // loop dispatch(editEvent(props));
    editEvent(dispatch);
  };
  const onSubmitSuccess = () => {
    console.log('EventPublic onSubmitSuccess');
  };
  return (
    <EventPublicForm
      initialValues={props.event}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  console.log('_______________ props __________________________________');
  console.log('--> EventPublic props.url: ' + JSON.stringify(props.url));
  console.log('_______________ state __________________________________');
  console.log('--> EventPublic state.user.eventId: ' + JSON.stringify(state.user.eventId));
  return {
    event: (state.user.events.find(e => { return e._id === props._id; })),
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => ({
  removeCategory: dispatch(removeEventCategory),
  linkDelete: dispatch(eventLinkDelete),
  aboutDelete: dispatch(eventAboutDelete)//,  editEvent: dispatch(editEvent)
});

export default connect(mapStateToProps, mapDispatchToProps)(EventPublic);
