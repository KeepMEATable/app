import React from 'react';
import { Scene, Actions } from 'react-native-router-flux';
import Show from '../components/waitingLine/Show';
import {delayRefresh} from '../utils/helpers';

export default [
  <Scene key="waitingLineShow" component={Show}
     title="waitingLine"
     onLeft={() => {
       Actions.pop();
       delayRefresh();
 }}/>,
];
