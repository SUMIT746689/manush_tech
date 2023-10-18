
import React from 'react';
import { Card, Grid } from '@mui/material';
import Image from 'next/image';

const strongStyle = { fontWeight: 600, color: '#083d9b' }
const IdentityCard = ({ user }) => {
    return (

        <Card key={user.id} sx={{ p: 1, backgroundColor: '#f2f2f2',
        // boxShadow:'0px 10px 10px #86b2f9'
        border:'1.5px dotted'
         }}>

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
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                textTransform: 'uppercase',
                color: 'white',
                letterSpacing: '0px',
                fontFamily: 'Times New Roman',
                backgroundColor: '#133f86',
                width: '100%',
                wordSpacing: '5px',
                borderRadius: 5,
                fontWeight: 800
            }}
        >
            {title}
        </header >
    );
};

const Profile = ({ user }) => {
    const { id, photo, name, birthDate, roll, section, blood_group, academicYear, phone } = user;
    return (
        <>
            <Grid sx={{
                textAlign: 'center',
                width: '100%',
                p: '5px',
                textTransform: 'uppercase',
                fontWeight: 900,
                color: '#083d9b'
            }}
            >
                {name}
            </Grid>
            <Grid sx={{
                display: 'grid',
                gridTemplateColumns: '20% 80%',
                gap: 2,
            }}>
               <Grid  display={'flex'} justifyContent={'center'} flexDirection={'column'}> 

                    <Image src={photo}
                        height={80}
                        width={80}
                        alt={`${name}'s photo`}
                        loading='eager'
                        objectFit={'cover'}
                        style={{
                            objectPosition:'center',
                            width:"100%",
                            height:"50%",
                            borderRadius:'10%'
                        }}
                    />
               
               </Grid>
                <ul
                    style={{
                        textAlign: 'left',
                    }}>

                    <li><strong style={strongStyle}>Class :</strong> {user.class}</li>
                    <li><strong style={strongStyle}>Section :</strong> {section}</li>
                    <li><strong style={strongStyle}>Class roll :</strong> {roll}</li>
                    <li><strong style={strongStyle}>Blood group:</strong> {blood_group}</li>
                    <li><strong style={strongStyle}>Academic Year:</strong> {academicYear}</li>
                    <li><strong style={strongStyle}>Phone:</strong> {phone}</li>
                    <li><strong style={strongStyle}>Date of birth :</strong> {birthDate}</li>
                </ul>


            </Grid>
        </>
    );
};



export default IdentityCard;