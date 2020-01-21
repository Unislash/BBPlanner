import './app.css';
import {Component} from 'react';
import React from 'react';
import logo from './react.png';

interface AppState {
    username?: string;
}

export class App extends Component {
    state: AppState = {username: undefined};

    componentDidMount() {
        fetch('/api/getUsername')
            .then(res => res.json())
            .then(user => this.setState({username: user.username}));
    }

    render() {
        const {username} = this.state;
        return (
            <div>
                {username ? <h1>{`Hello! ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
                <img src={logo} alt="react"/>
            </div>
        );
    }
}
