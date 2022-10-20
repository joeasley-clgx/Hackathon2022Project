function goToDashboard() {
    let env = document.getElementById("environmentField").value;
    let farm = document.getElementById("farmField").value;

    window.location.href = `/dashboard/${env}/${farm}`
}

document.getElementById("searchBtn").addEventListener("click", goToDashboard)