let btnMode = document.querySelector(".mode");
let spanMode = document.querySelector(".mode span");

let mainSection = document.querySelector(".main-section");
let mainContent = document.querySelector(".main-section .content");
let selectRegion = document.getElementsByName("region")[0];
let inputCountry = document.querySelector(".input input");
let form = document.forms[0];

let detailsSection = document.querySelector(".details-section");
let backBtn = document.querySelector(".details-section #back-btn");
let detailsContent = document.querySelector(".details-section .content");
let detailsImg = document.querySelector(".details-section .content>img");
let countryName = document.querySelector(".full-info #country-name");
let nativeName = document.getElementById("native-name");
let population = document.getElementById("population");
let region = document.getElementById("region");
let subRegion = document.getElementById("sub-region");
let capital = document.getElementById("capital");
let topLevelDomain = document.getElementById("top-level-domain");
let currencies = document.getElementById("currencies");
let languages = document.getElementById("languages");
let borderCountries = document.getElementById("border-countries");

form.onsubmit = function (e) {
  e.preventDefault();
};

function localMode() {
  if (localStorage.getItem("darkMode") === "true") {
    darkMode();
  } else {
    lightMode();
  }
}
localMode();

btnMode.onclick = function () {
  if (spanMode.textContent === "Dark Mode") {
    darkMode();
  } else {
    lightMode();
  }
};

function darkMode() {
  document.documentElement.style.setProperty(
    "--main-text-color",
    "hsl(0, 0%, 100%)"
  );
  document.documentElement.style.setProperty(
    "--main-bg-color",
    "hsl(207, 26%, 17%)"
  );
  document.documentElement.style.setProperty(
    "--secondary-bg-color",
    "hsl(209, 23%, 22%)"
  );
  document.documentElement.style.setProperty(
    "--box-shadow-color",
    "rgba(25,43,50,255)"
  );
  document.documentElement.style.setProperty(
    "--flag-shadow-color",
    "rgba(25,43,50,255)"
  );
  spanMode.textContent = "Light Mode";
  localStorage.setItem("darkMode", true);
}

function lightMode() {
  document.documentElement.style.setProperty(
    "--main-text-color",
    "hsl(200, 15%, 8%)"
  );
  document.documentElement.style.setProperty(
    "--main-bg-color",
    "hsl(0, 0%, 98%)"
  );
  document.documentElement.style.setProperty(
    "--secondary-bg-color",
    "hsl(0, 0%, 100%)"
  );
  document.documentElement.style.setProperty("--box-shadow-color", "#eee");
  document.documentElement.style.setProperty("--flag-shadow-color", "#f8f8f8");
  spanMode.textContent = "Dark Mode";
  localStorage.setItem("darkMode", false);
}

backBtn.onclick = function () {
  detailsSection.style.display = "none";
  mainSection.style.display = "block";
};

fetch("https://restcountries.com/v2/all")
  .then(function (resolve) {
    return resolve.json();
  })
  .then(function (resolve) {
    resolve.forEach(function (ele, i) {
      var country = document.createElement("div");
      country.className = "country";
      country.dataset.name = ele["name"];
      country.dataset.region = ele["region"];
      mainContent.appendChild(country);
      let divImage = document.createElement("div");
      divImage.className = "div-img";
      country.appendChild(divImage);
      let countryImage = document.createElement("img");
      countryImage.src = ele["flags"]["png"].replace("w320", "h120");
      countryImage.alt = `${ele["name"]} flag`;
      divImage.appendChild(countryImage);

      let countryInfo = document.createElement("div");
      countryInfo.classList.add("info");
      country.appendChild(countryInfo);

      countryInfo.innerHTML = `<h4>${ele["name"]}</h4>
        <p><span>Population:</span> <span>${ele[
          "population"
        ].toLocaleString()}</span></p>
        <p><span>Region:</span> <span>${ele["region"]}</span></p>
        <p><span>Capital:</span> <span>${
          ele["capital"] || "No Capital"
        }</span></p>`;

      country.onclick = function (e) {
        mainSection.style.display = "none";
        detailsSection.style.display = "block";
        detailsImg.src = ele["flags"]["png"].replace("w320", "h120");
        countryName.textContent = ele["name"];
        nativeName.textContent = ele["nativeName"];
        population.textContent = ele["population"].toLocaleString();
        region.textContent = ele["region"];
        subRegion.textContent = ele["subregion"];
        if (ele["capital"] !== undefined) {
          capital.textContent = ele["capital"];
        } else {
          capital.parentElement.style.display = "none";
        }
        topLevelDomain.textContent = ele["topLevelDomain"];

        if (ele["currencies"] !== undefined) {
          let currenciesArray = Array.from(ele["currencies"]);
          let allCurrencies = [];
          currenciesArray.forEach(function (currency) {
            allCurrencies.push(currency["name"]);
          });
          currencies.textContent = allCurrencies.join(", ");
        } else {
          currencies.parentElement.style.display = "none";
        }

        let languagesArray = Array.from(ele["languages"]);
        let allLanguages = [];
        languagesArray.forEach(function (language) {
          allLanguages.push(language["name"]);
        });
        languages.textContent = allLanguages.join(", ");

        if (ele["borders"] !== undefined) {
          let bordersArray = Array.from(ele["borders"]);
          let allBorders = [];
          let allBordersCountries = [];
          bordersArray.forEach(function (border) {
            allBorders.push(border);
          });
          console.log(allBorders);
          let filterBorders;
          allBorders.forEach(function (oneBorder) {
            filterBorders = resolve.filter(function (oneCountry) {
              return oneCountry["alpha3Code"] === oneBorder;
            });
            allBordersCountries.push(filterBorders[0]["name"]);
          });

          borderCountries.innerHTML = "";
          allBordersCountries.forEach(function (borderCou) {
            let borderCountry = document.createElement("span");
            borderCountry.textContent = borderCou;
            borderCountries.appendChild(borderCountry);
          });
        } else {
          borderCountries.parentElement.style.display = "none";
        }
      };
    });
  })
  .then(function (resolve) {
    let countries = Array.from(document.querySelectorAll(".country"));

    function filterCountries() {
      countries.forEach(function (element) {
        element.style.display = "none";
      });

      let fCountries = countries.filter(function (ele) {
        return (
          (ele.dataset.region === selectRegion.value ||
            selectRegion.value === "no value") &&
          ele.dataset.name
            .toLowerCase()
            .includes(inputCountry.value.trim().toLowerCase())
        );
      });
      fCountries.forEach(function (el) {
        el.style.display = "block";
      });
    }

    selectRegion.onchange = filterCountries;
    inputCountry.oninput = filterCountries;
  });
