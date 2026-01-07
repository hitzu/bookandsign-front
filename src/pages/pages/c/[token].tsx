import NonLayout from "@layout/NonLayout";
import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { axiosInstanceWithoutToken } from "../../../api/config/axiosConfig";

const ContractPublicPage = () => {
  const router = useRouter();
  const token = router.query.token as string | undefined;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Ajusta esta URL al endpoint REAL de tu backend
        const res = await axiosInstanceWithoutToken.get(
          `/contracts/public/${token}`
        );
        setData(res.data);
      } catch (e: any) {
        setError("No se pudo cargar el contrato.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <div style={{ color: "white" }}>Cargando…</div>;
  if (error) return <div style={{ color: "white" }}>{error}</div>;

  return (
    <div style={{ color: "white" }}>
      {/* Aquí armas la UI bonita (status, cliente, fecha, etc.) */}
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

ContractPublicPage.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);
export default ContractPublicPage;
