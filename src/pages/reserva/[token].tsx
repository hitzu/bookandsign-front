import NonLayout from "@layout/NonLayout";
import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import ReservationPublicPage from "../../features/booking/pages/ReservationPublicPage";

const ContractPublicPage = () => {
  const router = useRouter();
  const raw = router.query.token;
  const token = Array.isArray(raw) ? raw[0] : (raw as string | undefined);
  return <ReservationPublicPage token={token} />;
};

ContractPublicPage.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);
export default ContractPublicPage;
