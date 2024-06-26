import { useAuth } from '@/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';
import { FormControl, FormControlLabel, Grid, Paper, Radio, TableContainer, TableBody, RadioGroup, Table, TableHead, TableCell, TextField, TableRow } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { Fragment, forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableVirtuoso } from 'react-virtuoso';
import { AutoCompleteWrapper, EmptyAutoCompleteWrapper } from '../AutoCompleteWrapper';

export const ClassAndSectionSelect = ({ classes, selectedDate, selectedClass, setSelectedClass, selectedSection, setSelectedSection, flag }) => {
    const { t }: { t: any } = useTranslation();
    // const [selectedClass, setSelectedClass] = useState(null);
    const [sections, setSections] = useState(null);

    const handleClassSelect = (e, value) => {
        setSelectedClass(value)
        setSelectedSection(null)
        if (value?.id) {
            const selectedClassSections = classes.find(i => i.id == value?.id);
            if (selectedClassSections) {
                if (selectedClassSections.has_section) setSections(selectedClassSections?.sections?.map(j => ({ label: j.name, id: j.id })));
                else setSelectedSection({ label: selectedClassSections?.sections[0].name, id: selectedClassSections?.sections[0].id });
            }
        }
    }
    return (
        <Grid columnGap={1} sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr'
            }
        }}  >

            {
                flag ?
                    <Grid item sx={{
                        minWidth: '200px',
                    }}
                    >
                        {/* <Autocomplete
                                sx={{
                                    m: 0
                                }}
                                limitTags={2}
                                // getOptionLabel={(option) => option.id}
                                options={classes.map(i => {
                                    return {
                                        label: i.name,
                                        id: i.id,
                                        has_section: i.has_section
                                    }
                                })}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        label={t('Select class')}
                                        placeholder={t('Class...')}
                                    />
                                )}
                                onChange={handleClassSelect}
                            /> */}
                        <AutoCompleteWrapper
                            minWidth="100%"
                            label='Select Class'
                            placeholder='select a class...'
                            options={classes?.map(i => {
                                return {
                                    label: i.name,
                                    id: i.id,
                                    has_section: i.has_section
                                }
                            })}
                            value={undefined}
                            handleChange={handleClassSelect}
                        />
                    </Grid>
                    :
                    (selectedDate ?
                        <Grid item sx={{
                            minWidth: '200px',
                        }}>

                            <AutoCompleteWrapper
                                minWidth="100%"
                                label='Select Class'
                                placeholder='select a class...'
                                options={classes?.map(i => {
                                    return {
                                        label: i.name,
                                        id: i.id,
                                        has_section: i.has_section
                                    }
                                })}
                                value={selectedClass}
                                handleChange={handleClassSelect}
                            />

                        </Grid>
                        :
                        <EmptyAutoCompleteWrapper
                            minWidth="200px"
                            label='Select Class'
                            placeholder='select a class...'
                            options={[]}
                            value={undefined}
                        />
                    )
            }

            {
                selectedClass?.has_section && sections && (flag ? true : selectedDate) ?
                    <Grid item sx={{
                        minWidth: '200px',
                    }}>
                        <AutoCompleteWrapper
                            label='Select Batch'
                            placeholder='select a batch...'
                            options={sections}
                            value={selectedSection}
                            handleChange={(e, value) => setSelectedSection(value)}
                        />
                    </Grid>
                    :
                    <EmptyAutoCompleteWrapper
                        minWidth="200px"
                        label='Select Batch'
                        placeholder='select a batch...'
                        options={[]}
                        value={undefined}
                    />
            }

        </Grid>

    );
};


