import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ScrollView, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Spinner from '../Spinner';
import { init } from '../../actions/waitingLine/show';
import QRCode from 'react-native-qrcode-svg';
import CountDown from 'react-native-countdown-component';

class Show extends Component {

  componentDidMount() {
    this.props.init();
  }

  render() {

    if (this.props.loading) return <Spinner size="large"/>;

    const item = this.props.retrieved;

    const {viewStyle, textStyleAlert } = styles;

    if (item && item.ready) return <Card><QRCode value="{item['customerId']}" size={300} /></Card>;

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
          <Button title="cancel" raised={true}/>
        </Card>
      </View>
  );

    if (item && item.started && !item.waiting && !item.ready) return <Card><QRCode value="{item['customerId']}" size={300} /></Card>;

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
  loading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Show);
