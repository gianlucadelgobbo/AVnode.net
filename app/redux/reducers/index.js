import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import modal from "../components/modal/reducers";
import profiles from "../components/profile/reducers";
import countries from "../components/countries/reducers";
import categories from "../components/categories/reducers";
import events from "../components/events/reducers";
import performances from "../components/performances/reducers";
import crews from "../components/crews/reducers";
import users from "../components/performances/users/reducers";
import partnerCategories from "../components/partnerCategories/reducers";
import footage from "../components/footage/reducers";
import playlists from "../components/playlists/reducers";
import signup from "../components/signup/reducers";
// import preferences from './preferences';

const reducer = combineReducers({
  events,
  profiles,
  countries,
  categories,
  users,
  //preferences,
  performances,
  crews,
  form: formReducer,
  modal,
  partnerCategories,
  footage,
  playlists,
  signup
});

export default reducer;
