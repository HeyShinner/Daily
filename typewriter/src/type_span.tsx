import React from 'react'

interface TypeSpanProps {
  text: string;
  speed: number;
  visible: boolean;
  color: string;
  onFinish(): void;
}

interface TypeSpanState {
  text: string;
}

export class TypeSpan extends React.Component<TypeSpanProps, TypeSpanState> {
  constructor(props: TypeSpanProps) {
    super(props);
    this.state = {
      text: ''
    }
  }
  rnd(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  async sleep(time: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }
  async goAhead() {
    const { text } = this.state
    const { text: totalText, speed, onFinish } = this.props
    await this.sleep(this.rnd(speed / 3, speed / 10 * 13))
    if (text.length >= totalText.length) {
      onFinish()
      return
    }
    this.setState({
      text: text + totalText[text.length],
    }, this.goAhead)
  }
  startTyping() {
    this.goAhead()
  }
  componentDidMount() {
    if (this.props.visible) {
      this.startTyping()
    }
  }
  componentWillReceiveProps(nextProps: TypeSpanProps) {
    if (this.props.visible !== nextProps.visible && nextProps.visible) {
      this.startTyping()
    }
  }
  render() {
    return this.state.text === ''
      ? <br />
      : <span style={{ color: this.props.color }}>{this.state.text}</span>
  }
}