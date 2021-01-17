import { React, useEffect, useState } from 'react';
import { Router, Route } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from "websocket";

import './App.css';
import Header from './Components/Header/Header';
import Doc from './Components/Doc/Doc';
import Home from './Components/Home/Home';
import history from './history';

// Connect to websocket server
const client = new W3CWebSocket('ws://736254919d44.ngrok.io/ws');

function App() {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (notes !== '') {
      client.send(JSON.stringify({'newText': notes}));
    }
  });

  client.onopen = () => {
    console.log('connected to socket');
    client.send(JSON.stringify({'clientType': 'front-end'}));
  }
  
  client.onmessage = (message) => {
    setNotes(message.data);
  }
  
  return (
    <Router history={ history }>
      <Header />
      <Route exact path='/' render={(props) => <Home {...props} ws={client} />} />
      <Route path='/docs/*' render={(props) => <Doc {...props} ws={client} notes={notes} handleChange={setNotes}/>} />
    </Router>
  );
}

export default App;

