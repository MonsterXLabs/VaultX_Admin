import { useEffect, useState } from "react";
// css
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
// Components
import SideBar from "./components/SideBar/SideBar";
import Dashboard from "./components/Dashboard/Dashboard";
import Homepage from "./components/Homepage/Homepage";
import MediaImage from "./components/Mediaimage/MediaImage";
import User from "./components/User/User";
import NFTs from "./components/NFTs/NFTs";
import Curation from "./components/Curation/Curation";
import Category from "./components/Category/Category";
import Order from "./components/Order/Order";
import Fee from "./components/Fee/Fee";
import Tooltip from "./components/Tooltip/Tooltip";
import Translation from "./components/Translation/Translation";
import Networks from "./components/Networks/Networks";
import Administrtor from "./components/Administrtor/Administrtor";
import Login from "./components/Login/Login";

export function App () {
    const [tab,setTab] = useState('login');
    const handleTab = (tabName) => {
        setTab(tabName)
    }

    switch (tab) {
        case 'login':
            return <Login onLogin={handleTab} />
        case 'dashboard':
            return <Dashboard render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab}/>} />
        case 'homepage':
            return <Homepage render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab}/>} />
        case 'mediaimage':
            return <MediaImage render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab}/>} />
        case 'user':
            return <User render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab}/>} />
        case 'nfts':
            return <NFTs render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab}/>} />
        case 'curation':
            return <Curation render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab} />} />
        case 'category':
            return <Category render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab} />} />
        case 'order':
            return <Order render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab} />} />
        case 'fee':
            return <Fee render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab} />} />
        case 'tooltip':
            return <Tooltip render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab} />} />
        case 'translation':
            return <Translation render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab} />} />
        case 'networks':
            return <Networks render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab} />} />
        case 'administrator':
            return <Administrtor render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab} />} />
        default:
            return <Dashboard render={<SideBar onButtonClick={handleTab} activeTab={tab} onLogout={handleTab} />} />
    }
  
}