import NonLayout from "@layout/NonLayout";
import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import InspirationPublicPage from "../../features/party/pages/InspirationPublicPage";

const InspirationTokenPage = () => {
  const router = useRouter();
  const raw = router.query.token;
  const token = Array.isArray(raw) ? raw[0] : (raw as string | undefined);

  return <InspirationPublicPage token={token} />;
};

InspirationTokenPage.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);

export default InspirationTokenPage;
