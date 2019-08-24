import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ScrollView, View, Text } from 'react-native';
import { Card, List, ListItem } from 'react-native-elements';
import Spinner from '../Spinner';
import { retrieve, getUid } from '../../actions/waitingLine/show';

class Show extends Component {

  componentDidMount() {
    // this.props.retrieve(this.props.id);
    this.props.getUid();
  }

  static renderRow(title, value) {
    return (
        <ListItem
            subtitleStyle={ {color: 'black', fontSize: 16} }
            titleStyle={ {color: 'gray', fontSize: 16, paddingBottom: 10} }
            key={value}
            hideChevron={true}
            title={title}
            subtitle={Array.isArray(value) ? value.length.toString() : value}
            subtitleNumberOfLines={100}
        />
    );
  }

  render() {

    if (this.props.loading) return <Spinner size="large"/>;

    const item = this.props.retrieved;

    const {viewStyle, textStyleAlert } = styles;

    return (
        <View style={ {flex: 1} }>
          <ScrollView>
                <Text>{this.props.uid}</Text>
            {item &&
            <Card title="Holder">
              <List title="title">
                {Show.renderRow('id', item['@id'])}
                {Show.renderRow('name', item['name'])}
                {Show.renderRow('username', item['username'])}
                {Show.renderRow('roles', item['roles'])}
                {Show.renderRow('password', item['password'])}
                {Show.renderRow('plainPassword', item['plainPassword'])}
                {Show.renderRow('salt', item['salt'])}
                {Show.renderRow('updatedAt', item['updatedAt'])}
                {Show.renderRow('createdAt', item['createdAt'])}
                {Show.renderRow('status', item['status'])}
                {Show.renderRow('estimatedDelay', item['estimatedDelay'])}
              </List>
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
    uid: state.waitingLine.show.init,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUid: () => dispatch(getUid()),
    retrieve: id => dispatch(retrieve(id)),
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
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  retrieved: PropTypes.object,
  retrieve: PropTypes.func.isRequired,
  uid: PropTypes.string,
  getUid: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Show);
