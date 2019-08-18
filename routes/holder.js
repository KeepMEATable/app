import React from 'react';
import { Scene, Actions } from 'react-native-router-flux';
import List from '../components/holder/List';
import Create from '../components/holder/Create';
import Show from '../components/holder/Show';
import Update from '../components/holder/Update';
import {delayRefresh} from '../utils/helpers';

export default [
          <Scene
              rightTitle="Add"
              onRight={() => Actions.holderCreate()}
              key="holderList" component={List}
              title="List of Holders"
              initial
          />,
          <Scene key="holderCreate" component={Create}
                 title="Add a new holder"/>,
          <Scene key="holderShow" component={Show}
                 title="Holder"
                 leftTitle="< List of Holders"
                 onLeft={() => {
                   Actions.pop();
                   delayRefresh();
                 }}/>,
          <Scene key="holderUpdate" component={Update}
                 title="Update Holder"/>,
];
