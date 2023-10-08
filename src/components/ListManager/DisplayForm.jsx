import React, { useState } from 'react';
import StyledButton from '../UI/StyledButton'
import { ValidateUrlFormatPromise, checkUrlExists } from '../../services/validationRules'
import isEmptyObj from '../../services/isEmptyObj'
import readTime from '../../services/readTime'
import validateField from '../../services/validateField'
import BookmarkEditBox from './BookmarkEditBox'

export function DisplayForm(buttons, bookmark = {}) {

  //init form depending on if we were passed a bookmark with data
  //Q: does this break rules of Hooks?
  //https://reactjs.org/docs/hooks-rules.html
  const [values, setValues] = useState(() => {
    if (isEmptyObj(bookmark)) {
      return ({
        showForm: true,
        url: '',
        urlDesc: '',
        isWaiting: false,
        validationMessage: ''
      })
    } else {
      return ({
        showForm: false,
        url: bookmark.url,
        urlDesc: bookmark.urlDesc,
        isWaiting: false,
        validationMessage: ''
      })
    }
  })

  const submitButton = buttons.find((button) => button.type === 'submit')

  //generic handleChange funciton for all inputs
  const handleChange = (event) => {
    updateValues({ [event.target.id]: event.target.value })
  }

  const updateValues = (obj) => {
    console.log('in updateValues with', obj)
    let newValues = {}
    for (const [key, value] of Object.entries(obj)) {
      newValues[key] = value
    }
    //have to pass prevState, cos closures
    //ref: https://reactjs.org/docs/hooks-reference.html#usestate
    setValues(prevState => {
      return { ...prevState, ...newValues };
    });
  }

  const validationRules = [ValidateUrlFormatPromise, checkUrlExists]

  const setTimedValidationMessage = (flashMessage = "") => {
    // setValidationMessage(flashMessage)
    updateValues({ validationMessage: flashMessage })
    const delay = readTime(flashMessage)
    setTimeout(() => { updateValues({ validationMessage: '' }) }, delay * 3)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateValues({ isWaiting: true })
    const validationResult = await validateField(values.url, validationRules)
      .catch(v => {
        setTimedValidationMessage("sorry something went terribly wrong.")
      })
    updateValues({ isWaiting: false })
    if (validationResult.passedAll) {
      bookmark['url'] = values.url
      bookmark['urlDesc'] = values.urlDesc
      bookmark['created'] = ('created' in bookmark) ? bookmark.created : + new Date()
      // calls the function associated with the submit button, atm either add or edit.
      //TODO: rename onClickFunc?
      submitButton.func(bookmark)
      // calls a local form action such as reset or close the form.
      callAfterFunc(submitButton.afterFunc)
    } else {
      setTimedValidationMessage(validationResult.messages[0].errorMessage)
      console.log('validation failed', validationResult.messages[0].errorMessages)
    }
  }

  // allow buttons to change the local form values, show/hide and reset input fields.
  const callAfterFunc = (funcName) => {
    switch (funcName) {
      case 'close':
        updateValues({ showForm: false })
        break;
      case 'reset':
        updateValues({ url: '', urlDesc: '' })
        break;
      default:
        console.warn('unknown switch case')
    }
  }

  // pass the current bookmark to the passed in function onClick function
  const handleButtonClick = (e, func, afterFunc, bookmark) => {
    e.preventDefault();
    func && func(bookmark)
    afterFunc && callAfterFunc(afterFunc)
  }

  //display the form in onlyread mode
  const readView = () => {
    return (
      <div>
        <a rel="noreferrer" target="_blank" href={bookmark.url}>{bookmark.url}</a>
        &nbsp;<StyledButton onClick={() => updateValues({ showForm: true })}>edit</StyledButton>
      </div>
    )
  }

  //return an jsx fragment containing the buttons for the form
  //TODO: could probably dry this up a bit
  const DisplayFormButtons = () => {
    return (
      <React.Fragment>
        {
          buttons.map((button, i) => {
            //test if this is the submit button and treat it slightly diffently.
            if (button.type === 'submit') {
              return (<StyledButton key={'key' + bookmark.created + i} type='submit' wait={values.isWaiting} disabled={values.isWaiting}>
                {values.isWaiting ? 'wait' : button.value}
              </StyledButton>
              )
            } else {
              return (
                <StyledButton
                  key={'key' + bookmark.created + i} onClick={(e) => handleButtonClick(e, button.func, button.afterFunc, bookmark)}>
                  {button.value}
                </StyledButton>
              )
            }
          })
        }
      </React.Fragment>
    )
  }

  //display the form inputs and the custom buttons.
  const formView = () => {
    return (
      <BookmarkEditBox>
        <form onSubmit={e => { handleSubmit(e) }}>
          <label htmlFor='url'>url:</label>
          <input
            id='url'
            type='text'
            value={values.url}
            onChange={handleChange}
          />
          &nbsp;<span>{values.validationMessage}</span>
          <br />
          <label htmlFor='urlDesc'>notes:</label>
          <input
            id='urlDesc'
            type='text'
            value={values.urlDesc}
            onChange={handleChange}
          />
          <br />
          <DisplayFormButtons />
        </form>
      </BookmarkEditBox>
    )
  }

  //NOTE: conditional rendering but hooks always get called. 
  return values.showForm ? formView() : readView()
}

