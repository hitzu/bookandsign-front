import React, { ReactElement } from "react";
import Layout from "@layout/index";

const Receipt = () => {
  return <div>Receipt</div>;
};

Receipt.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Receipt;