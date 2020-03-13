import * as api from '../../api';
import {arrayOfCategories} from './schema'
import {fetchList as generateFetchList} from '../../actions/'
import {fetchEventList as generateFetchEventList} from '../../actions/'
import {fetchVideoList as generateFetchVideoList} from '../../actions/'
import * as selectors from "./selectors";
import * as constants from './constants'

export const fetchList = () => generateFetchList({
    constants,
    selectors,
    schema: arrayOfCategories,
    request: api.fetchPerformancesCategories
});

export const fetchEventList = () => generateFetchEventList({
    constants,
    selectors,
    schema: arrayOfCategories,
    request: api.fetchEventsCategories
});

export const fetchVideoList = () => generateFetchVideoList({
    constants,
    selectors,
    schema: arrayOfCategories,
    request: api.fetchVideosCategories
});
