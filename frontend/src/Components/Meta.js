import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keyword }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keyword} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to shopNow",
  description:
    "We sell original mobile devices for the cheapest price in the market",
  keyword:
    "electronics, buy mobiles, smartphones, cheapest price phones, apple, android",
};

export default Meta;
