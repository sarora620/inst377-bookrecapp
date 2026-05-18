async function populateTable() {
    const tableBody = document.getElementById("savedBody");

    const response = await fetch('/books');
    const data = await response.json();

    tableBody.innerHTML = "";

    data.forEach(book => {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.textContent = book.title;

        row.appendChild(cell);
        tableBody.appendChild(row);
    });
}

// run when page loads
populateTable();