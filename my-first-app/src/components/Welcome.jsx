function Welcome({ email }) {
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
        <button className="welcome__button" type="button">
          Continue to dashboard
        </button>
      </div>
    </section>
  )
}

export default Welcome
