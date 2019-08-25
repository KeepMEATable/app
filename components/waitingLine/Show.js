import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ScrollView, View, Text } from 'react-native';
import { Card } from 'react-native-elements';
import Spinner from '../Spinner';
import { init } from '../../actions/waitingLine/show';

class Show extends Component {

  componentDidMount() {
    this.props.init();
  }

  render() {

    if (this.props.loading) return <Spinner size="large"/>;

    const item = this.props.retrieved;

    const {viewStyle, textStyleAlert } = styles;

    return (
        <View style={ {flex: 1} }>
          <ScrollView>
            {item &&
                <Card>
                    <Text>{item['customerId']}</Text>
                    <Text>{item['ready'] ? 'ready' : 'not Ready'}</Text>
                    <Text>{item['started'] ? 'started' : 'not started'}</Text>
                    <Text>{item['waiting'] ? 'waiting' : 'not waiting'}</Text>
                </Card>
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
  },
  textStyleAlert: {
    color: 'red',
    textAlign: 'center',
  },
  actionStyle: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignContent: 'center',
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
