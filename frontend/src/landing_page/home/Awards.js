import React from "react";

function Awards() {
  const largestBrokerImage = `${process.env.PUBLIC_URL}/media/images/largestBroker.svg`;
  const pressLogosImage = `${process.env.PUBLIC_URL}/media/images/pressLogos.png`;

  return (
    <div className="container mt-5 awards-section">
      <div className="row">
        <div className="col-12 col-md-6 p-4 p-md-5 awards-image-col">
          <img
            src={largestBrokerImage}
            alt="Largest stock broker in India"
            className="awards-main-image"
          />
        </div>
        <div className="col-12 col-md-6 p-4 p-md-5 mt-0 mt-md-5 awards-content-col">
          <h1>Largest stock broker in India</h1>
          <p className="mb-5">
            2+ million Zerodha clients contribute to over 15% of all retail
            order volumes in India daily by trading and investing in:
          </p>
          <div className="row">
            <div className="col-12 col-sm-6">
              <ul>
                <li>
                  <p>Futures and Options</p>
                </li>
                <li>
                  <p>Commodity derivatives</p>
                </li>
                <li>
                  <p>Currency derivatives</p>
                </li>
              </ul>
            </div>
            <div className="col-12 col-sm-6">
              <ul>
                <li>
                  <p>Stocks & IPOs</p>
                </li>
                <li>
                  <p>Direct mutual funds</p>
                </li>
                <li>
                  <p>Bonds and Govt. Securities</p>
                </li>
              </ul>
            </div>
          </div>
          <img src={pressLogosImage} className="awards-press-logos" alt="Press logos" />
        </div>
      </div>
    </div>
  );
}

export default Awards;
