"use client";

import { useState } from "react";
import { CONNECTION_TYPES, formatTableTime } from "@/lib/connectionSpeeds";

type SizeUnit = "KB" | "MB" | "GB" | "TB";
type SpeedUnit = "Kbps" | "Mbps" | "Gbps";

const SIZE_MULT: Record<SizeUnit, number> = {
  KB: 1_000, MB: 1_000_000, GB: 1_000_000_000, TB: 1_000_000_000_000,
};
const SPEED_MULT: Record<SpeedUnit, number> = {
  Kbps: 1_000, Mbps: 1_000_000, Gbps: 1_000_000_000,
};

const PRESETS = [
  { label: "Photo (5 MB)",      size: "5",  unit: "MB" as SizeUnit },
  { label: "Short video (200 MB)", size: "200", unit: "MB" as SizeUnit },
  { label: "4K video (8 GB)",   size: "8",  unit: "GB" as SizeUnit },
  { label: "Backup (50 GB)",    size: "50", unit: "GB" as SizeUnit },
];

function calc(size: number, su: SizeUnit, speed: number, spu: SpeedUnit): number | null {
  if (!size || !speed || size <= 0 || speed <= 0) return null;
  return (size * SIZE_MULT[su] * 8) / (speed * SPEED_MULT[spu]);
}

function formatDuration(s: number): string {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.round(s % 60);
  const parts: string[] = [];
  if (h > 0)   parts.push(`${h} ${h === 1 ? "hour" : "hours"}`);
  if (m > 0)   parts.push(`${m} ${m === 1 ? "minute" : "minutes"}`);
  if (sec > 0) parts.push(`${sec} ${sec === 1 ? "second" : "seconds"}`);
  return parts.length ? parts.join(" ") : "less than a second";
}

function toByteSpeed(speed: number, unit: SpeedUnit): string {
  const u = unit === "Kbps" ? "KB/s" : unit === "Mbps" ? "MB/s" : "GB/s";
  return `${parseFloat((speed / 8).toFixed(4))} ${u}`;
}

const inputCls  = "w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-3 px-4 text-base";
const selectCls = "bg-gray-50 dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium px-3 py-3 outline-none rounded-r-xl cursor-pointer";
const fieldWrap = "flex border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all";
const thCls     = "border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800";
const tdCls     = "border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs text-gray-700 dark:text-gray-300";

export default function UploadCalculator() {
  const [fileSize, setFileSize] = useState("");
  const [sizeUnit, setSizeUnit]   = useState<SizeUnit>("MB");
  const [speed, setSpeed]         = useState("");
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>("Mbps");

  const result   = calc(parseFloat(fileSize), sizeUnit, parseFloat(speed), speedUnit);
  const hasSpeed = parseFloat(speed) > 0;

  const fileSizeBytes = parseFloat(fileSize) > 0 ? parseFloat(fileSize) * SIZE_MULT[sizeUnit] : 1e9;
  const fileSizeLabel = parseFloat(fileSize) > 0 ? `${fileSize} ${sizeUnit}` : "1 GB";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 sm:px-8 py-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Upload Time Calculator</h1>
        </div>
        <p className="text-green-100 text-sm ml-11">Find out how long your file will take to upload</p>
      </div>

      {/* Presets */}
      <div className="px-6 sm:px-8 pt-5">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quick Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => { setFileSize(p.size); setSizeUnit(p.unit); }}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-950/40 hover:text-green-700 dark:hover:text-green-400 border border-transparent hover:border-green-200 dark:hover:border-green-900 transition-all font-medium">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="px-6 sm:px-8 py-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">File Size</label>
          <div className={fieldWrap}>
            <input type="number" min="0" value={fileSize} onChange={(e) => setFileSize(e.target.value)} placeholder="Enter file size" className={inputCls} />
            <select value={sizeUnit} onChange={(e) => setSizeUnit(e.target.value as SizeUnit)} className={selectCls}>
              <option>KB</option><option>MB</option><option>GB</option><option>TB</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Upload Speed</label>
          <div className={fieldWrap}>
            <input type="number" min="0" value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="Enter your speed" className={inputCls} />
            <select value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value as SpeedUnit)} className={selectCls}>
              <option>Kbps</option><option>Mbps</option><option>Gbps</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="px-6 sm:px-8 pb-6">
        {result !== null ? (
          <div className="bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900 rounded-xl px-6 py-5 text-center">
            <p className="text-xs font-semibold text-green-500 dark:text-green-400 uppercase tracking-wider mb-2">Estimated Upload Time</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300">{formatDuration(result)}</p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
            </svg>
            <p className="text-sm text-gray-400 dark:text-gray-500">Enter file size and speed above to calculate</p>
          </div>
        )}
      </div>

      {/* Summary + table */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 sm:px-8 py-6 space-y-5">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Upload speeds are typically much slower than download speeds on asymmetric connections like
          ADSL and Cable, but symmetric on fiber and Wi-Fi. Because upload speeds are measured in{" "}
          <strong>bits per second (bps)</strong> while file sizes are in <strong>bytes</strong>,
          the key conversion is{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">1 byte = 8 bits</code>.
          {hasSpeed && result !== null && parseFloat(fileSize) > 0 && (
            <>{" "}At your <strong>upload speed</strong> of <strong>{speed} {speedUnit}</strong>{" "}
            (≈ <strong>{toByteSpeed(parseFloat(speed), speedUnit)}</strong>), uploading{" "}
            <strong>{fileSize} {sizeUnit}</strong> takes <strong>{formatDuration(result)}</strong>.</>
          )}{" "}
          The table below shows typical upload speeds by connection type and the estimated time to
          upload a <strong>{fileSizeLabel} file</strong> using each.
        </p>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className={thCls}>Connection Type</th>
                <th className={thCls}>Typical Upload Speed</th>
                <th className={thCls}>Upload Time ({fileSizeLabel})</th>
              </tr>
            </thead>
            <tbody>
              {CONNECTION_TYPES.map(({ type, uploadMbps }) => {
                const bps  = uploadMbps * 1e6;
                const secs = (fileSizeBytes * 8) / bps;
                const speedLabel = uploadMbps >= 1000
                  ? `${uploadMbps / 1000} Gbps`
                  : uploadMbps >= 1
                  ? `${uploadMbps} Mbps`
                  : `${uploadMbps * 1000} Kbps`;
                return (
                  <tr key={type} className="even:bg-white even:dark:bg-gray-900/40">
                    <td className={tdCls}>{type}</td>
                    <td className={tdCls}>{speedLabel}</td>
                    <td className={tdCls}>{formatTableTime(secs)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          <strong>Note:</strong> Upload speeds listed are typical averages. Asymmetric connections
          (ADSL, Cable, mobile) have significantly lower upload than download speeds. Fiber and Wi-Fi
          connections are generally symmetric.
        </p>
      </div>
    </div>
  );
}
