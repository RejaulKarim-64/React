function Welcome({ email, onSignOut }) {
  return (
    <section className="welcome">
      <div className="welcome__card">
        <p className="welcome__eyebrow">Signed in</p>
        <h1 className="welcome__title">Welcome back!</h1>
        <p className="welcome__message">
          {email
            ? `We\'re glad to see you again, ${email}.`
            : "We\'re glad to see you again."}
        </p>
        <div className="welcome__actions">
          <button className="welcome__button" type="button">
            Continue to dashboard
          </button>
          <button
            className="welcome__button welcome__button--secondary"
            type="button"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </section>
  )
}

export default Welcome
