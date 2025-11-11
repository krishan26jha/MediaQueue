'use client'

import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js/auto'

interface PeakHourData {
  hour: string
  patients: number
  waitTime: number
  staffCount: number
  efficiency: number
}

interface Props {
  data: PeakHourData[]
}

export default function PeakHoursChart({ data }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: data.map(d => d.hour),
        datasets: [
          {
            label: 'Patients',
            data: data.map(d => d.patients),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Wait Time (min)',
            data: data.map(d => d.waitTime),
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Peak Hours Analysis'
          },
          tooltip: {
            callbacks: {
              afterBody: (tooltipItems: any) => {
                const dataIndex = tooltipItems[0].dataIndex
                const item = data[dataIndex]
                return [
                  `Staff Count: ${item.staffCount}`,
                  `Efficiency: ${item.efficiency}%`
                ]
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Number of Patients'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Wait Time (minutes)'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    }

    chartInstance.current = new Chart(ctx, chartConfig)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <canvas ref={chartRef} />
    </div>
  )
} 