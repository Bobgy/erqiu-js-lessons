import './App.css'

import styled from '@emotion/styled'
import {css } from '@emotion/core'
import React, { Component } from 'react'

import SortLesson from './lesson-1-sort/yuan/SortLesson'
import logo from './logo.svg'

const LessonTitle = styled('h1')({
  textAlign: 'left',
})

const DivWithMaxWeight = styled('div')({
  maxWidth: 600,
})

const RootFlexContainer = styled.div`
  display: flex;
  flexDirection: column;
  alignItems: center;
`

const Lesson = ({ children, name }: { name: string; children: any }) => {
  return (
    <RootFlexContainer/>
    //   <LessonTitle>{name}</LessonTitle>
    //   <DivWithMaxWeight>{children}</DivWithMaxWeight>
    // </RootFlexContainer>
  )
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Erqiu JS Lessons</h1>
        </header>
        <Lesson name="Lesson 1: Sort">
          {/* <SortLesson /> */}
        </Lesson>
      </div>
    )
  }
}

export default App
