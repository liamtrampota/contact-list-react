import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      newContact: false,
      contacts: []
    }
  }

  toggleNewContact(){
    console.log('toggle newContact')
    this.setState({newContact: !this.state.newContact})
  }

  componentDidMount(){
    console.log('app mounting')
    fetch('/contacts')
    .then((res)=>{
      console.log(res)
      return res.json()
    })
    .then((res)=>{
      console.log(res)
      this.setState({contacts: this.state.contacts.concat(res)})
    })
    .catch((error)=>{
      console.log('error')
      console.log(error)
    })
  }

  deleteContact(contact){
    console.log('app deleting contact')
    console.log(contact)
    var contacts = this.state.contacts.slice();
    contacts.forEach(function(currContact, index){
      if(currContact.name === contact.name && currContact.phone===contact.phone){
        contacts.splice(index, 1)
      }
    })
    console.log(contacts)
    this.setState({contacts: contacts})
  }

  addContact(contact){
    console.log('adding contact')
    this.setState({contacts:this.state.contacts.concat(contact)})
    this.toggleNewContact()
  }

  editContact(contact){
    console.log('editing app: ', contact)
    var contacts = this.state.contacts.slice();
    contacts.forEach(function(currContact, index){
      if(currContact.name === contact.former.name && currContact.phone === contact.former.phone){
        contacts[index].name = contact.name;
        contacts[index].phone = contact.phone;
        contacts[index].birthday = contact.birthday;
      }
    })
    console.log('new contacts:', contacts)
    this.setState({contacts:contacts})
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Contacts</h1>
        </header>
        {(this.state.newContact) ? <NewContact addContact={(contact)=>this.addContact(contact)} toggle={()=>this.toggleNewContact()}/>
          : <ContactList editContact={(contact)=>this.editContact(contact)} toggle={()=>this.toggleNewContact()} contacts={this.state.contacts} deleteContact={(id)=>this.deleteContact(id)}/> }
      </div>
    );
  }
}

class NewContact extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      phone: '',
    }
  }

  nameChange(e){
    this.setState({name: e.target.value})
  }

  phoneChange(e){
    this.setState({phone: e.target.value})
  }

  birthdayChange(e){
    this.setState({birthday: e.target.value})
  }

  submitContact(){
    if(this.state.name.length===0){
      this.setState({incomplete:true})
      return ;
    }
    this.props.addContact({name:this.state.name, phone:this.state.phone, birthday:this.state.birthday})
    fetch('/contact/new', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name:this.state.name,
        phone:this.state.phone,
        birthday:this.state.birthday
      })
    }).then((res)=> {
      if(res.status === 200) {
        console.log('saved contact')
      } else {
        console.log('server error')
      }
    }).catch((err) => {
      console.log(err)
    })
  }


  render(){
    return (
      <div style={{margin:'10px'}}>
        {(this.state.incomplete) ? <div style={{color:'red'}}>Name Required</div> : <div></div>}
        <input type='text' name='name' placeholder='Name' value={this.state.name} onChange={(e)=>this.nameChange(e)} style={{width:'195px', textAlign:'center'}}/><br></br>
        <input type='text' name='phone' placeholder='Phone' value={this.state.phone} onChange={(e)=>this.phoneChange(e)} style={{width:'195px', textAlign:'center'}}/><br></br>
        <input type='date' name='birthday' placeholder='Birthday' value={this.state.birthday} onChange={(e)=>this.birthdayChange(e)} style={{width:'195px', textAlign:'center'}}/><br></br>
        <button className='btn btn-success' type="submit" value="Submit" style={{width:'97.5px', borderRadius:'0px', fontSize:'13px'}} onClick={()=>this.submitContact()}>Add Contact</button>
        <button className='btn btn-danger' style={{width:'97.5px', borderRadius:'0px', fontSize:'13px'}} onClick={this.props.toggle}>Cancel</button>
      </div>
    )
  }
}

class ContactList extends Component {
  constructor(props){
    super(props);
    this.state={
      editContact: false,
    }
  }

  toggleEditMode(){
    this.setState({editContact: false, contact:''})
  }

  editMode(contact){
    this.setState({editContact: true, contact: contact})
  }


