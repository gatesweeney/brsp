import { alpha, styled } from '@mui/material/styles';
import {DataGridPremium, GridActionsCellItem, gridClasses, GridCloseIcon, GridLogicOperator, GridToolbar, useGridApiRef} from "@mui/x-data-grid-premium";

import moment from "moment";
import {eRhythm, emotionalPeriod, iRhythm, intellectualPeriod, pRhythm, physicalPeriod} from "../array";
import React, { useEffect, useMemo, useState } from 'react';
import { PlayerDetailPanel } from './PlayerDetailPanel';
import { Box, Button, Checkbox, Chip, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


export default function TeamRosterTable({roster, gameDate}) {

    const apiRef = useGridApiRef()

    //Alternating Row Styling
    const ODD_OPACITY = 0.2;
    const StripedDataGrid = styled(DataGridPremium)(({ theme }) => ({
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
    const [totals, setTotals] = useState([])

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
    

    function AddPlayerModal() {
      const [open, setOpen] = React.useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);

      const [firstName, setFirstName] = useState()
      const [lastName, setLastName] = useState()
      const [birthday, setBirthday] = useState()
      const [pos, setPos] = useState()

      const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    
      return (
        <div>
          <Button variant='contained' color='warning' onClick={handleOpen}>Add Player Manually</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Stack spacing={2}>
                <TextField label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                <TextField label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}/>
                <DatePicker
                    label="Birthday"
                    fullWidth
                    value={birthday}
                    onChange={setBirthday}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                />
                <FormControl fullWidth>
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={pos}
                    label="Position"
                    onChange={setPos}
                  >
                    <MenuItem value={"P"}>Pitcher</MenuItem>
                    <MenuItem value={"H"}>Hitter</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </Modal>
        </div>
      );
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
        { field: 'pPep', headerName: 'PP', resizable: true, width: 1, sortComparator: customComparator, valueGetter: params => params.row.pValue.pep},
        { field: 'ePep', headerName: 'EP', resizable: true, width: 1, sortComparator: customComparator, valueGetter: params => params.row.eValue.pep},
        { field: 'iPep', headerName: 'IP', resizable: true, width: 1, sortComparator: customComparator, valueGetter: params => params.row.iValue.pep},
        { field: 'pep', headerName: 'PEP', resizable: true, width: 1, sortComparator: customComparator, valueGetter: params => params.row.pValue?.pep + params.row.eValue?.pep + params.row.iValue?.pep ?? ''},
        { field: 'totalPoints', headerName: 'Total', resizable: true, flex: 1, sortComparator: customComparator,
          valueGetter: params => (params.row.avg + params.row.pValue?.pep + params.row.eValue?.pep + params.row.iValue?.pep ?? '').toFixed(2),
          renderCell: params => {
            if (params.value > 6.75) {
              return <Chip color='primary' label={params.value}></Chip>
            } else if (params.value > 10) {
              return <Chip color='success' label={params.value}></Chip>
            } else if (params.value < 6.75) {
              return <Chip color='warning' label={params.value}></Chip>
            } else if (params.value === 6.75) {
              return <Chip label={params.value}></Chip>
            }
          },
        },
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

      const aggregationModel = {
        pep: 'sum', 
      }


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


    //TOTALS
    useMemo(() => {

      var emo = rows.map(row => row.eValue.value)
      var phy = rows.map(row => row.pValue.value)
      var int = rows.map(row => row.iValue.value)

      var emoPeps = rows.map(row => row.eValue.pep)
      var phyPeps = rows.map(row => row.pValue.pep)
      var intPeps = rows.map(row => row.iValue.pep)

      var avgs = rows.map(row => row.Status === statusFilter ? row.avg : null)
      var peps = rows.map(row => row.Status === statusFilter ? row.pValue?.pep + row.eValue?.pep + row.iValue?.pep ?? '' : null)

      const totalE = emo.reduce((partialSum, a) => partialSum + a, 0)
      const totalP = phy.reduce((partialSum, a) => partialSum + a, 0)
      const totalI = int.reduce((partialSum, a) => partialSum + a, 0)
      const totalEPeps = emoPeps.reduce((partialSum, a) => partialSum + a, 0)
      const totalPPeps = phyPeps.reduce((partialSum, a) => partialSum + a, 0)
      const totalIPeps = intPeps.reduce((partialSum, a) => partialSum + a, 0)
      const totalAvg = avgs.reduce((partialSum, a) => partialSum + a, 0)
      const totalPeps = peps.reduce((partialSum, a) => partialSum + a, 0)

      
      setTotals([
        {name: 'Physical', value: totalP},
        {name: 'Emotional', value: totalE},
        {name: 'Intellectual', value: totalI},
        {name: 'PP', value: totalPPeps},
        {name: 'EP', value: totalEPeps},
        {name: 'IP', value: totalIPeps},
        {name: 'Average', value: totalAvg},
        {name: 'PEPs', value: totalPeps},
      ])
    }, [rows])

    function RowMod() {
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
        RowMod()
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
            apiRef={apiRef}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            rowHeight={25}
            columns={columns}
            rows={rows}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                csvOptions: { fileName: [roster?.[0]?.Team, gameDate?.format('YYYY-MM-DD')].join('-') },
              }
            }}
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
              aggregation: {
                model: aggregationModel
              },
            }}
            getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }

            />
            <br></br>
            <Typography variant='h4'>Totals</Typography>
            <Divider/>
            <Stack sx={{marginTop: 2}} direction='row' spacing={2} divider={ <Divider orientation='vertical' flexItem /> }>
              {totals.map(t => <Typography variant='p'>{t.name}: <strong>{t.value.toFixed(2)}</strong></Typography>)}
            </Stack>
            <br></br>
            <AddPlayerModal/>
        </Box>
    )
}