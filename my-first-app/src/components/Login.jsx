import { useState } from 'react'

const initialFormState = {
  email: '',
  password: '',
  remember: false,
}

function Login({ onLogin }) {
  const [formState, setFormState] = useState(initialFormState)

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target

    setFormState((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin(formState.email)
  }

  return (
    <section className="login">
      <div className="login__card">
        <header className="login__header">
          <p className="login__eyebrow">Welcome back</p>
          <h1 className="login__title">Sign in to continue</h1>
          <p className="login__subtitle">
            Use your email address and password to access your account.
          </p>
        </header>

        <form className="login__form" onSubmit={handleSubmit}>
          <label className="login__field">
            <span>Email address</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="login__field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="login__checkbox">
            <input
              name="remember"
              type="checkbox"
              checked={formState.remember}
              onChange={handleChange}
            />
            <span>Remember this device</span>
          </label>

          <button className="login__button" type="submit">
            Sign In
          </button>
        </form>

        <footer className="login__footer">
          <a className="login__link" href="#reset">
            Forgot your password?
          </a>
          <a className="login__link" href="#signup">
            Create an account
          </a>
        </footer>
      </div>
    </section>
  )
}

export default Login
