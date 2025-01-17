import { ResourceAdapter } from "@/adapters/ckan";
import { DatastoreAdapter } from "@/adapters/ckan/datastore.adapter";
import { useEffectAsync, useFetchAndLoader } from "@/hooks";
import { BaseRoutes } from "@/models";
import { ChartFormData, ChartType, Datastore, Field, Resource, Row } from "@/models/ckan";
import { getDatastore, getDatastoreSql, getResource } from "@/services/ckan";
import { loadAbortable } from "@/utils";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AreaChartView } from "./components/area-chart";
import { BarChartView } from "./components/bar-chart";
import ChartForm from "./components/chart-form";
import { LineChartView } from "./components/line-chart";
import { PieChartView } from "./components/pie-chart";
import { ScatterChartView } from "./components/scatter-chart";

const noChart = <div>No se encontró el gráfico</div>;

export default function NewChart() {
  const resourceId = useParams().id ?? "";
  const location = useLocation();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | undefined>(() => location.state);
  const [datastore, setDatastore] = useState<Datastore | undefined>();
  const [currentChart, setCurrentChart] = useState(noChart);
  const { callEndpoint: loadResource, loading } = useFetchAndLoader(useState);
  const { callEndpoint: loadDatastore, loading: loadingDatastore } = useFetchAndLoader(useState);

  if (!resourceId) navigate(BaseRoutes.NOT_FOUND, { replace: true });

  useEffectAsync({
    asyncFunction: () =>
      loadResource(resource ? ({} as ReturnType<typeof getResource>) : getResource(resourceId)),
    successFunction: (data) => setResource(ResourceAdapter.toResource(data)),
    errorFunction: () => !resource && navigate(BaseRoutes.NOT_FOUND, { replace: true }),
    deps: [resourceId],
  });

  useEffectAsync({
    asyncFunction: () => loadDatastore(getDatastore(resourceId, 0)),
    successFunction: (data) => setDatastore(DatastoreAdapter.toDatastore(data)),
    errorFunction: () => !datastore && navigate(BaseRoutes.NOT_FOUND, { replace: true }),
    deps: [resourceId],
  });

  if (loading || loadingDatastore) return <div>Loading...</div>;
  if (!datastore) return <div>No datastore</div>;
  if (!datastore.fields) return <div>No fields</div>;

  function loadChart(fields: Field[], rows: Row[], chart: ChartType) {
    const operationKey = fields[0].id;
    const keys = fields.map((field) => field.id).filter((key) => key !== operationKey);
    const data = rows
      .filter((row) => typeof row[operationKey] === "number")
      .map((row) => ({
        name: keys.map((key) => row[key]).join("-"),
        value: row[operationKey] as number,
      }));
    switch (chart) {
      case "area_chart":
        return <AreaChartView data={data} />;
      case "bar_chart":
        return <BarChartView data={data} />;
      case "line_chart":
        return <LineChartView data={data} />;
      case "pie_chart":
        return <PieChartView data={data} />;
      case "scatter_chart":
        return <ScatterChartView data={data} />;
      default:
        return noChart;
    }
  }

  async function handleSubmit(data: ChartFormData) {
    const operation = data.operation.replace("yAxis", data.yAxis);
    const columns = data.xAxis.join(", ");
    const orderBy = data.xAxis.join(" ASC, ");
    const sql = `SELECT ${operation}, ${columns} FROM "${resourceId}" GROUP BY ${columns} ORDER BY ${orderBy}`;
    const response = await loadAbortable(getDatastoreSql(sql));
    if (!response || response instanceof Error) return toast.error("Error al crear la consulta");
    toast.success("Consulta creada");
    setCurrentChart(loadChart(response.data.fields, response.data.records, data.chartType));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Chart Configuration</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-3">{currentChart}</div>
        <ChartForm onSubmit={handleSubmit} fields={datastore.fields} />
      </div>
    </div>
  );
}
