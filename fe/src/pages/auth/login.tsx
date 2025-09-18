import { Button } from "../../components/ui/button";

const Login = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      {/* <Overlap isOpen={true} /> */}
      <div className="hero-content flex-row-reverse w-full">
        <div className="card bg-base-100 w-full max-w-md shrink-0 mx-auto shadow-2xl">
          <form className="card-body" onSubmit={(e) => e.preventDefault()}>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-3">
              <Button onClick={() => console.log('onCliked')} >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
