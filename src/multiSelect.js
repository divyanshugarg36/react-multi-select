import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';
import { ArrowDown, CloseIcon } from './icons';

export class MultiSelect extends Component {
  constructor(props) {
    super();
    const { data, defaultData: selected } = props;
    const unSelected = data.filter(el => !selected.includes(el));
    this.state = {
      data,
      show: false,
      selected: [...selected],
      unSelected,
      searchString: '',
    };
    this.searchValue = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    const { selected } = prevState;
    if (!isEqual(data, prevState.data)) {
      const unSelected = data.filter(el => !selected.includes(el));
      return { unSelected };
    }
    return null;
  }

  componentDidMount() {
    this.setRefAPI()
  }


  componentDidUpdate() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.setRefAPI();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node) => {
    this.show = node;
  }

  handleClickOutside = (event) => {
    if (this.show && !this.show.contains(event.target)) {
      this.setState({ show: false });
    }
  }

  setRefAPI = () => {
    const { ref1 } = this.props || {};
    if (ref1) {
      ref1.current = {};
      ref1.current.getApi = () => {
        return {
          clear: this.unSelectAll,
          show: this.toggleMenu,
          focus: this.focusInput
        };
      }
    }
  }


  toggleMenu = (show = true) => {
    this.setState({ show });
    this.focusInput();
  }

  focusInput = () => {
    const { searchValue } = this;
    searchValue.current.focus();
  }

  selectData = (select) => {
    const { maxValues, onChange } = this.props;
    const { selected, unSelected } = this.state;
    if (maxValues > selected.length || maxValues === 0) {
      const index = unSelected.findIndex(x => isEqual(x, select));
      selected.push(...unSelected.splice(index, 1));
      this.setState({
        selected,
        unSelected,
      });
    }
    onChange(selected);
    this.focusInput();
  }

  unSelectData = (index) => {
    const { sortData } = this;
    const { onChange } = this.props;
    const { selected, unSelected } = this.state;
    unSelected.push(...selected.splice(index, 1));
    this.setState({
      selected,
      unSelected: sortData(unSelected),
      show: true,
      searchString: '',
    });
    onChange(selected);
    this.focusInput();
  }

  unSelectAll = () => {
    const { sortData } = this;
    const { data, onChange } = this.props;
    this.setState({
      selected: [],
      unSelected: [...sortData(data)],
      searchString: '',
    });
    onChange([]);
    this.focusInput();
  }

  sortData = (data) => {
    if (data.length === 0) { return []; }
    const { searchKey } = this.props;
    if (searchKey) {
      if (data[0][searchKey]) {
        return data.sort((a, b) => {
          const A = a[searchKey].toUpperCase();
          const B = b[searchKey].toUpperCase();
          let res = 0;
          if (A > B) { res = 1; } else if (A < B) { res = -1; }
          return res;
        });
      }
    }
    return data.sort();
  }

  filterData = (data, search, searchKey) => {
    const string = search.toLowerCase();
    const index = data.map(({ [searchKey]: label }, index) =>
      ({ index, pos: label.toLowerCase().indexOf(string) }));
    const sorted = index.sort((a, b) => a.pos - b.pos);
    const arranged = sorted.filter(({ pos }) => pos >= 0).concat(sorted.filter(({ pos }) => pos < 0));
    const result = arranged.map(({ index }) => data[index]);
    return result;
  }

  // filterData = (data) => {
  //   if (data.length === 0) { return []; }
  //   const { searchString } = this.state;
  //   const { searchKey } = this.props;
  //   if (searchKey) {
  //     if (data[0][searchKey]) {
  //       return data.filter((
  //         { [searchKey]: label },
  //       ) => (label.toLowerCase().indexOf(searchString.toLowerCase()) === 0));
  //     }
  //   }
  //   return data.filter(str => (str.toLowerCase().indexOf(searchString.toLowerCase()) === 0));
  // }

  handleSearchInput = (e) => {
    const { value } = e.currentTarget;
    this.setState({ searchString: value, show: true });
  }

  render() {
    const {
      toggleMenu, selectData, unSelectData, unSelectAll, filterData,
      handleSearchInput, setWrapperRef,
    } = this;
    const {
      element, selectedElement, searchKey, showCross,
    } = this.props;
    const {
      show, selected, unSelected, searchString,
    } = this.state;
    const typeTestSelected = selectedElement('test') === 'test';
    const typeTestUnSelected = element('test') === 'test';
    const elementInSelect = typeTestSelected ? element : selectedElement;
    const filteredUnSelected = filterData(unSelected, searchString, searchKey);
    const selectedLength = selected.length;
    const unSelectedLength = filteredUnSelected.length;
    const inputSize = searchString.length === 0 ? 1 : searchString.length;
    return (
      <div
        className={`multi-select ${show}`}
        ref={setWrapperRef}
      >
        <div
          className="multi-select-content"
          onClick={() => toggleMenu(!show)}
        >
          <div className="node-section">
            {selected.map((sel, index) => (
              <div
                key={index}
                className={`node-container ${(!typeTestUnSelected || !typeTestSelected)
                  ? '' : 'node-container-external'}`}
                onClick={(e) => {
                  unSelectData(index);
                  e.stopPropagation();
                }}
              >
                <div className='node'
                >
                  {elementInSelect(sel, searchKey)}
                </div>
                {showCross && <CloseIcon className="remove-node" />}
              </div>
            ))}
            <input
              className="search-value"
              ref={this.searchValue}
              onChange={handleSearchInput}
              value={searchString}
              size={inputSize}
            />
          </div>
          <div className="icon-section">
            <CloseIcon
              className={`remove-all ${!selectedLength && 'disable'}`}
              onClick={unSelectAll}
            />
            <div className="divider" />
            <ArrowDown
              className={`show-dropdown ${show}`}
            />
          </div>
        </div>
        {show && (
          <div className="multi-select-dropdown">
            {(unSelectedLength === 0)
              ? <div className="no-options">No Options!</div>
              : (
                <div className="unselected-nodes">
                  {filteredUnSelected.map((sel, index) => (
                    <div
                      key={index}
                      className="node-container"
                      onClick={() => selectData(sel)}
                    >
                      {element(sel, searchKey)}
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    );
  }
}

MultiSelect.propTypes = {
  data: PropTypes.instanceOf(Array),
  defaultData: PropTypes.instanceOf(Array),
  element: PropTypes.func,
  selectedElement: PropTypes.func,
  maxValues: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  searchKey: PropTypes.string,
  showCross: PropTypes.bool,
};

MultiSelect.defaultProps = {
  data: ['No Data'],
  defaultData: [],
  element: (data, searchKey) => (searchKey ? data[searchKey] : data),
  selectedElement: (data, searchKey) => (searchKey ? data[searchKey] : data),
  searchKey: '',
  maxValues: 0,
  showCross: false,
};
