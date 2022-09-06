import { Avatar, CardHeader } from "@mui/material";
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
        { field: 'BatHand', headerName: 'Bats', width: 80 },
        { field: 'ThrowHand', headerName: 'Throws', width: 80 },
        { field: 'Status', headerName: 'Status', width: 150 },
        { field: 'pRhythm', headerName: 'Physical', width: 120, valueGetter: params => getBiorhythmStatus("P", params.row) },
        { field: 'eRhythm', headerName: 'Emotional', width: 120, valueGetter: params => getBiorhythmStatus("E", params.row) },
        { field: 'iRhythm', headerName: 'Intellectual', width: 120, valueGetter: params => getBiorhythmStatus("I", params.row) },
    ];

    function getFullName(params) {
        return `${params.row.LastName || ''}, ${params.row.FirstName || ''}`;
    }

    function getBiorhythmStatus(type, player) {
        let period = 0;
        let values = [];
        //console.log(`Type: ${type}, player: ${player}`)
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
        console.log(`Values: ${values}`)
        const durationSinceBirth = moment.duration(gameDate.diff(moment(player.BirthDate)))
        console.log(`days since birth: ${durationSinceBirth.asDays()}`)
        const index = Math.floor(durationSinceBirth.asDays() % period)
        console.log(`index: ${index}`)
        if (player.BirthDate && values.length > 0) {
            return values[index].display
        }

    }

    return (
        <div style={{ height: 500 }}>
            <DataGrid columns={columns} rows={rows} />
        </div>
    )
}