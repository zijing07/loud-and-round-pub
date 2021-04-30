import {
  BrowserRouter as Router,
  Route, Switch
} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import { Article } from "./loudandround/Article";
import { ArticleList } from "./loudandround/ArticleList";
import { Parser } from "./loudandround/Parser";

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/list'><ArticleList /></Route>
        <Route path='/parser'><Parser /></Route>
        <Route path='/article/:id' component={Article}/>
      </Switch>
    </Router>
  );
}

export default App;
