import React from 'react'
import { TypeItem, TypeLine } from './type_line'

interface TypeMachineProps {
  texts: TypeItem[][]
  defaultColor: string
  speed: number
}

interface TypeMachineState {
  switcher: boolean[]
}

export class TypeMachine extends React.Component<TypeMachineProps, TypeMachineState> {
  constructor(props: TypeMachineProps) {
    super(props)
    this.state = {
      switcher: this.props.texts.map(() => false)
    }
  }

  next() {
    const { switcher } = this.state
    const nextIdx = switcher.findIndex((v) => !v)
    if (nextIdx === -1) return
    switcher[nextIdx] = true
    this.setState({
      switcher
    })
  }

  componentDidMount() {
    this.next()
  }

  render() {
    const { texts, speed } = this.props
    const { switcher } = this.state
    return (
      <div>
        {texts.map((text, index) => {
          const visible = switcher[index]
          return (
            <TypeLine
              key={index}
              text={text}
              visible={visible}
              speed={speed!}
              onFinish={() => this.next()}
              defaultColor={this.props.defaultColor}
            />
          )
        })}
      </div>
    )
  }
}