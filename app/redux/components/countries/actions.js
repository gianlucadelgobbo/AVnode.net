import * as api from '../../api';
import {arrayOfCountry} from './schema'
import {fetchList as generateFetchList} from '../../actions/'
import * as selectors from "./selectors";
import * as constants from './constants'

export const fetchList = () => generateFetchList({
    selectors,
    constants,
    schema: arrayOfCountry,
    request: api.fetchCountries,
});
