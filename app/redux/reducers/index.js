import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import modal from '../components/modal/reducers';
import profiles from '../components/profile/reducers';
import countries from '../components/countries/reducers';
import categories from '../components/categories/reducers';
import events from '../components/events/reducers';
import performances from '../components/performances/reducers';

// import crews from './crews';
// import performances from './performances';
// import preferences from './preferences';

const reducer = combineReducers({
    events,
    profiles,
    countries,
    categories,
    //preferences,
    performances,
    //crews,
    form: formReducer,
    modal
});

export default reducer;
