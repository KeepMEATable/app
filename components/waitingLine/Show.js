import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, Dimensions, Alert } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Spinner from '../Spinner';
import { init, updateState } from '../../actions/waitingLine/show';

import QRCode from 'react-native-qrcode-svg';
import CountDown from 'react-native-countdown-component';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class Show extends Component {

  componentDidMount() {
    this.props.init();
  }

  cancel = () => {
    Alert.alert(
      'get out the line',
      'Are you sure you want to cancel?',
      [
          {text: 'Oh, no.', style: 'cancel'},
          {text: 'Yes, the delicate smell of chips got me...', onPress: () => this.props.updateState(this.props.retrieved, 'reset')}
      ]
    );
  };

  reset = () => {
    Alert.alert(
      'Thank you',
      'Hope you liked it :)',
      [
        {text: 'Meh.', style: 'cancel', onPress: () => this.props.updateState(this.props.retrieved, 'reset')},
        {text: 'Yes, This app is delicately balanced :)', onPress: () => this.props.updateState(this.props.retrieved, 'reset')}
      ]
    );
  };

  _renderItem ({item, index}) {
    return (
        <View style={{ height: viewportHeight }}>
          <Card>
            <Text style={styles.title}>{ item.title }</Text>
          </Card>
          <Card>
            <Button title="Start immediately" raised={true}/>
          </Card>
        </View>
    );
  }

  render() {

    if (this.props.loading) return <Spinner size="large"/>;

    const item = this.props.retrieved;

    const {viewStyle, textStyleAlert } = styles;

    if (item && item.ready) return (
      <View style={ {flex: 1} }>
        <Card>
          <Text>Diner is ready!</Text>
        </Card>
        <Card>
          <Button onPress={this.reset} title="I am coming!" raised={true}/>
        </Card>
      </View>
    );

    if (item && item.waiting) return (
      <View style={ {flex: 1} }>
        <Card>
          <Text>Waiting for a table...</Text>
        </Card>
        <Card>
          <CountDown
            until={10}
            digitTxtStyle={{color: '#56a7f6'}}
            digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#56a7f6'}}
            separatorStyle={{color: '#56a7f6'}}
            timeToShow={['M', 'S']}
            timeLabels={{m: null, s: null}}
            onFinish={() => alert('Finish your beer! We should contact you soon :)')}
            onPress={() => alert('We are almost there... ')}
            size={30}
          />
        </Card>
        <Card>
          <Button onPress={this.cancel} title="cancel" raised={true}/>
        </Card>
      </View>
    );

    if (item && item.started && !item.waiting && !item.ready) return <Card><QRCode value="{item['customerId']}" size={300} /></Card>;

    if (item && !item.started && !item.waiting && !item.ready) return (
      <Carousel
        data={[
            {title: "It prevent you from waiting in a queue, and will warn you at the right time. Waiting for a table at a restaurant... It's simple and works in a few steps."},
            {title: "Present your QrCode."},
            {title: "Wait for your turn. The application detects that the QrCode has been flashed and redirect you in the waiting room. You can do anything you want until then (shopping, grab a couple of beers, run a marathon, etc) :)"},
            {title: "Changed your mind? Nothing to worry, you can always cancel and leave the waiting room."},
            {title: "It's your turn? The application will receive a signal, so as you ;)"},
        ]}
        renderItem={this._renderItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth}
        slideStyle={{ width: viewportWidth }}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
      />
    );

    return (
      <View style={ {flex: 1} }>
        <ScrollView>
          {item &&
            <React.Fragment>
              <Card>
                <Text>{item['customerId']}</Text>
                <Text>{item['ready'] ? 'ready' : 'not Ready'}</Text>
                <Text>{item['started'] ? 'started' : 'not started'}</Text>
                <Text>{item['waiting'] ? 'waiting' : 'not waiting'}</Text>
              </Card>
            </React.Fragment>
          }
          {this.props.error && <View style={viewStyle}><Text style={textStyleAlert}>{this.props.error}</Text></View>}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.waitingLine.show.error,
    loading: state.waitingLine.show.loading,
    retrieved: state.waitingLine.show.retrieved,
    authenticated: state.waitingLine.show.authenticated,
    uid: state.waitingLine.show.uid,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    init: () => dispatch(init()),
    updateState: (identity, newState) => dispatch(updateState(identity, newState)),
  };
};

const styles = {
  viewStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  }
};

Show.propTypes = {
  uid: PropTypes.string,
  error: PropTypes.string,
  retrieved: PropTypes.object,
  authenticated: PropTypes.object,
  init: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Show);
