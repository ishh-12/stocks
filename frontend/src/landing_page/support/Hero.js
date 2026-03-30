import React from "react";

function Hero() {
  const supportUrl = "https://support.zerodha.com/";

  return (
    <section className="container-fluid" id="supportHero">
      <div className="p-5 " id="supportWrapper">
        <h4>Support Portal</h4>
        <a href={supportUrl}>Track Tickets</a>
      </div>
      <div className="row p-5 m-3">
        <div className="col-6 p-3">
          <h1 className="fs-3">
            Search for an answer or browse help topics to create a ticket
          </h1>
          <input placeholder="Eg. how do I activate F&O" />
          <br />
          <a href={supportUrl}>Track account opening</a>
          <a href={supportUrl}>Track segment activation</a>
          <a href={supportUrl}>Intraday margins</a>
          <a href={supportUrl}>Kite user manual</a>
        </div>
        <div className="col-6 p-3">
          <h1 className="fs-3">Featured</h1>
          <ol>
            <li>
              <a href={supportUrl}>Current Takeovers and Delisting - January 2024</a>
            </li>
            <li>
              <a href={supportUrl}>Latest Intraday leverages - MIS & CO</a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;
