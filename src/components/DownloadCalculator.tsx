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
const fieldWrap = "flex border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all";
const thCls     = "border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800";
const tdCls     = "border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs text-gray-700 dark:text-gray-300";

export default function DownloadCalculator() {
  const [fileSize, setFileSize] = useState("");
  const [sizeUnit, setSizeUnit]   = useState<SizeUnit>("MB");
  const [speed, setSpeed]         = useState("");
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>("Mbps");

  const result    = calc(parseFloat(fileSize), sizeUnit, parseFloat(speed), speedUnit);
  const hasSpeed  = parseFloat(speed) > 0;

  // File size in bytes for table — default to 1 GB when empty
  const fileSizeBytes  = parseFloat(fileSize) > 0 ? parseFloat(fileSize) * SIZE_MULT[sizeUnit] : 1e9;
  const fileSizeLabel  = parseFloat(fileSize) > 0 ? `${fileSize} ${sizeUnit}` : "1 GB";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 sm:px-8 py-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Download Time Calculator</h1>
        </div>
        <p className="text-blue-100 text-sm ml-11">Estimate how long a file will take to download</p>
      </div>

      {/* Inputs */}
      <div className="px-6 sm:px-8 py-6 space-y-4">
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
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Download Speed</label>
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
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-xl px-6 py-5 text-center">
            <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-2">Estimated Download Time</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300">{formatDuration(result)}</p>
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
          Internet speeds have evolved dramatically over time, from early dial-up connections measured in
          kilobits per second to modern fiber and 5G connections capable of gigabit speeds. Because
          download speeds are measured in <strong>bits per second (bps)</strong> while file sizes are
          measured in <strong>bytes</strong>, converting between them requires remembering that{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">1 byte = 8 bits</code>.
          {hasSpeed && result !== null && parseFloat(fileSize) > 0 && (
            <>{" "}At your <strong>download speed</strong> of <strong>{speed} {speedUnit}</strong>{" "}
            (≈ <strong>{toByteSpeed(parseFloat(speed), speedUnit)}</strong>), downloading{" "}
            <strong>{fileSize} {sizeUnit}</strong> takes <strong>{formatDuration(result)}</strong>.</>
          )}{" "}
          The table below shows approximate average speeds for different connection technologies and the
          estimated time it would take to download a <strong>{fileSizeLabel} file</strong> using each.
        </p>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className={thCls}>Connection Type</th>
                <th className={thCls}>Average Speed</th>
                <th className={thCls}>Download Time ({fileSizeLabel})</th>
              </tr>
            </thead>
            <tbody>
              {CONNECTION_TYPES.map(({ type, downloadMbps }) => {
                const bps  = downloadMbps * 1e6;
                const secs = (fileSizeBytes * 8) / bps;
                const speedLabel = downloadMbps >= 1000
                  ? `${downloadMbps / 1000} Gbps`
                  : downloadMbps >= 1
                  ? `${downloadMbps} Mbps`
                  : `${downloadMbps * 1000} Kbps`;
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
          <strong>Note:</strong> Actual download speeds may vary due to network congestion, server limits,
          and signal quality. Speeds above are typical averages for each connection type.
        </p>
      </div>
    </div>
  );
}
