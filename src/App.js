import {Route, Switch, useLocation} from "react-router";
import { ThemeProvider } from "styled-components";
import {lightTheme} from "./components/Themes";
import GlobalStyle from "./GlobalStyles";

import Main  from "./components/Main";
import AboutPage from "./components/AboutPage";
import BlogPage from "./components/BlogPage";
import WorkPage from "./components/WorkPage";
import MySkillsPage from "./components/MySkillsPage";
import { AnimatePresence } from "framer-motion"; 

import Sesbar from "./subComponents/Sesbar"

function App() {

  const location = useLocation();

  return <div>

    <GlobalStyle/>

    <ThemeProvider theme={lightTheme}>

    <Sesbar />

    <AnimatePresence exitBeforeEnter>
       <Switch location={location} key={location.pathname}>
           <Route exact path="/" component={Main}/>
           <Route exact path="/about" component={AboutPage}/>
           <Route exact path="/blog" component={BlogPage}/>
           <Route exact path="/work" component={WorkPage}/>
           <Route exact path="/skills" component={MySkillsPage}/>
        </Switch>
    </AnimatePresence>
       

  </ThemeProvider>
    
    </div>
    
}

export default App

