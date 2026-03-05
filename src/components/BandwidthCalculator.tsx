"use client";

import { useState } from "react";
import { CONNECTION_TYPES, formatTableTime } from "@/lib/connectionSpeeds";

type SizeUnit = "KB" | "MB" | "GB" | "TB";
type SpeedUnit = "Kbps" | "Mbps" | "Gbps";
type TimeUnit  = "seconds" | "minutes" | "hours";
type Mode      = "required-speed" | "data-usage";

const SIZE_MULT: Record<SizeUnit, number> = {
  KB: 1_000, MB: 1_000_000, GB: 1_000_000_000, TB: 1_000_000_000_000,
};
const SPEED_MULT: Record<SpeedUnit, number> = {
  Kbps: 1_000, Mbps: 1_000_000, Gbps: 1_000_000_000,
};
const TIME_MULT: Record<TimeUnit, number> = {
  seconds: 1, minutes: 60, hours: 3600,
};

function formatSpeed(bps: number) {
  if (bps >= 1e9) return `${(bps / 1e9).toFixed(2)} Gbps`;
  if (bps >= 1e6) return `${(bps / 1e6).toFixed(2)} Mbps`;
  return `${(bps / 1e3).toFixed(2)} Kbps`;
}

function formatData(bytes: number) {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
  if (bytes >= 1e9)  return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6)  return `${(bytes / 1e6).toFixed(2)} MB`;
  return `${(bytes / 1e3).toFixed(2)} KB`;
}

const inputCls  = "w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-3 px-4 text-base";
const selectCls = "bg-gray-50 dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium px-3 py-3 outline-none rounded-r-xl cursor-pointer";
const thCls     = "border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800";
const tdCls     = "border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs text-gray-700 dark:text-gray-300";

