"use client";

import React, { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import ReusableTable from "../../../components/custom/reusable-table";
import { IAssistance } from "@/models/assistance.model";
import { findAllAssistance } from "@/api/assistance/assistance.api";
import { findById } from "@/api/users/users.api";
import { format } from "@formkit/tempo";
import { z } from "zod";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/custom/spinner";

const formatAssitanceSchema = z.object({
  worker: z.string(),
  date: z.string(),
  in: z.string(),
  out: z.string(),
});
type FormattedEntry = z.infer<typeof formatAssitanceSchema>;

export const AssistanceTable = () => {
  const [assistance, setAssistance] = useState<
    { worker: string; document: string; date: string; type: string }[]
  >([]);
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getAssistance();
  }, []);

  const getAssistance = async () => {
    const { data, status } = await findAllAssistance();
    if (status === 200) {
      const formatData = await Promise.all(
        data.map(async (el: IAssistance) => {
          const { data } = await findById(el.worker);
          return {
            worker: `${data.firstname} ${data.lastname}`,
            document: `${data.document}`,
            date: `${format(el.date, "medium")} ${format(el.date, { time: "short" })}`,
            type: el.type === "in" ? "Entrada" : "Salida",
          };
        }),
      );
      setAssistance(formatData);
    }
  };

  function formatEntries(entries: IAssistance[]): FormattedEntry[] {
    const workerMap: { [key: string]: IAssistance[] } = {};

    // Group entries by worker
    entries.forEach((entry) => {
      if (!workerMap[entry.worker]) {
        workerMap[entry.worker] = [];
      }
      workerMap[entry.worker].push(entry);
    });

    const formattedEntries: FormattedEntry[] = [];

    // Pair entries and create the formatted entries
    Object.keys(workerMap).forEach((worker) => {
      const workerEntries = workerMap[worker];
      let inEntry: IAssistance | undefined;
      workerEntries.forEach((entry) => {
        if (entry.type === "in") {
          inEntry = entry;
        } else if (entry.type === "out" && inEntry) {
          formattedEntries.push({
            worker: worker,
            date: `${format(entry.date, "long")}`,
            in: `${format(inEntry.date,  "h:mm a", "es")}`,
            out: `${format(entry.date,  "h:mm a", "es")}`,
          });
          inEntry = undefined; // Reset inEntry for the next pair
        }
      });
    });

    return formattedEntries;
  }

  const templateCols = [
    { key: "worker", header: "Nombre y Apellido" },
    { key: "document", header: "C.I" },
    { key: "date", header: "Fecha" },
    { key: "in", header: "Hora de entrada" },
    { key: "out", header: "Hora de salida" },
    { key: "insjustification", header: "Injustificada" },
    { key: "observation", header: "Observación" }
  ];

  const handleDownloadFile = async () => {
    const { data } = await findAllAssistance();
    const table = formatEntries(data);
    const formatData = await Promise.all(
      table.map(async (el) => {
        const { data } = await findById(el.worker);
        return {
          ...el,
          rest: "#",
          injutifications: "#",
          permissions: "#",
          observation: "#",
          comments: "#",
          worker: `${data.firstname} ${data.lastname}`,
          document: `${data.document}`,
        };
      }),
    );

    const res = await axios.post(
      "api/xlsx",
      JSON.stringify({
        cols: templateCols,
        data: formatData,
      }),
    );
    console.log(res.data);
    const location = document.querySelector(
      "#downloadButton",
    ) as HTMLAnchorElement;
    location.href =
      "data:" +
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" +
      ";base64," +
      res.data;
  };

  const cols = [
    {
      key: "worker",
      header: "Trabajador",
      columnOrdering: true,
      actions: false,
    },
    {
      key: "document",
      header: "C.I",
      columnOrdering: true,
      actions: false,
    },
    { key: "date", header: "Fecha", columnOrdering: true, actions: false },
    {
      key: "type",
      header: "Entrada/Salida",
      columnOrdering: true,
      actions: false,
    },
  ];

  const customButton = (
    <div className="flex flex-row gap-2 items-center justify-between">
      <a
        id="downloadButton"
        href="#"
        onClick={handleDownloadFile}
        className={cn(
          "flex flex-row items-center gap-2 justify-between",
          buttonVariants({ variant: "outline", size: "sm" }),
        )}
      >
        <span>Descargar Excel</span>
        <FileDown size={16} />
      </a>
    </div>
  );

  const Actions = ({ row }: { row: any }) => {
    return <></>;
  };

  const HeadActions = () => {
    return <></>;
  };

  return loading ? (
    <Spinner size="large" color="hsl(var(--primary))" />
  ) : (
    <ReusableTable
      data={assistance}
      cols={cols}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      showSelection={true}
      showActions
      Actions={Actions}
      HeadActions={HeadActions}
      customButtom={customButton}
    />
  );
};
