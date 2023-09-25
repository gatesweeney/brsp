import { alpha, styled } from '@mui/material/styles';
import {DataGridPro, GridActionsCellItem, gridClasses, GridCloseIcon, GridLogicOperator, GridToolbar, useGridApiRef} from "@mui/x-data-grid-pro";
import moment from "moment";
import {eRhythm, emotionalPeriod, iRhythm, intellectualPeriod, pRhythm, physicalPeriod} from "../array";
import React, { useEffect, useMemo, useState } from 'react';
import { PlayerDetailPanel } from './PlayerDetailPanel';
import { Box, Button, Checkbox, Divider, FormControlLabel, Stack, Typography } from '@mui/material';

export default function TeamRosterTable({roster, gameDate}) {


    const apiRef = useGridApiRef()

    //Alternating Row Styling
    const ODD_OPACITY = 0.2;
    const StripedDataGrid = styled(DataGridPro)(({ theme }) => ({
        [`& .${gridClasses.row}.even`]: {
          backgroundColor: theme.palette.grey[200],
          '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
              backgroundColor: 'transparent',
            },
          },
          '&.Mui-selected': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
              backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY +
                  theme.palette.action.selectedOpacity +
                  theme.palette.action.hoverOpacity,
              ),
              // Reset on touch devices, it doesn't add specificity
              '@media (hover: none)': {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  ODD_OPACITY + theme.palette.action.selectedOpacity,
                ),
              },
            },
          },
        },
      }));

    const [rows, setRows] = useState([]) 

    const [posFilter, setPosFilter] = useState()
    const [statusFilter, setStatusFilter] = useState("Active")
    const [totals, setTotals] = useState({totalAvg: 0, totalPeps: 0})

    const avgRow = [
      { id: 1000, player: 'Snow', Position: 'Jon', pAverage: 35 },
    ];

    function colAverage(columnID, rows) {
      var total = 0; // Total Calories

      const calories = rows.map((row) => (total += row.calories));

      console.log(calories);
    } 

    function customComparator(v1, v2) {
        return sortableValue(v1).localeCompare(sortableValue(v2))
    }

    function sortableValue(value) {
        if (value === "UNKNOWN") return "ZZZ"
        if (value === "CRIT") return "0"
        return value
    }

    const columns = [
        {
          field: 'player',
          headerName: 'Player',
          width: 150,
          editable: true,
          renderCell: params => getFullName(params),
          valueGetter: params => params.row.LastName
        },
        {
          field: 'BirthDate',
          disableExport: true,
          headerName: 'Birth Date',
          width: 120,
          valueFormatter: params => {
            return moment(params.value).format("MMM DD, YYYY")
          },
          editable: true,
          renderEditCell: v => v.value
        },
        { field: 'Position', headerName: 'POS', width: 10, editable: true },
        { field: 'PositionCategory', headerName: 'P/H', width: 10, editable: true },
        { field: 'Status', disableExport: true, resizable: true, headerName: 'Status', width: 60 },
        { field: 'pRhythm', headerName: 'Physical', resizable: true, flex: 1, sortComparator: customComparator, valueGetter: params => getBiorhythmStatus("P", params.row), valueFormatter: v => v.value.display },
        { field: 'eRhythm', headerName: 'Emotional', resizable: true, flex: 1, sortComparator: customComparator, valueGetter: params => getBiorhythmStatus("E", params.row), valueFormatter: v => v.value.display},
        { field: 'iRhythm', headerName: 'Intellectual', resizable: true, flex: 1, sortComparator: customComparator, valueGetter: params => getBiorhythmStatus("I", params.row), valueFormatter: v => v.value.display},
        { field: 'pAverage', headerName: 'AVG', resizable: true, width: 1, sortComparator: customComparator, valueGetter: params => params.row.avg?.toFixed(2) ?? ''},
        { field: 'pep', headerName: 'PEP', resizable: true, width: 1, sortComparator: customComparator, valueGetter: params => params.row.pValue?.pep + params.row.eValue?.pep + params.row.iValue?.pep ?? ''},
        {
          field: 'actions',
          type: 'actions',
          flex: 1,
          getActions: (params) => [
            <GridActionsCellItem
              icon={<GridCloseIcon />}
              label="Out"
              onClick={() => {
                apiRef.current.updateRows([{ id: params.id, _action: 'delete' }])
              }}
            />
          ],
        },
      ];


    function getFullName(params) {
        return `${params.row.LastName || ''}, ${params.row.FirstName || ''}`;
    }

    function getBiorhythmStatus(type, player) {
        let period = 0;
        let values = [];
        // eslint-disable-next-line default-case
        switch (type) {
            case "P":
                period = physicalPeriod
                values = pRhythm
                break
            case "E":
                period = emotionalPeriod
                values = eRhythm
                break
            case "I":
                period = intellectualPeriod
                values = iRhythm
                break
        }
        const durationSinceBirth = moment.duration(gameDate.diff(moment(player.BirthDate)))
        const index = (Math.floor(durationSinceBirth.asDays() - 1) % period)
        if (player.BirthDate && values.length > 0) {
            return values[index]
        }
        return { display: "UNKNOWN", value: null }
    }

    function average(array) {
        if (array == undefined || array.length === 0) {
            return 0;
        }
        return array.reduce((a, b) => a + b) / array.length;
    }

    function getAverage(player) {
        return average(["P", "E", "I"].flatMap(type => getBiorhythmStatus(type, player)?.value ?? [])) ?? 0;
    }

    useMemo(() => {
      var avgs = rows.map(row => row.Status === statusFilter ? row.avg : null)
      var peps = rows.map(row => row.Status === statusFilter ? row.pValue?.pep + row.eValue?.pep + row.iValue?.pep ?? '' : null)
      const totalAvg = avgs.reduce((partialSum, a) => partialSum + a, 0)
      const totalPeps = peps.reduce((partialSum, a) => partialSum + a, 0)
      setTotals({totalAvg, totalPeps})
    }, [rows])

    function ColumnTotals() {
      setRows(roster.map(player => {
        return {
            id: player.PlayerID,
            pValue: getBiorhythmStatus("P", player),
            eValue: getBiorhythmStatus("E", player),
            iValue: getBiorhythmStatus("I", player),
            avg: getAverage(player),
            ...player
        }
      }))

    }

    useEffect(() => {
      ColumnTotals()
    }, [roster, gameDate])

    return (
        <Box>
            <Stack direction='row' spacing={1}>
              <Button variant='contained' onClick={e => setPosFilter('')}>All</Button>
              <Button variant='contained' onClick={e => setPosFilter('P')}>Pitchers</Button>
              <Button variant='contained' onClick={e => setPosFilter('')}>Hitters</Button>
              <FormControlLabel control={<Checkbox onChange={e => e.target.checked ? setStatusFilter("") : setStatusFilter("Active")}/>} label="Show Full Roster" />
            </Stack>
            <br></br>
            <StripedDataGrid 
            components={{ Toolbar: GridToolbar }}
            apiRef={apiRef}
            autoHeight
            rowHeight={25}
            columns={columns}
            rows={rows}
            getDetailPanelHeight={() => 'auto'}
            getDetailPanelContent={row => <PlayerDetailPanel row={row} gameDate={gameDate} />}
            initialState={{
              sorting: {
                sortModel: [{ field: 'player', sort: 'asc' }],
              },
              filter: {
                filterModel: {
                  items: [
                    { id:1, field: 'Status', operator: 'equals', value: statusFilter },
                    { id:2, field: 'PositionCategory', operator: 'equals', value: posFilter }
                  ],
                  logicOperator: GridLogicOperator.And,
                },
              },
              columns: {
                columnVisibilityModel: {
                  PositionCategory: false,
                },
              },
            }}
            getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }

            />
            <br></br>
            <Typography variant='h4'>Totals</Typography>
            <Divider/>
            <Typography variant='h6'>Averages: {totals.totalAvg.toFixed(2)} | PEPs: {totals.totalPeps}</Typography>
            <br></br>
          <Button variant='contained' onClick={
            e=> {
              var rows = apiRef.current.getRowsCount()
              apiRef.current.updateRows([{id: rows + 1, LastName: 'Z', item: 'new item', Status: 'Active', BirthDate: "1987-11-08T00:00:00"}]);
            }
            }>Add Player Manually</Button>
        </Box>
    )
}