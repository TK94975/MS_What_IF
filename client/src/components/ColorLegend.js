// src/components/ColorLegend.js

import React from 'react';

const concentrationColors = {
    "Artificial Intelligence": "#ff5733",
    "Systems": "#3498db",
    "Theoretical CS": "#9b59b8",
    "Old Computer Science": "#34495e",
    "Signal Processing": "#e67e22",
    "Electronic Circuits": "#1abc9c",
    "Control Systems": "#e74c3c",
    "Other": "pink", // Renamed 'default' to 'Default' for clarity
};

// Function to group concentrations by color
const groupByColor = (colors) => {
    const colorGroups = {};
    for (const [concentration, color] of Object.entries(colors)) {
        if (!colorGroups[color]) {
            colorGroups[color] = [];
        }
        colorGroups[color].push(concentration);
    }
    return colorGroups;
}

const ColorLegend = () => {
    const colorGroups = groupByColor(concentrationColors);

    // Inline styles
    const styles = {
        legendContainer: {
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            width: '250px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        legendTitle: {
            marginBottom: '15px',
            textAlign: 'center',
            color: '#333',
            fontSize: '18px',
            fontWeight: 'bold',
        },
        legendList: {
            listStyle: 'none',
            padding: '0',
            margin: '0',
        },
        legendItem: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
        },
        colorBox: (color) => ({
            width: '20px',
            height: '20px',
            display: 'inline-block',
            marginRight: '10px',
            border: '1px solid #000',
            borderRadius: '4px',
            backgroundColor: color,
        }),
        legendText: {
            fontSize: '14px',
            color: '#555',
        },
    };

    return (
        <div style={styles.legendContainer}>
            <h5 style={styles.legendTitle}>Legend</h5>
            <ul style={styles.legendList}>
                {Object.entries(colorGroups).map(([color, concentrations]) => (
                    <li key={color} style={styles.legendItem}>
                        <span style={styles.colorBox(color)}></span>
                        <span style={styles.legendText}>
                            {concentrations.join(', ')}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ColorLegend;
