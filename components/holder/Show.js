import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ScrollView, View, Text } from 'react-native';
import { Card, List, ListItem, SocialIcon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Spinner from '../Spinner';
import { retrieve, reset } from '../../actions/holder/show';
import { Confirm } from '../Confirm';
import { delayRefresh } from '../../utils/helpers';

class Show extends Component {

  state = { showModal: false };

  componentDidMount() {
    this.props.retrieve(this.props.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.refresh !== this.props.refresh) {
      this.props.list();
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  remove() {
    this.setState({showModal: !this.state.showModal});
  }

  onAccept() {
    const {del, retrieved} = this.props;
    del(retrieved);
    this.setState({showModal: false});
    Actions.pop();
    delayRefresh();
  }

  onDecline() {
    this.setState({showModal: false});
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
    error: state.holder.show.error,
    loading: state.holder.show.loading,
    retrieved: state.holder.show.retrieved,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    retrieve: id => dispatch(retrieve(id)),
    reset: () => dispatch(reset()),
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
  reset: PropTypes.func.isRequired,
  refresh:PropTypes.number,
  id:PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Show);
