import React from "react";
import Textarea from "react-textarea-autosize";
import { Button, ButtonGroup } from "react-bootstrap";
import { Field, FieldArray } from "redux-form";
import PlacesAutocomplete from "react-places-autocomplete";
import Select, { Async } from "react-select";
import "react-select/dist/react-select.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Dropzone from "react-dropzone";
import {
  MODAL_ADD_USER_PERFORMANCE,
  MODAL_REMOVE
} from "../../modal/constants";
import TimePicker from "react-times";
import "react-times/css/classic/default.css";
import ReactTooltip from "react-tooltip";
import "react-phone-number-input/rrui.css";
import "react-phone-number-input/style.css";
import Phone from "react-phone-number-input";
import Reorder from "../../reorder";
import Autosuggest from "react-autosuggest";
import { fetchPerformancesForSelect, fetchUserForSelect } from "../../../api";
import { createMultiLanguageInitialObject } from "../../common/form";
import { DATE_FORMAT } from "../../../conf";
import { WithContext as ReactTags } from "react-tag-input";
import { Collapse } from "react-collapse";
import { FormattedMessage } from "react-intl";
import { FILE_UPLOAD, SUBSCRIPTIONS } from "../../common/form/labels";
import TreeSelect from "rc-tree-select";
import "rc-tree-select/assets/index.css";
import { Player } from "video-react";
import "video-react/dist/video-react.css";

