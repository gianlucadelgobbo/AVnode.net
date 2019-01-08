import React, { Component } from "react";
import LateralMenu from "../lateralMenu";
import Form from "./form";
import { connect } from "react-redux";
import { saveModel, fetchModel } from "./actions";
import { showModal } from "../../modal/actions";
import { bindActionCreators } from "redux";
import { MODAL_SAVED } from "../../modal/constants";
import Loading from "../../loading";
import ErrorMessage from "../../errorMessage";
import ItemNotFound from "../../itemNotFound";
import TitleComponent from "../../titleComponent";
import { PERFORMANCE_NAME } from "./constants";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { locales, locales_labels } from "../../../../../config/default";
import { fetchList as fetchCategories } from "../../categories/actions";
import { getList as getCategories } from "../../categories/selectors";
import {
  populateMultiLanguageObject,
  createMultiLanguageInitialObject
} from "../../common/form";

import { gData } from '../../common/form/utils';

function isLeaf(value) {
  if (!value) {
    return false;
  }
  let queues = [...gData];
  while (queues.length) { // BFS
    const item = queues.shift();
    if (item.value === value) {
      if (!item.children) {
        return true;
      }
      return false;
    }
    if (item.children) {
      queues = queues.concat(item.children);
    }
  }
  return false;
}

function findPath(value, data) {
  const sel = [];
  function loop(selected, children, item) {
    for (let i = 0; i < children.length; i++) {
      const item = children[i];
      if (selected === item.value) {
        sel.push(item);
        return;
      }
      if (item.children) {
        loop(selected, item.children, item);
        if (sel.length) {
          sel.push(item);
          return;
        }
      }
    }
  }
  loop(value, data);
  return sel;
}

