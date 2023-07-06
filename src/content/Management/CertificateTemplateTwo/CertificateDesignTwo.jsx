
import Image from 'next/image';
import React from 'react';
import styles from './Style.module.css';
 import frem from '../../../../public/certificate_images/certificate_2.png'
const CertificateDesignTwo = () => {
    return (
        <div>
            {/* <div className='container-for-two'>
                <h1 style={{
                    fontSize:'48px',
                    textAlign: 'center',
                    color: 'black',
                    paddingTop: '200px'
                }}>Certificate</h1>
            </div> */}
            <div className={styles.dd}>
                <Image src={frem} alt="frem" width="30%" height="20%" className={styles.containerForTwo} style={{op
                :0.2}}/>
                <div className={styles.centered}> rwfgrgwer rgteghet wrhetheth wrhgqret</div>
            </div>
        </div>

    );
};

export default CertificateDesignTwo;