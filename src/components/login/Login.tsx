import { useState } from 'react';
import '../../styles/Login.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/Firebase';
import Auth from './Auth';


function Login() {
    const [loginError, setLogginError] = useState(false);

  const logIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password).then(() => {
      setLogginError(false);
    }).catch((e) => {
      setLogginError(true);
      console.log(e);
    });
  };

  return (
    <div className='login'>
      {
      loginError &&
      <div id='loginAlert' className="alert alert-danger" role="alert">
        Krivi email ili lozinka!
      </div>
      }
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-xl-6 col-lg-12'>
            <div className='loginLogo'>City Eye</div>
          </div>
          <div className='col-xl-1 col-lg-0'>
            <div id='logoLine'></div>
          </div>
          <div className='col-xl-5 col-lg-12'>
            <div className='loginWrapper'>
              <Auth logIn={logIn} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  
export default Login;
  