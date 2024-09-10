
//NodeList is an array-like which contains the elements that match the query selector.
//addition assignment operator je +=
//Template literals (Template strings) je ona sa `` umesto ""
//interpolation je kad ubacim varijablu sa ${}

//PRVO SELEKTUJEM OVE ELEMENTE
const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown"); 
const addEntryButton = document.getElementById("add-entry"); 
const clearButton = document.getElementById("clear"); 
const output = document.getElementById("output"); 
console.log("HI");
//DRUGO URADIM OVO. TREBACE POSLE
let isError = false;

//TRECE RADIM OVO - OVA FUNKCIJA PROVERAVA DA LI STRING IMA + - " " I AKO IMA UKLANJA TO. Ovo ce mi trebati kod brojcanih vrednosti ako neko stavi + - ili " ".
function cleanInputString(str){

    const regex = /[+-\s]/g;                //ovo je negde oko lekcije broj 25. posto je unutar [] onda proverava svaki clan posebno. g je flag i znaci global sto valjda znaci da nadje sve sto matchuje ne samo prvo sto metchuje.
    return str.replace(regex, '');

//    const strArray = str.split("")                       //Citaj do krja. Split rastavlja string na pojedinacne clanove i napravi array. Npr. const str = 'Hello World';    const strArray = str.split('');   izbacice nam  ["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d"]. iMA RAZLIKE DAL JE split("")(rastavi na svako slovo.) ILI split(" ")(rastavi na svaku rec/). I onda nam valjda treba .join() da vratimo array u sring. 
//    const cleanStrArray = [];

//    for (let i = 0; i < strArray.length; i++){
//     if( !["+", "-", " "].includes(strArray[i]) ) {      //ovde sam stavio ! jer mi treba da pushuje u array ako NE includuje te elemente.
//         cleanStrArray.push(strArray[i])
//     }
//    }
}

//CETVRTO - nekad brojcani input ima slovo e (input type="number" ne dozvoljava slova ali dozvoljava e izmedju dva broja.). Ova funkcija pronalazi to. Trebace nam posle.
function isInvalidInput(str) {
    const regex = /\d+e\d+/i;   // ovde \d znaci bilo koja cifra od 0 - 9, e je slovo e, i znaci insensitive sto znaci  primetice i slovo e i E (malo i veliko), + znaci vise cifara zajedno npr. 22e22, 222e2, 22e222
    return str.match(regex);    // ove. match() vraca array koji sadrzi jedan metch ili svaki ako smo koristili g-global.
  }

