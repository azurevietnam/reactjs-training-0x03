import React, { Component } from 'react';
import $ from 'jquery';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.state = {
      people: [],
      next: '',
      previous: '',
      error: false,
      count: 0,
    };
  }

  callAjax = (url) => {
    $.ajax({
      url,
      beforeSend: () => {
        if (this.loading) {
          return false;
        }

        this.loading = true;
      },
      success: ({ results, previous, next }) => {
        console.log(previous, next);
        this.setState({
          people: results,
          next,
          previous,
          error: false,
        });
      },
      error: (xhr, status, error) => {
        this.setState({
          error: true,
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  componentWillMount() {
    this.callAjax('https://swapi.co/api/people/');
  }

  componentDidUpdate() {
    if (!this.state.next) {
      setTimeout(() => {
        this.callAjax(this.state.previous);
      }, 2000);
    }
  }

  renderPeople = () => {
    return this.state.people.map((person, index) => {
      return (<li key={index}>{person.name}</li>);
    });
  }

  handlePrev = () => {
    if (!this.state.previous) {
      return;
    }

    this.callAjax(this.state.previous);
  }

  handleNext = () => {
    if (!this.state.next) {
      return;
    }

    this.callAjax(this.state.next);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React: {this.state.count}</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <ul>
          {this.renderPeople()}
        </ul>
        {this.state.error && (<p>Please fetch again</p>)}
        <button onClick={this.handlePrev} disabled={!this.state.previous}>Previous</button>
        <button onClick={this.handleNext} disabled={!this.state.next}>Next</button>
      </div>
    );
  }
}

export default App;
