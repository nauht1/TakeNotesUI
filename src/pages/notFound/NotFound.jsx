import React from "react";
import "./notFound.scss";

const NotFound = () => {
  return (
    <div className="not-found-section">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
        <p>Please check the URL and try again.</p>
        <p>If the problem persists, please contact the administrator.</p>
      </div>
    </div>
  )
}

export default NotFound;