// PETO - allow users to add entries to the calorie counter
function addEntry(){
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);  //Ovde genijalno targetujem input-kontejnere. entryDropdown.value selektuje value onoga sto je trenutno namesteno na dropdown meniju. ako je lunch npr onda to ubacuje imesto entryDropdown.value i tagetuje lunch u input-kontejneru.
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;         // Ovo broji koliko inputa imam. I radim na osnovu "text" valjda zato sto ako radim preku "number" imacu jedan vise jer imam onaj input za budget na vrhu. Tako da sam isao preko "number" verovatno bi trebalo minus jedan.

    let HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>       
    <input id="${entryDropdown.value}-${entryNumber}-name" type="text" placeholder="Name">

    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>       
    <input id="${entryDropdown.value}-${entryNumber}-calories" type="number" placeholder="Calories" min="0">
    `   //Ovde mislim da se moblo i for i id ukloniti. Samo sam trebao input da stavim unutar label.


    targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);    //Ovo dodaje HTMLString tako da je poslednji child unutar elementa ali ne brise prethodno, samo dodaje novo. Kad ukucam vrednosti pa stisnem Add Entry dugme ne brise se ono sto sam vec uneo.    Sa targetInputContainer.innerHTML += HTMLString se obrisu prethodne vrednosti.
}

addEntryButton.addEventListener("click", addEntry);



//SESTO - get the calorie counts from the user's entries. I ONDA CU OVO U KORAKU SEDAM DA KORISTIM.
function getCaloriesFromInputs(list) {      //ovde ce list da bude rezultat querySelectora, pa cu verovatno imati sve inpute calorija unutaar NodeList-e(slicno array-u). i zato pravim for loop.
    let calories = 0;
   

    for (let i = 0; i < list.length; i++) {
        
        const currVal = cleanInputString(list[i].value);            //cleanInputString je ona funkcija od gore sto cisti + - "".  list[i].value je vrednost i-tog inputa. mislim da je umesto .value moglo .valueAsNumber. Onda dole nize u tekstu bi umesto "calories += Number(currVal)"" imao ovo "calories += currVal"
        let invalidInputMatch = isInvalidInput(currVal);            //invalidInputMatch proverava jel imamo e. Videti gore sta tacno radi.
        if (invalidInputMatch){                                 //Ovde proveravam jel truthy or falsy. https://developer.mozilla.org/en-US/docs/Glossary/Truthy
            alert(`Invalid Input: ${invalidInputMatch[0]}`)     //Ako je truthy sto znaci da nije prazan array sto znaci da ima input "e" onda poziva alert. I stavili smo [0] jer ako vec na nula ima nesto znaci ne valja. Mislim da je moglo i bez nule ali onda bi izbacilo array. Ovako izgleda bolje.
            isError = true;
            return null     //Ovde posto sam stavio return to je zavrsilo funkciju. Sad dalje pisem kod za slucaj kad je input validan. Ovde valjda posto je if statement a ne if-else ne moram da stavljam else.
        }

        calories += Number(currVal);    //U slucaju da je input validan sabiram inpute.
    }

    return calories;    //Vraca nam sumu kalorija kad pozovemo funkciju.
}


//SEDMO
function calculateCalories(e){
    e.preventDefault();              //Posto cu ovu funkciju da kacim na submit, default karakteristika submit-a je da reloaduje stranicu. SA "e.preventDefault()" zaustavljam to.
    isError = false;
    const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type=number]");  //Ovde ne razumem zasto je number bez ""
    const lunchNumberInputs = document.querySelectorAll("#lunch input[type=number]");
    const dinnerNumberInputs = document.querySelectorAll("#dinner input[type=number]");
    const snacksNumberInputs = document.querySelectorAll("#snacks input[type=number]");
    const exerciseNumberInputs = document.querySelectorAll("#exercise input[type=number]");

    //OVDE RACUNAM KALORIJE POSEBNO ZA SVAKU KATEGORIJU.
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);

    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);    //budgetNumberInput je na vrhu stranice. Posto san gore uradio .getElementById, a ne .querrySelectorAll onda mi je izbacio element umesto NodeList. I zato sam stavi [] oko budgetNumberInput jer u ovom slucaju array mi radi isto sto i NddeList, a to mi treba za funkciju getCaloriesFromInputs jel tamo koristim NodeList.

    if (isError) {      // na pocetku funkcije sam zadao isError = false ali ako dok pozivam getCaloriesFromInputs nadje gresku i prijavi isError = true; onda ce if statement biti truthy i zato zaustavljam funkciju sa return;
        return;
    }

    //Ukupan zbir kalorija
    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories; //Bitan je red kojim sabiram. Videcu posle hocu skontati sto. 

    //Budget - ukupan zbir + trening(kalorije)
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;

    const surplusOrDeficit = remainingCalories >= 0 ? "Surplus" : "Deficit";    //Ovo je "ternary operator". U sustini znaci if(remainingCalories >= 0) {return "Surplus"} else {return "Deficit"}.

    //Ovde sada hocu da izbacim output na kraju stranice. To mi je id za div na dnu skroz. Math.abs() izbacuje apsolutnu vrednost. Posto ako je deficit izbacice minus, a to ne treba da pise.
    output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>  
    `;

    output.classList.remove("hide");    //output elemenat (selektovan na vrhu) ima class = "outpu hide" pa smo sa ovim sklonili samo hide. U CSS-u je zadata.

}

// OSMO - 
// OVDE KACIM EVENT LISTENER NA FORM I KOLIIKO SAM SKONTAO
// FUNKCIONISE KAKO FUNKCIONUSE ZBOG OVOG SUBMIT OVDE I U HTML-U IMAM SAMO JEDNO BUTTON KOJE IMA TYPE="SUBMIT"
// JER AKO STAVIM OVDE UMESTO "SUBMIT" "CLICK" I PROMENIM U HTML-U BUTTON U TYPE="BUTTON" ONDA AKTIVIRA
// EVENT LISTENER GDE GOD KLIKNEM NA FORM. AKO NE OKACIM NA FORM ONDA NE RADI KAKO 
// TREBA (NPR PRVI INPUT SKROZ GORE JE REQUIRED ALI TO PRIJAVLJUJE SAMO KAD OVAKO URADIM).        Ako ovo uradim document.querySelector("#calculate-calories").addEventListener("click", calculateCalories) i ni ne moram u HTML-u  da promenim submit u button radi isto samo ne zahteva entry na prvi input.
calorieCounter.addEventListener("submit", calculateCalories);


//DEVETO
function clearForm() {
    const inputContainers = Array.from(document.querySelectorAll(".input-container"));  //Ovde kad odradim querySelectorAll izbaci mi NodeList i onda sa ovim Array.from() pretvorim to u pravi array.
    for (let i = 0; i < inputContainers.length; i++){
        inputContainers[i].innerHTML = "";                  //Sa ovim brisem tekst u svim .input-container-ima. 
    }

    budgetNumberInput.value = "";           //Ovde brisem tekst u onom inputu skroz gore.
    output.innerText = "";                  //Brisem sve iz outputa. Nisam siguran sto sa innerText radim. Mogao sam i sa innerHTML. Ako ovo ne uradim kad stisne clear ostanu dole rezultati.
    output.classList.add("hide");           //Sakriva prazan div sto ostane.
}

clearButton.addEventListener("click", clearForm);   //Aktivira ClearButtn da radi ovo unutar clearForm() funkcije.