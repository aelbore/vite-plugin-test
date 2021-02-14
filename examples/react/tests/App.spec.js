import React from 'react'
import ReactDOM from 'react-dom'
import App from '../src/App'

describe('App.jsx', () => {

  beforeEach(() => {
    const app = document.querySelector('div#app')
    ReactDOM.render(<App />, app)
  })

  afterEach(() => {
    const app = document.querySelector('div#app')
    app.firstElementChild.remove()
  })

  it('renders', () => {
    const app = document.querySelector('#app')
    expect(app.querySelector('p').innerHTML).equal('You clicked 0 times')
  })

})