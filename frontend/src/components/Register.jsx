import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify"
import FormContainer from "./FormContainer"
import axios from "axios"
import "../style/Login.css"
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [verified, setVerified] = useState(false);
  const [valid, setValid] = useState(true)


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/register', { email, password, name, address, phone });
      toast.success("Registration successful. Check your email for the activation link.");
    } catch (err) {
      toast.error(err?.response?.data?.errors[0]?.msg);
    }
  }

  const onChange = () => {
    setVerified(true)
  }

  const handleChange = (value) => {
    setPhone(value);
    setValid(validatePhoneNumber(value))
  }

  const validatePhoneNumber = (phone) => {

    const pattern = /^\d{10}$/;
    return pattern.test(phone)

  }


  return (
    // <FormContainer >
    //   <h1>Sign Up</h1>
    //   <Form onSubmit={handleSubmit}>
    //     <Form.Group className='my-1' controlId='name'>
    //       <Form.Label>Name</Form.Label>
    //       <Form.Control
    //         type='text'
    //         placeholder='Enter your Name'
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>
    //     <Form.Group className='my-1' controlId='email'>
    //       <Form.Label>Email</Form.Label>
    //       <Form.Control
    //         type='email'
    //         placeholder='Enter your email'
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>
    //     <Form.Group className='my-1' controlId='password'>
    //       <Form.Label>Password</Form.Label>
    //       <Form.Control
    //         type='password'
    //         placeholder='Enter password'
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>

    //     <Form.Group className='my-1' controlId='address'>
    //       <Form.Label>Address</Form.Label>
    //       <Form.Control
    //         type='text'
    //         placeholder='Enter your address'
    //         value={address}
    //         onChange={(e) => setAddress(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>

    //     <Form.Group className='my-1' controlId='phone'>
    //       <Form.Label>Phone</Form.Label>
    //       <Form.Control
    //         type='text'
    //         placeholder='Enter your phone'
    //         value={phone}
    //         onChange={(e) => setPhone(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>

    //     <Button
    //       type='submit'
    //       variant='primary'
    //       className='mt-3'
    //     >
    //       Sign UP
    //     </Button>
    //   </Form>
    <>

      <section className="background-radial-gradient overflow-hidden">
        <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
          <div className="row gx-lg-5 align-items-center mb-5">
            <div className="col-lg-6 mb-5 mb-lg-0" style={{
              zIndex: 10
            }}>
              <h1
                className="my-5 display-5 fw-bold ls-tight"
                style={{
                  color: 'hsl(218, 81%, 95%)'
                }}
              >
                The best offer <br />
                <span
                  style={{
                    color: 'hsl(218, 81%, 75%)'
                  }}
                >
                  for your trip
                </span>
              </h1>
              <p
                className="mb-4 opacity-70"
                style={{
                  color: 'hsl(218, 81%, 85%)'
                }}
              >
                Plan your trip with efficiency
              </p>
            </div>

            <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
              <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
              <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
              <div className="card bg-glass">
                <div className="card-body px-4 py-5 px-md-5">
                  <Form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-4 mb-4">
                        <div className="form-outline">
                          <input type="text" id="form3Example1" className="form-control"
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-md-8  mb-4">
                        <div className="form-outline">
                          <PhoneInput type="text" id="form3Example2" placeholder='Enter your phone'
                            value={phone}
                            country={'us'}
                            inputProps={{ required: true }}
                            onChange={handleChange} />
                        </div>
                      </div>
                    </div>


                    <div className="form-outline mb-4">
                      <input type="email" id="form3Example3" className="form-control"
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>


                    <div className="form-outline mb-4">
                      <input type="password" id="form3Example4" className="form-control"
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="form-outline mb-4">
                      <input type="text" id="form3Example5" className="form-control"
                        placeholder='Enter your address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} />
                    </div>

                    <div className=" d-flex justify-content-center mb-4">
                      <ReCAPTCHA
                        sitekey="6LffG58nAAAAAPc5o_3ximXbh-ZxrcW4mktP1jUE"
                        onChange={onChange}
                      />
                    </div>
                    <Button type="submit" disabled={!verified}>
                      Sign up
                    </Button >
                    <p>Already have an account ?<Link to="/">Sign In</Link></p>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );

}

export default Register
