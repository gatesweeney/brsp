import { alpha, styled } from '@mui/material/styles';
import {DataGrid, gridClasses, GridToolbar} from "@mui/x-data-grid";
import moment from "moment";
import {eRhythm, iRhythm, pRhythm} from "../array";


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
            pValue: getBiorhythmStatus("P", player),
            eValue: getBiorhythmStatus("E", player),
            iValue: getBiorhythmStatus("I", player),
            avg: getAverage(player),
            ...player
        }
    })

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
        { field: 'player', headerName: 'Player', width: 150, renderCell: params => getFullName(params) },
        { field: 'BirthDate', disableExport: true, headerName: 'Birth Date', width: 120, valueFormatter: params => {
            return moment(params.value).format("MMM DD, YYYY")
        }},
        { field: 'Position', headerName: 'Position', width: 10 },
        { field: 'Status', disableExport: true, resizable: true, headerName: 'Status', width: 60 },
        { field: 'pRhythm', headerName: 'Physical', resizable: true, width: 120, ortComparator: customComparator, valueGetter: params => params.row.pValue.display },
        { field: 'eRhythm', headerName: 'Emotional', resizable: true, width: 120, sortComparator: customComparator, valueGetter: params => params.row.eValue.display },
        { field: 'iRhythm', headerName: 'Intellectual', resizable: true, width: 120, sortComparator: customComparator, valueGetter: params => params.row.iValue.display },
        { field: 'pAverage', headerName: 'Average', resizable: true, width: 120, sortComparator: customComparator, valueGetter: params => params.row.avg.toFixed(2) }
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

    return (
        <div style={{ }}>
            <StripedDataGrid 
            components={{ Toolbar: GridToolbar }}
            autoHeight
            rowHeight={25}
            columns={columns} rows={rows}

            filterModel={{
                items: [
                  { id: 1, columnField: 'Status', operatorValue: 'contains', value: 'Active' },
                  { id: 2, columnField: 'Status', operatorValue: 'contains', value: '40' }
                ],
                // linkOperator: GridLinkOperator.And,
              }}

            getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }

            />

        </div>
    )
}