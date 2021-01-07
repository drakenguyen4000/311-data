import axios from 'axios';
import {
  takeLatest,
  call,
  put,
  all,
} from 'redux-saga/effects';

import {
  types,
  getMetadataSuccess,
  getRequestTypesSuccess,
  getCouncilsSuccess,
  getRegionsSuccess,
  getMetadataFailure,
} from '../reducers/metadata';

function* getMetadata() {
  const baseUrl = process.env.API_URL;
  try {
    const [metadata, requestTypes, councils, regions] = yield all([
      call(axios.get, `${baseUrl}/status/api`),
      call(axios.get, `${baseUrl}/types`),
      call(axios.get, `${baseUrl}/councils`),
      call(axios.get, `${baseUrl}/regions`),
    ]);
    const { data: statusMetadata } = metadata;
    const { data: typesMetadata } = requestTypes;
    const { data: councilsMetadata } = councils;
    const { data: regionsMetadata } = regions;

    yield all([
      put(getMetadataSuccess(statusMetadata)),
      put(getRequestTypesSuccess(typesMetadata)),
      put(getCouncilsSuccess(councilsMetadata)),
      put(getRegionsSuccess(regionsMetadata)),
    ]);
  } catch (e) {
    yield put(getMetadataFailure(e));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_METADATA_REQUEST, getMetadata);
}
