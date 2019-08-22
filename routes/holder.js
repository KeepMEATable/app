import React from 'react';
import { Scene, Actions } from 'react-native-router-flux';
import Show from '../components/holder/Show';
import {delayRefresh} from '../utils/helpers';

export default [
  <Scene key="holderShow" component={Show}
     title="Holder"
     onLeft={() => {
       Actions.pop();
       delayRefresh();
 }}/>,
];
