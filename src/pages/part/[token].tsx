import NonLayout from "@layout/NonLayout";
import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import PartyPublicPage from "../../../features/party/pages/PartyPublicPage";

const PartTokenPage = () => {
  const router = useRouter();
  const raw = router.query.token;
  const token = Array.isArray(raw) ? raw[0] : (raw as string | undefined);

  return <PartyPublicPage token={token} />;
};

PartTokenPage.getLayout = (page: ReactElement) => <NonLayout>{page}</NonLayout>;

export default PartTokenPage;