class PerformancePublic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tsOpen: false,
      visible: false,
      searchValue: '',
      value: '',
      lv: { value: '0-0-0-value', label: 'spe label' },
      multipleValue: [],
      simpleSearchValue: 'test111',
      simpleTreeData: [
        { key: 1, pId: 0, label: 'test1', value: 'test1' },
        { key: 121, pId: 0, label: 'test2', value: 'test2' },
        { key: 11, pId: 1, label: 'test11', value: 'test11' },
        { key: 12, pId: 1, label: 'test12', value: 'test12' },
        { key: 111, pId: 11, label: 'test111', value: 'test111' },
      ],
      treeDataSimpleMode: {
        id: 'key',
        rootPId: 0,
      },
    }
  }
  
  onClick = () => {
    this.setState({
      visible: true,
    });
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  }

  onSearch = (value) => {
    console.log('Do Search:', value, arguments);
    this.setState({ searchValue: value });
  }

  

  onChangeChildren = (...args) => {
    console.log('onChangeChildren', ...args);
    const value = args[0];
    const pre = value ? this.state.value : undefined;
    this.setState({ value: isLeaf(value) ? value : pre });
  }

  onChangeLV = (value) => {
    console.log('labelInValue', arguments);
    if (!value) {
      this.setState({ lv: undefined });
      return;
    }
    const path = findPath(value.value, gData).map(i => i.label).reverse().join(' > ');
    this.setState({ lv: { value: value.value, label: path } });
  }

  onMultipleChange = (value) => {
    console.log('onMultipleChange', arguments);
    this.setState({ multipleValue: value });
  }

  onSelect = (item) => {
    this.setState({ value:item });
    console.log(arguments);
  }

  onDropdownVisibleChange = (visible, info) => {
    console.log(visible, this.state.value, info);
    if (Array.isArray(this.state.value) && this.state.value.length > 1
      && this.state.value.length < 3) {
      window.alert('please select more than two item or less than one item.');
      return false;
    }
    return true;
  }

  filterTreeNode = (input, child) => {
    return String(child.props.title).indexOf(input) === 0;
  }


  componentDidMount() {
    const {
      fetchModel,
      match: {
        params: { _id }
      },
      fetchCategories
    } = this.props;
    fetchModel({
      id: _id
    });
    fetchCategories();
  }

  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values) || {};

    model.is_public = model.is_public;

    model.categories =  this.state.value;

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
    // Convert tech_reqs for API
    model.tech_reqs = model.tech_reqs.filter(w => w.value);

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const { model } = this.props;
    if (!model) {
      return {};
    }
    const { abouts } = model;
    let v = {};

    //Convert slug for redux-form
    v.slug = model.slug;

    //Convert title for redux-form
    v.title = model.title;

    v.abouts = populateMultiLanguageObject("abouts", abouts);

    v.is_public = model.is_public;
    v.categories = model.categories;
    v.users = model.users || [];
    v.price = model.price;
    v.duration = model.duration;
    v.tech_arts = createMultiLanguageInitialObject("tech_arts");
    v.tech_reqs = createMultiLanguageInitialObject("tech_reqs");

    // Convert tech_arts format for FieldArray redux-form
    /*v.tech_arts = [];
        if (Array.isArray(model.tech_arts)) {

            // convert current lang
            v.tech_arts = model.tech_arts.map(x => ({
                key: `tech_arts.${x.lang}`,
                value: x.text
            }));
        }

        locales.forEach(l => {
            let found = v.tech_arts.filter(o => o.key === `tech_arts.${l}`).length > 0;
            if (!found) {
                v.tech_arts.push({
                    key: `tech_arts.${l}`,
                    value: ""
                })
            }
        });
        v.tech_reqs = [];
        if (Array.isArray(model.tech_reqs)) {

            // convert current lang
            v.tech_reqs = model.tech_reqs.map(x => ({
                key: `tech_reqs.it`,
                value: x
            }));
        }

        locales.forEach(l => {
            let found = v.tech_reqs.filter(o => o.key === `tech_reqs.${l}`).length > 0;
            if (!found) {
                v.tech_reqs.push({
                    key: `tech_reqs.${l}`,
                    value: ""
                })
            }
        });
        */
    return v;
  }

  onSubmit(values) {
    const { showModal, saveModel, model } = this.props;
    const modelToSave = this.createModelToSave(values);
    modelToSave._id = model._id;

    //dispatch the action to save the model here
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model._id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  }

  render() {
    const {
      model = {},
      showModal,
      match: {
        params: { _id }
      },
      isFetching,
      errorMessage,
      categories
    } = this.props;
    return (
      <div className="row">
        <div className="col-md-2">
          <LateralMenu _id={_id} />
        </div>
        <div className="col-md-10">
          {isFetching && !model && <Loading />}

          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

          {!errorMessage && !isFetching && !model && <ItemNotFound />}

          {!errorMessage && !isFetching && model && (
            <TitleComponent title={model.title} type={PERFORMANCE_NAME} />
          )}

          <Form
            initialValues={this.getInitialValues()}
            onSubmit={this.onSubmit.bind(this)}
            model={model}
            showModal={showModal}
            tabs={locales}
            labels={locales_labels}
            categories={categories}
            _id={_id}

            style={{ width: 300 }}
            transitionName="rc-tree-select-dropdown-slide-up"
            choiceTransitionName="rc-tree-select-selection__choice-zoom"
            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
            searchPlaceholder="please search"
            showSearch={true} 
            allowClear={true} 
            treeLine={true}
            searchValue={this.state.searchValue}
            value={this.state.value}
            treeData={categories}
            treeNodeFilterProp="label"
            filterTreeNode={false}
            onSearch={this.onSearch}
            open={this.state.tsOpen}
            onDropdownVisibleChange={(v, info) => {
              console.log('single onDropdownVisibleChange', v, info);
              // document clicked
              if (info.documentClickClose && this.state.value === '0-0-0-0-value') {
                return false;
              }
              this.setState({
                tsOpen: v,
              });
              return true;
            } }
            onSelect={this.onSelect}
           
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
      params: { _id }
    }
  }
) => ({
  model: getModel(state, _id),
  isFetching: getModelIsFetching(state, _id),
  errorMessage: getModelErrorMessage(state, _id),
  categories: getCategories(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveModel,
      fetchModel,
      showModal,
      fetchCategories
    },
    dispatch
  );

PerformancePublic = connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformancePublic);

export default PerformancePublic;
