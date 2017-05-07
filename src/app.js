const css = require('./app.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

var socket = io();

socket.on('messageAdd', function(msg){
  console.log("有加入一個"+msg);
});

class TodoApp extends React.Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._messageRecieve = this._messageRecieve.bind(this);
    this.state = {items: [],text: ''};
  }

  componentDidMount() {
		socket.on('messageAdd', this._messageRecieve);
		// socket.on('send:message', this._messageRecieve);
		// socket.on('user:join', this._userJoined);
		// socket.on('user:left', this._userLeft);
		// socket.on('change:name', this._userChangedName);
	}

  render(){
    return(
      <div>
        <h3>TODO</h3>
        <TodoList items={this.state.items} />
          <form onSubmit={this.handleSubmit}>
            <input onChange={this.handleChange} value={this.state.text} />
            <button>{'Add #' + (this.state.items.length + 1)}</button>
          </form>
      </div>
    )
  }

  handleChange(e){
    this.setState({text: e.target.value});
  }

  _messageRecieve(item){
      var {items} = this.state;
  		items.push(item);
  		this.setState({items});

      console.log("有加入一個"+msg);
      // this.setState({
      //   items: prevState.items.concat(msg),
      //   text: ''
      // });
  }


  handleSubmit(e){
    e.preventDefault();

    var newItem = {
      text: this.state.text,
      id: Date.now()
    };

    socket.emit('submit',newItem);

    // this.setState((prevState) => ({
    //     items: prevState.items.concat(newItem),
    //     text: ''
    // }));
  }


}

class TodoList extends React.Component{
  render(){
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}> {item.text} </li>
        ))}
      </ul>
    );
  }
}

ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);
