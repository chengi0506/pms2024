import React from "react";
import {
  SYSTEM_YEAR,
  SYSTEM_VERSION,
  COMPANY_NAME,
  COMPANY_SITE,
} from "../config";

function Footer() {
  return (
    <>
      <strong>
        {SYSTEM_YEAR}
        <a href={COMPANY_SITE}>{COMPANY_NAME}</a>
      </strong>
      <div className="float-right d-none d-sm-inline-block">
        <b>Version</b> {SYSTEM_VERSION}
      </div>
    </>
  );
}

export default Footer;
