import NonLayout from "@layout/NonLayout";
import React, { ReactElement } from "react";
import InspirationPublicPage from "../../features/party/pages/InspirationPublicPage";

const InspirationPage = () => <InspirationPublicPage />;

InspirationPage.getLayout = (page: ReactElement) => <NonLayout>{page}</NonLayout>;

export default InspirationPage;
