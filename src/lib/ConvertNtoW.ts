export default (function () {
    // Type definitions for the function
    type NumberToLetterFn = (nombre: number | string, U?: string | null, D?: string | null) => string;

    const letter: { [key: number]: string } = {
        0: "zéro",
        1: "un",
        2: "deux",
        3: "trois",
        4: "quatre",
        5: "cinq",
        6: "six",
        7: "sept",
        8: "huit",
        9: "neuf",
        10: "dix",
        11: "onze",
        12: "douze",
        13: "treize",
        14: "quatorze",
        15: "quinze",
        16: "seize",
        17: "dix-sept",
        18: "dix-huit",
        19: "dix-neuf",
        20: "vingt",
        30: "trente",
        40: "quarante",
        50: "cinquante",
        60: "soixante",
        70: "soixante-dix",
        80: "quatre-vingt",
        90: "quatre-vingt-dix",
    };

    const NumberToLetter: NumberToLetterFn = (nombre, U = null, D = null) => {
        let numberToLetter = '';
        const nb = parseFloat(nombre.toString().replace(/ /gi, ""));

        
        // Check for invalid numbers
        if (nb.toString().replace(/ /gi, "").length > 15) return "dépassement de capacité";
        if (isNaN(nb)) return "Nombre non valide";
        
        // Handle numbers with decimals
        if (Math.ceil(nb) !== nb) {
            const parts = nb.toString().split('.');
            return NumberToLetter(parts[0]) + (U ? ` ${U} et ` : " virgule ") + NumberToLetter(parts[1]) + (D ? ` ${D}` : "");
        }

        // Length of the number
        const n = nb.toString().length;
        
        // Switch case for different number ranges
        switch (n) {
            case 1:
                numberToLetter = letter[nb];
                break;
            case 2:
                if (nb > 19) {
                    const quotient = Math.floor(nb / 10);
                    const reste = nb % 10;
                    if (nb < 71 || (nb > 79 && nb < 91)) {
                        if (reste === 0) numberToLetter = letter[quotient * 10];
                        if (reste === 1) numberToLetter = `${letter[quotient * 10]}-et-${letter[reste]}`;
                        if (reste > 1) numberToLetter = `${letter[quotient * 10]}-${letter[reste]}`;
                    } else {
                        numberToLetter = `${letter[(quotient - 1) * 10]}-${letter[10 + reste]}`;
                    }
                } else {
                    numberToLetter = letter[nb];
                }
                break;
            case 3:
                const quotientHundreds = Math.floor(nb / 100);
                const resteHundreds = nb % 100;
                if (quotientHundreds === 1 && resteHundreds === 0) numberToLetter = "cent";
                if (quotientHundreds === 1 && resteHundreds !== 0) numberToLetter = `cent ${NumberToLetter(resteHundreds)}`;
                if (quotientHundreds > 1 && resteHundreds === 0) numberToLetter = `${letter[quotientHundreds]} cents`;
                if (quotientHundreds > 1 && resteHundreds !== 0) numberToLetter = `${letter[quotientHundreds]} cent ${NumberToLetter(resteHundreds)}`;
                break;
            case 4:
            case 5:
            case 6:
                const quotientThousands = Math.floor(nb / 1000);
                const resteThousands = nb - quotientThousands * 1000;
                if (quotientThousands === 1 && resteThousands === 0) numberToLetter = "mille";
                if (quotientThousands === 1 && resteThousands !== 0) numberToLetter = `mille ${NumberToLetter(resteThousands)}`;
                if (quotientThousands > 1 && resteThousands === 0) numberToLetter = `${NumberToLetter(quotientThousands)} mille`;
                if (quotientThousands > 1 && resteThousands !== 0) numberToLetter = `${NumberToLetter(quotientThousands)} mille ${NumberToLetter(resteThousands)}`;
                break;
            case 7:
            case 8:
            case 9:
                const quotientMillions = Math.floor(nb / 1000000);
                const resteMillions = nb % 1000000;
                if (quotientMillions === 1 && resteMillions === 0) numberToLetter = "un million";
                if (quotientMillions === 1 && resteMillions !== 0) numberToLetter = `un million ${NumberToLetter(resteMillions)}`;
                if (quotientMillions > 1 && resteMillions === 0) numberToLetter = `${NumberToLetter(quotientMillions)} millions`;
                if (quotientMillions > 1 && resteMillions !== 0) numberToLetter = `${NumberToLetter(quotientMillions)} millions ${NumberToLetter(resteMillions)}`;
                break;
            case 10:
            case 11:
            case 12:
                const quotientBillions = Math.floor(nb / 1000000000);
                const resteBillions = nb - quotientBillions * 1000000000;
                if (quotientBillions === 1 && resteBillions === 0) numberToLetter = "un milliard";
                if (quotientBillions === 1 && resteBillions !== 0) numberToLetter = `un milliard ${NumberToLetter(resteBillions)}`;
                if (quotientBillions > 1 && resteBillions === 0) numberToLetter = `${NumberToLetter(quotientBillions)} milliards`;
                if (quotientBillions > 1 && resteBillions !== 0) numberToLetter = `${NumberToLetter(quotientBillions)} milliards ${NumberToLetter(resteBillions)}`;
                break;
            case 13:
            case 14:
            case 15:
                const quotientTrillions = Math.floor(nb / 1000000000000);
                const resteTrillions = nb - quotientTrillions * 1000000000000;
                if (quotientTrillions === 1 && resteTrillions === 0) numberToLetter = "un billion";
                if (quotientTrillions === 1 && resteTrillions !== 0) numberToLetter = `un billion ${NumberToLetter(resteTrillions)}`;
                if (quotientTrillions > 1 && resteTrillions === 0) numberToLetter = `${NumberToLetter(quotientTrillions)} billions`;
                if (quotientTrillions > 1 && resteTrillions !== 0) numberToLetter = `${NumberToLetter(quotientTrillions)} billions ${NumberToLetter(resteTrillions)}`;
                break;
        }

        // Handle the plural of "quatre-vingt"
        if (numberToLetter.substr(numberToLetter.length - "quatre-vingt".length, "quatre-vingt".length) === "quatre-vingt") {
            numberToLetter = numberToLetter + "s";
        }

        return numberToLetter;
    }

    return NumberToLetter;
})();
