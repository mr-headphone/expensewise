// ============================================
// CHART.JS - Draws the spending pie chart
// (Uses HTML Canvas - no extra libraries!)
// ============================================
import { expensesAPI } from './api.js';

// Colors for each slice of the pie
const COLORS = [
  '#6C63FF',  // Purple
  '#FF6584',  // Pink
  '#43AA8B',  // Green
  '#F9C74F',  // Yellow
  '#90BE6D',  // Light green
  '#F8961E',  // Orange
  '#577590',  // Blue gray
  '#F3722C',  // Dark orange
];

export const renderChart = async () => {
  const canvas = document.getElementById('categoryChart');
  const legend = document.getElementById('chartLegend');
  
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Set canvas size
  canvas.width = 280;
  canvas.height = 220;

  try {
    // Get spending data from backend
    const { data: summary, grandTotal } = await expensesAPI.getSummary();

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If no data, show a message
    if (summary.length === 0 || grandTotal === 0) {
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#999';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No expenses yet!', canvas.width / 2, canvas.height / 2);
      legend.innerHTML = '';
      return;
    }

    // Center point and radius for the donut
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerRadius = 95;
    const innerRadius = 55;  // Makes it a donut shape

    let startAngle = -Math.PI / 2;  // Start drawing from the top

    // Draw each slice
    summary.forEach(({ _id: category, total }, index) => {
      const sliceAngle = (total / grandTotal) * 2 * Math.PI;
      const color = COLORS[index % COLORS.length];

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Add a thin white line between slices
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle += sliceAngle;
    });

    // Draw the white hole in the middle (makes it a donut)
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

       // Draw total amount in the center
    const formatted = new Intl.NumberFormat('en-GM', {
      style: 'currency',
      currency: 'GMD',
      maximumFractionDigits: 0,
    }).format(grandTotal);

    ctx.fillStyle = '#2d2d2d';
    ctx.font = 'bold 14px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatted, cx, cy - 8);

    ctx.font = '11px Segoe UI, sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText('Total', cx, cy + 10);

    // Draw the legend below the chart
    legend.innerHTML = summary
      .map(
        ({ _id: category, total }, index) => `
        <div class="legend-item">
          <span class="legend-dot" style="background: ${COLORS[index % COLORS.length]}"></span>
          <span class="legend-label">${category}</span>
          <span class="legend-value">
            ${((total / grandTotal) * 100).toFixed(0)}%
          </span>
        </div>
      `
      )
      .join('');

  } catch (error) {
    console.error('Could not load chart:', error);
    legend.innerHTML = '<p style="color:#888;font-size:0.8rem">Chart unavailable</p>';
  }
};