export const VirtuosoTable = ({ columns, students, selectedSection, selectedDate, examFlag, selectedExam }) => {

    return (
        <>
            <Paper style={{ height: 400, width: '100%' }}>
                <TableVirtuoso

                    data={students || []}
                    // @ts-ignore
                    components={VirtuosoTableComponents}
                    fixedHeaderContent={() => fixedHeaderContent(columns)}
                    itemContent={(_index, row) => rowContent(_index, row, columns, selectedSection, selectedDate, examFlag, selectedExam)}
                />
            </Paper>

        </>
    );
};
const VirtuosoTableComponents = {
    Scroller: forwardRef((props, ref) => (
        // @ts-ignore
        <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    // @ts-ignore
    TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent(columns) {


    return (
        <TableRow >
            {columns.map((column) => (
                <TableCell

                    key={column.dataKey}
                    variant="head"
                    align={'center'}
                    // style={{ width: column.width }}
                    sx={{
                        backgroundColor: 'background.paper',
                    }}
                >
                    {column.label}<br />

                </TableCell>
            ))}
        </TableRow>
    );
}

function rowContent(_index, row, columns, selectedSection, selectedDate, examFlag, selectedExam) {
    return (

        <Fragment>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    align={'center'}

                >
                    {column.dataKey == 'attendence' ?
                        <>
                            <AttendenceSwitch
                                selectedExam={selectedExam}
                                examFlag={examFlag}
                                attendence={row['attendence']}
                                selectedSection={selectedSection}
                                selectedDate={selectedDate}
                                student_id={row.id}
                                remark={row['remark']}
                            />
                        </>
                        : row[column.dataKey]
                    }


                </TableCell>
            ))}
        </Fragment>
    );
}
const AttendenceSwitch = ({ attendence, remark, selectedSection, selectedDate, student_id, examFlag, selectedExam }) => {
    const { user } = useAuth();
    const [attendenceValue, setAttendenceValue] = useState(attendence);
    const [remarkValue, setRemarkValue] = useState(remark);
    const { showNotification } = useNotistick()
    useEffect(() => {
        setAttendenceValue(attendence)
    }, [attendence])

    useEffect(() => {
        if (!remark) {
            setRemarkValue('')
        } else {
            setRemarkValue(remark)
        }

    }, [remark])

    const handleUpdate = (e) => {
        if (e) {
            handleUpdateApi(e.target.value, null)
        }

    }

    const handleUpdateApi = (e, remarkValue) => {
        const date = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : examFlag ? new Date('0') : '';

        const value = {
            status: e,
        }

        if (remarkValue) {
            value['remark'] = remarkValue
        }
        if (examFlag) {
            if (selectedExam) {

                value['exam_id'] = selectedExam.id

                axios.patch(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&date=${date}&student_id=${student_id}`, value)
                    .then(() => {
                        setAttendenceValue(e)
                    })
                    .catch(err => console.log(err))
            } else {
                showNotification('Exam not selected!!', 'error')
            }
        }
        else {
            axios.patch(`/api/attendance/student?school_id=${user?.school_id}&section_id=${selectedSection?.id}&date=${date}&student_id=${student_id}`, value)
                .then(() => {
                    setAttendenceValue(e)
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <>
            {/* <Switch checked={value} onChange={handleUpdate} /> */}

            <FormControl sx={{
                marginRight: 1
            }}>
                <RadioGroup
                    row
                    name="attendance"
                    value={attendenceValue}
                    onChange={handleUpdate}
                    sx={{
                        display: 'flex',
                        flexWrap: 'nowrap'
                    }}
                >
                    <FormControlLabel value="present" control={<Radio />} label="Present" />
                    <FormControlLabel value="absent" control={<Radio />} label="Absent" />
                    <FormControlLabel value="late" control={<Radio />} label="Late" />
                    {
                        !examFlag && <>
                            <FormControlLabel value="bunk" control={<Radio />} label="Bunk" />
                            <FormControlLabel value="holiday" control={<Radio />} label="Holiday" />
                        </>
                    }

                    <TextField
                        size='small'
                        sx={{
                            width: '100px',
                            height: '20px',
                            p: 0
                        }}
                        variant="outlined"
                        value={remarkValue}
                        onChange={(e) => {
                            setRemarkValue(e.target.value)

                        }}
                        onBlur={(e) => {
                            if (attendenceValue && remarkValue !== '') {
                                handleUpdateApi(attendenceValue, remarkValue)
                                setRemarkValue(null)
                            }
                        }}
                        label="Remarks"
                        type='text'
                    />
                </RadioGroup>
            </FormControl>



        </>
    );
};


