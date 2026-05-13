import NonLayout from "@layout/NonLayout";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import InspirationPublicPage from "../../features/party/pages/InspirationPublicPage";

const InspirationTokenPage = () => {
  const router = useRouter();
  const rawToken = router.query.token;
  const eventToken = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  return <InspirationPublicPage eventToken={eventToken} />;
};

InspirationTokenPage.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);

export default InspirationTokenPage;
