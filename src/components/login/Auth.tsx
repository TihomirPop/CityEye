import '../../styles/Login.css'
import { BaseSyntheticEvent, useState } from "react";

interface Props{
  logIn: (email: string, password: string) => void;
}

function Auth({logIn}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="Auth">
      <form onSubmit={(e) => { e.preventDefault(); logIn(email, password); }}>
        <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" onChange={(e: BaseSyntheticEvent) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" onChange={(e: BaseSyntheticEvent) => setPassword(e.target.value)} />
        </div>
        <div className='signInButtonWrapper'>
          <button type="submit" id='signInButton' className="btn btn-primary signInButton">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Auth;
  