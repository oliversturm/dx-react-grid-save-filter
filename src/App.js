import React, { useState } from 'react';
import Immutable from 'seamless-immutable';
import './App.css';
import {
  FilteringState,
  IntegratedFiltering,
  DataTypeProvider
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow
} from '@devexpress/dx-react-grid-material-ui';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Input,
  Toolbar
} from '@material-ui/core';

const FilterManager = ({
  savedFilterIndex,
  savedFilterChanged,
  externalFilter
}) => {
  const [filters, setFilters] = useState(
    Immutable([
      {
        name: 'Name contains "um"',
        filter: [{ columnName: 'name', operation: 'contains', value: 'um' }]
      },
      {
        name: 'Released after 1990',
        filter: [{ columnName: 'year', operation: 'greaterThan', value: 1990 }]
      },
      {
        name: 'Released before 1990',
        filter: [
          { columnName: 'year', operation: 'lessThanOrEqual', value: 1990 }
        ]
      }
    ])
  );
  const selectFilterIndex = index =>
    savedFilterChanged({
      index,
      filter:
        index >= 0
          ? Immutable.asMutable(filters[index].filter, { deep: true })
          : []
    });
  const [newFilterName, setNewFilterName] = useState('');
  const saveFilter = () => {
    const existingIndex = filters.findIndex(f => f.name === newFilterName);
    const newFilters =
      existingIndex > -1
        ? Immutable.setIn(filters, [existingIndex, 'filter'], externalFilter)
        : filters.concat([{ name: newFilterName, filter: externalFilter }]);
    const newIndex = existingIndex > -1 ? existingIndex : newFilters.length - 1;
    setFilters(newFilters);
    savedFilterChanged({
      index: newIndex,
      filter: externalFilter
    });
  };

  return (
    <Toolbar>
      <FormControl>
        <InputLabel htmlFor="selection">Active Saved Filter</InputLabel>
        <Select
          label="Saved Filter"
          value={savedFilterIndex}
          onChange={ev => selectFilterIndex(ev.target.value)}
          inputProps={{ id: 'selection' }}
          style={{ width: '200px' }}
        >
          <MenuItem value={-1}>None</MenuItem>
          {filters.map((f, i) => (
            <MenuItem key={i} value={i}>
              {f.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {savedFilterIndex == -1 && (
        <div style={{ marginLeft: '10px' }}>
          <FormControl>
            <InputLabel htmlFor="newFilterName">Filter Name</InputLabel>
            <Input
              id="newFilterName"
              value={newFilterName}
              onChange={ev => setNewFilterName(ev.target.value)}
              style={{ width: '200px' }}
            />
          </FormControl>
          <Button variant="contained" onClick={saveFilter}>
            Save Filter
          </Button>
        </div>
      )}
    </Toolbar>
  );
};

const App = () => {
  const [rows] = useState(
    Immutable([
      {
        id: 1,
        name: 'Their Satanic Majesties Request',
        artist: 'The Rolling Stones',
        year: 1967
      },
      { id: 2, name: 'Prime Cuts', artist: 'David Bowie', year: 1983 },
      { id: 3, name: 'Human', artist: "Rag'n'Bone Man", year: 2017 },
      { id: 4, name: "Kill 'Em All", artist: 'Metallica', year: 1983 },
      {
        id: 5,
        name: 'Colour by Numbers',
        artist: 'Culture Club',
        year: 1983
      },
      {
        id: 6,
        name: 'Born in the U.S.A.',
        artist: 'Bruce Springsteen',
        year: 1984
      },
      { id: 7, name: 'Disraeli Gears', artist: 'Cream', year: 1967 },
      {
        id: 8,
        name: 'Between the Buttons',
        artist: 'The Rolling Stones',
        year: 1967
      },
      {
        id: 9,
        name: "Sgt. Pepper's Lonely Hearts Club Band",
        artist: 'The Beatles',
        year: 1967
      },
      {
        id: 10,
        name: 'The Battle of Los Angeles',
        artist: 'Rage Against the Machine',
        year: 1999
      },
      { id: 11, name: 'The Slim Shady LP', artist: 'Eminem', year: 1999 }
    ])
  );
  const [columns] = useState(
    Immutable([
      { name: 'name', title: 'Name' },
      { name: 'artist', title: 'Artist' },
      { name: 'year', title: 'Year' }
    ])
  );
  const [currentFilter, setCurrentFilter] = useState([]);
  const [savedFilterIndex, setSavedFilterIndex] = useState(-1);

  return (
    <div id="main">
      <FilterManager
        savedFilterIndex={savedFilterIndex}
        savedFilterChanged={({ index, filter }) => {
          setSavedFilterIndex(index);
          setCurrentFilter(filter);
        }}
        externalFilter={currentFilter}
      />
      <Grid rows={rows} columns={columns}>
        <DataTypeProvider
          for={['year']}
          availableFilterOperations={[
            'equal',
            'notEqual',
            'greaterThan',
            'greaterThanOrEqual',
            'lessThan',
            'lessThanOrEqual'
          ]}
        />
        <FilteringState
          filters={currentFilter}
          onFiltersChange={filters => {
            setCurrentFilter(filters);
            setSavedFilterIndex(-1);
          }}
        />
        <IntegratedFiltering />
        <Table />
        <TableHeaderRow />
        <TableFilterRow showFilterSelector={true} />
      </Grid>
    </div>
  );
};

export default App;
