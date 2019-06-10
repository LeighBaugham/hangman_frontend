import React, { Component } from 'react';
import { Header, Image, Segment } from 'semantic-ui-react'
import FaceImg from "../assets/face_small.png"
import Logo from "../assets/logo.png"

class LoggedInHeader extends Component {



    render () {
        return(
            <div>
            
               <Segment clearing>
                    <Header as='h2' floated='left'>
                       <Image src={FaceImg} /> 
                        <Header.Content>
                            <Image src={Logo} size='medium'/>
                            {/* <Header.Subheader> Welcome {this.props.user}</Header.Subheader> */}
                        </Header.Content>
                    </Header>

                    <Header as='h2' name="welcome" id="welcome">
                        <p>Welcome {this.props.user} </p>
                    </Header>

                    <Header as='h3' floated='right'>
                        <a href="#" style={{ color: '#f00' }} className="item" onClick={this.props.logout}>Logout </a> 
                    </Header>
                </Segment>    
            </div>
            
        )
    }



}
export default LoggedInHeader;
