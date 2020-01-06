import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isEqual, keys } from 'lodash';
import { ArrowDown, CloseIcon } from './icons';

export class MultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = this.initState(props);
    this.searchValue = React.createRef();
    this.validate = React.createRef();
    this.show = React.createRef();
  }

  initState = (props) => {
    const { data, defaultData, searchKey: sKey, maxValues } = props;
    const selected = (defaultData.length > maxValues) && (maxValues !== 0)
      ? [defaultData[0]] : defaultData;
    const unSelected = data.filter(el => !selected.includes(el));
    const searchKey = (typeof unSelected[0] === 'string')
      ? undefined : (sKey || keys(unSelected[0])[0]);
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
    this.setRefAPI();
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('scroll', this.handleScroll);
    console.log(this.div);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('scroll', this.handleScroll);
  }

  handleClickOutside = (event) => {
    const { show } = this.state;
    if (this.show.current && !this.show.current.contains(event.target) && show) {
      this.setState({ show: false, searchString: '' });
    }
  }

  handleScroll = () => {
    this.toggleMenu(false);
  }

  setDropdownPosition = () => {
    const { parentId } = this.props;
    const { innerHeight } = window;
    const { top, height, bottom: bottomSelect } = this.show.current.getBoundingClientRect();
    let parentBottomSpace;
    if (parentId) {
      const { bottom: bottomParent } = document.getElementById(parentId).getBoundingClientRect();
      parentBottomSpace = bottomParent - bottomSelect;
    }
    const windowBottomSpace = (top + height - innerHeight) * -1;
    const position = (windowBottomSpace > 150 || parentBottomSpace > 150)
      ? { top: 'calc(100% + 1px)' } : { bottom: 'calc(100% + 1px)' };
    return position;
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
    if (show) {
      this.setDropdownPosition();
    }
    this.focusInput();
  }

  focusInput = () => {
    const { searchValue } = this;
    searchValue.current.focus();
  }

  validateMessage = () => {
    const { validate: current } = this;
    const { minValues } = this.props;
    const { selected } = this.state;
    if (current) {
      const string = selected.length === 0
        ? "Please select the data."
        : `Please select at least ${minValues} values.`;
      try {
        this.validate.current.setCustomValidity(string);
      } catch{ }
    }
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
    this.setState(
      ({ selected, unSelected }) => {
        unSelected.push(...selected.splice(index, 1));
        onChange(selected);
        return {
          selected,
          unSelected,
          show: true,
          searchString: '',
        }
      }
    );
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

  filterData = (data, searchString, searchKey) => {
    if (data.length === 0) { return []; }
    if (searchKey) {
      if (data[0][searchKey]) {
        return data.filter((
          { [searchKey]: label },
        ) => (label.toLowerCase().indexOf(searchString.toLowerCase()) > -1));
      }
    }
    return data.filter(str => (str.toLowerCase().indexOf(searchString.toLowerCase()) > -1));
  }

  handleSearchInput = (e) => {
    const { currentTarget } = e;
    const { value } = currentTarget;
    this.setState({ searchString: value, show: true });
  }

  handleSearchInputUp = (e) => {
    const { keyCode } = e;
    const allNodes = document.querySelectorAll("[tabIndex].node-container");
    if (keyCode === 40 && allNodes[0]) {
      allNodes[0].focus();
    }
  }

  handleSearchInputDown = (e) => {
    const { keyCode } = e;
    const { selected, searchString } = this.state;
    const allNodes = document.querySelectorAll("[tabIndex].node-container");
    if (keyCode === 13 && allNodes[0]) {
      allNodes[0].focus();
    }
    if (keyCode === 8 && !searchString) {
      this.unSelectData(selected.length - 1);
    }
  }

  handleNodeKey = (e, sel) => {
    const { keyCode, currentTarget } = e;
    const prev = currentTarget.previousSibling;
    const next = currentTarget.nextSibling;
    if (keyCode === 13) {
      this.selectData(sel);
      this.setState({ searchString: '' });
    }
    if (keyCode === 38) {
      if (prev) {
        prev.focus();
      } else {
        this.focusInput();
      }
    }
    if (keyCode === 40 && next) {
      next.focus();
    }
  }

  render() {
    const {
      toggleMenu, selectData, unSelectData, unSelectAll, filterData,
      handleSearchInput,
      //  setWrapperRef,
      sortData, handleNodeKey,
      handleSearchInputUp, handleSearchInputDown, validateMessage,
      setDropdownPosition
    } = this;
    const {
      element, selectedElement, showCross, required, minValues
    } = this.props;
    const {
      show, selected, unSelected, searchString, searchKey
    } = this.state;
    const typeTestSelected = selectedElement('a') === 'a';
    const typeTestUnSelected = element('a') === 'a';
    const filteredUnSelected = filterData(sortData(unSelected), searchString, searchKey);
    const selectedLength = selected.length;
    const unSelectedLength = filteredUnSelected.length;
    const inputSize = searchString.length === 0 ? 1 : searchString.length;
    const validate = ((required || minValues > 0) && !(minValues - 1 < selectedLength));
    return (
      <div
        className={`multi-select ${show}`}
        ref={this.show}
      >
        {validate && <input
          ref={this.validate}
          className="validation-input"
          required
          onFocus={this.focusInput}
        />}
        <div
          className="multi-select-content"
          onClick={() => toggleMenu(!show)}
        >
          <div className="node-section">
            {selected.map((sel, index) => (
              <div
                key={index}
                className={`node-container ${(!typeTestUnSelected || !typeTestSelected)
                  ? 'node-container-external' : ''}`}
                onClick={(e) => {
                  unSelectData(index);
                  e.stopPropagation();
                }}
              >
                <div className='node'
                >
                  {selectedElement(sel, searchKey)}
                </div>
                {showCross && <CloseIcon className="remove-node" />}
              </div>
            ))}
            <input
              className="search-value"
              ref={this.searchValue}
              onFocus={validateMessage}
              onChange={handleSearchInput}
              onKeyUp={handleSearchInputUp}
              onKeyDown={handleSearchInputDown}
              value={searchString}
              size={inputSize}
              maxLength="15"
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
          <div className="multi-select-dropdown" style={setDropdownPosition()}>
            {(unSelectedLength === 0)
              ? <div className="no-options">No Options!</div>
              : (
                <div className="unselected-nodes">
                  {filteredUnSelected.map((sel, index) => (
                    <div
                      key={index}
                      tabIndex={0}
                      onKeyUp={(e) => handleNodeKey(e, sel)}
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
  minValues: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  searchKey: PropTypes.string,
  showCross: PropTypes.bool,
  required: PropTypes.bool,
  parentId: PropTypes.string,
};

MultiSelect.defaultProps = {
  data: ['No Data'],
  defaultData: [],
  element: (data, searchKey) => (searchKey ? data[searchKey] : data),
  selectedElement: (data, searchKey) => (searchKey ? data[searchKey] : data),
  searchKey: '',
  maxValues: 0,
  minValues: 0,
  showCross: false,
  required: false,
  parentId: '',
};
