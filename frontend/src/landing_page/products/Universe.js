import React from "react";
import { Link } from "react-router-dom";

function Universe() {
  const baseImagePath = `${process.env.PUBLIC_URL}/media/images`;

  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The Zerodha Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className="col-4 p-3 mt-5">
          <img src={`${baseImagePath}/zerodhaFundhouse.png`} alt="Zerodha Fund House" />
          <p className="text-small text-muted">Our asset management venture
that is creating simple and transparent index
funds to help you save for your goals.</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img style={{width:'150px',height:'150px'}}src={`${baseImagePath}/sensibullLogo.svg`} alt="Sensibull" />
          <p className="text-small text-muted">Options trading platform that lets you
create strategies, analyze positions, and examine
data points like open interest, FII/DII, and more.
</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src={`${baseImagePath}/tijori.svg`} alt="Tijori" />
          <p className="text-small text-muted">Investment research platform
that offers detailed insights on stocks,
sectors, supply chains, and more.
</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img style={{width:'150px',height:'100px'}}src={`${baseImagePath}/streakLogo.png`} alt="Streak" />
          <p className="text-small text-muted">Systematic trading platform
that allows you to create and backtest
strategies without coding.</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img style={{width:'150px',height:'100px'}} src={`${baseImagePath}/smallcaseLogo.png`} alt="Smallcase" />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img style={{width:'150px',height:'100px'}}src={`${baseImagePath}/dittoLogo.png`} alt="Ditto" />
          <p className="text-small text-muted">Personalized advice on life
and health insurance. No spam
and no mis-selling.</p>
        </div>
        <button
          className="p-2 btn btn-primary fs-5 mb-5"
          style={{ width: "20%", margin: "0 auto" }}
        >
          <Link to ='/signup' className="btn btn-primary " >
          Signup Now
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Universe;
