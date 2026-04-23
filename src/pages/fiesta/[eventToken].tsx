import { ReactElement } from "react";
import { useRouter } from "next/router";
import FiestaPage from "../../features/party/pages/FiestaPage";
import NonLayout from "@layout/NonLayout";

const FiestaRoute = () => {
  const { eventToken } = useRouter().query;
  return <FiestaPage eventToken={eventToken as string} />;
};

FiestaRoute.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);

export default FiestaRoute;
