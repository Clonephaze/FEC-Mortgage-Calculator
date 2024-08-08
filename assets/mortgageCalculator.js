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

function calculateMortgage() {
    const totalAmount = Number(mortgageAmount.val());
    const termLength = Number(mortgageTerm.val());
    const termMonths = termLength * 12
    const interestRate = Number(mortgageRate.val());
    const type = typeRepayment.is(':checked') ? 'repayment' : 'interest';
    const isValid = checkInputs(totalAmount, termLength, interestRate, type);


    if (!isValid) {
        return;
    } else {
        const paymentText = $('#monthlyResultsValue');
        let monthlyPayment = calculateMonthlyPayment(totalAmount, termLength, interestRate, type);
        const totalText = $('#totalResultsValue')
        let totalPayment = (monthlyPayment * termMonths) + totalAmount;
        paymentText.text(monthlyPayment.toFixed(2));
        totalText.text(totalPayment.toFixed(2));
        emptyResults.css('opacity', '0');
        completedResults.css('opacity', '1');
        
    }
}

function calculateMonthlyPayment(totalAmount, termLength, interestRate, type) {
    const monthlyInterest = interestRate / 100 / 12
    const termMonths = termLength * 12
    if (type === 'repayment') {
        // Use the formula for repayment mortgage
        return totalAmount * monthlyInterest * (Math.pow(1 + monthlyInterest, termMonths)) / (Math.pow(1 + monthlyInterest, termMonths) - 1);
    } else if (type === 'interest') {
        // For an interest-only mortgage, just multiply the principal by the monthly interest rate
        return totalAmount * interestRate;
    } else {
        return 0; // If type is not recognized
    }
}

function checkInputs(totalAmount, termLength, interestRate, type) {
    let isValid = true;

    // Check for valid totalAmount
    if ((totalAmount <= 0 && mortgageAmount.val().trim() === "") || totalAmount <= 0) {
        amountError.css('height', '1.2rem');
        isValid = false;
    }

    // Check for valid termLength
    if (termLength <= 0 && mortgageTerm.val().trim() === "") {
        termError.css('height', '1.2rem');
        isValid = false;
    }

    // Check for valid interestRate
    if (interestRate <= 0 && mortgageRate.val().trim() === "") {
        rateError.css('height', '1.2rem');
        isValid = false;
    }

    // Check if a radio input is selected
    if (!typeRepayment.is(':checked') && !typeInterest.is(':checked')) {
        typeError.css('height', '1.2rem');
        isValid = false;
    }

    return isValid;
}

function calcButtonAnimation() {
    calcButton.find('p').css('transform', 'scale(1.05)');
    setTimeout(function () {
        calcButton.find('p').removeAttr('style');
    }, 225);
}

$(document).ready(function() {
    // Event listeners for input fields to reset error heights when corrected
    mortgageAmount.on('input', function() {
        if (Number($(this).val()) > 0 && $(this).val().trim() !== "") {
            amountError.css('height', '0'); // Reset height to 0 if the field is correctly filled
        }
    });
    
    mortgageTerm.on('input', function() {
        if (Number($(this).val()) > 0 && $(this).val().trim() !== "") {
            termError.css('height', '0'); // Reset height to 0 if the field is correctly filled
        }
    });
    
    mortgageRate.on('input', function() {
        if (Number($(this).val()) > 0 && $(this).val().trim() !== "") {
            rateError.css('height', '0'); // Reset height to 0 if the field is correctly filled
        }
    });

    typeRepayment.on('change', function() {
        if ($(this).is(':checked')) {
            typeError.css('height', '0'); // Reset height to 0 if repayment type is selected
        }
    });
    
    typeInterest.on('change', function() {
        if ($(this).is(':checked')) {
            typeError.css('height', '0'); // Reset height to 0 if interest-only type is selected
        }
    });

    // event listener for calculate button
    calcButton.on('click', function () {
        calcButtonAnimation();
        calculateMortgage();
    });
})