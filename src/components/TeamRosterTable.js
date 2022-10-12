//import {Avatar, CardHeader, Typography} from "@mui/material";
import { alpha, styled } from '@mui/material/styles';
import {DataGrid, gridClasses, GridToolbar} from "@mui/x-data-grid";
import moment from "moment";
import {eRhythm, iRhythm, pRhythm} from "../array";
import { GridCsvExportOptions } from '@mui/x-data-grid';
import { GridPrintExportOptions } from '@mui/x-data-grid';


export default function TeamRosterTable({roster, gameDate}) {

    const physicalPeriod = 23;
    const emotionalPeriod = 28;
    const intellectualPeriod = 33;

    //Alternating Row Styling
    const ODD_OPACITY = 0.2;
    const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
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

    const rows = roster.map(player => {
        return {
            id: player.PlayerID,
            ...player
        }
    })

    const columns = [
        { field: 'player', headerName: 'Player', width: 150, renderCell: params => getFullName(params)
        //(       <CardHeader
                //avatar={<Avatar alt={getFullName(params)} src={params.row.PhotoUrl} />}
                //title={getFullName(params)}
        //    />
            
        //)
        },
        { field: 'BirthDate', disableExport: true, headerName: 'Birth Date', width: 120, valueFormatter: params => {
            return moment(params.value).format("MMM DD, YYYY")
        }},
        { field: 'Position', headerName: 'Position', width: 10 },
        { field: 'Status', disableExport: true, resizable: true, headerName: 'Status', width: 60 },
        { field: 'pRhythm', headerName: 'Physical', resizable: true, width: 120, renderCell: params => getBiorhythmStatus("P", params.row) },
        { field: 'eRhythm', headerName: 'Emotional', resizable: true, width: 120, renderCell: params => getBiorhythmStatus("E", params.row) },
        { field: 'iRhythm', headerName: 'Intellectual', resizable: true, width: 120, renderCell: params => getBiorhythmStatus("I", params.row) },
        { field: 'pAverage', headerName: 'Average', resizable: true, width: 120, renderCell: params => ((getBiorhythmValue("P", params.row) + getBiorhythmValue("E", params.row) + getBiorhythmValue("I", params.row))/3).toFixed(2) }
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
        const index = Math.floor(durationSinceBirth.asDays() % period)
        if (player.BirthDate && values.length > 0) {
            return values[index].display
        }
    }

    function getBiorhythmValue(type, player) {
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
      const index = Math.floor(durationSinceBirth.asDays() % period)
      if (player.BirthDate && values.length > 0) {
          return values[index].value
      }
  }


    

    return (
        <div style={{ }}>
            <StripedDataGrid 
            components={{ Toolbar: GridToolbar }}
            autoHeight
            rowHeight={25}
            columns={columns} rows={rows}

            filterModel={{
                items: [
                  //{ columnField: 'Status', operatorValue: 'contains', value: 'Active' }
                ],
              }}

            getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }

            />
        </div>
    )
}