export const autocompleteComponent = ({
  inputProps,
  suggestions,
  placeholder,
  getSuggestionValue,
  renderSuggestion,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested,
  getSuggestionID
}) => {
  const label = <div className="labelField">{placeholder}</div>;

  const field = (
    <div>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        getSuggestionID={getSuggestionID}
      />
    </div>
  );

  return (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const reactTreeComponent = ({
  style,
  transitionName,
  choiceTransitionName,
  dropdownStyle,
  placeholder,
  searchPlaceholder,
  showSearch,
  allowClear,
  treeLine,
  myvalue,
  treeData,
  treeNodeFilterProp,
  filterTreeNode,
  onChange,
  searchValue,
  onSearch,
  open,
  onDropdownVisibleChange,
  onSelect
}) => {
  const label = <div className="labelField">{placeholder}</div>;

  const field = (
    <div>
      <TreeSelect
        style={style}
        transitionName={transitionName}
        choiceTransitionName={choiceTransitionName}
        dropdownStyle={dropdownStyle}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        showSearch={showSearch}
        allowClear={allowClear}
        treeLine={treeLine}
        value={myvalue}
        searchValue={searchValue}
        treeData={treeData}
        treeNodeFilterProp={treeNodeFilterProp}
        filterTreeNode={filterTreeNode}
        onChange={onChange}
        onSearch={onSearch}
        onDropdownVisibleChange={onDropdownVisibleChange}
        open={open}
        onSelect={onSelect}
      />
    </div>
  );

  return (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const googleAutocompleteSelect = ({
  input,
  meta,
  placeholder,
  options,
  isChild
}) => {
  const renderFunc = ({
    getInputProps,
    getSuggestionItemProps,
    suggestions
  }) => (
    <div className="autocomplete-root">
      <input
        {...getInputProps({
          placeholder: "Search Places ...",
          className: "form-control location-search-input"
        })}
      />

      <div className="autocomplete-dropdown-container">
        {suggestions.map(suggestion => {
          const className = suggestion.active
            ? "suggestion-item--active"
            : "suggestion-item";
          // inline style for demonstration purpose
          const style = suggestion.active
            ? { backgroundColor: "#fafafa", cursor: "pointer" }
            : { backgroundColor: "#ffffff", cursor: "pointer" };
          return (
            <div {...getSuggestionItemProps(suggestion, { className, style })}>
              <span>{suggestion.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const field = (
    <div className="form-group">
      <PlacesAutocomplete {...input} options={options}>
        {renderFunc}
      </PlacesAutocomplete>
      {meta.error && meta.touched && (
        <span className="error-message">
          {isChild ? (
            <FormattedMessage id={meta.error._error} />
          ) : (
            <FormattedMessage id={meta.error} />
          )}
        </span>
      )}
    </div>
  );

  const label = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const performanceAutocompleteSelect = ({
  input,
  meta,
  multi = false,
  placeholder,
  options,
  isChild
}) => {
  const field = (
    <div className="form-group">
      <Async
        multi={multi}
        className="form-control"
        {...input}
        onBlurResetsInput={false}
        onCloseResetsInput={false}
        onSelectResetsInput={false}
        onBlur={() => {
          input.onChange(input.value);
        }}
        valueKey="_id"
        labelKey="title"
        loadOptions={fetchPerformancesForSelect}
      />
      {meta.error && meta.touched && (
        <span className="error-message">
          {isChild ? (
            <FormattedMessage id={meta.error._error} />
          ) : (
            <FormattedMessage id={meta.error} />
          )}
        </span>
      )}
    </div>
  );

  const label = <div className="labelField">{placeholder}</div>;

  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const userAutocompleteSelect = ({
  input,
  meta,
  multi = false,
  placeholder,
  options,
  isChild
}) => {
  const field = (
    <div className="form-group">
      <Async
        multi={multi}
        className="form-control"
        {...input}
        onBlurResetsInput={false}
        onCloseResetsInput={false}
        onSelectResetsInput={false}
        onBlur={() => {
          input.onChange(input.value);
        }}
        valueKey="_id"
        labelKey="title"
        loadOptions={fetchUserForSelect}
      />
      {meta.error && meta.touched && (
        <span className="error-message">
          {isChild ? (
            <FormattedMessage id={meta.error._error} />
          ) : (
            <FormattedMessage id={meta.error} />
          )}
        </span>
      )}
    </div>
  );

  const label = <div className="labelField">{placeholder}</div>;

  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const renderList = ({
  input,
  meta,
  placeholder,
  options,
  isChild,
  multiple,
  clearable
}) => {
  const field = (
    <div className="form-group">
      <Select
        {...input}
        name={input.name}
        value={input.value}
        onBlur={() => {
          input.onChange(input.value);
          input.onBlur();
        }}
        options={options}
        multi={multiple}
        clearable={clearable}
        onChange={input.onChange}
        placeholder={placeholder}
      />
      {meta.error && meta.touched && (
        <span className="error-message">
          <FormattedMessage id={meta.error} />
        </span>
      )}
    </div>
  );
  const label = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

const inputField = ({
  input,
  type,
  meta,
  placeholder,
  isChild,
  handleSelect
}) => {
  const field = (
    <div className="form-group">
      <input
        type={type}
        className="form-control"
        {...input}
        placeholder={placeholder}
      />
      {meta.error && meta.touched && (
        <span className="error-message">
          <FormattedMessage id={meta.error} />
        </span>
      )}
    </div>
  );
  const label = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const inputText = ({ input, meta, placeholder, isChild }) => {
  return inputField({ input, type: "text", meta, placeholder, isChild });
};

export const inputPassword = ({ input, meta, placeholder, isChild }) => {
  return inputField({ input, type: "password", meta, placeholder, isChild });
};

export const inputUrl = ({ input, meta, placeholder, isChild }) => {
  return inputField({ input, type: "url", meta, placeholder, isChild });
};

export const inputTel = ({ input, meta, placeholder, isChild }) => {
  const field = (
    <div className="form-group">
      <Phone {...input} placeholder={placeholder} className="form-control" />
      {meta.error && meta.touched && (
        <span className="error-message">
          <FormattedMessage id={meta.error} />
        </span>
      )}
    </div>
  );
  const label = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const inputEmail = ({ input, meta, placeholder, isChild }) => {
  return inputField({ input, type: "email", meta, placeholder, isChild });
};

export const inputCheckbox = ({ input, meta, placeholder, isChild }) => {
  return inputField({ input, type: "checkbox", meta, placeholder, isChild });
};

export const textarea = ({ input, id, meta, placeholder, isChild }) => {
  const field = (
    <div className="form-group">
      {/*placeholder && <label htmlFor="first_name">{placeholder}</label>*/}
      <Textarea
        id={id}
        className="form-control"
        {...input}
        placeholder={placeholder}
      />
      {meta.error && meta.touched && (
        <span className="error-message">
          <FormattedMessage id={meta.error} />
        </span>
      )}
    </div>
  );
  const label = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};
export const textareaMultiTab = ({
  tabs = [],
  name,
  labels = {},
  placeholder,
  fields,
  errors = {}
}) => {
  const id = `tabs-${Math.random()}`;
  const hasValue = (fields, index) =>
    fields && !!fields.get(index) && !!fields.get(index).value;
  const hasError = (errors = {}, index, name) =>
    errors[name] && errors[name][index] && !!errors[name][index].value;
  const label = <div className="labelField">{placeholder}</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
      </div>
      <div className="card-body">
        <br />

        <ul className="nav nav-pills justify-content-center">
          {tabs.map((k, index) => (
            <li className="nav-item" key={index}>
              <a
                className={"nav-link " + (index === 0 ? "active" : "")}
                data-toggle="pill"
                href={`#${id}${index}`}
              >
                {hasError(errors, index, fields.name) ? "! " : ""}
                {labels[k]}
                {hasValue(fields, index) ? "" : "*"}
              </a>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          {fields.map((member, index) => {
            return (
              <div
                key={index}
                className={
                  "tab-pane container " + (index === 0 ? "active" : "")
                }
                id={`${id}${index}`}
              >
                <Field
                  name={`${member}.value`}
                  component={textarea}
                  isChild={true}
                />
              </div>
            );
          })}
        </div>

        {Object.keys(errors[fields.name] || {}).length && (
          <span className="error-message">Check tabs marked with "!"</span>
        )}
      </div>
    </div>
  );
};

export const multiInputUrl = ({
  fields,
  title,
  showModal,
  placeholder,
  meta: { error }
}) => {
  return multiInput({
    fields,
    title,
    meta: { error },
    showModal,
    placeholder,
    render: inputUrl,
    key: "url",
    isChild: true
  });
};

export const multiInputText = ({
  fields,
  title,
  showModal,
  placeholder,
  meta: { error }
}) => {
  return multiInput({
    fields,
    title,
    meta: { error },
    showModal,
    placeholder,
    render: inputText,
    key: "text",
    isChild: true
  });
};

export const multiInputEmail = ({
  fields,
  title,
  showModal,
  placeholder,
  meta: { error }
}) => {
  return multiInput({
    fields,
    title,
    meta: { error },
    showModal,
    placeholder,
    render: inputEmail,
    key: "text",
    isChild: true
  });
};

export const multiInputCheckbox = ({
  fields,
  title,
  showModal,
  placeholder,
  meta: { error }
}) => {
  return multiInput({
    fields,
    title,
    meta: { error },
    showModal,
    placeholder,
    render: checkboxField,
    key: "checkbox",
    isChild: true
  });
};

// multiInputCheckboxes // Refactoring // Users in Performances

export const fieldWithLabel = ({
  fields,
  _id,
  showModal,
  placeholder,
  meta: { error }
}) => {
  const renderSubField = (member, index, fields, showModal) => {
    return (
      <div className={"row " + (index % 2 === 0 ? "even" : "odd")} key={index}>
        <div className="col-md-10">
          <Field
            name={`${member}.stagename`}
            component={fieldInColumn}
            placeholder={placeholder}
            isChild={true}
          />
        </div>
        <div className="col-md-2">
          <Button
            bsStyle="danger"
            onClick={() =>
              showModal({
                type: MODAL_REMOVE,
                props: {
                  onRemove: () => fields.remove(index)
                }
              })
            }
          >
            <i
              className="fa fa-trash"
              data-toggle="tooltip"
              data-placement="top"
            />
          </Button>
        </div>
      </div>
    );
  };
  const label = <div className="labelField">{placeholder}</div>;
  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          //onClick={() => fields.unshift({})}
          onClick={() =>
            showModal({
              type: MODAL_ADD_USER_PERFORMANCE,
              props: { _id }
            })
          }
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField(member, index, fields, showModal)
        )}
      </div>
    </div>
  );
};

export const multiInputEmailWithDetails = ({
  fields,
  title,
  showModal,
  placeholder,
  meta: { error },
  onVerifyEmail,
  modelEmails
}) => {
  const renderSubField = (member, index, fields, showModal) => {
    const field = fields.get(index);
    const { is_confirmed, _id } = field;

    const isNewEmail = typeof _id === "undefined";
    const emailIsStored = !isNewEmail;
    const emailIsStoredAndNotConfirmed = emailIsStored && !is_confirmed;
    const showAdditionalInfo = emailIsStored && is_confirmed;
    const showVerifyButton = emailIsStoredAndNotConfirmed;

    return (
      <div
        className={"container-fluid " + (index % 2 === 0 ? "even" : "odd")}
        key={_id || index}
      >
        <div className="row ">
          <div className="col-md-5 offset-1">
            <Field
              name={`${member}.email`}
              component={inputEmail}
              placeholder={placeholder}
              isChild={true}
            />
          </div>

          {showVerifyButton && (
            <div className="col-md-5">
              <div className="row">
                <Button bsStyle="primary" onClick={() => onVerifyEmail(field)}>
                  Verify!
                </Button>
              </div>
            </div>
          )}

          {showAdditionalInfo && (
            <div className="col-md-5">
              <div className="row">
                <div className="col-md-4">
                  <Field
                    name={`${member}.is_public`}
                    component={checkboxField}
                    placeholder={<div>Is public</div>}
                    isChild={true}
                  />
                </div>

                <div className="col-md-4">
                  <Field
                    disabled={!is_confirmed}
                    name={`${member}.is_primary`}
                    component={checkboxField}
                    placeholder={
                      <div data-tip="To set as primary, confirm the email first">
                        Is primary
                        <ReactTooltip />
                      </div>
                    }
                    isChild={true}
                  />
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <span className="badge badge-success">Is confirmed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="col-md-1">
            <Button
              bsStyle="danger"
              onClick={() =>
                showModal({
                  type: MODAL_REMOVE,
                  props: {
                    onRemove: () => fields.remove(index)
                  }
                })
              }
            >
              <i
                className="fa fa-trash"
                data-toggle="tooltip"
                data-placement="top"
              />
            </Button>
          </div>
        </div>

        {showAdditionalInfo && (
          <div className="row">
            <div className="col-sm-11 offset-1 email-subscriptions">
              <FormattedMessage id={SUBSCRIPTIONS} />

              <div className="row">
                <div className="col-md-3">
                  <Field
                    name={`${member}.mailinglists.flxer`}
                    component={checkboxField}
                    placeholder={<div>FLxER</div>}
                    isChild={true}
                  />
                </div>
                <div className="col-md-3">
                  <Field
                    name={`${member}.mailinglists.flyer`}
                    component={checkboxField}
                    placeholder={<div>Flyer</div>}
                    isChild={true}
                  />
                </div>
                <div className="col-md-3">
                  <Field
                    name={`${member}.mailinglists.livevisuals`}
                    component={checkboxField}
                    placeholder={<div>Live Visuals</div>}
                    isChild={true}
                  />
                </div>
                <div className="col-md-3">
                  <Field
                    name={`${member}.mailinglists.updates`}
                    component={checkboxField}
                    placeholder={<div>Updates</div>}
                    isChild={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <hr />
      </div>
    );
  };
  const label = <div className="labelField">{placeholder}</div>;
  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          onClick={() => fields.unshift({})}
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField(member, index, fields, showModal)
        )}
      </div>
    </div>
  );
};

export const multiInputTel = ({
  fields,
  title,
  showModal,
  placeholder,
  meta: { error }
}) => {
  return multiInput({
    fields,
    title,
    meta: { error },
    showModal,
    placeholder,
    render: inputTel,
    key: "tel",
    isChild: true
  });
};

export const multiGoogleCityCountry = ({
  fields,
  title,
  showModal,
  placeholder,
  meta: { error }
}) => {
  return multiInput({
    showModal,
    fields,
    title,
    placeholder,
    meta: { error },
    render: googleAutocompleteSelect,
    key: "text",
    options: {
      types: ["(city)"]
    },
    isChild: true
  });
};

export const singleGoogleCityCountry = ({
  fields,
  title,
  showModal,
  placeholder,
  meta: { error }
}) => {
  return singleInput({
    showModal,
    fields,
    title,
    placeholder,
    meta: { error },
    render: googleAutocompleteSelect,
    key: "text",
    options: {
      types: ["(city)"]
    },
    isChild: false
  });
};

export const multiGoogleAddress = ({
  fields,
  title,
  placeholder,
  meta: { error },
  showModal
}) => {
  return multiInput({
    showModal,
    fields,
    placeholder,
    title,
    meta: { error },
    render: googleAutocompleteSelect,
    key: "text",
    options: {
      types: ["(address)"]
    },
    isChild: true
  });
};

const singleInput = ({
  fields,
  title,
  meta: { error },
  render,
  placeholder,
  key,
  showModal
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const renderSubField = ({ fields, render, key = "text" }) => (
    <Field
      name="addresses"
      placeholder={placeholder}
      component={render}
      isChild={false}
    />
  );

  return <div>{renderSubField({ fields, render, key, showModal })}</div>;
};

const multiInput = ({
  fields,
  title,
  meta: { error },
  render,
  placeholder,
  key,
  showModal
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const renderSubField = ({ member, index, fields, render, key = "text" }) => (
    <div className="row" key={index}>
      <div className="col-md-9 offset-1">
        <Field
          name={`${member}.${key}`}
          placeholder={placeholder}
          component={render}
          isChild={true}
        />
      </div>
      <div className="col-md-2">
        >
        <Button
          bsStyle="danger"
          onClick={() =>
            showModal({
              type: MODAL_REMOVE,
              props: {
                onRemove: () => fields.remove(index)
              }
            })
          }
        >
          <i
            className="fa fa-trash"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          onClick={() => fields.unshift({})}
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField({ member, index, fields, render, key, showModal })
        )}
      </div>
    </div>
  );
};

export const renderListRadio = ({
  input,
  meta,
  placeholder,
  options,
  isChild
}) => {
  const field = (
    <div className="form-group">
      <ButtonGroup>
        {options.map(option => (
          <Button
            key={option[0]}
            bsStyle={option[0] === input.value ? "primary" : "default"}
            children={option[1]}
            name={input.name}
            onClick={input.onChange}
            value={option[0]}
          />
        ))}
      </ButtonGroup>
      {meta.error && meta.touched && (
        <span className="error-message">
          <FormattedMessage id={meta.error} />
        </span>
      )}
    </div>
  );
  const label = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const tagsInput = ({
  meta,
  placeholder,
  isChild,
  tags,
  delimiters,
  handleTagClick,
  handleDelete,
  handleAddition
}) => {
  const field = (
    <div className="form-group">
      <ReactTags
        tags={tags}
        //suggestions={suggestions}
        handleAddition={handleAddition}
        handleDelete={handleDelete}
        handleTagClick={handleTagClick}
        delimiters={delimiters}
      />
      {meta.error && meta.touched && (
        <span className="error-message">
          <FormattedMessage id={meta.error} />
        </span>
      )}
    </div>
  );
  const label = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const renderDatePicker = ({ input, meta, placeholder, isChild }) => {
  const field = (
    <div className="form-group">
      <DatePicker
        {...input}
        value={null}
        dateFormat={DATE_FORMAT}
        className="form-control"
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        selected={input.value ? moment(input.value, DATE_FORMAT) : null}
        placeholderText={placeholder}
      />
      {meta.error && meta.touched && (
        <span className="error-message">
          <FormattedMessage id={meta.error} />
        </span>
      )}
    </div>
  );
  const label = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const renderTimePicker = ({
  input,
  meta,
  withoutIcon,
  timeMode = "24",
  className,
  placeholder,
  isChild
}) => {
  const field = (
    <div className="form-group">
      <TimePicker
        className={className}
        onTimeChange={input.onChange}
        time={input.value}
        timeMode={timeMode}
        theme="classic"
        withoutIcon={withoutIcon}
      />
      ,
      {meta.error && meta.touched && (
        <span className="error-message">
          <FormattedMessage id={meta.error} />
        </span>
      )}
    </div>
  );
  const label = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

export const checkboxField = ({
  input,
  meta,
  id,
  placeholder,
  disabled,
  classNames,
  isChild
}) => {
  const field = (
    <div className="form-check">
      {isChild && placeholder && <label htmlFor={id}>{placeholder}</label>}
      <input
        id={id}
        defaultChecked={input.value}
        className="form-check-input"
        type="checkbox"
        {...input}
        disabled={disabled}
      />
    </div>
  );
  const label = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};

//Refactoring//
export const fieldInColumn = ({
  input,
  meta,
  id,
  placeholder,
  disabled,
  classNames,
  isChild
}) => {
  const field = (
    <div className="form-group">
      <ul className="user-list">
        <li id={id}>{input.value}</li>
      </ul>
    </div>
  );
  const list = <div className="labelField">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dd className="col-sm-12"> {field} </dd>
    </dl>
  );
};

export const renderDropzoneInput = field => {
  let files = field.input.value;
  let myClassName = field.className === undefined ? "" : field.className;
  const getExtensionIcon = (name = "") => {
    let extension =
      name.replace(/\s/g, "").slice(((name.lastIndexOf(".") - 1) >>> 0) + 2) ||
      "Unknown";
    extension = extension.toLocaleLowerCase();
    switch (extension) {
      case "pdf":
        return (
          <span key={name} className="label label-default">
            PDF
          </span>
        );
      case "png":
        return (
          <span key={name} className="label label-default">
            PNG
          </span>
        );
      default:
        return (
          <span key={name} className="label label-default">
            {extension}
          </span>
        );
    }
  };

  function formatBytes(bytes, decimals) {
    if (bytes === 0) return "0 Bytes";
    let k = 1000,
      dm = decimals + 1 || 3,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <div className={`${myClassName} form-group`}>
      {field.placeholder && <h4 className="labelField">{field.placeholder}</h4>}
      <Dropzone
        className="attachment-dropzone"
        activeClassName="active-dropzone"
        name={field.name}
        accept={field.accept}
        maxSize={field.maxSize || 10485760}
        //name={field.properties.fields.name}
        //accept={field.accept}
        //maxSize={field.properties.maxsize}
        multiple={!!field.multiple || false}
        onDropRejected={() => {
          alert("Ops... it seems your file is invalid");
        }}
        onDrop={filesToUpload => {
          let files = [...field.input.value, ...filesToUpload];
          files = files.filter((item, pos) => files.indexOf(item) === pos);
          files = files.filter(item => item !== "");
          field.input.onChange(files);
        }}
      >
        <div className="labelFieldUpload">
          <FormattedMessage id={FILE_UPLOAD} />
        </div>
      </Dropzone>
      {field.meta.touched && field.meta.error && (
        <span className="error">
          <FormattedMessage id={field.meta.error} />
        </span>
      )}
      {console.log(files)}
      {files && Array.isArray(files) && (
        <ul className="list-unstyled attached-file">
          {files.map((file, i) => (
            <li className="list-upload" key={i}>
              {getExtensionIcon(file.name)} {file.name}
              <span className="file-size">({formatBytes(file.size)})</span>
              {field.uploadButton && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => field.uploadFile(field.input.value)}
                >
                  <i
                    className="fa fa-upload"
                    data-toggle="tooltip"
                    data-placement="top"
                  />
                </button>
              )}
              <button
                type="button"
                className="btn btn-danger clear-attachment"
                onClick={() => {
                  field.showModal({
                    type: MODAL_REMOVE,
                    props: {
                      onRemove: () => {
                        let result = [...files];
                        result.splice(i, 1);
                        field.input.onChange(result);
                      }
                    }
                  });
                }}
              >
                <i
                  className="fa fa-trash"
                  data-toggle="tooltip"
                  data-placement="top"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const multiSchedule = ({
  fields,
  title,
  meta: { error },
  placeholder,
  showModal
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const renderSubField = ({ member, index, fields }) => {
    return (
      <div className={"row " + (index % 2 === 0 ? "even" : "odd")} key={index}>
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
                  types: ["establishment"]
                }}
                isChild={true}
              />
            </div>
            <div className="col-md-6">
              <Field
                name={`${member}.room`}
                component={inputText}
                placeholder="Room"
                isChild={true}
              />
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <Button
            bsStyle="danger"
            onClick={() =>
              showModal({
                type: MODAL_REMOVE,
                props: {
                  onRemove: () => fields.remove(index)
                }
              })
            }
          >
            <i
              className="fa fa-trash"
              data-toggle="tooltip"
              data-placement="top"
            />
          </Button>
        </div>

        <div className="col-md-12">
          <hr />
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          onClick={() => fields.unshift({})}
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField({ member, index, fields, showModal })
        )}
      </div>
    </div>
  );
};

export const multiProgram = ({
  fields,
  title,
  meta: { error },
  placeholder,
  showModal,
  categories
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const renderSubField = ({ member, index, fields }) => {
    return (
      <div className={"row " + (index % 2 === 0 ? "even" : "odd")} key={index}>
        <div className="col-md-9 offset-1">
          <div className="row">
            <div className="col-md-12">
              <Field
                name={`${member}.performance`}
                component={performanceAutocompleteSelect}
                placeholder="Performance"
              />
            </div>
            {/* <div className="col-md-12">
                        <Field
                            name={`${member}.categories`}
                            component={renderList}
                            placeholder="Category"
                            multiple={true}
                            options={categories}
                        />
                    </div>*/}
          </div>

          {/*                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <Field
                            name={`${member}.startdate`}
                            component={renderDatePicker}
                            placeholder="Start Date"
                        />
                    </div>
                    <div className="col-md-12">
                        <Field
                            name={`${member}.starttime`}
                            component={renderTimePicker}
                            placeholder="Start time"
                        />
                    </div>
                </div>

                <hr/>

                <div className="row">

                    <div className="col-md-12">
                        <Field
                            name={`${member}.enddate`}
                            component={renderDatePicker}
                            placeholder="End date"
                        />
                    </div>
                    <div className="col-md-12">
                        <Field
                            name={`${member}.endtime`}
                            component={renderTimePicker}
                            placeholder="End time"
                        />
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <Field
                            name={`${member}.venue`}
                            component={googleAutocompleteSelect}
                            placeholder="Venue"
                            options={{
                                types: ['establishment']
                            }}
                        />
                    </div>
                    <div className="col-md-12">
                        <Field
                            name={`${member}.room`}
                            component={inputText}
                            placeholder="Room"
                        />
                    </div>
                </div>*/}
        </div>

        <div className="col-md-2">
          >
          <Button
            bsStyle="danger"
            onClick={() =>
              showModal({
                type: MODAL_REMOVE,
                props: {
                  onRemove: () => fields.remove(index)
                }
              })
            }
          >
            <i
              className="fa fa-trash"
              data-toggle="tooltip"
              data-placement="top"
            />
          </Button>
        </div>

        {/*<div className="col-md-12">*/}
        {/*<hr/>*/}
        {/*</div>*/}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          onClick={() => fields.unshift({})}
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField({ member, index, fields, showModal })
        )}
      </div>
    </div>
  );
};

export const multiPackages = ({
  fields,
  title,
  meta: { error },
  placeholder,
  showModal,
  tabs,
  labels
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const renderSubField = ({ member, index, fields }) => {
    return (
      <div className={"row " + (index % 2 === 0 ? "even" : "odd")} key={index}>
        <div className="col-md-9 offset-1">
          <Field
            name={`${member}.name`}
            component={inputText}
            placeholder="Name"
          />

          <Field
            name={`${member}.price`}
            component={inputText}
            placeholder="Price"
          />

          <FieldArray
            name={`${member}.description`}
            component={textareaMultiTab}
            tabs={tabs}
            labels={labels}
            placeholder="Description"
          />

          <br />

          <Field
            name={`${member}.personal`}
            component={checkboxField}
            placeholder="Personal"
          />

          <Field
            name={`${member}.requested`}
            component={checkboxField}
            placeholder="Requested"
          />

          <Field
            name={`${member}.allow_multiple`}
            component={checkboxField}
            placeholder="Allow multiple"
          />

          <Field
            name={`${member}.allow_options`}
            component={checkboxField}
            placeholder={<p>Allow options</p>}
          />

          <Field
            name={`${member}.options_name`}
            component={inputText}
            placeholder="options name"
          />

          <Field
            name={`${member}.options`}
            component={inputText}
            placeholder="options"
          />

          <Field
            name={`${member}.daily`}
            component={checkboxField}
            placeholder="Daily"
          />

          <Field
            name={`${member}.start_date`}
            component={renderDatePicker}
            placeholder="Start Date"
          />

          <Field
            name={`${member}.end_date`}
            component={renderDatePicker}
            placeholder="End Date"
          />
        </div>

        <div className="col-md-2">
          >
          <Button
            bsStyle="danger"
            onClick={() =>
              showModal({
                type: MODAL_REMOVE,
                props: {
                  onRemove: () => fields.remove(index)
                }
              })
            }
          >
            <i
              className="fa fa-trash"
              data-toggle="tooltip"
              data-placement="top"
            />
          </Button>
        </div>

        <div className="col-md-12">
          <hr />
        </div>
      </div>
    );
  };

  //Initial obj
  const v = {};
  v.description = createMultiLanguageInitialObject("description");

  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          onClick={() => fields.unshift(v)}
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField({ member, index, fields, showModal })
        )}
      </div>
    </div>
  );
};

export const multiTopic = ({
  fields,
  title,
  meta: { error },
  placeholder,
  showModal,
  tabs,
  labels
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const renderSubField = ({ member, index, fields }) => {
    return (
      <div className={"row " + (index % 2 === 0 ? "even" : "odd")} key={index}>
        <div className="col-md-9 offset-1">
          <Field
            name={`${member}.title`}
            component={inputText}
            placeholder="Call name"
            showModal={showModal}
          />

          <FieldArray
            name={`${member}.description`}
            component={textareaMultiTab}
            tabs={tabs}
            labels={labels}
            placeholder="Description"
            showModal={showModal}
          />

          <br />
        </div>

        <div className="col-md-2">
          >
          <Button
            bsStyle="danger"
            onClick={() =>
              showModal({
                type: MODAL_REMOVE,
                props: {
                  onRemove: () => fields.remove(index)
                }
              })
            }
          >
            <i
              className="fa fa-trash"
              data-toggle="tooltip"
              data-placement="top"
            />
          </Button>
        </div>

        <div className="col-md-12">
          <hr />
        </div>
      </div>
    );
  };
  //Initial obj
  const v = {};
  v.description = createMultiLanguageInitialObject("description");

  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          onClick={() => fields.unshift(v)}
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField({ member, index, fields, showModal })
        )}
      </div>
    </div>
  );
};

export const multiCall = ({
  fields,
  title,
  meta: { error },
  placeholder,
  showModal,
  categories,
  tabs,
  labels
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const renderSubField = ({ member, index, fields, showModal }) => {
    return (
      <div className={"row " + (index % 2 === 0 ? "even" : "odd")} key={index}>
        <div className="col-md-9 offset-1">
          <Field
            name={`${member}.title`}
            component={inputText}
            placeholder="Call name"
          />

          <Field
            name={`${member}.email`}
            component={inputEmail}
            placeholder="Email contact"
          />

          <Field
            name={`${member}.slug`}
            component={inputText}
            placeholder="Event URL"
          />

          <Field
            name={`${member}.start_date`}
            component={renderDatePicker}
            placeholder="Start Date"
          />

          <Field
            name={`${member}.end_date`}
            component={renderDatePicker}
            placeholder="End Date"
          />

          <Field
            name={`${member}.categories`}
            component={renderList}
            placeholder="Category"
            multiple={true}
            options={categories}
          />

          <FieldArray
            name={`${member}.excerpt`}
            component={textareaMultiTab}
            tabs={tabs}
            labels={labels}
            placeholder="Event description"
            showModal={showModal}
          />

          <br />

          <FieldArray
            name={`${member}.terms`}
            component={textareaMultiTab}
            tabs={tabs}
            labels={labels}
            placeholder="Event terms"
            showModal={showModal}
          />

          <br />

          <FieldArray
            name={`${member}.closedcalltext`}
            component={textareaMultiTab}
            tabs={tabs}
            labels={labels}
            placeholder="Event Closed Call text"
            showModal={showModal}
          />

          <br />

          <FieldArray
            name={`${member}.packages`}
            component={multiPackages}
            placeholder="Packages"
            tabs={tabs}
            labels={labels}
            showModal={showModal}
          />

          <br />

          <FieldArray
            name={`${member}.topics`}
            component={multiTopic}
            placeholder="Topics"
            tabs={tabs}
            labels={labels}
            showModal={showModal}
          />

          <br />
        </div>

        <div className="col-md-2">
          >
          <Button
            bsStyle="danger"
            onClick={() =>
              showModal({
                type: MODAL_REMOVE,
                props: {
                  onRemove: () => fields.remove(index)
                }
              })
            }
          >
            <i
              className="fa fa-trash"
              data-toggle="tooltip"
              data-placement="top"
            />
          </Button>
        </div>

        <div className="col-md-12">
          <hr />
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          onClick={() => fields.unshift({})}
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField({ member, index, fields, showModal })
        )}
      </div>
    </div>
  );
};

export const sort = ({
  input,
  meta,
  placeholder,
  isChild,
  showModal,
  onRemove
}) => {
  const { onChange, value } = input;
  const items = value || [];

  return (
    <Reorder
      onChange={onChange}
      items={items}
      showModal={showModal}
      onRemove={onRemove}
    />
  );
};

export const multiContacts = ({
  fields,
  title,
  meta: { error },
  placeholder,
  showModal,
  tabs,
  labels
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const renderSubField = ({ member, index, fields }) => {
    return (
      <div className={"row " + (index % 2 === 0 ? "even" : "odd")} key={index}>
        <div className="col-md-10 offset-1">
          <div className="row">
            <div className="col-md-6">
              <Field
                name={`${member}.contact_title`}
                component={renderList}
                placeholder="Organization contact title "
                isChild={true}
                options={[
                  { value: "Mr", label: "Mr" },
                  { value: "Miss", label: "Miss" }
                ]}
              />
            </div>
            <div className="col-md-6">
              <Field
                name={`${member}.role`}
                component={inputText}
                placeholder="Organization contact role"
                isChild={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Field
                name={`${member}.contact_name`}
                component={inputText}
                placeholder="Organization contact name"
                isChild={true}
              />
            </div>
            <div className="col-md-6">
              <Field
                name={`${member}.contact_surname`}
                component={inputText}
                placeholder="Organization contact surname"
                isChild={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Field
                name={`${member}.contact_name`}
                component={renderList}
                placeholder="Organization contact language"
                isChild={true}
                options={tabs.map(l => ({
                  value: l,
                  label: labels[l]
                }))}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 form-group">
              <FieldArray
                name={`${member}.contact_email`}
                component={multiInputEmailWithDetails}
                placeholder="Organisation contact email"
                showModal={showModal}
                isChild={true}
              />
            </div>
          </div>
          <div class="row">
            <div className="col-md-12 form-group">
              <FieldArray
                name="mobile"
                component={multiInputTel}
                placeholder="mobile"
                title="Your Mobile Number"
                showModal={showModal}
              />
            </div>
          </div>
          <div class="row">
            <div className="col-md-12 form-group">
              <FieldArray
                name="skype"
                component={multiInputText}
                placeholder="Skype"
                showModal={showModal}
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 form-group">
              <FieldArray
                name="social"
                component={multiInputUrl}
                placeholder="Social channels"
                title="Socials"
                showModal={showModal}
              />
            </div>
          </div>
          <div className="col-md-2 offset-11">
            <Button
              bsStyle="danger"
              onClick={() =>
                showModal({
                  type: MODAL_REMOVE,
                  props: {
                    onRemove: () => fields.remove(index)
                  }
                })
              }
            >
              <i
                className="fa fa-trash"
                data-toggle="tooltip"
                data-placement="top"
              />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          onClick={() => fields.unshift({})}
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField({ member, index, fields, showModal })
        )}
      </div>
    </div>
  );
};

export const uploadComponent = ({
  fields,
  title,
  meta: { error },
  placeholder,
  showModal,
  uploadButton,
  accept,
  uploadFile,
  media,
  multiple
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const containerVideo = { marginBottom: "20px" };
  const mediaIsAnObj = typeof media === "object";

  const renderSubField = () => {
    return (
      <div className="row">
        <div className="col-md-12">
          <Field
            name="video"
            component={renderDropzoneInput}
            accept={accept}
            showModal={showModal}
            className="enableBorder"
            uploadFile={uploadFile}
            uploadButton={uploadButton}
            multiple={multiple}
          />
        </div>
      </div>
    );
  };
  return (
    <div>
      {mediaIsAnObj && (
        <div className="container-video">
          <div className="row">
            <div className="col-sm-12">
              <div className="labelField">
                <h4>Video</h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <Player playsInline src={media.original} />
            </div>
            <div className="col-sm-6">
              <table className="table-video-detail">
                <tbody>
                  <tr>
                    <th>FILE NAME:</th>
                    <td>{media.title}</td>
                  </tr>
                  <tr>
                    <th>FILE SIZE:</th>
                    <td>{media.filesize}</td>
                  </tr>
                  <tr>
                    <th>MIME TYPE:</th>
                    <td>{media.mimetype}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div>{renderSubField()}</div>
      {/* if array of video */}
      {media && Array.isArray(media) && media.length > 0 && (
        <div className="row">
          {media.map((v, i) => (
            <div className="col-sm-6" key={i}>
              <div style={containerVideo}>
                <div className="labelField">
                  <h4>{v.originalname}</h4>
                </div>
                <Player playsInline src={v.original} />
                <Button
                  className="btn-block"
                  bsStyle="danger"
                  onClick={() =>
                    showModal({
                      type: MODAL_REMOVE,
                      props: {
                        onRemove: () => this.onRemove(i)
                      }
                    })
                  }
                >
                  <i
                    className="fa fa-trash"
                    data-toggle="tooltip"
                    data-placement="top"
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const multiActivities = ({
  fields,
  title,
  meta: { error },
  placeholder,
  showModal,
  tabs,
  labels,
  seasons
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const renderSubField = ({ member, index, fields }) => {
    return (
      <div className={"row " + (index % 2 === 0 ? "even" : "odd")} key={index}>
        <div className="col-md-10 offset-1">
          <div className="row">
            <div className="col-md-6">
              <Field
                name={`${member}.activity_name`}
                component={inputText}
                placeholder="Activity Name"
                isChild={true}
              />
            </div>
            <div className="col-md-6">
              <Field
                name={`${member}.activity_description`}
                component={textarea}
                placeholder="Activity description"
                isChild={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Field
                name="logo"
                component={renderDropzoneInput}
                placeholder="Activity logo (.svg only)"
                isChild={true}
                showModal={showModal}
                className="enableBorder"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Field
                name={`${member}.activity_start_date`}
                component={renderDatePicker}
                placeholder="Activity start date"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Field
                name={`${member}.activity_running`}
                component={renderListRadio}
                placeholder="Activity is running?"
                options={[["act-yes", "Yes"], ["act-no", "No"]]}
                value=""
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Field
                name={`${member}.activity_end_date`}
                component={renderDatePicker}
                placeholder="Activity end date (only if it is not running)"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Field
                name={`${member}.activity_main_season`}
                component={renderList}
                placeholder="Activity main season"
                options={seasons.map(s => ({ label: s, value: s }))}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 form-group">
              <FieldArray
                name={`${member}.activity_city`}
                component={multiGoogleCityCountry}
                placeholder="Activity cities"
                showModal={showModal}
              />
            </div>
          </div>
          <div className="col-md-2 offset-11">
            <Button
              bsStyle="danger"
              onClick={() =>
                showModal({
                  type: MODAL_REMOVE,
                  props: {
                    onRemove: () => fields.remove(index)
                  }
                })
              }
            >
              <i
                className="fa fa-trash"
                data-toggle="tooltip"
                data-placement="top"
              />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          onClick={() => fields.unshift({})}
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField({ member, index, fields, showModal })
        )}
      </div>
    </div>
  );
};

export const multiLegalOrganization = ({
  fields,
  title,
  meta: { error },
  placeholder,
  showModal
}) => {
  const label = <div className="labelField">{placeholder}</div>;
  const renderSubField = ({ member, index, fields }) => {
    return (
      <div className={"row " + (index % 2 === 0 ? "even" : "odd")} key={index}>
        <div className="col-md-10 offset-1">
          <div className="row">
            <div className="col-md-6">
              <Field
                name="legal_representative_title"
                component={renderList}
                isChild={true}
                placeholder="Organization legal representative title"
                options={[
                  { value: "Mr", label: "Mr" },
                  { value: "Miss", label: "Miss" }
                ]}
              />
            </div>
            <div className="col-md-6">
              <Field
                name="legal_representative_role"
                component={inputText}
                isChild={true}
                placeholder="Organization legal representative role"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Field
                name="legal_representative_name"
                component={inputText}
                isChild={true}
                placeholder="Organization legal representative name"
              />
            </div>
            <div className="col-md-6">
              <Field
                name="legal_representative_surname"
                component={inputText}
                isChild={true}
                placeholder="Organization legal representative surname"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 form-group">
              <FieldArray
                name="email"
                component={multiInputEmailWithDetails}
                isChild={true}
                placeholder="Organization legal representative email"
                showModal={showModal}
              />
            </div>
          </div>
          <div className="col-md-2 offset-11">
            <Button
              bsStyle="danger"
              onClick={() =>
                showModal({
                  type: MODAL_REMOVE,
                  props: {
                    onRemove: () => fields.remove(index)
                  }
                })
              }
            >
              <i
                className="fa fa-trash"
                data-toggle="tooltip"
                data-placement="top"
              />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="card">
      <div className="card-header">
        <h4>{label}</h4>
        <Button
          bsStyle="success"
          className="pull-right"
          onClick={() => fields.unshift({})}
        >
          <i
            className="fa fa-plus"
            data-toggle="tooltip"
            data-placement="top"
          />
        </Button>
      </div>
      <div className="card-body">
        <br />
        {error && (
          <span className="error-message">
            <FormattedMessage id={error} />
          </span>
        )}
        {fields.map((member, index, fields) =>
          renderSubField({ member, index, fields, showModal })
        )}
      </div>
    </div>
  );
};

export const CollapsedPanel = ({
  input,
  meta,
  placeholder,
  options,
  height,
  isChild
}) => {
  const field = (
    <div className="form-group">
      <ButtonGroup>
        {options.map(option => (
          <Button
            key={option[0]}
            bsStyle={option[0] === input.value ? "primary" : "default"}
            children={option[1]}
            name={input.name}
            onClick={input.onChange}
            value={option[0]}
          />
        ))}
      </ButtonGroup>
      <Collapse isOpened={input.value === "group"}>
        <div style={{ height }} />
        <Field name="crewName" component={inputText} placeholder="Crew Name" />
        <Field
          name="CrewProfile"
          component={inputText}
          placeholder="Crew Profile Url"
        />
        <h4>YOU AS MEMBER OF THE CREW</h4>
        <p>You will be able to add more once you confirmed your account</p>
      </Collapse>
      {meta.error && meta.touched && (
        <span className="error-message">
          <FormattedMessage id={meta.error} />
        </span>
      )}
    </div>
  );
  const label = <div className="labelSignup">{placeholder}</div>;
  return !!isChild ? (
    field
  ) : (
    <dl className="row">
      <dt className="col-sm-2">{label}</dt>
      <dd className="col-sm-10"> {field} </dd>
    </dl>
  );
};
