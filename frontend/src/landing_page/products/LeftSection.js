import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDesription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  const googlePlayBadge = `${process.env.PUBLIC_URL}/media/images/googlePlayBadge.svg`;
  const appStoreBadge = `${process.env.PUBLIC_URL}/media/images/appstoreBadge.svg`;

  return (
    <div className="container mt-5 product-section">
      <div className="row">
        <div className="col-12 col-md-6 product-image-wrap">
          <img src={imageURL} alt={productName} />
        </div>
        <div className="col-12 col-md-6 p-5 mt-5 product-copy">
          <h1>{productName}</h1>
          <p>{productDesription}</p>
          <div className="product-links">
            <a href={tryDemo}>Try Demo</a>
            <a href={learnMore}>
              Learn More
            </a>
          </div>
          <div className="mt-3 product-links store-badges">
            <a href={googlePlay}>
              <img src={googlePlayBadge} alt="Get it on Google Play" />
            </a>
            <a href={appStore}>
              <img
                src={appStoreBadge}
                alt="Download on the App Store"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
