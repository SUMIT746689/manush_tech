
import React from 'react';
import './style.css';
import { Card, Grid } from '@mui/material';
import Image from 'next/image';

const IdentityCard = ({ user }) => {
    return (

        <Card key={user.id} sx={{p:1}}>

            <Header
                title={user.schoolName}
            />
            <Profile
                user={user}
            />

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
        <Grid sx={{
            display:'flex',
            flexWrap:'wrap',
            gap: 3
        }}>
            <div className="identityCard__identity"
                style={{
                    // border:'1px solid black',
                    textAlign: 'center'
                }}
            >
                <strong>Name :</strong> {name}
            </div>
            <Grid sx={{maxHeight:'80px',maxWidth:'80px'}}>
                <Image src={photo}
                    height={80}
                    width={80}
                    alt={`${name}'s photo`}
                    loading='lazy'
                // style={{
                //     maxHeight: '300px',
                //     maxWidth: '300PX',
                //     padding: '15px'
                // }}
                />
            </Grid>
            <ul
                // className="identityCard__list"
                style={{
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


        </Grid>
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