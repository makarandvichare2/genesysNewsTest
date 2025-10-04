import { IWorkerInput } from "../interfaces/worker-input.interface";
import { Helpers } from "./helper";
/// <reference lib="webworker" />

addEventListener('message', ({ data }: { data: IWorkerInput }) => {
  const dataWithHeaders = Helpers.generateCSV(data.csvData, data.headers);
  postMessage(dataWithHeaders);
});


