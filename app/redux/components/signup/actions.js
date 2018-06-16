import * as api from '../../api';
import {signup} from './schema'
import {saveModel as generateSaveModel} from '../../actions';
import * as selectors from "./selectors";
import * as constants from './constants'


export const saveModel = (model) => generateSaveModel({
    selectors,
    constants,
    request: api.saveSignupPublic,
    schema: signup,
    model,
});
