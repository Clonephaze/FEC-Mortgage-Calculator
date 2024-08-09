// JDoc Strings made via ai for documentation, other comments are manual.
// DOM Elements
const mortgageAmount = $('#amountInput');
const mortgageTerm = $('#termInput');
const mortgageRate = $('#rateInput');
const typeRepayment = $('#mortgage-type-radio');
const typeInterest = $('#interest-type-radio');
const calcButton = $('#calculateButton');
const emptyResults = $('#emptyResults');
const completedResults = $('#completedResults');
const clearButton = $('#clearButton');
const amountError = $('#amountError');
const termError = $('#termError');
const rateError = $('#rateError');
const typeError = $('#typeError');

/**
 * Calculates the mortgage based on user inputs, either for repayment or interest-only mortgage types.
 * Handles validation of input values, shows relevant results, and animates the output.
 * The function hides irrelevant result sections based on the selected mortgage type and updates error states if inputs are invalid.
 */
function calculateMortgage() {
    // Gets values from form elements, grabs wrapper elements to handle opacity, and grabs the input validity.
    const totalAmount = Number(mortgageAmount.val().replace(/,/g, ''));
    const termLength = Number(mortgageTerm.val() * 12);
    const interestRate = Number(mortgageRate.val());
    const type = typeRepayment.is(':checked') ? 'repayment' : 'interest';
    const repaymentWrapper = $('#repaymentWrapper');
    const interestWrapper = $('#interestWrapper');
    const isValid = checkInputs(totalAmount, termLength, interestRate, type);
    let monthlyPayment = calculateMonthlyPayment(totalAmount, termLength, interestRate);
    let totalPayment = monthlyPayment * termLength;

    if (!isValid) {
        // If the inputs are invalid stops this function, checkInputs() will update the error styles
        return;
    } else if (type === 'repayment') {
        // For repayment type, use monthlyPayment to calculate monthly payment and totalPayment to calculate total payment values
        // Hides the interest wrapper if visible
        repaymentWrapper.css('opacity', '1');
        interestWrapper.css('opacity', '0');
        // Uses updateNumber() to animate the monthly payment and total payment values, and cuts the decimal to 2 places.
        updateNumber('#monthlyResultsValue', monthlyPayment.toFixed(2));
        updateNumber('#totalResultsValue', totalPayment.toFixed(2));
        // Hides the empty results wrapper if visible and shows the completed results wrapper
        emptyResults.css('opacity', '0');
        completedResults.css('opacity', '1');
    } else if (type === 'interest') {
        // For interest type, use totalPayment and totalAmount to calculate total interest value
        let totalInterest = totalPayment - totalAmount;
        // Hides the repayment wrapper if visible
        repaymentWrapper.css('opacity', '0');
        interestWrapper.css('opacity', '1');
        // Use updateNumber() to animate the total interest value, and cuts the decimal to 2 places.
        updateNumber('#interestResultsValue', totalInterest.toFixed(2));
        // Hides the empty results wrapper if visible and shows the completed results wrapper
        emptyResults.css('opacity', '0');
        completedResults.css('opacity', '1');
    } else {
        // This should never be reached, but will log an error if it does
        console.log('Error');
    }
}

/**
 * Formats a numeric value with commas as thousands separators.
 * @param {string|number} value - The numeric value to be formatted.
 * @returns {string} - The formatted value with commas as thousands separators.
 */
