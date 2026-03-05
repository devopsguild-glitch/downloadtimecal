export const CONNECTION_TYPES = [
  { type: "Dial-Up Modem (1990s)", downloadMbps: 0.056,  uploadMbps: 0.056  },
  { type: "ISDN",                  downloadMbps: 0.128,  uploadMbps: 0.128  },
  { type: "Satellite (Early)",     downloadMbps: 0.512,  uploadMbps: 0.256  },
  { type: "ADSL",                  downloadMbps: 8,      uploadMbps: 1      },
  { type: "VDSL",                  downloadMbps: 25,     uploadMbps: 10     },
  { type: "Cable Internet",        downloadMbps: 100,    uploadMbps: 10     },
  { type: "Wi-Fi (802.11g)",       downloadMbps: 54,     uploadMbps: 54     },
  { type: "Wi-Fi (802.11n)",       downloadMbps: 150,    uploadMbps: 150    },
  { type: "Wi-Fi (802.11ac)",      downloadMbps: 433,    uploadMbps: 433    },
  { type: "Wi-Fi 6 (802.11ax)",    downloadMbps: 1200,   uploadMbps: 1200   },
  { type: "3G Mobile",             downloadMbps: 2,      uploadMbps: 1      },
  { type: "4G LTE",                downloadMbps: 20,     uploadMbps: 10     },
  { type: "5G Mobile",             downloadMbps: 1000,   uploadMbps: 100    },
  { type: "Fiber (FTTH)",          downloadMbps: 1000,   uploadMbps: 1000   },
  { type: "High-End Fiber",        downloadMbps: 10000,  uploadMbps: 10000  },
];

export function formatTableTime(seconds: number): string {
  if (seconds < 1)        return "< 1 second";
  if (seconds < 60)       return `~${Math.round(seconds)} sec`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return s > 0 ? `~${m} min ${s} sec` : `~${m} min`;
  }
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
  }
  const d = (seconds / 86400).toFixed(1);
  return `~${d} days`;
}
