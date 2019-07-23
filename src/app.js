const css = require('../src/app.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

var socket = io();

var user = { id: '', to: '', selfid: '' };

socket.on('messageAdd', function (msg) {
  //console.log("有加入一個"+msg);
});

class ChatApp extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.handleClick.bind(this);
    this._messageRecieve = this._messageRecieve.bind(this);
    this._start = this._start.bind(this);
    this._userexit = this._userexit.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.state = {
      items: [],
      text: '',
      connect: false,
      login: false
    }
  }

  componentDidMount() {
    socket.on('messageAdd', this._messageRecieve);
    socket.on('start', this._start);
    socket.on('userexit', this._userexit);
  }

  componentDidUpdate(e) {
    var scrollNode = ReactDOM.findDOMNode(this.mainElement);
    this.mainElement.scrollTop = this.mainElement.scrollHeight;
    console.log(scrollNode.scrollTop);
    console.log(scrollNode.scrollHeight);
  }

  handleScroll(e) {
    const scrollTop = e.srcElement.body.scrollTop;
    this.setState({ "scrollTop": scrollTop });
  }

  render() {
    if (this.state.login) {
      if (this.state.connect) {
        return (
          <div style={{ height: "100%" }} className="wrapper" >
            <div className="main" ref={(main) => this.mainElement = main}>
              <ChatList items={this.state.items} />
            </div>
            <ChatInput text={this.state.text} items={this.state.items} />
          </div>
        )
      } else {
        return (
          <div style={{ "height": "100%" }} className="wrapper" >
            <div className="main">
              <div className="push"></div>
              <blockquote className="messages" style={{ display: "block", textAlign: "center" }}>
                <div>等待對象</div>
              </blockquote>
            </div>
            <ChatInput text={this.state.text} items={this.state.items} />
          </div>
        )
      }

    } else {
      return (
        <div className="main" style={{ "height": "100%" }}>
          <div className="contents">
            <div className="bg-image" style={{ "height": "100%" }}>
              <div className="image">
                <div className="logowrapper">
                  <div className="header">
                    <div className="logo">
                      <img />
                    </div>
                    <div className="slogan">
                      <div className="sloganText">摸聊、不無聊</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="buttons">
                <input type="submit" className="startButton" value="開始聊天" onClick={this.onClick} />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  handleClick(e) {
    this.setState({ login: true })
    socket.emit('login', function (id) {
      user.id = id
    })
  }

  _userexit(msg) {
    console.log('usersxit')
    this.setState({ login: false, connect: false, items: [] })
  }

  _start(uid, selfid) {
    user.to = uid;
    user.selfid = selfid;
    this.setState({ connect: true })
    console.log("selfid" + user.selfid)
  }

  _messageRecieve(item) {
    var { items } = this.state;
    items.push(item);
    this.setState({ items });
    console.log("有加入一個" + item + " from " + item.whoid);
  }
}

class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleExit = this.handleExit.bind(this);
    this.state = {
      items: this.props.items,
      text: this.props.text
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(e) {
    let code = e.keyCode
    if (code == 13) {
      this.handleSubmit(e)
    }
  }

  render() {
    return (
      <div className="sendBox">
        <div>
          <div>
            <div className="changeButton">
              <input type="button" onClick={this.handleExit} value={"離開"} />
            </div>
            <div className="textBox">
              <input onChange={this.handleChange} value={this.state.text} placeholder="請輸入訊息" />
            </div>
            <div className="sendButton">
              <input type="button" onClick={this.handleSubmit} value={"送出"} />
            </div>
          </div>
        </div>
      </div>
    )
  }
  handleExit(e) {
    //
    console.log('exit')
    this.setState({ login: 'fucl', connect: false, items: [] })
    socket.emit('_userexit');
  }

  handleChange(e) {
    this.setState({ text: e.target.value })
  }


  handleSubmit(e) {
    e.preventDefault()
    var newItem = {
      text: this.state.text,
      id: Date.now()
    }
    socket.emit('submit', newItem, user.selfid)
    this.setState({ text: '' })
  }
}

class ChatList extends React.Component {
  render() {
    return (
      <blockquote className="messages" style={{ display: "block", textAlign: "center" }}>
        <div style={{ textAlign: "center" }}>可以開始聊天囉!</div>
        {this.props.items.map(item => (
          user.selfid == item.whoid ? <div className="ourmsg" style={{ "text-align": "right" }} key={item.id}> {item.text} </div> : <div className="notourmsg" style={{ "text-align": "left" }} key={item.id}> {item.text} </div>
        ))}
      </blockquote>
    );
  }
}

ReactDOM.render(
  <ChatApp />,
  document.getElementById('root')
);
