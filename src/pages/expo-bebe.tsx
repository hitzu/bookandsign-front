import type { ReactElement } from "react";
import NonLayout from "@layout/NonLayout";
import { ExpoBebePage } from "../features/expo-bebe/pages/ExpoBebePage";

const ExpoBebe = () => <ExpoBebePage />;

ExpoBebe.getLayout = (page: ReactElement) => <NonLayout>{page}</NonLayout>;

export default ExpoBebe;
