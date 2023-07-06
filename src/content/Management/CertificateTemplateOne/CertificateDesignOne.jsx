import React from 'react';
import './styleForOne.css';

const CertificateDesign = ({ finalResult }) => {
  return (


    <div className="demo-content hero pm-certificate-container">
      <div className="outer-border"></div>
      <div className="inner-border"></div>

      <div className="pm-certificate-border col-xs-12">
        <div className="row pm-certificate-header">
          <div className="pm-certificate-title cursive col-xs-12 text-center">
            <h2>{finalResult?.student?.academic_year?.school?.name}</h2>
          </div>
        </div>

        <div className="row pm-certificate-body">

          <div className="pm-certificate-block">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-2">
                  {/* <!-- LEAVE EMPTY --> */}
                </div>
                <div className="pm-certificate-name underline margin-0 col-xs-8 text-center">
                  <span className="pm-name-text bold">Final exam certificate</span>
                </div>
                <div className="col-xs-2">
                  {/* <!-- LEAVE EMPTY --> */}
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-2">
                  {/* <!-- LEAVE EMPTY --> */}
                </div>
                <div className="pm-earned col-xs-8 text-center">
                  <span className="pm-earned-text padding-0 block cursive">has earned</span>
                  <span className="pm-credits-text block bold sans">{finalResult?.termWiseTotalMark?.length} exam</span>
                </div>
                <div className="col-xs-2">
                  {/* <!-- LEAVE EMPTY --> */}
                </div>
                <div className="col-xs-12"></div>
              </div>
            </div>




            <div className="pm-course-title col-xs-8 text-center">

              <span className="pm-credits-text block sans">This is to certify that
                <span className=' font-bold'> {finalResult?.student?.student_info?.first_name} {finalResult?.student?.student_info?.middle_name} {finalResult?.student?.student_info?.last_name}</span> son/daughter of <span className='  font-bold'>{finalResult?.student?.student_info?.father_name}</span> and <span className='  font-bold'>{finalResult?.student?.student_info?.mather_name}</span> bearing class roll <span className='  font-bold'>{finalResult?.student?.class_roll_no}</span> and registration number <span className='  font-bold'>{finalResult?.student?.class_registration_no} </span>
                 duly passed the final exam certificate of  <span className='  font-bold'>{finalResult?.student?.section?.class?.name}</span> and secured total <span className=' text-center font-bold'>{finalResult?.termWiseTotalMark?.reduce(
                  (accumulator, currentValue) => accumulator + currentValue?.calculatedTotalMark, 0
                ).toFixed(2)}</span> mark</span>
            </div>





          </div>

          <div className="col-xs-12">
            <div className="row">
              <div className="pm-certificate-footer">
                <div className="col-xs-4 pm-certified col-xs-4 text-center">
                  {/* <span className="pm-credits-text block sans">Buffalo City School District</span> */}
                  <span className="pm-empty-space block underline"></span>
                  <span className="bold block">{finalResult?.student?.academic_year?.school?.name}</span>
                </div>
                <div className="col-xs-4">
                  {/* <!-- LEAVE EMPTY --> */}
                </div>
                <div className="col-xs-4 pm-certified col-xs-4 text-center">
                  <span className="pm-credits-text block sans">Date Completed</span>
                  <span className="pm-empty-space block underline"></span>

                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CertificateDesign;