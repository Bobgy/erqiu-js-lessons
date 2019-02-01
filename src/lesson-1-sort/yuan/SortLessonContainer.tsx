import React from 'react'
import PropTypes from 'prop-types'
import erqiuBubbleSort from '../erqiu/bubbleSort'
import { expandArray, randomArray, resetArray } from './utils'
import yuanBubbleSort from './sampleAlgorithm'
import invariant from 'invariant'
import { ArrayItemData, OnGoingAction } from './ArrayVisualization'
import { DelayOption, CompareAction, SwapAction } from './commonTypes'

const delayOptions = {
  slow: 2000,
  normal: 1000,
  fast: 100,
  fastest: 0,
}

interface SortLessonContainerProps {
  children: any
  initialArray: number[]
}

interface OnGoingActionData {
  type?: OnGoingAction
  params?: any[]
}

type Status = 'initial' | 'running' | 'complete' | 'paused' | 'history' | 'error'
type Algorithm = 'yuan' | 'erqiu'
type ArrayData = ArrayItemData[]

interface HistoryItem {
  action: OnGoingActionData
  array: ArrayData
}

interface SortLessonContainerState {
  array: ArrayItemData[]
  arrayID: number
  caughtError: any
  status: Status

  onGoingAction: OnGoingActionData
  history: HistoryItem[]
  historyIndex: number | null

  allowDuplicateNumber: boolean
  algorithmToUse: Algorithm
  chosenDelayOption: DelayOption
}

