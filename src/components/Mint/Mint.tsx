import { useState } from 'react';
import Header from '../Header/Header';
import SearchCuration from './SearchCuration';
import Create from './Create';
import { saveUserToken } from '../../services/mintServices';
import { CreateNFTProvider, useCreateNFT } from '@/context/createNFTContext';

// Define types for props (if any are expected from the parent component)
interface MintProps {
  render?: React.ReactNode;
}

// Define types for the curation object
interface Curation {
  owner: {
    _id: string;
  };
}

// Define types for the component's state
interface State {
  curation: Curation | null;
  curationSelected: boolean;
}

function MintChild(props: MintProps) {
  // Initialize state with the correct type
  const [state, setState] = useState<State>({
    curation: null,
    curationSelected: true,
  });

  const { setCuration } = useCreateNFT();

  // Async function to select the curation
  const selectCuration = async (curation: Curation | null) => {
    if (curation && curation.owner && curation.owner._id) {
      const tokenSaved = await saveUserToken({
        userId: curation.owner._id,
      });

      if (tokenSaved) {
        setCuration(curation);
        setState({
          curation: curation,
          curationSelected: false,
        });
      }
    }
  };

  // Function to handle the back button
  const handleBack = () => {
    setState((prevState) => ({
      ...prevState,
      curationSelected: true,
    }));
  };

  return (
    <section className="dashboard__area">
      {props.render}
      <Header />

      {state.curationSelected ? (
        <SearchCuration onSelect={selectCuration} />
      ) : (
        <Create curation={state.curation} handleBack={handleBack} />
      )}
    </section>
  );
}

export default function Mint(props: MintProps) {
  return (
    <CreateNFTProvider>
      <MintChild render={props.render} />
    </CreateNFTProvider>
  )
}