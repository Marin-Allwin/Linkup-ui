import React from "react";
import "./LandingPage.scss";
import Navbar from "../navbar/Navbar";
import { Divider } from "primereact/divider";

export default function LandingPage() {
  return (
    <div className="landingpage-main">
      <div className="landingpage-sec-one">1</div>
      <Divider layout="vertical" />
      <div className="landingpage-sec-two">2</div>
      <Divider layout="vertical" />
      <div className="landingpage-sec-three">3</div>
    </div>
  );
}
