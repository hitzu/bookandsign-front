import NonLayout from "@layout/NonLayout";
import React, { ReactElement } from "react";
import InspirationPublicPage from "../../features/party/pages/InspirationPublicPage";

const InspirationTokenPage = () => <InspirationPublicPage />;

InspirationTokenPage.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);

export default InspirationTokenPage;
