import React, {Component} from "react";
import LateralMenu from "../lateralMenu";
import Form from "./form";
import {connect} from "react-redux";
import {fetchModel, saveModel} from "./actions";
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_SAVED} from "../../modal/constants";
import Loading from "../../loading";
import ErrorMessage from "../../errorMessage";
import ItemNotFound from "../../itemNotFound";
import TitleComponent from "../../titleComponent";
import {EVENT_NAME, SHOW} from "./constants";
import {getModel, getModelErrorMessage, getModelIsFetching} from "../selectors";
import {locales, locales_labels} from "../../../../../config/default";
import {fetchEventList as fetchEventsCategories} from "../../categories/actions";
import {getList as getCategories} from "../../categories/selectors";
import moment from "moment";
import {populateMultiLanguageObject} from "../../common/form";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import axios from "axios";
// 1. LOADING BAR add actions generators
import {hideLoading, showLoading} from 'react-redux-loading-bar';

class EventPublic extends Component {

  componentDidMount() {
    const {
      fetchModel,
      match: {
        params: {_id}
      },
      fetchEventsCategories
    } = this.props;
    fetchModel({
      id: _id
    });
    fetchEventsCategories();
  }

  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values);

    // Convert web
    model.categories = model.categories.map(w => ({
      id: w.value,
      title: w.label
    }));

    //Convert abouts for API
    if (Array.isArray(model.abouts)) {
      model.abouts = model.abouts.map(x => {
        const splitted = x.key.split(".");
        return {
          lang: splitted[splitted.length - 1],
          abouttext: x.value
        };
      });
    }

    // Convert web
    model.web = model.web.filter(w => w.url);

    // Convert social
    model.social = model.social.filter(w => w.url);

    // Convert Phone Number
    model.phones = model.phones
        .filter(a => a)
        .map(p => ({
          url: p.tel
        }));

    // Convert schedule
    model.schedule = model.schedule
        .map(s => {
          const start = moment(s.startdate).clone().startOf("day");
          const end = moment(s.enddate).clone().startOf("day");
          const sTime = moment(s.starttime);
          const eTime = moment(s.endtime);
          const starttime = start.add(sTime.format("mm"), "minutes").add(sTime.format("kk")).format();
          const endtime = end.add(eTime.format("mm"), "minutes").add(eTime.format("kk")).format();

          const r = {
            ...s,
            starttime,
            endtime
          };

          delete r.date;
          delete r.startdate;
          delete r.enddate;

          return r;
        });

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const {model} = this.props;

    if (!model) {
      return {};
    }

    let v = {};
    const {abouts, subtitles} = model;

    // Convert categories
    v.categories = [];
    if (Array.isArray(model.categories)) {
      v.categories = model.categories.map(x => x._id);
    }

    // Convert categories
    v.schedule = [];
    if (Array.isArray(model.schedule)) {
      // const createVenue = v => {
      //   const {location = {}, name} = v;
      //   const {locality, country} = location;
      //   let venue = "";
      //
      //   if (name) {
      //     venue += name;
      //   }
      //
      //   if (locality) {
      //     venue += `, ${locality}`;
      //   }
      //
      //   if (country) {
      //     venue += `, ${country}`;
      //   }
      //
      //   return venue;
      // };

      v.schedule = model.schedule.map(x => ({
        startdate: moment(x.starttime),
        starttime: x.starttime,
        enddate: moment(x.endtime),
        endtime: x.endtime,
        venue: !!x.venue && !!x.venue.formatted_address ? x.venue.formatted_address : "",
        room: x.venue ? x.venue.room : ""
      }));
    }

    //Convert slug for redux-form
    v.slug = model.slug;

    //Convert title for redux-form
    v.title = model.title;

    // Convert about
    v.abouts = populateMultiLanguageObject("abouts", abouts);

    // Convert subtitles format for FieldArray redux-form
    v.subtitles = populateMultiLanguageObject("subtitles", subtitles);

    // Web: Add one item if value empty
    v.web =
        Array.isArray(model.web) && model.web.length > 0
            ? model.web
            : [{url: ""}];

    // Social: Add one item if value empty
    v.social =
        Array.isArray(model.social) && model.social.length > 0
            ? model.social
            : [{url: ""}];

    // Emails: Add one item if value empty
    v.emails =
        Array.isArray(model.emails) && model.emails.length > 0
            ? model.emails
            : [{text: ""}];

    v.phones =
        Array.isArray(model.phones) && model.phones.length > 0
            ? model.phones.filter(a => a).map(p => ({tel: p.url}))
            : [""];

    return v;
  }

    createLatLongToSave = address => {
        return geocodeByAddress(address).then(function (results) {
            return getLatLng(results[0]).then(geometry => [results, geometry]); // function(b) { return [resultA, b] }
        }).then(function ([results, geometry]) {
            let loc = {};
            results[0].address_components.forEach(address_component => {
                if (address_component.types.indexOf('country') !== -1) loc.country = address_component.long_name;
                if (address_component.types.indexOf('locality') !== -1) loc.locality = address_component.long_name;
            });
            loc.formatted_address = results[0].formatted_address;
            loc.geometry = geometry;
            return loc;
        });
    };

    onSubmit(values) {
        // 3. LOADING BAR get action from props
        const {showModal, saveModel, model, showLoading, hideLoading} = this.props;

        let promises = [];

        const schedule = values.schedule;

        schedule.forEach(a => {
            promises.push(
                this.createLatLongToSave(a.venue)
                    .then(result => {
                        // add to a model
                        a.venue = result;
                    })
                    .catch(() => {
                        console.log("ciao da google!");
                    })
            );
        });

        // 4. LOADING BAR show loading bar
        showLoading();

        return axios.all(promises).then(() => {
            //dispatch the action to save the model here
            const modelToSave = this.createModelToSave(values);

            modelToSave._id = model._id;
            modelToSave.schedule = schedule;
            console.log("About to save", modelToSave)

            return saveModel(modelToSave)
                .then(response => {
                    if (response.model && response.model._id) {
                        showModal({
                            type: MODAL_SAVED
                        });
                    }

                    // 5. LOADING BAR hide loading bar
                    hideLoading();
                });
        });
    }

  //   onSubmit(values) {
  //   const {showModal, saveModel, model} = this.props;
  //   const modelToSave = this.createModelToSave(values);
  //
  //   modelToSave._id = model._id;
  //
  //   //dispatch the action to save the model here
  //   return saveModel(modelToSave)
  //       .then(model => {
  //         if (model && model.id) {
  //           showModal({
  //             type: MODAL_SAVED
  //           });
  //         }
  //       });
  // }

  render() {
    const {
      model = {},
      showModal,
      match: {
        params: {_id}
      },
      isFetching,
      errorMessage,
      categories
    } = this.props;

    return (
        <div className="row">
          <div className="col-md-2">
            <LateralMenu _id={_id}/>
          </div>
          <div className="col-md-10">
            {isFetching && !model && <Loading/>}

            {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

            {!errorMessage && !isFetching && !model && <ItemNotFound/>}

            {!errorMessage && !isFetching && model && (
                <TitleComponent title={model.title} type={EVENT_NAME}  link={"/events/"+model.slug} show={SHOW}/>
            )}

            <Form
                initialValues={this.getInitialValues()}
                onSubmit={this.onSubmit.bind(this)}
                model={model}
                showModal={showModal}
                tabs={locales}
                labels={locales_labels}
                categories={categories}
            />
          </div>
        </div>
    );
  }
}

//Get form's initial values from redux state here
const mapStateToProps = (
    state,
    {
      match: {
        params: {_id}
      }
    }
) => ({
  model: getModel(state, _id),
  isFetching: getModelIsFetching(state, _id),
  errorMessage: getModelErrorMessage(state, _id),
  categories: getCategories(state).map(c => ({value: c.key, label: c.title}))
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
          saveModel,
          fetchModel,
          showModal,
          fetchEventsCategories,
            hideLoading,
            showLoading
        },
        dispatch
    );

EventPublic = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventPublic);

export default EventPublic;