function formatWithCommas(value) {
    // Remove user entered commas to avoid formatting errors, then adds a comma after every 3 digits
    value = String(value);
    value = value.replace(/,/g, '');
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Animates the transition of a numeric value within an HTML element.
 * The number animates from 0 to the specified value with comma formatting applied.
 * @param {string} element - The selector for the HTML element where the number should be updated.
 * @param {number} number - The numeric value to animate to.
 */
function updateNumber(element, number) {
    // Animates the number from 0 to the number passed
    $(element).prop('counter', 0).animate({
        counter: number
    }, {
        duration: 500,
        step: function (now) {
            $(this).text(formatWithCommas(now.toFixed(2)));
        }
    });
}

/**
 * Calculates the monthly mortgage payment using the formula for a fixed-rate mortgage.
 * The formula used is: M = P * R * (1 + R)^n / ((1 + R)^n - 1)
 * @param {number} totalAmount - The total mortgage amount (principal).
 * @param {number} termLength - The total mortgage term length in months.
 * @param {number} interestRate - The annual interest rate as a percentage.
 * @returns {number} - The calculated monthly mortgage payment.
 */
function calculateMonthlyPayment(totalAmount, termLength, interestRate) {
    // Grabs the passed values and calculates the monthly payment, then returns the value
    // Uses the formula M = P * R * (1 + R)^n / ((1 + R)^n - 1)
    const monthlyInterest = interestRate / 100 / 12
    return totalAmount * monthlyInterest * (Math.pow(1 + monthlyInterest, termLength)) / (Math.pow(1 + monthlyInterest, termLength) - 1);
}

/**
 * Validates user inputs for the mortgage calculation form.
 * Checks if the inputs for amount, term length, interest rate, and mortgage type are valid.
 * Updates error messages and styles if inputs are invalid.
 * @param {number} totalAmount - The total mortgage amount (principal).
 * @param {number} termLength - The total mortgage term length in months.
 * @param {number} interestRate - The annual interest rate as a percentage.
 * @param {string} type - The type of mortgage selected (either 'repayment' or 'interest').
 * @returns {boolean} - True if all inputs are valid, otherwise false.
 */
function checkInputs(totalAmount, termLength, interestRate, type) {
    // Checks if the inputs are empty, throws error states if they are.
    // The input validity is handled with the html "pattern" attribute
    let isValid = true;

    if ((totalAmount <= 0 && mortgageAmount.val().trim() === "") || totalAmount <= 0) {
        amountError.css('height', '1.2rem');
        isValid = false;
    }

    if (termLength <= 0 && mortgageTerm.val().trim() === "") {
        termError.css('height', '1.2rem');
        isValid = false;
    }

    if (interestRate <= 0 && mortgageRate.val().trim() === "") {
        rateError.css('height', '1.2rem');
        isValid = false;
    }

    if (!typeRepayment.is(':checked') && !typeInterest.is(':checked')) {
        typeError.css('height', '1.2rem');
        isValid = false;
    }

    return isValid;
}


/**
 * Animates the content inside the calculate button when it is clicked or pressed.
 * The button content briefly scales up and then returns to its original size.
 */
function calcButtonAnimation() {
    // Animates the content inside the button when clicked or pressed
    calcButton.find('p').css('transform', 'scale(1.05)');
    setTimeout(function () {
        calcButton.find('p').removeAttr('style');
    }, 225);
}

/**
 * Resets the mortgage calculator form to its initial state.
 * Clears all input fields, resets error messages, and hides the completed results while showing the empty results.
 */
function clearFormFields() {
    // Resets the Calculator
    // Clears the input fields and resets the error styles
    // Hides the completed results wrapper and shows the empty results wrapper
    mortgageAmount.val('');
    $('.amount-bar').addClass('ignore-error');
    mortgageTerm.val('');
    $('.term-bar').addClass('ignore-error');
    mortgageRate.val('');
    $('.rate-bar').addClass('ignore-error');
    typeRepayment.prop('checked', false);
    typeInterest.prop('checked', false);
    amountError.css('height', '0');
    termError.css('height', '0');
    rateError.css('height', '0');
    typeError.css('height', '0');
    completedResults.css('opacity', '0');
    emptyResults.css('opacity', '1');
}

/**
 * Handles the input formatting and validation for the mortgage amount field.
 * Ensures only numeric values and a single decimal point are entered, formats the value with commas, and limits decimal places to 2.
 * @param {jQuery} element - The jQuery element representing the mortgage amount input field.
 */
function amountInputHandler(element) {
    let inputValue = element.val().replace(/,/g, ''); // Remove commas before processing
    let decimalPart = inputValue.split('.'); // Split the value by the decimal point
    
    // Ensure only numbers and a single decimal point are entered
    if (/^[0-9]*(\.[0-9]*)?$/.test(inputValue)) {
        // Check if there's already a decimal part and limit it to 2 digits
        if (decimalPart.length > 1 && decimalPart[1].length > 2) {
            inputValue = decimalPart[0] + '.' + decimalPart[1].substring(0, 2); // Limit decimal part to 2 digits
        }
        
        element.val(formatWithCommas(inputValue)); // Format the value with commas
    } else {
        // Replace non-numeric characters with an empty string
        element.val(inputValue.replace(/\D/g, ''));
    }
}

/**
 * Handles the input formatting and validation for the mortgage term input field.
 * Limits the input to a maximum of 3 digits and ensures only numeric values are entered.
 * @param {jQuery} element - The jQuery element representing the mortgage term input field.
 */
function termInputHandler(element) {
    let inputValue = element.val();
    // Checks if the input contains more than 3 digits and only numeric values
    if (/^[0-9]*$/.test(inputValue)) {
        if (inputValue.length > 3) {
            element.val(element.val().slice(0, 3));
        }
    } else {
        // Makes sure only numeric values entered by replacing them with an empty string
        element.val(inputValue.replace(/\D/g, ''));
    }
}

/**
 * Handles the input formatting and validation for the mortgage interest rate input field.
 * Limits the input to a maximum of 3 digits before the decimal and 2 digits after the decimal.
 * Ensures only numeric values and a single decimal point are entered.
 * @param {jQuery} element - The jQuery element representing the mortgage interest rate input field.
 */
function rateInputHandler(element) {
    var inputValue = element.val();
    // Removes anything other than digits and the decimal point
    var cleanedInput = inputValue.replace(/[^0-9.]/g, '');
    // Splits the input value by the decimal point
    var parts = cleanedInput.split('.');
    // Checks if the input contains more than 3 digits before the decimal point
    if (parts[0].length > 3) {
        // Keep only the first 3 digits before the decimal point
        parts[0] = parts[0].substring(0, 3);
    }
    // Checks if the input contains more than 2 digits after the decimal point
    if (parts.length > 1 && parts[1].length > 2) {
        // Keep only the first 2 digits after the decimal point
        parts[1] = parts[1].substring(0, 2);
    }
    // Reconstructs the input value
    var reconstructedInput = parts.join('.');
    element.val(reconstructedInput);
}

/**
 * Initializes event listeners for various input fields and buttons.
 * Handles resetting error states, formatting input values, and triggering mortgage calculations.
 */
$(document).ready(function () {
    // Event listeners for input fields to reset error heights when corrected
    // Also removes the ignore-error class that may be present from the reset button
    mortgageAmount.on('input', function () {
        if (Number($(this).val()) > 0 && $(this).val().trim() !== "") {
            amountError.css('height', '0');
        }
        $('.amount-bar').removeClass('ignore-error');
    });
    mortgageTerm.on('input', function () {
        if (Number($(this).val()) > 0 && $(this).val().trim() !== "") {
            termError.css('height', '0');
        }
        $('.term-bar').removeClass('ignore-error');
    });
    mortgageRate.on('input', function () {
        if (Number($(this).val()) > 0 && $(this).val().trim() !== "") {
            rateError.css('height', '0');
        }
        $('.rate-bar').removeClass('ignore-error');
    });
    typeRepayment.on('change', function () {
        if ($(this).is(':checked')) {
            typeError.css('height', '0');
        }
    });
    typeInterest.on('change', function () {
        if ($(this).is(':checked')) {
            typeError.css('height', '0');
        }
    });

    // Event listener for calculate button, Animates and calls the calculateMortgage function
    calcButton.on('click', function () {
        calcButtonAnimation();
        calculateMortgage();
    });

    // Event listener for clear button, calls the clearFormFields function
    clearButton.on('click', function () {
        clearFormFields();
    });

    // Event listeners for input fields, calls their handler functions
    mortgageAmount.on('input', function () {
        amountInputHandler($(this));
    });
    mortgageTerm.on('input', function () {
        termInputHandler($(this));
    });
    mortgageRate.on('input', function () {
        rateInputHandler($(this));
    });
})
