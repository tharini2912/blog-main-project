import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <section className="for-footer">
      <p>Blog Shine &copy; {currentYear}</p>
    </section>
  );
};

export default Footer;
