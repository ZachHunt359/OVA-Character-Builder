function rollDice() {
  const bonusesInput = document.getElementById("bonuses");
  const numDiceInput = document.getElementById("numDice");
  const resultDiv = document.getElementById("resultDiv");

  let numBonus = parseInt(bonusesInput.value);
  let numDice = parseInt(numDiceInput.textContent);
  let isNegative = (numBonus < 0); //Are we doing a 'Negative Dice' roll?
  let total = 0;
  let resultText = "";
  const rolls = [];

  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * 6) + 1; // Simulating a 6-sided dice
    rolls.push(roll);
  }

  rolls.sort(); // Sort the rolls array
  rolls.reverse(); // Reverse that sort, so it's in descending order

  const rollCounts = {};
  for (const roll of rolls) {
    if (rollCounts[roll]) {
      if (!isNegative) {
        rollCounts[roll] += roll;
      } else {
        rollCounts[roll] = roll; //Duplicate dice are never added together when rolling 'Negative Dice'
      }

    } else {
      rollCounts[roll] = roll;
    }
  }

  let highestValue = 0;
  let lowestValue = Infinity;
  let highlightDice = 0;

  for (const [roll, value] of Object.entries(rollCounts)) {
    if (!isNegative && value > highestValue) {
      highestValue = value;
      highlightDice = roll;
    }
    if (isNegative && value < lowestValue) {
      lowestValue = value;
      highlightDice = roll;
    }
  }
  if (!isNegative) {
    resultText = `Total: ${highestValue}` + "\n\n";
  } else {
    resultText = `Total (Lowest): ${lowestValue}` + "\n\n";
  }

  resultText += "Rolls: " + rolls.join(", ");
  resultDiv.textContent = resultText;
  winningDice(highlightDice, resultDiv);

  // Add click event listener to the copy button
  const copyButton = document.getElementById("copyButton");
  copyButton.addEventListener("click", function() {
    copyTextToClipboard(resultDiv);
  });
}

function updateNumDice() {
  const bonusesInput = document.getElementById("bonuses");
  const numDiceInput = document.getElementById("numDice");

  const bonuses = parseInt(bonusesInput.value);
  let numDice = bonuses + 2;
  if (bonuses < 0) {
    numDice = Math.abs(bonuses)
  }
  numDiceInput.textContent = numDice;
}
// Function to copy text to the clipboard
function copyTextToClipboard(element) {
  const plainText = element.innerText;

  const textArea = document.createElement("textarea");
  textArea.value = plainText;
  document.body.appendChild(textArea);

  textArea.select();
  document.execCommand("copy");

  document.body.removeChild(textArea);

  /*var range = document.createRange();
  range.selectNode(element);
  window.getSelection().removeAllRanges(); // clear current selection
  window.getSelection().addRange(range); // to select text
  document.execCommand("copy");
  window.getSelection().removeAllRanges(); // to deselect */

  //const parser = new DOMParser();

}

function winningDice(rolledNum, element) {
  const regex = new RegExp(`(?<=Rolls:.*)(\\b${rolledNum}\\b)`, 'g');
  const originalContent = element.innerHTML;
  const modifiedContent = originalContent.replace(regex, `<span class="winningDice">${rolledNum}</span>`);

  element.innerHTML = modifiedContent;
}

// Initialize an empty character data structure
var characterData = {
  name: "Character Name",
  abilities: [],
  weaknesses: []
};

// Constructor function for Abilities
function Ability(name, level, description = "") {
  this.name = name;
  this.level = level;
  this.description = description;
  this.perks = [];
  this.flaws = [];
}

// Constructor function for Weaknesses
function Weakness(name, level, description = "") {
  this.name = name;
  this.level = level;
  this.description = description;
  this.perks = [];
  this.flaws = [];
}

// Constructor function for Perks and Flaws
function Modifier(name, endurance, description = "") {
  this.name = name;
  this.endurance = endurance;
  this.description = description;
}

// Function to add an ability
function addAbility(name, level, description = "") {
  // Check if the ability with the same name already exists
  var existingAbility = characterData.abilities.find(function (ability) {
    return ability.name === name;
  });

  if (!existingAbility) {
    var newAbility = {
      name: name,
      level: level,
      description: description,
      perks: [], // Initialize perks and flaws as empty arrays
      flaws: []
    };

    // Push the new ability to the characterData's abilities array
    characterData.abilities.push(newAbility);
  }
}


// Function to add a weakness
function addWeakness(name, level, description = "") {
  // Check if the weakness with the same name already exists
  var existingWeakness = characterData.weaknesses.find(function (weakness) {
    return weakness.name === name;
  });

  if (!existingWeakness) {
    var newWeakness = {
      name: name,
      level: level,
      description: description,
      perks: [], // Initialize perks and flaws as empty arrays
      flaws: []
    };

    // Push the new weakness to the characterData's weaknesses array
    characterData.weaknesses.push(newWeakness);
  }
}


// Function to add a perk to an ability or weakness
function addPerk(target, name, endurance, description = "") {
  var modifier = new Modifier(name, endurance, description);
  target.perks.push(modifier);
}

