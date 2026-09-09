import { Line } from "react-chartjs-2";

const COLORS = ["#14b8a6", "#fb7185", "#0284c7", "#a855f7", "#f59e0b", "#84cc16"];

export default function SeriesLineChart({ labels, series, ySuffix = "" }) {
  return (
    <div className="line-chart">
      <Line
        data={{
          labels,
          datasets: series.map((item, index) => ({
            label: item.label,
            data: item.data,
            borderColor: item.color ?? COLORS[index % COLORS.length],
            backgroundColor: item.color ?? COLORS[index % COLORS.length],
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 2,
          })),
        }}
        options={{
          plugins: {
            legend: { position: "bottom" },
          },
          scales: {
            y: {
              ticks: {
                callback: (value) => (ySuffix ? `${value} ${ySuffix}` : value),
              },
            },
          },
        }}
      />
    </div>
  );
}
