import React, { useState } from 'react'
import { setLogin } from "state";
import {  useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, } from "react";
import {
    Box,
    Button,
    TextField,
    useTheme,
    useMediaQuery

} from "@mui/material";
import * as yup from "yup";

import { Formik } from "formik";


function RegiterForm() {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleFormSubmit = async (values, onSubmitProps) => {
        await updateUser(values, onSubmitProps);
    };

    const [initalUpdateValues, setInitalUpdateValues] = useState(
        {
            firstName: user ? user.firstName : '',
            lastName: user ? user.lastName : '',
            location: "",
            occupation: "",
        }
    );

    const updateSchema = yup.object().shape({
        firstName: yup.string().required("required"),
        lastName: yup.string().required("required"),
        location: yup.string().required("required"),
        occupation: yup.string().required("required"),
    });

    async function updateUser(values, onSubmitProps) {
               const savedUserResponse = await fetch(
            `http://localhost:3001/users/${user._id}/update`,
            {
                method: "POST",
                body: JSON.stringify(values),
                headers: {"Content-Type": "application/json" ,Authorization: `Bearer ${token}` },
            }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser.message==='DONE') {

            console.log(savedUser.user);
            dispatch(
                setLogin({
                    user: savedUser.user,
                    token: token,
                })
            );

            navigate('/home');
        }

    }
    const { palette } = useTheme();



    useEffect(() => {
        if (user && !initalUpdateValues.firstName) {
            setInitalUpdateValues({
                firstName: user.firstName,
                lastName: user.lastName,
                location: "",
                occupation: "",

            })
        }

    }, [initalUpdateValues, user])
    return (
        <>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initalUpdateValues}
                validationSchema={updateSchema}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    resetForm,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >

                            <>
                                <TextField
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    error={
                                        Boolean(touched.firstName) && Boolean(errors.firstName)
                                    }
                                    helperText={touched.firstName && errors.firstName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Occupation"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.occupation}
                                    name="occupation"
                                    error={
                                        Boolean(touched.occupation) && Boolean(errors.occupation)
                                    }
                                    helperText={touched.occupation && errors.occupation}
                                    sx={{ gridColumn: "span 4" }}
                                />

                            </>

                        </Box>

                        {/* BUTTONS */}
                        <Box>
                            <Button
                                fullWidth
                                type="submit"
                                sx={{
                                    m: "2rem 0",
                                    p: "1rem",
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    "&:hover": { color: palette.primary.main },
                                }}
                            >
                                {"SAVE"}
                            </Button>

                        </Box>
                    </form>
                )}
            </Formik>

        </>
    )
}

export default RegiterForm
