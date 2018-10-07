import React from 'react'
import PropTypes from 'prop-types'
import erqiuBubbleSort from '../erqiu/bubbleSort'
import { expandArray, randomArray, resetArray } from './utils'
import yuanBubbleSort from './sampleAlgorithm'

const delayOptions = {
  slow: 2000,
  normal: 1000,
  fast: 100,
  fastest: 0,
}

export class SortLessonContainer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    initialArray: PropTypes.array,
  }

  static defaultProps = {
    initialArray: randomArray(false),
  }

  state = {
    array: expandArray(this.props.initialArray),
    arrayID: 0,
    chosenDelayOption: 'normal',
    algorithmToUse: 'erqiu',
    caughtError: null,
    status: 'initial',
    onGoingAction: null,
    actionParams: null,
    allowDuplicateNumber: true,
  }

  setDelayOption = option => {
    if (delayOptions[option] == null) {
      throw new Error(`delay option "${option}" not found`)
    }

    this.setState({
      chosenDelayOption: option,
    })
  }

  getDelayMillis = () => {
    return delayOptions[this.state.chosenDelayOption]
  }

  setOnGoingAction = {
    clear: () => {
      this.setState({
        onGoingAction: null,
        actionParams: null,
      })
    },
    swapping: (i, j) => {
      this.setState({
        onGoingAction: 'swap',
        actionParams: [this.state.array[i].index, this.state.array[j].index],
      })
    },
    comparing: (i, j) => {
      this.setState({
        onGoingAction: 'compare',
        actionParams: [this.state.array[i].index, this.state.array[j].index],
      })
    },
  }

  toggleAlgorithmToUse = () => {
    this.stopAlgorithm()
    this.setState(({ algorithmToUse }) => ({ algorithmToUse: algorithmToUse === 'yuan' ? 'erqiu' : 'yuan' }))
  }

  toggleAllowDuplicateNumber = () => {
    this.setState(({ allowDuplicateNumber }) => ({
      allowDuplicateNumber: !allowDuplicateNumber,
    }))
  }

  pausedAction = null
  retryTimeoutHandle = null

  // TODO: refactor to change immediateFn to key value argument
  makeAsync = (fn, immediateFn = null) => {
    return (...args) => {
      // TODO: refactor this to write it more elegantly
      return new Promise((resolve, reject) => {
        const doTheWork = ({ skip } = { skip: false }) => {
          if (!skip) {
            this.checkStatus()
          }
          if (immediateFn) {
            resolve(immediateFn(...args))
          } else {
            resolve()
          }
        }

        const tryOnce = (interval = 0) => {
          this.retryTimeoutHandle = setTimeout(() => {
            try {
              this.pausedAction = null
              doTheWork(resolve)
            } catch (err) {
              if (err === 'paused') {
                this.pausedAction = {
                  run: () => {
                    clearTimeout(this.retryTimeoutHandle)
                    doTheWork({ skip: true })
                  },
                }
                tryOnce(50)
              } else {
                reject(err)
              }
            }
          }, interval)
        }
        tryOnce()
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              try {
                resolve(fn(...args))
              } catch (err) {
                reject(err)
              }
            }, this.getDelayMillis() / 2)
          })
        })
        .then(result => {
          return new Promise((resolve, reject) => {
            setTimeout(() => resolve(result), this.getDelayMillis() / 2)
          })
        })
    }
  }

  checkIndexRangeOK = (index, name) => {
    if (index >= 0 && index < this.state.array.length) {
      // ok
    } else {
      throw new Error(
        `index ${name} is out of range, current value is ${index}, should be in range [0, ${this.state.array.length})`
      )
    }
  }

  checkStatus = () => {
    if (this.state.status !== 'running') {
      if (this.state.status === 'paused') {
        throw 'paused'
      } else {
        throw 'interrupted'
      }
    }
  }

  swap = this.makeAsync(
    (i, j) => {
      console.log(`swapping #${i} and #${j}`)

      this.setState(({ array }) => {
        const newArray = array.slice()
        const t = newArray[i]
        newArray[i] = newArray[j]
        newArray[j] = t

        return {
          array: newArray,
        }
      })
    },
    (i, j) => {
      this.checkIndexRangeOK(i, 'left of swap(left, right)')
      this.checkIndexRangeOK(j, 'right of swap(left, right)')

      this.setOnGoingAction.swapping(i, j)
    }
  )

  lessThan = this.makeAsync(
    (i, j) => {
      const leftValue = this.state.array[i].value
      const rightValue = this.state.array[j].value
      const result = leftValue < rightValue
      console.log(`comparing (#${i}, ${leftValue}) (#${j}, ${rightValue}) result: ${result}`)

      return result
    },
    (i, j) => {
      this.checkIndexRangeOK(i, 'left of lessThan(left, right)')
      this.checkIndexRangeOK(j, 'right of lessThan(left, right)')

      this.setOnGoingAction.comparing(i, j)
    }
  )

  shuffle = () => {
    this.stopAlgorithm()
    const newArrayID = this.state.arrayID + 1
    this.setState({
      array: expandArray(randomArray(this.state.allowDuplicateNumber), newArrayID),
      status: 'initial',
      arrayID: newArrayID,
    })
  }

  reset = () => {
    this.stopAlgorithm()
    this.setState({
      array: resetArray(this.state.array),
    })
  }

  runAlgorithm = (...args) => {
    const algorithmToUse = this.state.algorithmToUse === 'yuan' ? yuanBubbleSort : erqiuBubbleSort
    this.setState({
      status: 'running',
    })
    algorithmToUse(...args)
      .then(() => {
        this.setState({
          status: 'complete',
        })
        this.setOnGoingAction.clear()
      })
      .catch(err => {
        if (err === 'interrupted') {
          console.log('stopped')
        } else {
          this.setOnGoingAction.clear()
          this.setState({
            caughtError: err,
            status: 'error',
          })
        }
      })
  }

  stopAlgorithm = () => {
    this.setOnGoingAction.clear()
    this.setState({
      status: 'initial',
    })
  }

  pauseAlgorithm = () => {
    this.setState(({ status }) => {
      if (status === 'running') {
        return {
          status: 'paused',
        }
      }
    })
  }

  resumeAlgorithm = () => {
    this.setState(({ status }) => {
      if (status === 'paused') {
        return {
          status: 'running',
        }
      }
    })
  }

  // TODO: move other algorithm related actions to here
  algorithmActions = {
    nextStep: () => {
      // only meaningful when paused
      if (this.state.status === 'paused') {
        this.pausedAction.run()
      }
    },
  }

  render() {
    return this.props.children({
      array: this.state.array,
      swap: this.swap,
      lessThan: this.lessThan,
      runAlgorithm: this.runAlgorithm,
      stopAlgorithm: this.stopAlgorithm,
      pauseAlgorithm: this.pauseAlgorithm,
      resumeAlgorithm: this.resumeAlgorithm,
      nextStepAlgorithm: this.algorithmActions.nextStep,
      algorithmToUse: this.state.algorithmToUse,
      toggleAlgorithmToUse: this.toggleAlgorithmToUse,
      status: this.state.status,
      error: this.state.caughtError,
      shuffle: this.shuffle,
      reset: this.reset,
      onGoingAction: this.state.onGoingAction,
      actionParams: this.state.actionParams,
      toggleAllowDuplicateNumber: this.toggleAllowDuplicateNumber,
      allowDuplicateNumber: this.state.allowDuplicateNumber,
      setDelayOption: this.setDelayOption,
      chosenDelayOption: this.state.chosenDelayOption,
    })
  }
}
