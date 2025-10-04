import { IWorkerInput } from "../interfaces/worker-input.interface";
import { Helpers } from "./helper";
/// <reference lib="webworker" />

addEventListener('message', ({ data }: { data: IWorkerInput }) => {
  const response = `worker response to ${data}`;
  const dataWithHeaders = Helpers.generateCSV(data.csvData, data.headers);
  Helpers.downloadFile(dataWithHeaders, data.fileName)
  postMessage(response);
});


