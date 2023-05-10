import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, } from "react";
import { setLogin } from "state";
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress

} from "@mui/material";
import RegiterForm from './registerForn';

export default function OauthLogin() {

  const theme = useTheme();
  const [verifyDone, setVerifyDone] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);



  useEffect(() => {

    async function verifyUser() {
      const verifyResponce = await fetch("http://localhost:3001/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${searchParams.get('token')}`
        },
      });
      const verified = await verifyResponce.json();
      setVerifyDone(true);

      if (verified.message === 'OK') {
        dispatch(
          setLogin({
            user: verified.user,
            token: verified.token,
          })
        );

      }
    }

    verifyUser();
  }, [dispatch, searchParams]);


  useEffect(() => {

    if (verifyDone && user && !user.location) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }

    if (user && user.location && user.occupation) {
      setShowForm(false);
      navigate('/home');

    }

  }, [navigate, user, verifyDone]);



  return (
    <>
      {
        showForm ?
          (
            <>
              <Box>
                <Box
                  width="100%"
                  backgroundColor={theme.palette.background.alt}
                  p="1rem 6%"
                  textAlign="center"
                >
                  <Typography fontWeight="bold" fontSize="32px" color="primary">
                    Sociopedia
                  </Typography>
                </Box>

                <Box
                  width={isNonMobileScreens ? "50%" : "93%"}
                  p="2rem"
                  m="2rem auto"
                  borderRadius="1.5rem"
                  backgroundColor={theme.palette.background.alt}
                >
                  <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                    Finish Registering
                  </Typography>
                  <RegiterForm></RegiterForm>
                </Box>
              </Box>

            </>
          ) :
          (
            <Box
              width="100%"
              height="100%"
              backgroundColor={theme.palette.background.alt}
              p="1rem 6%"
              textAlign="center">

              <CircularProgress></CircularProgress>

            </Box>
          )
      }
    </>
  )
}
