
function Home() {
  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="h3 mb-4 text-center">Art Port</h1>
          <LocalForm />
          <br className="mb-5"/>
          <Methods />
      </div>
    </main>
  );
}

function Methods() {
  return (
    <div>
      <a href="/auth/github">
        <button className="flex-grow-1 btn btn-primary" style={{ width: "100%" }}>Log in with GitHub</button>
      </a>
    </div>
  );
}

function LocalForm() {

  return (
    <form action="/auth/local" method="post">
      <div className="form-group mb-3">
        <label htmlFor="username">Username</label>
        <input className="form-control"name="username" required />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="password">Password</label>
        <input className="form-control" name="password" type="password" required />
      </div>
      <button className="flex-grow-1 btn btn-primary" type="submit">Sign in</button>
    </form>
  );
}

export default Home;