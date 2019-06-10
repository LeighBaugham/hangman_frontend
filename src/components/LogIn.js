import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Loader} from 'semantic-ui-react'
import FaceImg from '../assets/face_small.png'
import {api_base,routes} from '../apiUri'



 class LogIn extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            fetching: false,
            name: "",
            password: ""
        }
    }

    startFetch(){
      this.setState({fetching:true})
    }

    cancelFetch(){
      this.setState({fetching:false})
    }

    handleSubmit=(event) => {
        this.startFetch()
        event.preventDefault()
        fetch(api_base + "/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(this.state)
        })
        .then(res => {
            return res.json()})
        .then( user => {
            this.cancelFetch()
            if (user.error)
                this.props.setError(user)
            else {
                this.props.history.push("/")
                this.props.setUser(user)}
        })
        
    }        

     

     render = () => {

        return(

     <div className='login-form'>
     <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
       <Grid.Column style={{ maxWidth: 450 }}>
         <Header as='h2' color='red' textAlign='center'>
         <Image src={FaceImg} />
            Log-in to your account
            
         </Header>
         <p style={{color:'red'}}> {this.props.errors ? this.props.errors.error : null} </p>
         {this.state.fetching ? <Loader inline active/> : null}
         <Form size='large' onSubmit={this.handleSubmit}>
           <Segment stacked>
             <Form.Input fluid icon='user' iconPosition='left' className="name" placeholder='Username' onChange={(e) => this.setState({ name: e.target.value })}/>
             <Form.Input
               fluid
               icon='lock'
               iconPosition='left'
               placeholder='Password'
               type='password'
               name="password"
               onChange={(e) => this.setState({ password: e.target.value })} />
 
             <Button color='red' fluid size='large'>
               Login
             </Button>
           </Segment>
         </Form>
         <Message>
           New to us? <Link to={routes.signup}>Sign Up</Link>
         </Message>
       </Grid.Column>
     </Grid>
   </div>
        )}
    }

const LogInWithRouter = withRouter(LogIn)

export default LogInWithRouter;
