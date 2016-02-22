import React from 'react';

export default class Application extends React.Component {
  render() {
    return (
      <div>
        <p className='text'><b>Example Text:</b> { this.props.example.text }</p>
        <p className='id'><b>Example Id:</b> { this.props.example.id }</p>
      </div>
    );
  }
}