// Function to add a flaw to an ability or weakness
function addFlaw(target, name, endurance, description = "") {
  var modifier = new Modifier(name, endurance, description);
  target.flaws.push(modifier);
}

// Rest of your existing functions

// Function to update the interface based on characterData
function updateInterface() {
  // Clear the existing abilities and weaknesses lists
  $(".ability-list, .weakness-list").empty();
  
  // Add an h3 element to indicate "Abilities:" or "Weaknesses:"
  $(".ability-list").append("<h3 class='list-header'>Abilities:</h3>");
  $(".weakness-list").append("<h3 class='list-header'>Weaknesses:</h3>");

  // Update abilities
  characterData.abilities.forEach(function(ability) {
    var abilityItem = $("<li class='ability' data-level='" + ability.level + "' data-name='" + ability.name + "'>" + ability.name + ": " + ability.level + "</li>");

    // Create Perk List
    var perkList = $("<ul class='perk-list'></ul>");

    // Create Add Perk and Add Flaw buttons
    var addPerkButton = $("<button class='add-perk-button'>Add Perk</button>");
    var addFlawButton = $("<button class='add-flaw-button'>Add Flaw</button>");

    // Append buttons and Perk List to the ability
    abilityItem.append(addPerkButton);
    abilityItem.append(addFlawButton);
    abilityItem.append(perkList);

    // Append the ability to the appropriate list
    $(".ability-list").append(abilityItem);

    // Update the perk list for this ability
    ability.perks.forEach(function(perk) {
      var perkItem = $("<li class='perk' data-endurance='" + perk.endurance + "' data-name='" + perk.name + "'></li>");
      var displayText = (perk.endurance > 0) ? " (+" + perk.endurance + ")" : " (" + perk.endurance + ")";
      perkItem.append("<span class='item-name'>" + perk.name + displayText + "</span>");
      perkList.append(perkItem);
    });

    // Update the flaw list for this ability
    ability.flaws.forEach(function(flaw) {
      var flawItem = $("<li class='flaw' data-endurance='" + flaw.endurance + "' data-name='" + flaw.name + "'></li>");
      var displayText = (flaw.endurance > 0) ? " (+" + flaw.endurance + ")" : " (" + flaw.endurance + ")";
      flawItem.append("<span class='item-name'>" + flaw.name + displayText + "</span>");
      perkList.append(flawItem);
    });
  });

  // Update weaknesses
  characterData.weaknesses.forEach(function(weakness) {
    var weaknessItem = $("<li class='weakness' data-level='" + weakness.level + "' data-name='" + weakness.name + "'>"  + weakness.name + ": " + weakness.level + "</li>");

    // Create Perk List
    var perkList = $("<ul class='perk-list'></ul>");

    // Create Add Perk and Add Flaw buttons
    var addPerkButton = $("<button class='add-perk-button'>Add Perk</button>");
    var addFlawButton = $("<button class='add-flaw-button'>Add Flaw</button>");

    // Append buttons and Perk List to the weakness
    weaknessItem.append(addPerkButton);
    weaknessItem.append(addFlawButton);
    weaknessItem.append(perkList);

    // Append the weakness to the appropriate list
    $(".weakness-list").append(weaknessItem);

    // Update the perk list for this weakness
    weakness.perks.forEach(function(perk) {
      var perkItem = $("<li class='perk' data-endurance='" + perk.endurance + "' data-name='" + perk.name + "'></li>");
      var displayText = (perk.endurance > 0) ? " (+" + perk.endurance + ")" : " (" + perk.endurance + ")";
      perkItem.append("<span class='item-name'>" + perk.name + displayText + "</span>");
      perkList.append(perkItem);
    });

    // Update the flaw list for this weakness
    weakness.flaws.forEach(function(flaw) {
      var flawItem = $("<li class='flaw' data-endurance='" + flaw.endurance + "' data-name='" + flaw.name + "'></li>");
      var displayText = (flaw.endurance > 0) ? " (+" + flaw.endurance + ")" : " (" + flaw.endurance + ")";
      flawItem.append("<span class='item-name'>" + flaw.name + displayText + "</span>");
      perkList.append(flawItem);
    });
  });

  // Add the "add-button" element at the end of each list
  var addButton = $("<li class='add-item'><button class='add-button'>+</button></li>");
  $(".ability-list, .weakness-list").append(addButton);

  // Attach the click event to the "add-button" element
  addButton.find(".add-button").click(function() {
  var type = $(this).closest("ul").hasClass("ability-list") ? "ability" : "weakness";
  createAddForm(type);
  });

  // Call other functions as needed to update the interface
  $("ul:not(.add-item), h3:not(.list-header)").sortable({
    items: "li:not(.add-item)", // Exclude add-button li elements
  });
  $("ul.add-item").sortable("disable");
  $("ul, h3").disableSelection();
}


