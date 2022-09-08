import {Avatar, CardHeader, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import moment from "moment";
import {eRhythm, iRhythm, pRhythm} from "../array";

export default function TeamRosterTable({roster, gameDate}) {

    const physicalPeriod = pRhythm.length
    const emotionalPeriod = eRhythm.length
    const intellectualPeriod = iRhythm.length

    const rows = roster.map(player => {
        return {
            id: player.PlayerID,
            ...player
        }
    })

    const columns = [
        { field: 'player', headerName: 'Player', width: 250, renderCell: params => (
            <CardHeader
                avatar={<Avatar alt={getFullName(params)} src={params.row.PhotoUrl} />}
                title={getFullName(params)}
            />
        )},
        { field: 'BirthDate', headerName: 'Birth Date', width: 120, valueFormatter: params => {
            return moment(params.value).format("MMM DD, YYYY")
        }},
        { field: 'Position', headerName: 'Position', width: 80 },
        { field: 'Status', headerName: 'Status', width: 120 },
        { field: 'pRhythm', headerName: 'Physical', width: 150, renderCell: params => getBiorhythmStatus("P", params.row) },
        { field: 'eRhythm', headerName: 'Emotional', width: 150, renderCell: params => getBiorhythmStatus("E", params.row) },
        { field: 'iRhythm', headerName: 'Intellectual', width: 150, renderCell: params => getBiorhythmStatus("I", params.row) },
    ];

    function getFullName(params) {
        return `${params.row.LastName || ''}, ${params.row.FirstName || ''}`;
    }

    function getBiorhythmStatus(type, player) {
        let period = 0;
        let values = [];
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
    

    return (
        <div style={{ }}>
            <DataGrid 
            autoHeight
            columns={columns} rows={rows}

            filterModel={{
                items: [
                  { columnField: 'Status', operatorValue: 'contains', value: 'Active' }
                ],
              }}

            />
        </div>
    )
}