import { ReactElement } from "react";
import { useRouter } from "next/router";
import MisFotosPage from "../../features/party/pages/MisFotosPage";
import NonLayout from "@layout/NonLayout";

const MisFotosRoute = () => {
  const { sessionToken } = useRouter().query;
  return <MisFotosPage sessionToken={sessionToken as string} />;
};

MisFotosRoute.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);

export default MisFotosRoute;
