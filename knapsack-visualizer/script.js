let items = [];
let knapsackCapacity = 5;
let animationSpeedMultiplier = 1;



// Update Knapsack Capacity
document.getElementById("knapsackCapacity").addEventListener("change", function() {
    knapsackCapacity = parseInt(this.value);
    document.getElementById("capacityDisplay").innerText = knapsackCapacity;
});

// Theme Switcher
document.getElementById("themeSelect").addEventListener("change", function () {
    let theme = this.value;
    document.body.className = "";
    
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else if (theme === "sci-fi") {
        document.body.classList.add("sci-fi-theme");
    } else if (theme === "retro") {
        document.body.classList.add("gow-theme");
    }
});

  
// Add New Item
function addItem() {
    let weight = parseInt(document.getElementById("itemWeight").value);
    let value = parseInt(document.getElementById("itemValue").value);

    if (!weight || !value || weight <= 0 || value <= 0) {
        alert("Enter valid weight and value!");
        return;
    }

    let item = { weight, value };
    items.push(item);
    updateItemsDisplay();
}

// Display Available Items
function updateItemsDisplay() {
    let container = document.getElementById("itemsContainer");
    container.innerHTML = "<h3>Available Items</h3>";

    items.forEach((item, index) => {
        let itemElement = document.createElement("div");
        itemElement.classList.add("item");
        itemElement.setAttribute("draggable", "true");
        itemElement.innerHTML = `W=${item.weight}, V=${item.value}`;
        itemElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("index", index);
        });
        container.appendChild(itemElement);
    });
}

// Drag & Drop Functionality
document.getElementById("knapsack").addEventListener("dragover", (e) => {
        e.preventDefault();
});

document.getElementById("knapsack").addEventListener("drop", (e) => {
    e.preventDefault();
    let index = e.dataTransfer.getData("index");
    if (index !== undefined) {
        addItemToKnapsack(parseInt(index));
    }
});

// Add Item to Knapsack
function addItemToKnapsack(index) {
    let item = items[index];
    let totalWeight = parseInt(document.getElementById("totalWeight").innerText);
    
    if (totalWeight + item.weight > knapsackCapacity) {
        alert("Cannot add item, exceeds knapsack capacity!");
        return;
    }

    let knapsackItems = document.getElementById("knapsackItems");
    let itemElement = document.createElement("div");
    itemElement.classList.add("item");
    itemElement.innerHTML = `W=${item.weight}, V=${item.value}`;
    knapsackItems.appendChild(itemElement);

    document.getElementById("totalWeight").innerText = totalWeight + item.weight;
    document.getElementById("totalValue").innerText = parseInt(document.getElementById("totalValue").innerText) + item.value;
}

// 🏆 **Run the Knapsack Algorithm**
function runKnapsack() {
    let n = items.length;
    let W = knapsackCapacity;
    let dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));

    // Fill the DP Table
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
            if (items[i - 1].weight <= w) {
                dp[i][w] = Math.max(items[i - 1].value + dp[i - 1][w - items[i - 1].weight], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Clear Previous Selection
    let selectedItems = [];
    let totalWeight = 0;
    let totalValue = dp[n][W];
    let w = W;

    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selectedItems.push(items[i - 1]);
            totalWeight += items[i - 1].weight;
            w -= items[i - 1].weight;
        }
    }

    // Display DP Table
    displayDpTable(dp);
     // Call the dust effect animation
    animateDPTableDustEffect();
    // Update Items Taken
    updateItemsTaken(selectedItems);
    
    // Launch particle effect
    launchParticleEffect();
}

