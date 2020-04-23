import * as React from 'react'
import { TypeMachine } from './type_machine'

export class App extends React.Component {
  render() {
    const texts = [
      [{ text: '第一行', color: 'red' }],
      [{ text: '第二行' }, { text: '同行换色', color: 'yellow' }]
    ]
    return (
      <div className="app">
        <TypeMachine texts={texts} speed={500} defaultColor='#BBB' />
      </div>
    )
  }
}
