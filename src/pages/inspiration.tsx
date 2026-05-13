import NonLayout from "@layout/NonLayout";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import InspirationPublicPage from "../features/party/pages/InspirationPublicPage";

const getQueryValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const InspirationPage = () => {
  const router = useRouter();
  const eventToken =
    getQueryValue(router.query.token) || getQueryValue(router.query.eventToken);

  return <InspirationPublicPage eventToken={eventToken} />;
};

InspirationPage.getLayout = (page: ReactElement) => <NonLayout>{page}</NonLayout>;

export default InspirationPage;
