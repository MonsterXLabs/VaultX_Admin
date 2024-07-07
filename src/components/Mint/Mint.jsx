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
    if (curation && curation.owner) {
      const tokenSaved = await saveUserToken({
        userId: curation.owner,
      })

      if (tokenSaved) {
        setState({
          curation: curation,
          curationSelected: false
        })
      }
    }
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
          : <Create />
        }


    </section>
  )
}
