import NonLayout from "@layout/NonLayout";
import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import PartyPublicPage from "../../features/party/pages/PartyPublicPage";

const PartyTokenPage = () => {
  const router = useRouter();
  const raw = router.query.token;
  const token = Array.isArray(raw) ? raw[0] : (raw as string | undefined);

  return <PartyPublicPage token={token} />;
};

PartyTokenPage.getLayout = (page: ReactElement) => <NonLayout>{page}</NonLayout>;

export default PartyTokenPage;
