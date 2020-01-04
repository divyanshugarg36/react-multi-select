import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isEqual, keys } from 'lodash';
import { ArrowDown, CloseIcon } from './icons';

export class MultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = this.initState(props);
    this.searchValue = React.createRef();
  }

  initState = (props) => {
    const { data, defaultData: selected, searchKey: propSearchKey } = props;
    const unSelected = data.filter(el => !selected.includes(el));
    const searchKey = (typeof unSelected[0] === 'object' && !propSearchKey)
      ? keys(unSelected[0])[0] : propSearchKey;
    return {
      data,
      show: false,
      selected: [...selected],
      unSelected,
      searchString: '',
      searchKey,
    };
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
    const { selected } = this.state;
    const { refApi } = this.props || {};
    if (refApi) {
      refApi.current = {};
      refApi.current.getApi = () => {
        return {
          clear: this.unSelectAll,
          show: this.toggleMenu,
          focus: this.focusInput,
          value: selected,
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
    const { onChange } = this.props;
    const { selected, unSelected } = this.state;
    unSelected.push(...selected.splice(index, 1));
    this.setState({
      selected,
      unSelected: unSelected,
      show: true,
      searchString: '',
    });
    onChange(selected);
    this.focusInput();
  }

  unSelectAll = () => {
    const { data, onChange } = this.props;
    this.setState({
      selected: [],
      unSelected: [...data],
      searchString: '',
    });
    onChange([]);
    this.focusInput();
  }

  sortData = (data) => {
    if (data.length === 0) { return []; }
    const { searchKey } = this.state;
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
    if (search && searchKey) {
      const string = search.toLowerCase();
      const index = data.map(({ [searchKey]: label }, index) =>
        ({ index, pos: label.toLowerCase().indexOf(string) }));
      const sorted = index.sort((a, b) => a.pos - b.pos);
      const arranged = sorted.filter(({ pos }) => pos >= 0);
      // .concat(sorted.filter(({ pos }) => pos < 0));
      const result = arranged.map(({ index }) => data[index]);
      return result;
    }
    return data;
  }

  handleSearchInput = (e) => {
    const { value } = e.currentTarget;
    this.setState({ searchString: value, show: true });
  }

  render() {
    const {
      toggleMenu, selectData, unSelectData, unSelectAll, filterData,
      handleSearchInput, setWrapperRef, sortData
    } = this;
    const {
      element, selectedElement, showCross,
    } = this.props;
    const {
      show, selected, unSelected, searchString, searchKey,
    } = this.state;
    const typeTestSelected = selectedElement('test') === 'test';
    const typeTestUnSelected = element('test') === 'test';
    const elementInSelect = typeTestSelected ? element : selectedElement;
    const filteredUnSelected = filterData(sortData(unSelected), searchString, searchKey);
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
