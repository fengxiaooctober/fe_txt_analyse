import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import './tableSimple.scss';

class TableSimple extends React.Component{
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        ['updateState', 'onclickAddColum', 'onchangeNewColumnName', 'onchangeNewColumnType']
        .forEach(function(itemKey){
            if(this[itemKey]){
                this[itemKey] = this[itemKey].bind(this);
            }
        }.bind(this));
    }
	render(){
        let newColumnName = this.state.newColumnName;
        let newColumnType = this.state.newColumnType;
        let arrayDomOptType = [{name:'Number',value:'NUMBER'},{name:'Text',value:'TEXT'}].map(function(item,index){
            return (
                <option value={item.value} key={index}>{item.name}</option>
            )
        });
        return (
		 <div className="table-simple">
         <div>
            <input value={newColumnName} onChange={this.onchangeNewColumnName}/>
            <select value={newColumnType} onChange={this.onchangeNewColumnType}>{arrayDomOptType}</select>
            <button type="button" onClick={this.onclickAddColum}>Add Colum</button>
        </div>
        <ReactTable data={this.state.data} columns={this.state.columns} />
         </div>
		)
    }
    getInitialState(){
        return {
            newColumnName: '',
            newColumnType: 'NUMBER',
			data: [{
				name: 'Tanner Linsley',
                age: 26,
                gender: 'M'
			}, {
				name: 'Karen Wills',
                age: 29,
                gender: 'F'
			}],
			columns: [{
				Header: 'Name',
				accessor: 'name'
			}, {
				Header: 'Age',
				accessor: 'age',
				Cell: props => <span className='number'>{props.value}</span>
			}]
        };
    }
    updateState(data){
        let newState = {}, newColumnName = this.state.newColumnName;
        for(let key in this.state){
            if(typeof(data[key])!='undefined'){
                let item = data[key];
                switch(item.action.toUpperCase()){
                    case 'REPLACE':
                        newState[key] = item.value;
                    break;
                    case 'CONCAT':
                        if(Array.isArray(this.state[key])){
                            newState[key] = this.state[key].concat(item.value);
                        }
                    break;
                }
            }else if(Array.isArray(this.state[key])){
                newState[key] = [].concat(this.state[key]);
            }else if(typeof(this.state[key])=='Object'){
                newState[key] = Object.assign({}, this.state[key]);
            }else{
                newState[key] = this.state[key];
            }
        }
        this.setState(newState);
    }
    onclickAddColum(){
        let newColumnName = this.state.newColumnName;
        let newColumnType = this.state.newColumnType;
        let objInitialState = this.getInitialState();
        if(newColumnName){
            let objColumn = {
                Header: newColumnName,
                accessor: (''+newColumnName).toLowerCase()
            };
            switch(newColumnType){
                case 'NUMBER':
                case 'TEXT':
                objColumn.Cell = props =>(
                <input type={newColumnType.toLowerCase()} className={[newColumnType.toLowerCase()].join(' ')}/>
                )
                break;
            }
            this.updateState({
                newColumnName: {
                    value: objInitialState.newColumnName,
                    action: 'REPLACE'
                },
                newColumnType: {
                    value: objInitialState.newColumnType,
                    action: 'REPLACE'
                },
                columns: {
                    value: [objColumn],
                    action: 'CONCAT'
                }
            });
        }else{
            console.warn('onclickAddColum', 'newColumnName cannot be empty');
        }
    }
    onchangeNewColumnName(e){
        let newColumnName = e.target.value;
        this.updateState({
            newColumnName: {
                value: newColumnName,
                action: 'REPLACE'
            }
        });
    }
    onchangeNewColumnType(e){
        let newColumnType = e.target.value;
        this.updateState({
            newColumnType: {
                value: newColumnType,
                action: 'REPLACE'
            }
        });
    }
}

export default TableSimple;