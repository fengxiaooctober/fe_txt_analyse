import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Table from './components/tableSimple/tableSimple.jsx';

class Main extends Component{
	constructor(props) {
		super(props);
    }
	render(){
		return (
		<Table />
		)
	}
}
ReactDOM.render(
	<Main />,
	document.getElementById('content')
);