import React from 'react'
import { shallow, configure } from 'enzyme'

import App from '../src/App'

import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('App.jsx', () => {

  it('renders', () => {
    const wrapper = shallow(<App />)
    const p = wrapper.find('p')

    expect(p.text()).equal('You clicked 0 times')
  })

})