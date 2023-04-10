let input = document.getElementById("myInput");
let reg = input.addEventListener("input", getValue);

function getValue() {
	const queryString = input.value;
	getDate(queryString);

	return queryString;
}

function autocomplete(input, array) {
	let currentFocus;
	input.addEventListener("input", function (e) {
		let a, b, i, inlineString = this.value;
		closeAllLists();
		if (!inlineString) {
			return false;
		}
		currentFocus = -1;
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		this.parentNode.appendChild(a);
		for (i = 0; i < array.length; i++) {
			if (array[i].substr(0, inlineString.length).toUpperCase() == inlineString.toUpperCase()) {
				b = document.createElement("DIV");
				b.innerHTML = "<strong>" + array[i].substr(0, inlineString.length) + "</strong>";
				b.innerHTML += array[i].substr(inlineString.length);
				b.innerHTML += "<input type='hidden' value='" + array[i] + "'>";
				b.addEventListener("click", function (e) {
					input.value = this.getElementsByTagName("input")[0].value;
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	input.addEventListener("keydown", function (e) {
		let letter = document.getElementById(this.id + "autocomplete-list");
		if (letter) letter = letter.getElementsByTagName("div");
		if (e.keyCode == 40) {
			currentFocus++;
			addActive(letter);
		} else if (e.keyCode == 38) {
			currentFocus--;
			addActive(letter);
		} else if (e.keyCode == 13) {
			e.preventDefault();
			if (currentFocus > -1) {
				if (letter) letter[currentFocus].click();
			}
		}
	});
	function addActive(letter) {
		if (!letter) return false;
		removeActive(letter);
		if (currentFocus >= letter.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = letter.length - 1;
		letter[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(letter) {
		for (let i = 0; i < letter.length; i++) {
			letter[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(element) {
		let letter = document.getElementsByClassName("autocomplete-items");
		for (let i = 0; i < letter.length; i++) {
			if (element != letter[i] && element != input) {
				letter[i].parentNode.removeChild(letter[i]);
			}
		}
	}
	document.addEventListener("click", function (e) {
		getNameCompany(e.target.innerText);
		closeAllLists(e.target);
	});
}

const arrayOfNameCompany = [];
const getData = (queryString) => {
	let url =
		"https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
	let token = "ecf93bd1f2b49ce8b854dccfd9b9c9d7ccb617fa";
	let query = `${queryString}`;
	let options = {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: "Token " + token,
		},
		body: JSON.stringify({ query: query, count: 20 }),
	};
	return (response = fetch(url, options).then((response) =>
		response.json().then((data) => data.suggestions),
	));
};

async function getDate(queryString) {
	const arrayOfData = [];
	const data = await getData(queryString);
	await data.map((el) => arrayOfData.push(el.value));
	const arrayCompleted = arrayOfData.concat(arrayOfNameCompany);
	autocomplete(document.getElementById("myInput"), arrayCompleted);
	return arrayCompleted;
}

async function getDateCompany(nameCompany) {
	const data = await getData(nameCompany);
	let shortName = document.getElementById("name_short");
	let longName = document.getElementById("name_full");
	let inn = document.getElementById("inn_kpp");
	let address = document.getElementById("address");
	shortName.value = data[0].data.name.short_with_opf;
	longName.value = data[0].data.name.full_with_opf;
	inn.value = `${data[0].data.inn} /  ${data[0].data.kpp}`;
	address.value = data[0].data.address.unrestricted_value;

	return data;
}
getDate();
function getNameCompany(nameCompany) {
	getDateCompany(nameCompany);
}
