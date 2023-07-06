
import React from 'react';
import './style.css';
import { Card, Grid } from '@mui/material';

const IdentityCard = ({ user }) => {
    return (

        <Card
            key={user.id}

            sx={{
                width: '100%',
                height: '100vh',
                // pt: `${template.top_space}px`,
                // pb: `${template.bottom_space}px`,
                // pl: `${template.left_space}px`,
                // pr: `${template.right_space}px`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url(/certificate_images/idcard.png)`,
                backgroundPosition: 'center',
                // backgroundSize: '100%',
                // backgroundSize: 'contain',
                // breakAfter: true,
                // mt: 4,
                boxShadow: 'none',
                p: '15px',
                pageBreakAfter: 'always',

            }} >
            <Grid
                display="flex"
                flexDirection="column"
                alignContent={"space-between"}
                justifyContent={"space-between"}
                sx={{
                    textAlign: 'left',
                    height: "100%",
                    // border: '1px solid black'
                }}
                container
            >


                <Header
                    title={user.schoolName}
                />
                <Profile
                    user={user}
                />
                {/* <Footer
                        name={user.name}
                        id={user.id} /> */}



            </Grid>
        </Card>


    );
};

const Header = ({ title }) => {
    return (
        <header
            className="identityCard__header"
            style={{
                width: '100%',
                letterSpacing: '0px',
                wordSpacing: '10px'
            }}
        >
            {title}
        </header >
    );
};

const Profile = ({ user }) => {
    const { id, photo, name, birthDate, roll, section, blood_group, academicYear, phone } = user;
    return (
        <div className="identityCard__profile">
            <div className="identityCard__identity"
            style={{
                // border:'1px solid black',
                textAlign:'center'
            }}
            >
                <strong>Name :</strong> {name}
            </div>
            <div className="identityCard__visual">
                <img src={photo} alt=""
                    style={{
                        maxHeight: '300px',
                        maxWidth: '300PX',
                        padding: '15px'
                    }}
                />
            </div>
            <ul className="identityCard__list" style={{
                textAlign: 'left',
                // display:'grid',
                // gridTemplateColumns:'auto auto'
            }}>
                
                <li><strong>Class :</strong> {user.class}</li>
                <li><strong>Section :</strong> {section}</li>
                <li><strong>Class roll :</strong> {roll}</li>
                <li><strong>Blood group:</strong> {blood_group}</li>
                <li><strong>Academic Year:</strong> {academicYear}</li>
                <li><strong>Phone:</strong> {phone}</li>
                <li><strong>Date of birth :</strong> {birthDate}</li>
            </ul>


        </div>
    );
};

const Footer = ({ name, id }) => {
    return (
        <footer className="identityCard__footer">
            <div className="filled"><span>IDF{name}</span></div>
            <div className="filled"><span>{id}{name}</span></div>
        </footer>
    );
};


export default IdentityCard;