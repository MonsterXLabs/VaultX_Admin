import { useState } from 'react'
import Header from '../Header/Header'
import SearchCuration from './SearchCuration'
import Create from './Create'
import { saveUserToken } from '../../services/mintServices'

export default function Mint(props) {
  const [state, setState] = useState({
    curation: null,
    curationSelected: true
  })

  const selectCuration = async (curation) => {
    if (curation && curation.owner && curation.owner._id) {
      const tokenSaved = await saveUserToken({
        userId: curation.owner._id,
      })

      if (tokenSaved) {
        setState({
          curation: curation,
          curationSelected: false
        })
      }
    }
  }

  const handleBack = async () => {
    setState({
      ...state,
      curationSelected: true
    })
  }

  return (
    <section className="dashboard__area">
        {props.render}
        <Header />

        {
          state.curationSelected ? 
          <SearchCuration 
          onSelect={selectCuration} 
          />
          : <Create curation={state.curation} handleBack={handleBack} />
        }


    </section>
  )
}
