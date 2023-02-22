class Zamestnanec {
    constructor(ID_Nation, Nation, ID_Year, Year, Population, Slug_Nation) {
        this.ID_Nation = ID_Nation;
        this.Nation = Nation;
        this.ID_Year = ID_Year;
        this.Year = Year;
        this.Population = Population;
        this.Slug_Nation = Slug_Nation;
    }
}

const zam = document.querySelector(".zam");

const req = new XMLHttpRequest();

req.open("GET", "https://datausa.io/api/data?drilldowns=Nation&measures=Population");
req.send();

function reqLiestener() {
    zam.textContent = this.responseText;
    //console.log(this.responseText);
}

function updateProgress(event) {
    if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
    }
}

function transferComplete(evt) {
    console.log("The transfer is complete.");
}

function transferFailed(evt) {
    console.log("An error occurred while transferring the file.");
}

function transferCanceled(evt) {
    console.log("The transfer has been canceled by the user.");
}

req.addEventListener("progress", updateProgress);
req.addEventListener("load", transferComplete);
req.addEventListener("error", transferFailed);
req.addEventListener("abort", transferCanceled);
req.addEventListener("load", reqLiestener);


var i = 0;
function move() {
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 10;
        var id = setInterval(frame, this.responseText);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width++;
                elem.style.width = width + "%";
                elem.innerHTML = width + "%";
            }
        }
    }
}
move();

class List {
    constructor() {
        this.zamestnanci = [];
        this.loadZamestnanci();
    }

    loadZamestnanci() {
        if (localStorage.getItem("zamestnanci") == null) {
            this.getZamestnanciFromWeb();
            console.log("*web!");
        } else if (localStorage.getItem("zamestnanci") != null) {
            this.getZamestnanciFromLocalStorage();
            console.log("*local storage!");
        } else {
            localStorage.removeItem("zamestnanci");
            console.error("Error loading zamestnanci!");
        }
    }

    getZamestnanciFromWeb() {
        let req = new XMLHttpRequest();
        req.open("GET", "https://datausa.io/api/data?drilldowns=Nation&measures=Population");
        req.send();

        req.onload = (e) => {
            let data = JSON.parse(req.responseText);

            if (data == null || data == undefined || data == "") {
                console.error("Error parsing JSON from web!");
                return;
            }

            data["zamestnanci"].forEach(zamestnanec => {
                let z = new Zamestnanec(
                    zamestnanec.ID_Nation,
                    zamestnanec.Nation,
                    zamestnanec.ID_Year,
                    zamestnanec.Year,
                    zamestnanec.Population,
                    zamestnanec.Slug_Nation,
                );
                this.zamestnanci.push(z);
            });

            localStorage.setItem("zamestnanci", JSON.stringify(this.zamestnanci));
        }
        req.onerror = (error) => {
            console.log(error);
        }
    }

    getZamestnanciFromLocalStorage() {
        let zamestnanci = JSON.parse(localStorage.getItem("zamestnanci"));

        zamestnanci.forEach(zamestnanec => {
            let z = new Zamestnanec(
                zamestnanec.ID_Nation,
                zamestnanec.Nation,
                zamestnanec.ID_Year,
                zamestnanec.Year,
                zamestnanec.Population,
                zamestnanec.Slug_Nation,
            );
            this.zamestnanci.push(z);
        });
    }
}

onload = () => {
    let list = new List();
}
//localStorage.clear();
