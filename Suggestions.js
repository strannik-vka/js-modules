require('./jquery.suggestions');

export default class Suggestions {

    constructor(obj) {
        this.token = obj.token;
    }

    organization(elem, options) {
        if (elem.length) {
            elem.suggestions({
                token: this.token,
                type: "PARTY",
                hint: false,
                onSelect: (json) => {
                    if (options.onSelect) {
                        options.onSelect(json);
                    }
                }
            });
        }
    }

    uniqValues(json, field) {
        var values = [],
            result = [];

        $.each(json, function (i, item) {
            if (item.data[field] && values.indexOf(item.data[field]) == -1) {
                values.push(item.data[field]);
                result.push(item);
            }
        });

        return result;
    }

    country(elem) {
        if (elem.length) {
            elem.suggestions({
                token: this.token,
                type: "country",
                hint: false,
            });
        }
    }

    region(elem) {
        if (elem.length) {
            elem.suggestions({
                token: this.token,
                type: "address",
                hint: false,
                count: 1,
                bounds: "region",
                formatSelected: function (suggestion) {
                    return suggestion.data.region_with_type.replace('г ', '');
                },
                formatResult: function (value, currentValue, suggestion, options) {
                    suggestion.value = suggestion.data.region_with_type.replace('г ', '');
                    return $.Suggestions.prototype.formatResult.call(this, suggestion.value, currentValue, suggestion, options);
                },
                onSuggestionsFetch: (json) => {
                    return this.uniqValues(json, 'region_with_type');
                }
            });
        }
    }

    city(elem) {
        if (elem.length) {
            elem.suggestions({
                token: this.token,
                type: "address",
                hint: false,
                bounds: "city",
                constraints: {
                    locations: { city_type_full: "город" }
                },
                formatSelected: function (suggestion) {
                    return suggestion.data.city;
                },
                formatResult: function (value, currentValue, suggestion, options) {
                    var newValue = suggestion.data.city;
                    suggestion.value = newValue;
                    return $.Suggestions.prototype.formatResult.call(this, newValue, currentValue, suggestion, options);
                },
                onSuggestionsFetch: (json) => {
                    return this.uniqValues(json, 'city');
                }
            });
        }
    }

}