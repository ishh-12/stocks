import React from "react";

function RightSection({ imageURL, productName, productDesription, learnMore }) {
  return (
    <div className="container mt-5 product-section">
      <div className="row">
        <div className="col-12 col-md-6 p-5 mt-5 product-copy order-2 order-md-1">
          <h1>{productName}</h1>
          <p>{productDesription}</p>
          <div className="product-links">
            <a href={learnMore}>Learn More</a>
          </div>
        </div>
        <div className="col-12 col-md-6 product-image-wrap order-1 order-md-2">
          <img src={imageURL} alt={productName} />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