  render(){
    return (
      <div style={{margin:'10px'}}>
        {(this.state.editContact) ? <EditContact contact={this.state.contact} edit={(contact)=>this.props.editContact(contact)} toggle={()=>this.toggleEditMode()}/> :
        <div>
          <button className='btn btn-primary' onClick={this.props.toggle} style={{width:"300px", borderRadius:'0px'}}>Create New</button>
          <div style={{alignItems:'center', display:'flex', flexDirection:'column'}}>
            {this.props.contacts.map((contact)=><Contact editMode={(contact)=>this.editMode(contact)} deleteContact={(contact)=>this.props.deleteContact(contact)} contact={contact}/>)}
          </div>
        </div>}
      </div>
    )
  }
}

class EditContact extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: props.contact.name,
      phone: props.contact.phone,
      birthday: props.contact.birthday,
    }
  }

  nameChange(e){
    this.setState({name: e.target.value})
  }

  phoneChange(e){
    this.setState({phone: e.target.value})
  }

  birthdayChange(e){
    this.setState({birthday: e.target.value})
  }

  submitContact(){
    console.log(this.state)
    fetch('/contact/edit', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name:this.state.name,
        phone:this.state.phone,
        birthday:this.state.birthday,
        former: this.props.contact
      })
    }).then((res)=> {
      if(res.status === 200) {
        console.log('edited contact')
      } else {
        console.log('server error')
      }
    }).catch((err) => {
      console.log(err)
    })
    this.props.edit({name:this.state.name, phone:this.state.phone, birthday:this.state.birthday, former:this.props.contact})
    this.props.toggle()
  }


  render(){
    return (
      <div style={{margin:'10px'}}>
        <input type='text' name='name' placeholder='Name' value={this.state.name} onChange={(e)=>this.nameChange(e)} style={{width:'195px', textAlign:'center'}}/><br></br>
        <input type='text' name='phone' placeholder='Phone' value={this.state.phone} onChange={(e)=>this.phoneChange(e)} style={{width:'195px', textAlign:'center'}}/><br></br>
        <input type='date' name='birthday' placeholder='Birthday' value={this.state.birthday} onChange={(e)=>this.birthdayChange(e)} style={{width:'195px', textAlign:'center'}}/><br></br>
        <button type="submit" value="Submit" className='btn btn-success' style={{width:'97.5px', borderRadius:'0px', fontSize:'13px'}} onClick={()=>this.submitContact()}>Edit Contact</button>
        <button className='btn btn-danger' style={{width:'97.5px', borderRadius:'0px', fontSize:'13px'}} onClick={this.props.toggle}>Cancel</button>
      </div>
    )
  }
}

class Contact extends Component {

  birthdayTransform(birthday){
    console.log(birthday)
    var dateBirthday = new Date(birthday)
    dateBirthday = dateBirthday.toDateString()
    var arrBirthday = dateBirthday.split(' ');
    var arrBirthday = arrBirthday.slice(1,4)
    var stringBirthday = arrBirthday.join(' ')
    return stringBirthday
  }

  deleteContact(){
    console.log('delete Contact')
    this.props.deleteContact(this.props.contact)
    fetch('/contact/delete', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact:this.props.contact
      })
    }).then((res)=> {
      if(res.status === 200) {
        console.log('deleted contact')
      } else {
        console.log('server error - server did not delete')
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  render() {
    return(
        <div className='contactButtons' style={{display:'flex', justifyContent:'space-between', width:'300px', border:'1px solid grey', padding:'5px'}}>
          <div style={{textAlign:'left'}}>
            <b>Name</b> {this.props.contact.name} <br></br>
            <b>Phone</b> {this.props.contact.phone} <br></br>
            <b>Birthday</b> {this.birthdayTransform(this.props.contact.birthday)}
          </div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <button className='edit' style={{padding:'2px', margin:'1px', borderRadius:'0px', backgroundColor:'darkgrey', color:'white'}} onClick={(contact)=>this.props.editMode(this.props.contact)}>Edit</button>
            <button className='btn btn-danger' style={{padding:'2px', margin:'1px', borderRadius:'0px'}} onClick={()=>this.deleteContact()}>Delete</button>
          </div>
        </div>
    )
  }

}

export default App;
