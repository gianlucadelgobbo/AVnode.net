import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import modal from '../components/modal/reducers';
import profile from '../components/profile/reducers';
import countries from '../components/countries/reducers';

import crews from './crews';
import performances from './performances';
import events from './events';
import preferences from './preferences';

const reducer = combineReducers({
    //events,
    //performances,
    //crews,
    profile,
    countries,
    //preferences,
    form: formReducer,
    modal
});

export default reducer;
