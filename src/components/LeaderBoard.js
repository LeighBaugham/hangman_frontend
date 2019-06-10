import React, { Component } from 'react';
import { List } from 'semantic-ui-react'

export default class LeaderBoard extends Component {


  render() {
      return (
          <div>
               <List celled={true} animated verticalAlign='middle' >
               <h2>Leader Board </h2>
               {this.props.leaders.map(leader => <List.Item content={`${leader.name} : ${leader.total_score}`} />)}               
               </List>
          </div>
      )
  }

}