$(document).ready(function() {

  var abilityData = []; // Store ability data here

  // Load the JSON data from abilities.json
  // Assuming the JSON file is named abilities.json
  fetch('json/abilities.json')
  .then(response => response.json())
  .then(data => {
    abilityData = data;
  })
  .catch(error => console.error('Error loading JSON:', error));



  characterData.name = "Riley Moore"
  addAbility("Healer", 3);
  addAbility("Quick", 1);
  
  addWeakness("Awkward Size", 2);

  updateInterface();

  // Add Perk button click event
  $(document).on("click", ".add-perk-button", function() {
    var listItem = $(this).closest("li");
    var perkName = prompt("Enter the new Perk name:");
    var perkEndurance = prompt("Enter the endurance cost for the Perk:");
    if (perkName !== null && perkEndurance !== null) {
      var characterList = listItem.closest(".ability-list, .weakness-list");
      var characterType = characterList.hasClass("ability-list") ? "ability" : "weakness";

      // Check if it's an ability or weakness
      var character = (characterType === "ability") ? characterData.abilities : characterData.weaknesses;

      // Find the character object based on its name
      var characterObject = character.find(function(obj) {
        return obj.name === listItem.data("name");
      });

      if (characterObject) {
        characterObject.perks.push({
          name: perkName,
          endurance: parseInt(perkEndurance)
        });

        // Call updateInterface to update the UI
        updateInterface();
      }
    }
  });

  // Add Flaw button click event
  $(document).on("click", ".add-flaw-button", function() {
    var listItem = $(this).closest("li");
    var flawName = prompt("Enter the new Flaw name:");
    var flawEndurance = prompt("Enter the endurance cost for the Flaw:");
    console.log("Adding Flaw: " + flawName + " " + flawEndurance)

    if (flawName !== null && flawEndurance !== null) {
      var characterList = listItem.closest(".ability-list, .weakness-list");
      var characterType = characterList.hasClass("ability-list") ? "ability" : "weakness";
      console.log("...to a " + characterType)

      // Check if it's an ability or weakness
      var character = (characterType === "ability") ? characterData.abilities : characterData.weaknesses;
      console.log("...to a " + characterType)
      // Find the character object based on its name
      var characterObject = character.find(function(obj) {
        console.log("listItem named: " + listItem.data("name"))
        console.log("obj named: " + obj.name)
        return obj.name === listItem.data("name");
      });

      if (characterObject) {
        console.log("Pushing to " + characterObject.name + ": Flaw: " + flawName + " " + flawEndurance)
        characterObject.flaws.push({
          name: flawName,
          endurance: parseInt(flawEndurance)
        });

        // Call updateInterface to update the UI
        updateInterface();
      }
    }
  });


});

// Rest of your existing code
// ...
function printCharacterData() {
  console.log("Character Name: " + characterData.name);

  console.log("\nAbilities:");
  characterData.abilities.forEach(function (ability) {
    console.log("Name: " + ability.name);
    console.log("Level: " + ability.level);
    console.log("Description: " + ability.description);

    console.log("Perks:");
    ability.perks.forEach(function (perk) {
      console.log("Name: " + perk.name);
      console.log("Endurance: " + perk.endurance);
    });

    console.log("Flaws:");
    ability.flaws.forEach(function (flaw) {
      console.log("Name: " + flaw.name);
      console.log("Endurance: " + flaw.endurance);
    });
  });

  console.log("\nWeaknesses:");
  characterData.weaknesses.forEach(function (weakness) {
    console.log("Name: " + weakness.name);
    console.log("Level: " + weakness.level);
    console.log("Description: " + weakness.description);

    console.log("Perks:");
    weakness.perks.forEach(function (perk) {
      console.log("Name: " + perk.name);
      console.log("Endurance: " + perk.endurance);
    });

    console.log("Flaws:");
    weakness.flaws.forEach(function (flaw) {
      console.log("Name: " + flaw.name);
      console.log("Endurance: " + flaw.endurance);
    });
  });
}

function createAddForm(type) {
  // Create a form for adding abilities or weaknesses
  var form = $("<form class='add-form'></form>");

  // Create a dropdown for selecting the name
  var nameDropdown = $("<select class='name-dropdown'></select>");
  var dataToUse = (type === "ability") ? abilityData : weaknessData;

  // Populate the dropdown with options based on the selected type
  dataToUse.forEach(function(item) {
    var option = $("<option></option>")
      .text(item.name)
      .data("description", item.description); // Store description as data
    nameDropdown.append(option);
  });

  // Create an input for selecting the level
  var levelInput = $("<input type='number' class='level-input' placeholder='Level'>");

  // Create a description display area
  var descriptionDisplay = $("<p class='description-display'></p>");

  // Create a submit button
  var addButton = $("<button type='button' class='add-button-form'>Add</button>");

  // Append the form elements
  form.append(nameDropdown);
  form.append(levelInput);
  form.append(descriptionDisplay); // Add description display
  form.append(addButton);

  // Append the form to the appropriate list
  $(".ability-list, .weakness-list").append(form);

  // Update the description display when a name is selected
  nameDropdown.on("change", function() {
    var selectedOption = $(this).find("option:selected");
    var description = selectedOption.data("description");
    descriptionDisplay.text(description);
  });
}