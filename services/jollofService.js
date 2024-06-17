"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JollofService = /** @class */ (function () {
    function JollofService() {
    }
    JollofService.prototype.isProviderMismatched = function (existingProvider, userAccount) {
        return ((existingProvider == 'Google' && userAccount.user.GoogleUser == null) ||
            (existingProvider == 'Facebook' && userAccount.user.FacebookUser == null));
    };
    return JollofService;
}());
var jollofService = new JollofService();
exports.default = jollofService;
