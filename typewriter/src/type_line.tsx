import React from 'react'
import { TypeSpan } from './type_span'

export interface TypeItem {
  text: string
  color?: string
}

interface TypeLineProps {
  text: TypeItem[]
  visible: boolean
  speed: number
  defaultColor: string
  onFinish(): void
}

interface TypeLineState {
  switcher: boolean[]
}

export class TypeLine extends React.Component<TypeLineProps, TypeLineState> {
  constructor(props: TypeLineProps) {
    super(props)
    this.state = {
      switcher: this.props.text.map(() => false)
    }
  }
  componentDidMount() {
    if (this.props.visible)
      this.next()
  }

  componentWillReceiveProps(nextProps: TypeLineProps) {
    if (this.props.visible !== nextProps.visible && nextProps.visible)
      this.next()
  }

  next() {
    const { switcher } = this.state
    const nextIndex = switcher.findIndex((v) => !v)
    if (nextIndex === -1) {
      this.props.onFinish()
      return
    }
    switcher[nextIndex] = true
    this.setState({
      switcher
    })
  }

  render() {

    const { text } = this.props
    const { switcher } = this.state

    return (
      <div>
        {
          text.map((item, index) => {
            const visible = switcher[index]
            return (
              <TypeSpan
                key={index}
                text={item.text}
                color={item.color || this.props.defaultColor}
                speed={this.props.speed}
                visible={visible}
                onFinish={() => { this.next() }}
              />
            )
          })
        }
      </div>
    )
  }
}