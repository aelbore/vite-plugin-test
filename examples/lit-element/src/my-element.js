import { LitElement, html } from 'lit-element'

export class MyElement extends LitElement {

  constructor() {
    super()
    this.message = 'World'
  }

  static get properties() {
    return {
      message: String
    }
  }

  render() {
    return html `<h1>Hello, ${this.message}!</h1>`
  }
}

customElements.define('my-element', MyElement)