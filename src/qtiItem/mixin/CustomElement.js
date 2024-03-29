import Mixin from 'taoQtiItem/qtiItem/mixin/Mixin';
import _ from 'lodash';

var methods = {
    prop: function (name, value) {
        if (name) {
            if (value !== undefined) {
                this.properties[name] = value;
            } else {
                if (typeof name === 'object') {
                    for (var prop in name) {
                        this.prop(prop, name[prop]);
                    }
                } else if (typeof name === 'string') {
                    if (this.properties[name] === undefined) {
                        return undefined;
                    } else {
                        return this.properties[name];
                    }
                }
            }
        }
        return this;
    },
    removeProp: function (propNames) {
        var _this = this;
        if (typeof propNames === 'string') {
            propNames = [propNames];
        }
        _.forEach(propNames, function (propName) {
            delete _this.attributes[propName];
        });
        return this;
    },
    getProperties: function () {
        return _.clone(this.properties);
    },
    getMarkupNamespace: function () {
        if (this.markupNs && this.markupNs.name && this.markupNs.uri) {
            return _.clone(this.markupNs);
        } else {
            var relatedItem = this.getRootElement();
            if (relatedItem) {
                //set the default one:
                relatedItem.namespaces[this.defaultMarkupNsName] = this.defaultMarkupNsUri;
                return {
                    name: this.defaultMarkupNsName,
                    uri: this.defaultMarkupNsUri
                };
            }
        }

        return {};
    },
    setMarkupNamespace: function (name, uri) {
        this.markupNs = {
            name: name,
            uri: uri
        };
    }
};

export default {
    augment: function (targetClass) {
        Mixin.augment(targetClass, methods);
    },
    methods: methods
};
