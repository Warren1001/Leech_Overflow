window.addEventListener("load", load, false);

function load() {

	const SELECT_DIFFICULTY = setupInputElement(document.getElementById("difficultySelect"), display)

	const NUMBER_DAMAGE = setupInputElement(document.getElementById("damage"), display)
	const NUMBER_LEECH = setupInputElement(document.getElementById("leech"), display)

	const TEXT_DAMAGE_BITS = document.getElementById("damageBits")
	const TEXT_LEECH_BITS = document.getElementById("leechBits")
	const TEXT_SPECIAL = document.getElementById("special")
	const TEXT_NUMERATOR_NO_OVERFLOW = document.getElementById("numeratorNoOverflow")
	const TEXT_NUMERATOR_OVERFLOW = document.getElementById("numeratorOverflow")
	const TEXT_FINAL_LEECH_EXTRA_BITS = document.getElementById("finalLeechExtraBits")
	const TEXT_FINAL_LEECH_BITS = document.getElementById("finalLeechBits")
	const TEXT_FINAL_LEECH = document.getElementById("finalLeech")

	let difficultyPenalty = 3
	let damage = 0
	let leech = 0

	display()

	function display() {

		difficultyPenalty = SELECT_DIFFICULTY.value
		damage = getNumberFromInput(NUMBER_DAMAGE)
		leech = getNumberFromInput(NUMBER_LEECH)
		leech = Math.floor(leech / difficultyPenalty);

		let damageBits = i(damage * 256);
		let leechBits = i(leech << 6);
		let notSpecial = damageBits <= 1048576;
		let numeratorNoOverflow = damageBits * leechBits;
		let numeratorOverflow = notSpecial ? i(numeratorNoOverflow) : numeratorNoOverflow;
		let finalLeechExtraBits = i(numeratorOverflow / 100);
		let finalLeechBits = Math.max(0, i(finalLeechExtraBits / 64));
		let finalLeech = i(finalLeechBits / 256);

		TEXT_DAMAGE_BITS.value = damageBits;
		TEXT_LEECH_BITS.value = leechBits;
		TEXT_SPECIAL.value = special ? "No" : "Yes";
		TEXT_NUMERATOR_NO_OVERFLOW.value = numeratorNoOverflow;
		TEXT_NUMERATOR_OVERFLOW.value = numeratorOverflow;
		TEXT_FINAL_LEECH_EXTRA_BITS.value = finalLeechExtraBits;
		TEXT_FINAL_LEECH_BITS.value = finalLeechBits;
		TEXT_FINAL_LEECH.value = finalLeech;

	}

	function getNumberFromInput(input) {
		let value = input.value
		value = Math.max(0, value)
		if (value != input.value) input.value = value
		return value
	}

	function i(input) {
		return input | 0;
	}

}

function setupInputElement(element, eventListener) {
	element.addEventListener("change", eventListener, false)
	if (element.type == "number") {
		element.onkeydown = function (e) { // only allows the input of numbers, no negative signs
			if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
				return false
			}
		}
	}
	return element
}
