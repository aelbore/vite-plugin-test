import { fixture, html, expect } from '@open-wc/testing'

import '../src/my-element.js'

describe('My Element', () => {

  it('My Element', async () => {
    const el = await fixture(html`<my-element></my-element>`);
    expect(el).shadowDom.to.equal(`<h1>Hello, World!</h1>`)
  })

})