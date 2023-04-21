window.PhoneMultiMask = function (param) {
    this.input = param.input || null;
    this.codes = param.codes || window.phoneCodes;
    this.defaultCountry = param.defaultCountry || 'ge';
    this.geoCodeAuto = param.geoCodeAuto || false;
    this.countrySort = param.countrySort || [];

    this.telInput = null;
    this.init();
};



window.PhoneMultiMask.prototype = {

    init: function () {
        let self = this;
        if (typeof window.intlTelInput == 'function') {
            this.telInput = window.intlTelInput(self.input, {
                initialCountry: self.defaultCountry,
                preferredCountries: self.countrySort,

            });

            self.input.addEventListener("countrychange", function (e) {
                self.setMultiMask();
            });
            self.setMultiMask(self.defaultCountry);
        }
    },

    setMultiMask: function (countryCode = null) {
        let self = this;
        let force = false;
        if (!countryCode) {
            countryCode = self.telInput.getSelectedCountryData().iso2;
        }
        else {
            force = true;
        }


        console.log(self.input.value);
        if (countryCode) {
            countryCode = countryCode.toUpperCase();

            let maskObject = null;
            for (let key in self.codes) {
                if (self.codes[key]['cc'] == countryCode) {
                    maskObject = self.codes[key];
                    break;
                }
            }
            console.log(self.input.value);
            if (maskObject && (self.input.value.length > 1 || force == true)) {

                let mask = maskObject.mask;
                let maskValue = '';
                let value = '';
                for (let i = 0; i < mask.length; i++) {
                    let symbol = mask[i];

                    if (
                        symbol !== '#' &&
                        symbol !== '(' &&
                        symbol !== ')' &&
                        symbol !== '-'
                    ) {
                        if (symbol == '+') {
                            maskValue += symbol;
                        }
                        else {

                            maskValue += "#";
                        }
                        value += symbol;

                    }
                    else {
                        maskValue += symbol;
                    }
                }
                let placeholder = maskValue.replaceAll('#', '_');
                $(self.input).inputmask('remove');
                $(self.input).inputmask(maskValue, { "placeholder": placeholder });
                self.input.value = value;
            }
        }
    }
};