// Display the DP Table with animation
function displayDpTable(dp) {
    let table = document.getElementById("dpTable");
    table.innerHTML = ""; // Clear existing content

    let n = dp.length - 1;             // Number of items
    let W = dp[0].length - 1;          // Knapsack capacity

    // Create header row (weights)
    let headerRow = document.createElement("tr");
    let cornerCell = document.createElement("th");
    cornerCell.innerText = "Items ↓ / Capacity →";
    headerRow.appendChild(cornerCell);

    for (let w = 0; w <= W; w++) {
        let th = document.createElement("th");
        th.innerText = w;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Create rest of the table with row headers (items)
    for (let i = 0; i <= n; i++) {
        let tr = document.createElement("tr");

        let rowHeader = document.createElement("th");
        rowHeader.innerText = i;
        tr.appendChild(rowHeader);

        for (let w = 0; w <= W; w++) {
            let td = document.createElement("td");
            td.innerText = dp[i][w];

            // Optional animation
            td.style.opacity = "0";
            td.style.transform = "scale(0.5)";
            setTimeout(() => {
                td.style.opacity = "1";
                td.style.transform = "scale(1)";
                td.style.transition = "opacity 0.4s ease-in, transform 0.3s ease-out";
            }, (i + w) * 100 / animationSpeedMultiplier);
            

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
    adjustDPTable(dp[0].length - 1, dp.length - 1); // (W, n)

    
}

// Function to fill number with animation
function fillNumber(td, targetValue) {
    let currentValue = 0;
    const increment = Math.ceil(targetValue / 100); // Increment value for smoother animation
    const delay = 50/ animationSpeedMultiplier; // Delay between increments

    // Use a loop to fill the number
    const totalSteps = Math.ceil(targetValue / increment);
    for (let step = 0; step <= totalSteps; step++) {
        setTimeout(() => {
            currentValue = Math.min(step * increment, targetValue); // Ensure it doesn't exceed the target
            td.innerText = currentValue; // Update the cell text
        }, step * delay); // Delay for each step
    }
}

// 🔄 **Update Items Taken**
function updateItemsTaken(selectedItems) {
    const itemsTakenElement = document.getElementById("itemsTaken");
    const totalStatsElement = document.getElementById("totalStats");

    let totalWeight = 0;
    let itemsDisplay = [];

    selectedItems.forEach((item) => {
        totalWeight += item.weight;
        itemsDisplay.push(item.weight); // Only show weight
    });

    // Join weights with a space
    const displayText = itemsDisplay.join(" ");
    const totalValue = selectedItems.reduce((sum, item) => sum + item.value, 0);

    const statsBox = document.getElementById("statsBox");
    statsBox.innerHTML = `
        📦 <strong>Items Taken:</strong> ${displayText} |
        ⚖️ <strong>Total Weight:</strong> ${totalWeight} |
        💰 <strong>Total Value:</strong> ${totalValue}
    `;
}

// Reset Everything
function reset() {
    console.log("Reset function called");
    // Clear the knapsack items
    document.getElementById('weightsInput').value = '';
    document.getElementById('valuesInput').value = '';
    
    // Reset total weight and value displays
    document.getElementById("statsBox").innerHTML = "";
    
    // Clear the items taken display
    document.getElementById("itemsTaken").innerText = ""; // Reset items taken
    document.getElementById("totalStats").innerText = ""; // Reset total stats
    
    // Reset the items array
    items = []; 
    
    // Clear the available items display
    updateItemsDisplay(); // This will clear the displayed items
    
    // Clear the DP table
    displayDpTable([]); // Pass an empty array to clear the table
}

// Function to launch particle effect
function launchParticleEffect() {
    const overlay = document.getElementById('particleOverlay');
    overlay.innerHTML = ''; // Clear old particles

    const numParticles = 150;

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random starting position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        // Random end offset
        const tx = (Math.random() - 0.5) * 300;
        const ty = (Math.random() - 0.5) * 300;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        overlay.appendChild(particle);
    }

    // Remove particles after animation
    setTimeout(() => {
        overlay.innerHTML = '';
    }, 1600);
}

// Function to adjust DP Table size based on knapsack size
function adjustDPTable(knapsackSize, totalItems) {
    let dpTable = document.getElementById('dpTable');
    let dpTableContainer = document.getElementById('dpTableContainer');

    // Reset classes
    dpTable.classList.remove('normal-dp-table', 'medium-dp-table', 'small-dp-table');

    // Auto-adjust based on knapsack size
    if (knapsackSize <= 15) {
        dpTable.classList.add('normal-dp-table');
    } else if (knapsackSize <= 25) {
        dpTable.classList.add('medium-dp-table');
    } else {
        dpTable.classList.add('small-dp-table');
    }

    // Enable horizontal scroll if needed
    setTimeout(() => {
        if (dpTable.offsetWidth > dpTableContainer.offsetWidth) {
            dpTableContainer.style.overflowX = 'scroll';
        } else {
            dpTableContainer.style.overflowX = 'hidden';
        }
    }, 100); // Slight delay ensures DOM is updated
}


function animateDPTableDustEffect() {
    const dpTable = document.getElementById("dpTable");
    const cells = dpTable.querySelectorAll("td");

    cells.forEach((cell, index) => {
        const randX = (Math.random() - 0.5) * 200; // -100 to 100
        const randY = (Math.random() - 0.5) * 200;
        const randBlur = Math.floor(Math.random() * 6) + 2;

        cell.style.opacity = "0";
        cell.style.transform = `translate(${randX}px, ${randY}px) scale(0.2) rotate(10deg)`;
        cell.style.filter = `blur(${randBlur}px)`;

        setTimeout(() => {
            cell.style.transition = "all 0.6s ease-out";
            cell.style.opacity = "1";
            cell.style.transform = "translate(0, 0) scale(1) rotate(0)";
            cell.style.filter = "blur(0)";
        }, index * 30); // staggered delay
    });
}

// Function to add bulk items
function addBulkItems() {
    const weights = document.getElementById('weightsInput').value.trim().split(/\s+/).map(Number);
    const values = document.getElementById('valuesInput').value.trim().split(/\s+/).map(Number);
    const capacity = parseInt(document.getElementById('knapsackCapacity').value);

    if (weights.length !== values.length) {
        alert("Weights and Values must have the same number of elements.");
        return;
    }

    if (isNaN(capacity)) {
        alert("Please enter a valid knapsack capacity.");
        return;
    }

    // Clear old items (optional)
    items = []; // Reset items array
    document.getElementById('itemsContainer').innerHTML = '<h3>Available Items</h3>';

    for (let i = 0; i < weights.length; i++) {
        let item = {
            weight: weights[i],
            value: values[i],
            index: i + 1
        };
        items.push(item);

        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.textContent = `W:${item.weight}, V:${item.value}`;
        document.getElementById('itemsContainer').appendChild(itemDiv);
    }

    document.getElementById('capacityDisplay').textContent = capacity;
    knapsackCapacity = capacity; // Update knapsack capacity
}

// Call this function after creating the DP table
let knapsackSize = 30;  // Replace with actual knapsack size
let totalItems = 10;     // Replace with actual item count
adjustDPTable(knapsackSize, totalItems);

