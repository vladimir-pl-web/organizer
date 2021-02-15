/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { AppRootStateType } from "../../../redux/store";
import { login } from "../../../redux/auth-reducer";

type FormikErrorType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};
export type DataType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const Login = () => {
   
  const dispatch = useDispatch();
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn);
   
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      if (values.password.length < 2) {
        errors.password = "Too Short password";
      }
      return errors;
    },

    onSubmit: (values: DataType) => {
      dispatch(login(values.email, values.password, values.rememberMe));
      formik.resetForm();
    },
  });
  if (isLoggedIn) {
    return <Redirect to={"/"} />;
  }
  return (
    <Grid container justify="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered&ensp;
                <a
                  href={"https://social-network.samuraijs.com/ "}
                  target={"_blank"}
                >
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                {...formik.getFieldProps("email")}
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && formik.touched.email ? (
                <div style={{ color: "red" }}>{formik.errors.email}</div>
              ) : null}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
                onBlur={formik.handleBlur}
              />
              {formik.errors.password && formik.touched.password ? (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              ) : null}
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox {...formik.getFieldProps("rememberMe")} />}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
export default Login