export class SortLessonContainer extends React.Component<
  SortLessonContainerProps,
  SortLessonContainerState
  > {
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
    caughtError: null,
    status: 'initial' as Status,
    // action history
    onGoingAction: {
      type: undefined,
      params: undefined,
    },
    history: [],
    historyIndex: null,
    // config
    allowDuplicateNumber: true,
    algorithmToUse: 'erqiu' as Algorithm,
    chosenDelayOption: 'normal' as DelayOption,
  }

  setDelayOption = (option: DelayOption) => {
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
    _setAction: (action: OnGoingActionData) => {
      this.setState(state => ({
        onGoingAction: action,
        history: state.history.concat({ action, array: state.array }),
        historyIndex: state.history.length,
      }))
    },
    clear: () => {
      this.setState({
        onGoingAction: {
          type: undefined,
          params: undefined,
        },
        history: [],
        historyIndex: null,
      })
    },
    swapping: (i: number, j: number) => {
      this.setOnGoingAction._setAction({
        type: 'swap',
        params: [this.state.array[i].index, this.state.array[j].index],
      })
    },
    comparing: (i: number, j: number) => {
      this.setOnGoingAction._setAction({
        type: 'compare',
        params: [this.state.array[i].index, this.state.array[j].index],
      })
    },
  }

  toggleAlgorithmToUse = () => {
    this.stopAlgorithm()
    this.setState(({ algorithmToUse }) => ({
      algorithmToUse: algorithmToUse === 'yuan' ? 'erqiu' : 'yuan',
    }))
  }

  toggleAllowDuplicateNumber = () => {
    this.setState(({ allowDuplicateNumber }) => ({
      allowDuplicateNumber: !allowDuplicateNumber,
    }))
  }

  pausedAction: null | {
    run: Function
  } = null
  retryTimeoutHandle?: number = undefined

  // TODO: refactor to change immediateFn to key value argument
  // TODO: fix types
  makeAsync = (fn: any, immediateFn: any = null) => {
    return (...args: any[]) => {
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
          this.retryTimeoutHandle = window.setTimeout(() => {
            try {
              this.pausedAction = null
              doTheWork()
            } catch (err) {
              if (err === 'paused') {
                this.pausedAction = {
                  run: () => {
                    window.clearTimeout(this.retryTimeoutHandle)
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

  checkIndexRangeOK = (index: number, name: string) => {
    if (index >= 0 && index < this.state.array.length) {
      // ok
    } else {
      throw new Error(
        `index ${name} is out of range, current value is ${index}, should be in range [0, ${
        this.state.array.length
        })`,
      )
    }
  }

  checkStatus = () => {
    if (this.state.status !== 'running') {
      if (['paused', 'history'].includes(this.state.status)) {
        throw 'paused'
      } else {
        throw 'interrupted'
      }
    }
  }

  swap = this.makeAsync(
    (i: number, j: number) => {
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
    (i: number, j: number) => {
      this.checkIndexRangeOK(i, 'left of swap(left, right)')
      this.checkIndexRangeOK(j, 'right of swap(left, right)')

      this.setOnGoingAction.swapping(i, j)
    },
  )

  lessThan = this.makeAsync(
    (i: number, j: number) => {
      const leftValue = this.state.array[i].value
      const rightValue = this.state.array[j].value
      const result = leftValue < rightValue
      console.log(`comparing (#${i}, ${leftValue}) (#${j}, ${rightValue}) result: ${result}`)

      return result
    },
    (i: number, j: number) => {
      this.checkIndexRangeOK(i, 'left of lessThan(left, right)')
      this.checkIndexRangeOK(j, 'right of lessThan(left, right)')

      this.setOnGoingAction.comparing(i, j)
    },
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

  resetArrayImp = () => {
    this.setState(state => ({
      array: resetArray(state.array),
    }))
  }

  reset = () => {
    this.stopAlgorithm()
  }

  runAlgorithm = (length: number, lessThan: CompareAction, swap: SwapAction) => {
    const algorithmToUse = this.state.algorithmToUse === 'yuan' ? yuanBubbleSort : erqiuBubbleSort
    this.setState({
      status: 'running',
    }, () => {
      // following code depends on status already changed to running
      algorithmToUse(length, lessThan, swap)
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
    })
  }

  stopAlgorithm = () => {
    this.setOnGoingAction.clear()
    this.resetArrayImp()
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

      return null
    })
  }

  resumeAlgorithm = () => {
    if (this.state.status === 'history') {
      this.setState(({ history }) => {
        const lastHistoryItem = history[history.length - 1]

        return {
          status: 'paused',
          array: lastHistoryItem.array,
          onGoingAction: lastHistoryItem.action,
          historyIndex: history.length - 1,
        }
      })

      setTimeout(() => this.setState({ status: 'running' }), 1000)
    } else if (this.state.status === 'paused') {
      this.setState({
        status: 'running',
      })
    }
  }

  // TODO: move other algorithm related actions to here
  algorithmActions = {
    nextStep: () => {
      if (this.state.status === 'paused') {
        // only meaningful when paused
        this.pausedAction!.run()
      } else if (this.state.status === 'history') {
        invariant(this.state.historyIndex != null, "nextStep: history index shouldn't be null")
        if (this.state.historyIndex === this.state.history.length - 1) {
          // already reached latest history, try next step
          this.setState(
            {
              status: 'paused',
            },
            () => this.pausedAction!.run(),
          )
        } else {
          invariant(this.state.historyIndex != null, "nextStep: history index shouldn't be null")
          // go to next step in history
          this.setState(state => ({
            historyIndex: state.historyIndex! + 1,
            onGoingAction: state.history[state.historyIndex! + 1].action,
            array: state.history[state.historyIndex! + 1].array,
            status: 'history',
          }))
        }
      }
    },
    prevStep: () => {
      if (this.state.status === 'paused' || this.state.status === 'history') {
        this.setState(state => {
          invariant(state.historyIndex != null, "prevStep: history index shouldn't be null")
          const historyIndex = Math.max(0, state.historyIndex! - 1)

          return {
            historyIndex,
            onGoingAction: state.history[historyIndex].action,
            array: state.history[historyIndex].array,
            status: 'history',
          }
        })
      }
    },
  }

  render() {
    return this.props.children({
      array: this.state.array,
      swap: this.swap,
      lessThan: this.lessThan,
      runAlgorithm: this.runAlgorithm,
      pauseAlgorithm: this.pauseAlgorithm,
      resumeAlgorithm: this.resumeAlgorithm,
      nextStepAlgorithm: this.algorithmActions.nextStep,
      prevStepAlgorithm: this.algorithmActions.prevStep,
      hasPrevStep: this.state.historyIndex != null && this.state.historyIndex! > 0,
      algorithmToUse: this.state.algorithmToUse,
      toggleAlgorithmToUse: this.toggleAlgorithmToUse,
      status: this.state.status,
      error: this.state.caughtError,
      shuffle: this.shuffle,
      reset: this.reset,
      onGoingAction: this.state.onGoingAction.type,
      actionParams: this.state.onGoingAction.params,
      toggleAllowDuplicateNumber: this.toggleAllowDuplicateNumber,
      allowDuplicateNumber: this.state.allowDuplicateNumber,
      setDelayOption: this.setDelayOption,
      chosenDelayOption: this.state.chosenDelayOption,
    })
  }
}
