import './bootstrap';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';

function App() {
    return (
        <Router>
            <Switch>
                {/* Route to create a new product */}
                <Route path="/create-product" component={ProductForm} />

                {/* Route to edit an existing product */}
                <Route path="/edit-product/:id" component={ProductForm} />

                {/* Route to list all products */}
                <Route path="/" exact component={ProductList} />
            </Switch>
        </Router>
    );
}

export default App;