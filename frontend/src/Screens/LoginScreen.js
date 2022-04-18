import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../Components/message";
import Loader from "../Components/loader";
import FormContainer from "../Components/FormContainer";
import { login, loginWithMObile, register } from "../actions/userActions";
import axios from "axios";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [radioValue, setRadioValue] = useState("1");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [approve, setApprove] = useState("");

  const radios = [
    { name: "Sign in to account", value: "1" },
    { name: "Sign in with your mobile", value: "2" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const userRegister = useSelector((state) => state.userRegister);
  const { loading: loadingRegister, error: errorRegister, userInfo: userInfoRegister } = userRegister;

  const [searchParams, setSearchParams] = useSearchParams();

  const redirect = searchParams.get("test1") || "";

  useEffect(() => {
    if (userInfo) {
      navigate(`/${redirect}`);
    }
  }, [userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
    if (userInfo) navigate("/");
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setShowOtp(true);
    await axios.post("/api/mobileotp/request", { mobile });
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    const {data} = await axios.post("/api/mobileotp/send", { otp });
    if(data){
      dispatch(loginWithMObile(mobile))
    }
  }

  return (
    <FormContainer>
      <ButtonGroup>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant={idx % 2 ? "outline-success" : "outline-danger"}
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>

      <h1>Sign in</h1>
      {error && <Message variant="danger">{error}</Message>}
      {mobile.length>10 && <Message variant="danger">Please enter a valid mobile number</Message>}
      {approve && <Message variant="danger">{approve}</Message>}
      {loading && <Loader />}
      {radioValue === "1" ? (
        <>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button className="mt-2" type="submit" variant="primary">
              Sign in
            </Button>
          </Form>

          <Row className="py-3">
            <Col>
              New customer?{" "}
              <Link to={redirect ? `/register?test1=${redirect}` : "/register"}>
                Register
              </Link>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Form>
            <Row className="align-items-center">
              <Col className="md-8">
                <Form.Group controlId="mobile">
                  <Form.Control
                    type="number"
                    placeholder="Enter Your Mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col className="md-4">
                <Button type="submit" variant="primary" onClick={handleClick}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
          {showOtp && (
            <Form className="mt-3">
              <Row className="align-items-center">
                <Col className="md-8">
                  <Form.Group controlId="otp">
                    <Form.Control
                      type="number"
                      placeholder="Enter Your OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="md-4">
                  <Button type="submit" variant="primary" onClick={handleOtpLogin}>
                    Sign in
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </>
      )}
    </FormContainer>
  );
};

export default LoginScreen;
