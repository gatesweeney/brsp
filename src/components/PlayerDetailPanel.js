

import { Avatar, Box, Button, CardContent, Divider, Modal, Stack, Tab, Tabs, TextField, Typography, gridClasses} from "@mui/material";
import React, { useEffect, useState } from "react";
import { alpha, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import moment from "moment/moment";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { eRhythm, emotionalPeriod, iRhythm, intellectualPeriod, pRhythm, physicalPeriod } from "../array";
import { LineChart } from "@mui/x-charts";


export function PlayerDetailPanel(params) {
    
    const {row, gameDate } = params

    const newDate = new Date(gameDate._d)
    
    const { id, PlayerID, BirthDate, Position } = row

    const [open, setOpen] = useState(false);
    const [days, setDays] = useState(15)
    const [chartDates, setChartDates] = useState()

    var hiddenCols = {
        data: false,
    }

    const apiRef = useGridApiRef()

    const [rows, setDetailRows] = useState([{id: 1}])

    const columns = [
        {
            field: 'id',
        },
        {
            field: 'date',
            headerName: "Date",
            valueFormatter: v => new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
              }).format(v.value)
        },
        {
            field: 'eRhythm',
            headerName: "Emotional",
            flex: 1,
            valueGetter: v => v.row.eRhythm.display,
        },
        {
            field: 'pRhythm',
            headerName: "Physical",
            flex: 1,
            valueGetter: v => v.row.pRhythm.display,
        },
        {
            field: 'iRhythm',
            headerName: "Intellectual",
            flex: 1,
            valueGetter: v => v.row.iRhythm.display,
        },
    ]
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
        [`& .colored`]: {
            backgroundColor: theme.palette.primary.light,
            '&:hover, &.Mui-hovered': {
              backgroundColor: theme.palette.primary.light,
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

    const generator = () => {
        const td = days * 2
        const start = new Date(newDate - (days * (24 * 3600000)))
        const rows = []
        var dates = []
        for (let d = 0; d <= td; d++) {
            var currDay = new Date(start.getTime() + d * 24 * 3600000)
            dates.push(currDay)
        }

        setChartDates(dates)

        dates.map((date, index) => {
            const data = {}
            const dm = moment(date)
            data.id = index
            data.eRhythm = getBiorhythmStatus("E", dm)
            data.pRhythm = getBiorhythmStatus("P", dm)
            data.iRhythm = getBiorhythmStatus("I", dm)
            data.date = date
            rows.push(data)
        })

        console.log(rows)
        setDetailRows(rows)
        
    }

    function getBiorhythmStatus(type, date) {
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
        const durationSinceBirth = moment.duration(date.diff(moment(row.row.BirthDate)))
        const index = (Math.floor(durationSinceBirth.asDays() - 1) % period)
        if (row.row.BirthDate && values.length > 0) {
            return values[index]
        }
        return { display: "UNKNOWN", value: null }
    }

    useEffect(() => {
        generator()
    }, [days])

    function BasicTabs() {
        const [value, setValue] = React.useState(0);
      
        const handleChange = (event, newValue) => {
          setValue(newValue);
        };
      
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Chart View" {...a11yProps(0)} />
                <Tab label="Graph View" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <StripedDataGrid
                    {...{rows, columns}}
                    density="compact"
                    apiRef={apiRef}
                    autoHeight
                    getRowClassName={(params) => {
                        //console.log(params.row.date, newDate)
                        if (new Date(params.row.date).getTime() === new Date(newDate).getTime()) return "colored"
                        return params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }
                    }
                    initialState={{
                        columns: {
                        columnVisibilityModel: hiddenCols
                        },
                    }}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
               
            </CustomTabPanel>
          </Box>
        );
      }


    return (
      <Box sx={{backgroundColor: '#c2c2c2', padding: 1}}>
        <Stack spacing={1}>
            <CardItem>
                <br></br>
                <TextField id="days" label="Days +/-" value={days}  onChange={e => {
                    var days = e.target.value
                    if (days > 30) days = 30
                    if (days < 0) days = 1
                    setDays(days)
                }} variant="outlined" />
                <br></br>
                <br></br>
                <BasicTabs />
            </CardItem>
        </Stack>


      </Box>
    )
  }




  const CardItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text,
  }));

  const StackItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }))


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

<style>
    .gamedate {{backgroundColor: "green"}}
</style>