export default function BandwidthCalculator() {
  const [mode, setMode] = useState<Mode>("required-speed");

  const [fileSize, setFileSize]           = useState("");
  const [fileSizeUnit, setFileSizeUnit]   = useState<SizeUnit>("GB");
  const [desiredTime, setDesiredTime]     = useState("");
  const [desiredTimeUnit, setDesiredTimeUnit] = useState<TimeUnit>("minutes");

  const [usageSpeed, setUsageSpeed]       = useState("");
  const [usageSpeedUnit, setUsageSpeedUnit] = useState<SpeedUnit>("Mbps");
  const [duration, setDuration]           = useState("");
  const [durationUnit, setDurationUnit]   = useState<TimeUnit>("hours");

  const fieldWrap = `flex border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden focus-within:ring-2 ${mode === "required-speed" ? "focus-within:ring-purple-500" : "focus-within:ring-violet-500"} focus-within:border-transparent transition-all`;

  const rawRequiredBps = (() => {
    const s = parseFloat(fileSize), t = parseFloat(desiredTime);
    if (!s || !t || s <= 0 || t <= 0) return null;
    return (s * SIZE_MULT[fileSizeUnit] * 8) / (t * TIME_MULT[desiredTimeUnit]);
  })();
  const requiredSpeed = rawRequiredBps !== null ? formatSpeed(rawRequiredBps) : null;

  const durationSecs = parseFloat(duration) > 0 ? parseFloat(duration) * TIME_MULT[durationUnit] : null;
  const rawDataBytes = (() => {
    const sp = parseFloat(usageSpeed), d = parseFloat(duration);
    if (!sp || !d || sp <= 0 || d <= 0) return null;
    return (sp * SPEED_MULT[usageSpeedUnit] * d * TIME_MULT[durationUnit]) / 8;
  })();
  const dataUsed = rawDataBytes !== null ? formatData(rawDataBytes) : null;

  const fileSizeLabel = parseFloat(fileSize) > 0 ? `${fileSize} ${fileSizeUnit}` : "1 GB";
  const fileSizeBytes = parseFloat(fileSize) > 0 ? parseFloat(fileSize) * SIZE_MULT[fileSizeUnit] : 1e9;
  const durationLabel = parseFloat(duration) > 0 ? `${duration} ${durationUnit}` : null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-500 px-6 sm:px-8 py-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Bandwidth Calculator</h1>
        </div>
        <p className="text-purple-100 text-sm ml-11">Calculate required speed or total data usage</p>
      </div>

      {/* Mode tabs */}
      <div className="px-6 sm:px-8 pt-5">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {([
            { id: "required-speed", label: "Required Speed" },
            { id: "data-usage",     label: "Data Usage"     },
          ] as { id: Mode; label: string }[]).map(({ id, label }) => (
            <button key={id} onClick={() => setMode(id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${mode === id ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="px-6 sm:px-8 py-5 space-y-4">
        {mode === "required-speed" ? (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400">What speed do I need to transfer a file in a given time?</p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">File Size</label>
              <div className={fieldWrap}>
                <input type="number" min="0" value={fileSize} onChange={(e) => setFileSize(e.target.value)} placeholder="Enter file size" className={inputCls} />
                <select value={fileSizeUnit} onChange={(e) => setFileSizeUnit(e.target.value as SizeUnit)} className={selectCls}>
                  <option>KB</option><option>MB</option><option>GB</option><option>TB</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Desired Transfer Time</label>
              <div className={fieldWrap}>
                <input type="number" min="0" value={desiredTime} onChange={(e) => setDesiredTime(e.target.value)} placeholder="Enter time" className={inputCls} />
                <select value={desiredTimeUnit} onChange={(e) => setDesiredTimeUnit(e.target.value as TimeUnit)} className={selectCls}>
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400">How much data will I use at a given speed over time?</p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Connection Speed</label>
              <div className={fieldWrap}>
                <input type="number" min="0" value={usageSpeed} onChange={(e) => setUsageSpeed(e.target.value)} placeholder="Enter speed" className={inputCls} />
                <select value={usageSpeedUnit} onChange={(e) => setUsageSpeedUnit(e.target.value as SpeedUnit)} className={selectCls}>
                  <option>Kbps</option><option>Mbps</option><option>Gbps</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Duration</label>
              <div className={fieldWrap}>
                <input type="number" min="0" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Enter duration" className={inputCls} />
                <select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value as TimeUnit)} className={selectCls}>
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Result */}
      <div className="px-6 sm:px-8 pb-6">
        {(mode === "required-speed" ? requiredSpeed : dataUsed) ? (
          <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 rounded-xl p-6 text-center">
            <p className="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wider mb-2">
              {mode === "required-speed" ? "Required Bandwidth" : "Total Data Used"}
            </p>
            <p className="text-4xl font-bold text-purple-700 dark:text-purple-300">
              {mode === "required-speed" ? requiredSpeed : dataUsed}
            </p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
            </svg>
            <p className="text-sm text-gray-400 dark:text-gray-500">Enter values above to calculate</p>
          </div>
        )}
      </div>

      {/* Summary + table */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 sm:px-8 py-6 space-y-5">
        {mode === "required-speed" ? (
          <>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Bandwidth determines how quickly data can be transferred. To move{" "}
              <strong>{fileSizeLabel}</strong>
              {parseFloat(desiredTime) > 0 ? <> in <strong>{desiredTime} {desiredTimeUnit}</strong></> : null}
              {requiredSpeed ? <>, you need at least <strong>{requiredSpeed}</strong></> : null}.
              {" "}The table below shows which connection types can meet the required bandwidth
              {rawRequiredBps ? " — connections slower than the required speed are highlighted" : ""}.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className={thCls}>Connection Type</th>
                    <th className={thCls}>Average Speed</th>
                    <th className={thCls}>Transfer Time ({fileSizeLabel})</th>
                    {rawRequiredBps && <th className={thCls}>Meets Requirement</th>}
                  </tr>
                </thead>
                <tbody>
                  {CONNECTION_TYPES.map(({ type, downloadMbps }) => {
                    const bps  = downloadMbps * 1e6;
                    const secs = (fileSizeBytes * 8) / bps;
                    const meets = rawRequiredBps !== null ? bps >= rawRequiredBps : null;
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
                        {rawRequiredBps && (
                          <td className={`${tdCls} font-semibold ${meets ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                            {meets ? "✓ Yes" : "✗ No"}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Data usage depends on both connection speed and duration. The table below shows how much
              data each connection type transfers
              {durationLabel ? <> over <strong>{durationLabel}</strong></> : " in the given time"}.
              {dataUsed && <> Your connection would use <strong>{dataUsed}</strong> in that period.</>}
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className={thCls}>Connection Type</th>
                    <th className={thCls}>Average Speed</th>
                    <th className={thCls}>Data Used {durationLabel ? `(${durationLabel})` : ""}</th>
                  </tr>
                </thead>
                <tbody>
                  {CONNECTION_TYPES.map(({ type, downloadMbps }) => {
                    const bps   = downloadMbps * 1e6;
                    const bytes = durationSecs !== null ? (bps * durationSecs) / 8 : (bps * 3600) / 8;
                    const speedLabel = downloadMbps >= 1000
                      ? `${downloadMbps / 1000} Gbps`
                      : downloadMbps >= 1
                      ? `${downloadMbps} Mbps`
                      : `${downloadMbps * 1000} Kbps`;
                    return (
                      <tr key={type} className="even:bg-white even:dark:bg-gray-900/40">
                        <td className={tdCls}>{type}</td>
                        <td className={tdCls}>{speedLabel}</td>
                        <td className={tdCls}>{formatData(bytes)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          <strong>Note:</strong> Actual speeds vary due to network congestion, signal quality, and
          server limits. Speeds listed are typical averages for each connection type.
        </p>
      </div>
    </div>
  );
}
