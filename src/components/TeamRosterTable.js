import {Avatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

export default function TeamRosterTable({roster}) {

    const rows = roster.map(player => {
        return {
            id: player.PlayerID,
            ...player
        }
    })

    const columns = [
        { field: 'player', headerName: 'Player', width: 150, renderCell: params => (
            <div>
                <Avatar alt={getFullName(params)} src={params.row.PhotoUrl} />
                <strong>
                    {getFullName(params)}
                </strong>
            </div>
        )},
        { field: 'BirthDate', headerName: 'Birth Date', width: 150 },
        { field: 'Position', headerName: 'Position', width: 150 },
        { field: 'BatHand', headerName: 'Bats', width: 150 },
        { field: 'ThrowHand', headerName: 'Throws', width: 150 },
        { field: 'Status', headerName: 'Status', width: 150 },
    ];

    function getFullName(params) {
        return `${params.row.LastName || ''}, ${params.row.FirstName || ''}`;
    }

    return (
        <div style={{ height: 500 }}>
            <DataGrid columns={columns} rows={rows} />
        </div>
    )
}