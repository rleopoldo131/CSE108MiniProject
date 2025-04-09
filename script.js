document.addEventListener("DOMContentLoaded", loadGrades);

async function loadGrades() {
    try {
        const response = await fetch("http://localhost:5000/grades"); // Fetch JSON from Flask backend
        if (!response.ok) throw new Error("Failed to load grades");

        const grades = await response.json();
        console.log("Grades from API:", grades);
        displayGrades(grades);
    } catch (error) {
        console.error("Error loading grades:", error);
    }
}

function displayGrades(grades) {
    const tableBody = document.getElementById("gradesTableBody");
    tableBody.innerHTML = "";

    Object.entries(grades).forEach(([name, grade]) => {
        addGradeToTable(name, grade);
    });
}

function addGradeToTable(name, grade) {
    const tableBody = document.getElementById("gradesTableBody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${name}</td>
        <td>${grade}</td>
        <td>
            <button class="edit" onclick="editGrade('${name}', this)">Edit</button>
            <button class="delete" onclick="deleteGrade('${name}', this)">Delete</button>
        </td>
    `;

    tableBody.appendChild(row);
}

// Adding new grade
document.getElementById("addGrade").addEventListener("click", async function () {
    const name = document.getElementById("studentName").value.trim();
    const grade = document.getElementById("studentGrade").value.trim();

    if (!name || !grade) {
        alert("Please enter both name and grade.");
        return;
    }
    if (grade < 0 || grade > 100){
        alert("Grade must be between 0 and 100.")
        return;
    }
    try {
        const response = await fetch("http://localhost:5000/grades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, grade: parseFloat(grade) }),
        });

        if (!response.ok) throw new Error("Failed to add grade");

        addGradeToTable(name, grade);
        document.getElementById("studentName").value = "";
        document.getElementById("studentGrade").value = "";
    } catch (error) {
        console.error("Error adding grade:", error);
    }
});

// Edit Grade
async function editGrade(name, button) {
    const newGrade = prompt(`Enter new grade for ${name}:`);
    if (newGrade === null) return;


    if(newGrade < 0 || newGrade > 100){
        alert("Grade must be a number between 0 and 100.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/grades/${encodeURIComponent(name)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ grade: parseFloat(newGrade) }),
        });

        if (!response.ok) throw new Error("Failed to update grade");

        button.closest("tr").children[1].textContent = newGrade;
    } catch (error) {
        console.error("Error updating grade:", error);
    }
}

// Delete Grade
async function deleteGrade(name, button) {
    if (!confirm(`Delete ${name}'s grade?`)) return;

    try {
        const response = await fetch(`http://localhost:5000/grades/${encodeURIComponent(name)}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete grade");

        button.closest("tr").remove();
    } catch (error) {
        console.error("Error deleting grade:", error);
    }
}
document.getElementById("searchGrade").addEventListener("click", async function () {
    const name = document.getElementById("searchName").value.trim();
    const resultBox = document.getElementById("searchResult");

    if (!name) {
        resultBox.textContent = "Please enter a name.";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/grades/${encodeURIComponent(name)}`);

        if (response.status === 404) {
            resultBox.textContent = `No grade found for ${name}.`;
            return;
        }

        if (!response.ok) throw new Error("Failed to fetch grade");

        const data = await response.json();
        resultBox.textContent = `${name}'s grade is ${data.grade}.`;
    } catch (error) {
        console.error("Error fetching grade:", error);
        resultBox.textContent = "Something went wrong.";
    }
});
