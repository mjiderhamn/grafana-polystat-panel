System.register(["lodash", "app/core/utils/kbn"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, kbn_1, MetricOverride, MetricOverridesManager;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            }
        ],
        execute: function () {
            MetricOverride = (function () {
                function MetricOverride() {
                }
                return MetricOverride;
            }());
            exports_1("MetricOverride", MetricOverride);
            MetricOverridesManager = (function () {
                function MetricOverridesManager($scope, templateSrv, savedOverrides) {
                    var _this = this;
                    this.$scope = $scope;
                    this.templateSrv = templateSrv;
                    this.suggestMetricNames = function () {
                        return lodash_1.default.map(_this.$scope.ctrl.series, function (series) {
                            return series.alias;
                        });
                    };
                    this.metricOverrides = savedOverrides || new Array();
                }
                MetricOverridesManager.prototype.addMetricOverride = function () {
                    var override = new MetricOverride();
                    override.metricName = "";
                    override.thresholds = [];
                    override.colors = ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"];
                    override.decimals = "";
                    override.enabled = true;
                    override.unitFormat = "";
                    override.clickThrough = "";
                    override.valueName = "avg";
                    override.scaledDecimals = null;
                    override.prefix = "";
                    override.suffix = "";
                    this.metricOverrides.push(override);
                };
                MetricOverridesManager.prototype.removeMetricOverride = function (override) {
                    this.metricOverrides = lodash_1.default.without(this.metricOverrides, override);
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.matchOverride = function (pattern) {
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        var anOverride = this.metricOverrides[index];
                        var regex = kbn_1.default.stringToJsRegex(anOverride.metricName);
                        var matches = pattern.match(regex);
                        if (matches && matches.length > 0) {
                            return index;
                        }
                    }
                    return -1;
                };
                MetricOverridesManager.prototype.applyOverrides = function (data) {
                    for (var index = 0; index < data.length; index++) {
                        var matchIndex = this.matchOverride(data[index].name);
                        if (matchIndex >= 0) {
                            data[index].color = this.getColorForValue(matchIndex, data[index].value);
                            var anOverride = this.metricOverrides[matchIndex];
                            var formatFunc = kbn_1.default.valueFormats[anOverride.unitFormat];
                            if (formatFunc) {
                                data[index].valueFormatted = formatFunc(data[index].value, anOverride.decimals, anOverride.scaledDecimals);
                                data[index].valueRounded = kbn_1.default.roundValue(data[index].value, anOverride.decimals);
                            }
                            data[index].thresholds = anOverride.thresholds;
                            data[index].prefix = anOverride.prefix;
                            data[index].suffix = anOverride.suffix;
                            if ((anOverride.clickThrough) && (anOverride.clickThrough.length > 0)) {
                                data[index].clickThrough = this.templateSrv.replaceWithText(anOverride.clickThrough);
                            }
                        }
                    }
                };
                MetricOverridesManager.prototype.getColorForValue = function (index, value) {
                    var anOverride = this.metricOverrides[index];
                    for (var i = anOverride.thresholds.length; i > 0; i--) {
                        if (value >= anOverride.thresholds[i - 1]) {
                            return anOverride.colors[i];
                        }
                    }
                    return lodash_1.default.first(anOverride.colors);
                };
                MetricOverridesManager.prototype.invertColorOrder = function (override) {
                    override.colors.reverse();
                    this.$scope.ctrl.refresh();
                };
                MetricOverridesManager.prototype.setUnitFormat = function (override, subItem) {
                    override.unitFormat = subItem.value;
                };
                MetricOverridesManager.prototype.moveMetricOverrideUp = function (override) {
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        var anOverride = this.metricOverrides[index];
                        if (override === anOverride) {
                            if (index > 0) {
                                this.arraymove(this.metricOverrides, index, index - 1);
                                break;
                            }
                        }
                    }
                };
                MetricOverridesManager.prototype.moveMetricOverrideDown = function (override) {
                    for (var index = 0; index < this.metricOverrides.length; index++) {
                        var anOverride = this.metricOverrides[index];
                        if (override === anOverride) {
                            if (index < this.metricOverrides.length) {
                                this.arraymove(this.metricOverrides, index, index + 1);
                                break;
                            }
                        }
                    }
                };
                MetricOverridesManager.prototype.arraymove = function (arr, fromIndex, toIndex) {
                    var element = arr[fromIndex];
                    arr.splice(fromIndex, 1);
                    arr.splice(toIndex, 0, element);
                };
                return MetricOverridesManager;
            }());
            exports_1("MetricOverridesManager", MetricOverridesManager);
        }
    };
});
//# sourceMappingURL=metric_overrides_manager.js.map