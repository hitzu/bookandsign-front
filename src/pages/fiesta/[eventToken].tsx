import { ReactElement } from "react";
import { useRouter } from "next/router";
import FiestaPage from "../../features/party/pages/FiestaPage";
import NonLayout from "@layout/NonLayout";

const getQueryValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const FiestaRoute = () => {
  const { eventToken } = useRouter().query;
  return <FiestaPage eventToken={getQueryValue(eventToken)} />;
};

FiestaRoute.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);

export default FiestaRoute;
