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
        let arrayOptColumns = this.state.columns.map((item,index)=>{
            return (
                <option value={item.accessor} key={index}>{item.Header}</option>
            )
        });
        arrayOptColumns.push(
            <option value="" key={this.state.columns.length}>{'LAST'}</option>
        )
        return (
		 <div className="table-simple">
         <div>
            <button type="button" onClick={this.onclickAddColum} disabled="disabled">Add Colum</button>
            <span>Add a column</span>
            <input value={this.state.params.newColumnName} onChange={this.onchangeUpdateByPath.bind(this, 'params.newColumnName')}/>
            <span>before</span>
            <select value={this.state.params.columnAddBefore} onChange={this.onchangeUpdateByPath.bind(this, 'params.columnAddBefore')}>{arrayOptColumns}</select>
            <button type="button" onClick={this.onclickAddColumBefore.bind(this)}>Add Column</button>
            <button type="button" onClick={this.onClickSave.bind(this)}>Save</button>
        </div>
        <ReactTable data={this.state.data} columns={this.state.columns} />
         </div>
		)
    }
    getParamsObject(){
        return {
            newColumnName: '',
            columnAddBefore: ''
        };
    }
    getInitialState(){
        let self = this;
        //Data
        let data = [{
            "column0": "",
            "column1": "2016",
            "column2": "2015",
        }, {
            "column0": '第一项',
            "column1": 26,
            "column2": 10
        }, {
            "column0": '第二项',
            "column1": 29,
            "column2": 8
        }, {
            "column0": '总计',
            "column1": 55,
            "column2": 18
        }];
        //Column
        let columns = [];
        data.forEach((item,index)=>{
            Object.keys(item).forEach(key=>{
                if(columns.indexOf(key)<0){
                    columns.push(key);
                }
            })
        });
        columns = columns.map(item=>{
            return {
                Header: item,
                accessor: item,
                Cell: props => {
                    // console.warn('props', props);
                    let isTotoalField = false;
                    for(let key in props.original){
                        if(/\u603b\u8ba1/.test(props.original[key])){
                            isTotoalField = true;
                            break;
                        }
                    }
                    return isTotoalField && !/\u603b\u8ba1/.test(props.value)?(
                    <input type="number" value={props.value} column={props.column.Header} index={props.index} onChange={this.onchangeCell.bind(self,props.index,props.column.Header)}/>
                    ):(
                    <span>{props.value}</span>
                    )
                }
            }
        });
        //Result
        return {
            newColumnType: 'NUMBER',
            params: this.getParamsObject(),
			data: data,
            columns: columns,
        };
    }
    onchangeUpdateByPath(path, e){
        console.log('onchangeUpdateByPath - path', path);
        let arrayNodes = path.split('.');
        if(this.state[arrayNodes[0]]){
            let keyIterator, key1stLayer;
            let data = this.state[key1stLayer = keyIterator = arrayNodes.shift()];
            while(keyIterator = arrayNodes.shift()){
                if(arrayNodes.length){
                    data = data[keyIterator];
                }else{
                    data[keyIterator] = e.target.value;
                }
            }
            var objUpdate = {};
            objUpdate[key1stLayer] = {
                value: data,
                action: 'REPLACE'
            }
            this.updateState(objUpdate);
        }
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
    onchangeCell(index, column, e){
        var data = [].concat(this.state.data);
        data[index][column]=e.target.value;
        this.updateState({
            data: {
                value: data,
                action: 'REPLACE'
            }
        });
    }
    onclickAddColumBefore(e){
        // console.log('this.params',this.state.params);
        // console.log('e',e);
        let newColumnName = this.state.params.newColumnName;
        let columnAddBefore = this.state.params.columnAddBefore;
        if(newColumnName){
            let columns = [].concat(this.state.columns);
            let data = [].concat(this.state.data);
            let config = this.state.config;
            let indexToInsert;
            columns.forEach((item, index)=>{
                if(item.accessor==columnAddBefore){
                    indexToInsert = index;
                }
            });
            if(typeof indexToInsert=='undefined'){
                indexToInsert = columns.length;
            }
            columns.splice(indexToInsert,0,{
                Header: newColumnName,
                accessor: newColumnName.toLowerCase(),
                Cell: props => (
                    <input type="text" value={props.value} column={props.column.Header} index={props.index} onChange={this.onchangeCell.bind(this,props.index,props.column.Header)}/>
                )
            });
            data.forEach(item=>{
                item[newColumnName] = '';
            });
            this.updateState({
                columns: {
                    value: columns,
                    action: 'REPLACE'
                },
                data: {
                    value: data,
                    action: 'REPLACE'
                },
                params: {
                    value: this.getParamsObject(),
                    action: 'REPLACE'
                }
            })
        }
    }
    onClickSave(){
        console.log('onClickSave', this.state.data);
    }
}

export default TableSimple;