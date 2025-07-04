import React, { ReactElement, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { Layout } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/login/register';
import { ErrorPage } from './pages/error-page';
import { Private } from './components/private';
import Header from './components/header';
import Footer from './components/footer';
import { USER_PROFILE } from './models/common/sys-msg';
import { HttpStatusCode } from './models/common/http-status-code';
import Home from './pages/home'
import './styles/common.scss';

function App() : ReactElement {
  const navigate = useNavigate();
  const authInterceptor = axios.interceptors.request.use(
    (config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
      let user = JSON.parse(sessionStorage.getItem(USER_PROFILE) ?? '{}');
      config.headers = {'Content-Type':'application/json'};
      config.headers = {'Authorization': user && user.token ? `Bearer ${user.token}` : ''};
      return config;
    },
    (error: Error): Promise<void> => {
      return Promise.reject(error);
    }
  );

  const responseInterceptor = axios.interceptors.response.use((res) => {
    return res;
  }, (error) => {
    if(error.response.status === HttpStatusCode.Unauthorized){
      navigate('/login');
    }
    return Promise.reject(error);
  })

  useEffect((): void | (() => void | undefined) => {
    return (): void => {
      axios.interceptors.request.eject(authInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authInterceptor, responseInterceptor]);

  return (
    <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/embedhome" element={<Home forReview={true}/>}/>
        <Route path="/*" element={
          <Layout>
            <Header/>
            <Layout.Content>
              <Private/>
            </Layout.Content>
            <Footer/>
          </Layout>
        }></Route>
        <Route path="*" element={<ErrorPage code={404} />}></Route>
      </Routes>
  );
}

export default App;
