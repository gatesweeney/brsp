const physicalPeriod = 23;
const emotionalPeriod = 28;
const intellectualPeriod = 33;

const pRhythm = [
    {display:'2.00 + ↑ Lo ', value:2.00, pep: 2},
    {display:'3.00 + ↑ Avg -', value:3.00, pep: 2},
    {display:'4.50 + ↑ Avg', value:4.50, pep: 2},
    {display:'6.00 + ↑ Avg +', value:6.00, pep: 2},
    {display:'7.00 + ↑ Hi', value:7.00, pep: 4},
    {display:'7.50 + (Apex) Hi', value:7.50, pep: 4},
    {display:'7.00 + ↓  Hi', value:7.00, pep: 2},
    {display:'6.00 + ↓ Avg +', value:6.00, pep: 1},
    {display:'4.50 + ↓ Avg', value:4.50, pep: 1},
    {display:'3.00 + ↓ Avg -', value:3.00, pep: 1},
    {display:'2.00 + ↓ Lo ', value:2.00, pep: 1},
    {display:'CRIT', value: null, pep: 1},
    {display:'1.00 - ↓ Lo', value:1.00, pep: 0},
    {display:'2.00 - ↓ Avg -', value:2.00, pep: 0},
    {display:'3.00 - ↓ Avg', value:3.00, pep: 0},
    {display:'4.50 - ↓ Avg +', value:4.50, pep: 0},
    {display:'5.00 - ↓ (Nadir) Hi', value:5.00, pep: 2},
    {display:'5.00 - ↑ (Nadir) Hi', value:5.00, pep: 3},
    {display:'4.50 - ↑ Avg +', value:4.50, pep: 1},
    {display:'3.00 - ↑ Avg', value:3.00, pep: 1},
    {display:'2.00 - ↑ Avg -', value:2.00, pep: 1},
    {display:'1.00 - ↑ Lo', value:1.00, pep: 1},
    {display:'CRIT', value: null, pep: 1}
];

const eRhythm = [
    {display:'2.00 + ↑ Lo', value:2.00, pep: 2},
    {display:'2.00 + ↑ Lo', value:2.00, pep: 2},
    {display:'3.00 + ↑ Avg -', value:3.00, pep: 2},
    {display:'4.50 + ↑ Avg', value:4.50, pep: 2},
    {display:'4.50 + ↑ Avg', value:4.50, pep: 2},
    {display:'6.00 + ↑ Avg +', value:6.00, pep: 2},
    {display:'7.00 + ↑ Hi', value:7.00, pep: 4},
    {display:'7.50 + (Apex) Hi', value:7.50, pep: 4},
    {display:'7.00 + ↓ Hi', value:7.00, pep: 3},
    {display:'6.00 + ↓ Avg +', value:6.00, pep: 1},
    {display:'4.50 + ↓ Avg', value:4.50, pep: 1},
    {display:'4.50 + ↓ Avg', value:4.50, pep: 1},
    {display:'3.00 + ↓ Avg -', value:3.00, pep: 1},
    {display:'2.00 + ↓ Lo', value:2.00, pep: 1},
    {display:'CRIT', value: null, pep: 1},
    {display:'1.00 - ↓ Lo', value:1.00, pep: 0},
    {display:'2.00 - ↓ Avg -', value:2.00, pep: 0},
    {display:'3.00 - ↓ Avg', value:3.00, pep: 0},
    {display:'3.00 - ↓ Avg', value:3.00, pep: 0},
    {display:'4.50 - ↓ Avg +', value:4.50, pep: 0},
    {display:'5.00 - (Nadir) Hi', value:5.00, pep: 2},
    {display:'5.00 - (Nadir) Hi', value:5.00, pep: 2},
    {display:'4.50 - ↑ Avg +', value:4.50, pep: 1},
    {display:'3.00 - ↑ Avg', value:3.00, pep: 1},
    {display:'3.00 - ↑ Avg', value:3.00, pep: 1},
    {display:'2.00 - ↑ Avg -', value:2.00, pep: 1},
    {display:'1.00 - ↑ Lo', value:1.00, pep: 1},
    {display:'CRIT', value: null, pep: 1}
];

const iRhythm = [
    {display:'2.00 + ↑ Lo', value:2.00, pep: 2},
    {display:'2.00 + ↑ Lo', value:2.00, pep: 2},
    {display:'3.00 + ↑ Avg -', value:3.00, pep: 2},
    {display:'3.00 + ↑ Avg -', value:3.00, pep: 2},
    {display:'4.50 + ↑ Avg', value:4.50, pep: 2},
    {display:'4.50 + ↑ Avg', value:4.50, pep: 2},
    {display:'6.00 + ↑ Avg +', value:6.00, pep: 2},
    {display:'7.00 + ↑ Hi', value:7.00, pep: 2},
    {display:'7.50 + (Apex) Hi', value:7.50, pep: 4},
    {display:'7.00 + ↓ Hi', value:7.00, pep: 3},
    {display:'6.00 + ↓ Avg +', value:6.00, pep: 1},
    {display:'4.50 + ↓ Avg', value:4.50, pep: 1},
    {display:'4.50 + ↓ Avg', value:4.50, pep: 1},
    {display:'3.00 + ↓ Avg -', value:3.00, pep: 1},
    {display:'3.00 + ↓ Avg -', value:3.00, pep: 1},
    {display:'2.00 + ↓ Lo', value:2.00, pep: 1},
    {display:'CRIT', value: null, pep: 1},
    {display:'1.00 - ↓ Lo', value:1.00, pep: 0},
    {display:'1.00 - ↓ Lo', value:1.00, pep: 0},
    {display:'2.00 - ↓ Avg -', value:2.00, pep: 0},
    {display:'2.00 - ↓ Avg -', value:2.00, pep: 0},
    {display:'3.00 - ↓ Avg', value:3.00, pep: 0},
    {display:'3.00 - ↓ Avg', value:3.00, pep: 0},
    {display:'4.50 - ↓ (Nadir) Avg +', value:4.50, pep: 0},
    {display:'5.00 - ↓ (Nadir) Hi', value:5.00, pep: 0},
    {display:'5.00 - ↑ Hi', value:5.00, pep: 1},
    {display:'4.50 - ↑ Avg +', value:4.50, pep: 1},
    {display:'3.00 - ↑ Avg', value:3.00, pep: 1},
    {display:'3.00 - ↑ Avg', value:3.00, pep: 1},
    {display:'2.00 - ↑ Avg -', value:2.00, pep: 1},
    {display:'2.00 - ↑ Avg -', value:2.00, pep: 1},
    {display:'1.00 - ↑ Lo', value:1.00, pep: 1},
    {display:'CRIT', value: null, pep: 1}
];

module.exports = {
    pRhythm,
    eRhythm,
    iRhythm,
    physicalPeriod,
    emotionalPeriod,
    intellectualPeriod
}