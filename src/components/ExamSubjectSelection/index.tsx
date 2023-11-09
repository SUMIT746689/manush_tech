import { useState, useEffect, useContext } from 'react';
import { AutoCompleteWrapper } from '../AutoCompleteWrapper';
import { Grid } from '@mui/material';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import axios from 'axios';

const ExamSubjectSelection = ({ classes, classList,
    selectedClass, setSelectedClass, selectedSection, setSelectedSection,
    selectedExam, setSelectedExam, selectedSubject, setSelectedSubject
}) => {

    const [academicYear, setAcademicYear] = useContext(AcademicYearContext);

    const [subjectList, setSubjectList] = useState([]);
    const [sections, setSections] = useState(null);


    const [exams, setExams] = useState([]);


    useEffect(() => {
        if (selectedSection && academicYear) {
            console.log("called");

            axios.get(`/api/exam/exam-list?academic_year=${academicYear?.id}&section_id=${selectedSection.id}`)
                .then((res) =>
                    setExams(
                        res.data?.map((i) => {
                            return {
                                label: i.title,
                                id: i.id
                            };
                        })
                    )
                )
                .catch((err) => console.log(err));

        }
    }, [selectedSection, academicYear]);

    const handleExamSelect = (e, newvalue) => {
        setSelectedExam(newvalue)
        setSelectedSubject(null)

        if (newvalue) {

            axios.get(`/api/exam/exam-subject-list?exam_id=${newvalue.id}`)
                .then(res => {
                    setSubjectList(res.data?.map(i => ({
                        label: i.subject.name,
                        id: i.id,
                    })
                    ))
                })

                .catch(err => console.log(err))
        }

    }
    const handleClassSelect = (event, newValue, setFieldValue = null) => {
        setSelectedClass(newValue)
        setSelectedSection(null)
        setSelectedSubject(null)

        console.log("class changed__");


        if (newValue) {
            sectionSelection(newValue)
        }
    };


    const sectionSelection = (newValue) => {
        setSelectedSubject(null)

        const targetClass = classes?.find(i => i.id == newValue?.id)
        if (targetClass) {
            if (targetClass.has_section == false) {
                setSelectedSection(targetClass.sections[0])

            } else {
                setSections(targetClass?.sections?.map(i => ({
                    label: i.name,
                    id: i.id
                })
                ))
            }
        }

    }
    return (
        <Grid container spacing={0} sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
                xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr'
            },
            columnGap: 2,
            p: 3
        }}>


            <AutoCompleteWrapper
                minWidth="100%"
                name='class_id'
                label="Select Class"
                placeholder="Select class"
                options={classList}
                value={selectedClass}
                required={true}
                handleChange={(event, newValue) => handleClassSelect(event, newValue)}
            />
            {/* select section */}
            {((selectedClass && sections && selectedClass?.has_section)) &&
                <AutoCompleteWrapper
                    minWidth="100%"
                    name='section_id'
                    label="Select Section"
                    placeholder="Section a name ..."
                    options={sections}
                    required={true}
                    value={selectedSection}
                    handleChange={(e, v) => {
                        setSelectedSection(v)
                        setSelectedExam(null)
                        setSelectedSubject(null);

                    }}
                />

            }
            {
                selectedClass && selectedSection && <AutoCompleteWrapper
                    minWidth="100%"
                    name='exam_id'
                    label="Select exam"
                    placeholder="Exam"
                    options={exams}
                    required={true}
                    value={selectedExam}
                    handleChange={(event, newValue) => handleExamSelect(event, newValue)}
                />
            }
            {
                selectedSection && <AutoCompleteWrapper
                    minWidth="100%"
                    name='exam_details_id'
                    label="Select subject exam"
                    placeholder="Subject exam"
                    options={subjectList}
                    required={true}
                    value={selectedSubject}
                    handleChange={(e, v) => {
                        setSelectedSubject(v)
                    }}
                />
            }
        </Grid>
    );
};

export default ExamSubjectSelection;